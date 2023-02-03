var multer = require("multer");
var storage = multer.diskStorage({
    destination: (req, file, path) => {
        console.log("here")
        path(null, "public/images");
    },
    filename: (req, file, path) => {
        console.log("here", file.originalname);
        var lastIndex = file.originalname.lastIndexOf(".");
        console.log("lastIndex", lastIndex);
        const fileExtension = file.originalname.slice(lastIndex);
        const timeStamp = new Date().valueOf();
        const startName = file.originalname.slice(0, lastIndex);
        const newFileName = startName + "-" + timeStamp + fileExtension;
        console.log("fileExtension", fileExtension);
        console.log("timeStamp", timeStamp);
        console.log("startName", startName);
        console.log("newFileName", newFileName);

        path(null, newFileName);



    },



})
var upload = multer({ storage: storage });
module.exports = upload;