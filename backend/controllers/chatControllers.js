const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel"); 
const User = require("../models/userModel"); 

// Access a chat based on user ID
exports.accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    // If user ID is missing in the request body
    console.log("UserId param not sent with request");
    return res.status(400).send("UserId param not sent with request");
  }

  // Check if a chat already exists between the current user and the target user
  let existingChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  existingChat = await User.populate(existingChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (existingChat.length > 0) {
    // If an existing chat is found, return it
    return res.send(existingChat[0]);
  }

  // If no existing chat, create a new one
  const chatData = {
    chatName: "sender", // You may want to customize this
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).send(fullChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Fetch all chats for the current user
exports.fetchChats = asyncHandler(async (req, res, next) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).send(chats);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Create a group chat
exports.createGroupChat = asyncHandler(async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    // If users or name is missing in the request body
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users;
  try {
    users = JSON.parse(req.body.users);
  } catch (error) {
    // If there's an error parsing users as JSON
    return res.status(400).send("Invalid JSON format in users field");
  }

  if (users.length < 2) {
    // If there are less than 2 users (minimum required for a group chat)
    return res
      .status(400)
      .send("More than two users are required to form a group chat");
  }
  users.push(req.user); // Add the logged-in user to the group of users

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Rename a group chat
exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    // If the chat is not found
    res.status(404).json({ message: "Chat Not Found" });
  } else {
    res.json(updatedChat);
  }
});

// Add a user to a group chat
exports.addToGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    // If the chat is not found
    res.status(404).json({ message: "Chat Not Found" });
  } else {
    res.json(added);
  }
});

// Remove a user from a group chat
exports.removeFromGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,  
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    // If the chat is not found
    res.status(404).json({ message: "Chat Not Found" });
  } else {
    res.json(removed);
  }
});
