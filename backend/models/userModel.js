const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        // "https://i.pinimg.com/1200x/66/b8/58/66b858099df3127e83cb1f1168f7a2c6.jpg",
        "https://picsum.photos/200/300",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password=await bcrypt.hash(this.password,salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword,this.password)
}

const User = mongoose.model("User", userSchema );

module.exports = User;
