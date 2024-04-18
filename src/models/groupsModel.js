const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  message: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      type: {
        type: String,
        enum: ["Text", "Media", "Document", "Link"],
      },
      text: {
        type: String,
      },
      isRemove: {
        type: Boolean,
      },
      file: {
        type: String,
      },
      replyToTxt: {
        type: String,
      },
      replyToId: {
        type: String,
      },
      created_at: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  role: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      rank: String, // Vai trò của người dùng trong nhóm
    },
  ],
});

const GroupModel = mongoose.model("Group", GroupSchema);

module.exports = GroupModel;
