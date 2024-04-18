const GroupModel = require("../models/groupsModel");
const UserModel = require("../models/userModel");
const createGroup = async (req, res, next) => {
  try {
    const { image, members, message, messages, role, selectedMembers } =
      req.body;
    const { name, uid } = req.query;
    console.log("name", name);
    console.log("uid", uid);
    console.log("selectedMembers", selectedMembers);
    const selectedMemberIds = Object.keys(selectedMembers).filter(
      (key) => selectedMembers[key] === true
    );

    const groupName = name || "Nhóm mới";
    const group = new GroupModel({
      name: groupName,
      image,
      members,
      message,
      messages,
      role,
    });

    await group.save();

    const group1 = await GroupModel.findById(group._id);
    if (group1) {
      group1.members.push(...selectedMemberIds);
      await group1.save();
      return res.json({ msg: "Group added successfully.", data: group1 });
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
    console.log("groupId", groupId);

    const selectedMemberIds = Object.keys(selectedMembers).filter(
      (key) => selectedMembers[key] === true
    );

    console.log("Member", selectedMemberIds);
    const group = await GroupModel.findById(groupId);
    if (group) {
      group.members.push(...selectedMemberIds);
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
const sendMsg = async (req, res) => {
  try {
    const { groupId, sender, type, text, file, replyToTxt, replyToId } =
      req.body;
    console.log("groupid ", groupId);
    console.log("groupid ", sender);
    console.log("text ", text);
    let group = await GroupModel.findById(groupId);

    if (group) {
      let newMessage = {
        sender,
        type,
        text,
        isRemove: false,
        file,
        replyToTxt,
        replyToId,
      };

      await Promise.all([
        await group.messages.push(newMessage),
        await group.save(),
      ]);

      res.status(201).json({ message: "Tin nhắn đã được lưu thành công" });
    } else {
      res.status(501).json({ message: "Nhóm không còn tồn tại" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lưu tin nhắn", error: error.message });
  }
};

const removeMsg = async (req, res) => {
  try {
    const { groupId, msgId } = req.body;

    console.log("groupId ", groupId);
    console.log("msgid ", msgId);
    const resu = await GroupModel.findOneAndUpdate(
      { _id: groupId, "messages._id": msgId },
      { $set: { "messages.$.isRemove": true } }
    );
    console.log("resu: ", resu);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa tin nhắn", error: error.message });
  }
};

module.exports = {
  createGroup,
  addMember,
  deleteMember,
  getGroup,
  appointDeputy,
  getGroupAll,
  sendMsg,
  removeMsg,
};
