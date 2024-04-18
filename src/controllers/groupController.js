const GroupModel = require("../models/groupsModel");
const UserModel = require("../models/userModel");
const createGroup = async (req, res, next) => {
  try {
    const { name, image, members, message, messages, role, uid } = req.body;
    console.log("name", name);
    console.log("role", role);
    const group = new GroupModel({
      name,
      image,
      members,
      message,
      messages,
      role,
    });
    console.log("group", group);

    await group.save();

    if (group) {
      const user = await UserModel.findById(uid);
      if (user) {
        user.groups.push(group._id);
        await user.save();
      }

      return res.json({ msg: "Group added successfully.", data: group });
      // return res.json({ msg: "Group added successfully." });
    } else {
      return res.json({ msg: "Failed to add group to the database" });
    }
  } catch (ex) {
    next(ex);
  }
};
const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { selectedMembers } = req.body;
    console.log("Member", selectedMembers);
    const group = await GroupModel.findById(groupId);
    if (group) {
      group.members.push(...selectedMembers);
      await group.save();
      return res.json({ msg: "Group add members successfully.", data: group });
    } else {
      return res.json({ msg: "Failed to add members to the database" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const { groupId, memberId, userId } = req.body;
    console.log("req: ", req.body);
    // Tìm nhóm
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // Kiểm tra xem người thực hiện thao tác có phải là trưởng nhóm hay không
    const role = group.role.find((role) => role.userId.toString() === userId);
    if (!role || role.rank !== "Truong Nhom") {
      return res
        .status(403)
        .json({ msg: "Unauthorized: Only group admins can kick members" });
    }

    // Xóa thành viên khỏi nhóm
    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );
    await group.save();
    return res.json({ msg: "Member kicked successfully", data: group });
  } catch (ex) {
    next(ex);
  }
};

const appointDeputy = async (req, res, next) => {
  try {
    const { deputyUserId, userId } = req.body;
    const { groupId } = req.params;
    console.log("req: ", req.body);
    // Tìm nhóm
    const group = await GroupModel.findById(groupId);
    console.log("group", group);
    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // Kiểm tra xem người thực hiện thao tác có phải là trưởng nhóm hay không
    const role = group.role.find((role) => role.userId.toString() === userId);
    console.log("role", role);
    if (!role || role.rank !== "Truong Nhom") {
      return res.status(403).json({
        msg: "Unauthorized: Only group admins can appointDeputy members",
      });
    }
    group.role.push({ userId: deputyUserId, rank: "Pho Nhom" });
    await group.save();
    // Xóa thành viên khỏi nhóm
    return res.json({ msg: "Member kicked successfully", data: group });
  } catch (ex) {
    next(ex);
  }
};

const getGroup = async (req, res, next) => {
  try {
    const { groupId } = req.query;
    console.log(groupId);
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.json({ msg: "Group Faile", data: group });
    }
    return res.json({ msg: "Group succes", data: group });
  } catch (ex) {
    next(ex);
  }
};
const getGroupAll = async (req, res, next) => {
  try {
    const group = await GroupModel.find();
    if (!group) {
      return res.json({ msg: "Group Faile", data: group });
    }
    return res.json({ msg: "Group succes", data: group });
  } catch (ex) {
    next(ex);
  }
};

module.exports = {
  createGroup,
  addMember,
  deleteMember,
  getGroup,
  appointDeputy,
  getGroupAll,
};
