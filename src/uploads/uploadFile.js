const multer = require("multer");
const AWS = require("aws-sdk");
const path = require("path");

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 300000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).single("avatar");

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|doc|docx|xls|xlsx|pdf|csv|json|mp4|mp3/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error("Error: Images, Word, Excel, and PDF files only !!!"));
}

const uploadFiles = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "Lỗi trong quá trình upload ảnh",
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: "Upload file thất bại",
      });
    }

    const { userId } = req.params;
    const avatar = req.file?.originalname.split(".");
    const fileType = avatar[avatar.length - 1];
    const filePath = `zalo/W${userId}_W${Date.now().toString()}.${fileType}`;

    const paramsS3 = {
      Bucket: bucketName,
      Key: filePath,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    s3.upload(paramsS3, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Upload file thất bại",
        });
      }
      const url = data.Location;
      return res.status(200).json({
        success: true,
        message: "Upload file thành công",
        avatar: url,
      });
    });
  });
};

module.exports = uploadFiles;
