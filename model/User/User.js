const mongoose = require("mongoose");

//create schema

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    profilePhoto: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Editor"],
      default: "Guest",
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    plan: {
      type: String,
      enum: ["Free", "Premium", "Pro"],
      default: "Free",
    },

    userAward: {
      type: String,
      enum: ["Bronze", "Silver", "Gold"],
      default: "Bronze",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//Get Full name
userSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

//Get User Initials
userSchema.virtual("initials").get(function () {
  return `${this.firstName[0]}${this.lastName[0]}`;
});

//Get Post Counts
userSchema.virtual("postCounts").get(function () {
  return this.posts.length;
});

//Get followers Counts
userSchema.virtual("followersCounts").get(function () {
  return this.followers.length;
});

//Get FOLLOWING Counts
userSchema.virtual("followingCounts").get(function () {
  return this.following.length;
});

//Get Viewers Counts
userSchema.virtual("viewersCounts").get(function () {
  return this.viewers.length;
});

//Get Blocked Counts
userSchema.virtual("blockedCounts").get(function () {
  return this.blocked.length;
});

//compile the user model
const User = mongoose.model("User", userSchema);
module.exports = User;
