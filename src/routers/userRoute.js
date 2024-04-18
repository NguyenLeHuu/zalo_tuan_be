const express = require("express");
const {
  findUser,
  getUsers,
  findUserByEmail,
  sendFriendRequest,
  acceptFriendRequestAndSendMessage,
  getFriends,
} = require("../controllers/userController");
const uploadFiles = require("../uploads/uploadFile");

const router = express.Router();
router.get("/", getUsers);
router.get("/find/:userId", findUser);
router.get("/findUserByEmail/:email", findUserByEmail);
router.post("/sendFriendRequest", sendFriendRequest);
router.post(
  "/acceptFriendRequestAndSendMessage",
  acceptFriendRequestAndSendMessage
);
router.get("/getFriends/:userId", getFriends);
router.post("/upload/:userId", uploadFiles);

module.exports = router;
