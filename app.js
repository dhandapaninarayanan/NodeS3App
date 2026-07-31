const express = require("express");
const path = require("path");

const uploadRoute = require("./routes/upload");
const { listFiles } = require("./services/s3Service");

const app = express();

const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {

    try {

        const data = await listFiles();

        res.render("index", {

            files: data.files,

            totalFiles: data.totalFiles,

            totalStorage: data.totalStorage,

            region: process.env.AWS_REGION

});

    } catch (err) {

        console.error(err);

        res.render("index", {

            files: [],

            totalFiles: 0,

            totalStorage: "0 Bytes",

            region: process.env.AWS_REGION

        });

    }

});

// Upload Route
app.use("/upload", uploadRoute);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});