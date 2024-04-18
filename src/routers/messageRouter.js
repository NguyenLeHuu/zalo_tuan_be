const express = require("express");

const {
  getMessages,
  addMessage,
  retrieveMessage,
  deleteMessage,
  forwardMessage,
} = require("../controllers/messageController");

const router = express.Router();

router.get("/getMessages", getMessages);
router.post("/forward", forwardMessage);
router.post("/addMessage", addMessage);
router.patch("/:messageId/:senderId", retrieveMessage);
router.delete("/:messageId", deleteMessage);

module.exports = router;
