const mongoose = require("mongoose");
const Post = require("../Post/Post");

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

//Hooks
//pre - before record is saved - all /^find/
userSchema.pre("findOne", async function (next) {
  this.populate({
    path: "posts",
  });
  //get the user id
  const userId = this._conditions._id;

  //find the post created by the user
  const posts = await Post.find({
    user: userId,
  });

  //get the last post created by the user
  const lastPost = posts[posts.length - 1];

  //get the last post date
  const lastPostDate = new Date(lastPost?.createdAt);

  const lastPostDateStr = lastPostDate.toDateString();

  //add virtual to the schema
  userSchema.virtual("lastPostDate").get(function () {
    return lastPostDateStr;
  });

  //Check if user is inactive for 30 days
  const currentDate = new Date();

  //Difference between last post and the current date
  const diff = currentDate - lastPostDate;

  //get the difference in days and return less than in days
  const diffInDays = diff / (1000 * 3600 * 24);

  if (diffInDays > 30) {
    userSchema.virtual("isInactive").get(function () {
      return true;
    });
    await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
  } else {
    userSchema.virtual("isInactive").get(function () {
      return false;
    });
    await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
  }

  //-----------------------Last Active Date--------------------------//
  const daysAgo = Math.floor(diffInDays);
  userSchema.virtual("lastActive").get(function () {
    if (daysAgo <= 0) {
      return "Today";
    }
    if (daysAgo === 1) {
      return "Yesterday";
    }
    if (daysAgo > 1) {
      return `${daysAgo} days ago`;
    }
  });

  //-------------------Update userAward based on number of post---------//
  const numOfPost = posts.length;
  if (numOfPost < 10) {
    await User.findByIdAndUpdate(
      userId,
      {
        userAward: "Bronze",
      },
      {
        new: true,
      }
    );
  }
  if (numOfPost > 10) {
    await User.findByIdAndUpdate(
      userId,
      {
        userAward: "Silver",
      },
      {
        new: true,
      }
    );
  }
  if (numOfPost > 20) {
    await User.findByIdAndUpdate(
      userId,
      {
        userAward: "Gold",
      },
      {
        new: true,
      }
    );
  }
  next();
});

//post - after saving

// userSchema.post("save", function (next) {
//   console.log("post hook called");
//   next();
// });

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
