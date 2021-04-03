const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ejs = require("ejs");
const port = 8745;
const staticPath = path.join(__dirname, "../public");

app.set("view engine", "ejs");
app.use(express.static(staticPath));

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads/"),
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("file");
function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb("Error:Images Only!");
  }
}
app.get("/", (req, res) => {
  res.render(`index`);
});
app.post("/uploads", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", { msg: err });
    } else {
      if (!req.file) {
        res.render("index", { msg: "File Is Not Selected!" });
      } else {
        console.log(req.file);
        res.render("index", {
          msg: "File Has Been Uploaded Successfully!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});
app.listen(port, () => {
  console.log(`Server is on http://localhost:${port}`);
});
