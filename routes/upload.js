const express = require("express");
const multer = require("multer");
const path = require("path");

const {
    uploadFile,
    deleteFile
} = require("../services/s3Service");

const router = express.Router();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));
    }

});

const upload = multer({ storage });

router.post("/",

upload.single("myFile"),

async (req, res) => {

    try{

        await uploadFile(req.file);

        res.send(`
            <h2>File Uploaded Successfully to Amazon S3 🎉</h2>

            <a href="/">Upload Another File</a>
        `);

    }
    catch(err){

        console.error(err);

        res.status(500).send(err.message);

    }

});

router.post("/delete", async (req, res) => {

    try {

        const fileName = req.body.fileName;

        await deleteFile(fileName);

        res.redirect("/");

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

});

module.exports = router;