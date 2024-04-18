const express = require("express");

const {
  createGroup,
  addMember,
  deleteMember,
  getGroup,
  appointDeputy,
  getGroupAll,
  sendMsg,
  removeMsg,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/groups/addMember/:groupId", addMember);
router.post("/groups", createGroup);
router.post("/msg/", sendMsg);
router.delete("/groups/deleteMember", deleteMember);
router.get("/", getGroup);
router.get("/all", getGroupAll);
router.post("/groups/appoint/:groupId", appointDeputy);
router.put("/remove", removeMsg);

module.exports = router;
