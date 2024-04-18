const express = require("express");

const {
  createGroup,
  addMember,
  deleteMember,
  getGroup,
  appointDeputy,
  getGroupAll,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/groups/addMember/:groupId", addMember);
router.post("/groups", createGroup);
router.delete("/groups/deleteMember", deleteMember);
router.get("/", getGroup);
router.get("/all", getGroupAll);
router.post("/groups/appoint/:groupId", appointDeputy);

module.exports = router;
