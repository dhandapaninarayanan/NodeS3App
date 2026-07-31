const fs = require("fs");
const path = require("path");

const {
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const s3Client = require("../config/aws");

async function uploadFile(file) {

    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {

        Bucket: process.env.AWS_BUCKET_NAME,

        Key: file.originalname,

        Body: fileStream,

        ContentType: file.mimetype

    };

    await s3Client.send(
        new PutObjectCommand(uploadParams)
    );

    fs.unlinkSync(file.path);

    return true;
}

async function listFiles() {

    const command = new ListObjectsV2Command({

        Bucket: process.env.AWS_BUCKET_NAME

    });

    const response = await s3Client.send(command);

    const files = response.Contents || [];

    const totalSize = files.reduce((sum, file) => sum + file.Size, 0);

    return {

        files: files.map(file => ({

            key: file.Key,

            size: formatFileSize(file.Size),

            lastModified: formatDate(file.LastModified)

        })),

        totalFiles: files.length,

        totalStorage: formatFileSize(totalSize)

    };

}

async function deleteFile(fileName) {

    const command = new DeleteObjectCommand({

        Bucket: process.env.AWS_BUCKET_NAME,

        Key: fileName

    });

    await s3Client.send(command);

    return true;
}

function formatFileSize(bytes) {

    if (bytes < 1024)
        return bytes + " Bytes";

    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(2) + " KB";

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-GB");
}
module.exports = {
    uploadFile,
    listFiles,
    deleteFile
};