const express = require("express");
const app = express();
const cors = require("cors"); // Add this line
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const connectDB=require('./config/dbConnection')
const colors = require('colors')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')


dotenv.config();
//connecting database
connectDB();

app.use(express.json()) //to accept json data
// app.use(cors()); // Add this line to enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.get("/", (req, res) => {
  res.send("API is Running");
});

const userRoutes=require('./routes/userRoutes')
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes.js");
const { Socket } = require("socket.io");
app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


app.use(notFound);
app.use(errorHandler);

const server=app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeout:60000,
  cors: {
    origin: "http://localhost:5173"
  }
})

io.on("connection", (socket) => {
  console.log("connected to socket.io")

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected',userData)
  })

  socket.on("join chat", (room) => {
    socket.join(room)
    console.log('User Joined Room:'+room  );
  });

  socket.on('typing',(room)=>socket.in(room).emit('typing'))
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat
    
    if (!chat.users) return console.log("chat.users not defined")
    
    chat.users.forEach(user => {
      if (user._id == newMessageRecieved.sender._id) return
      socket.in(user._id).emit('message recieved',newMessageRecieved)
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED")
    socket.leave(userData._id)
  })

})

