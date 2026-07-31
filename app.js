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

        const files = await listFiles();

        console.log(files);   // <-- Add this line

        res.render("index", { files });

    } catch (err) {

        console.error(err);

        res.render("index", { files: [] });

    }

});

// Upload Route
app.use("/upload", uploadRoute);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});