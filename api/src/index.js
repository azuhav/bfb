import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer'
import os from 'os';
import helmet from 'helmet';
import { Buffer } from 'node:buffer';

const PORT = process.env.PORT || 3001;

const app = express();

async function main() {

    let uploadedFiles = [];

    let uploadedFileType = null;

    app.use(cors());
    app.use(helmet());
    app.use((err, req, res, next) => {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File size exceeds 1MB limit!" });
        }
        next(err);
    });

    app.disable('x-powered-by');

    const storage = multer.memoryStorage();
    const upload = multer({
        storage,
        limits: { fileSize: 2 * 1024 * 1024 },
    });

    app.post('/upload', upload.single('file'), (req, res) => {

        if (!req.file) {
            console.log("Nothing received");
            return res.send({
                success: false
            });

        } else {
            uploadedFiles.push(req.file.buffer);
            uploadedFileType = req.file.mimetype;
            console.log('File uploaded successfully:', req.file.originalname);
            return res.send({
                success: true
            })
        }
    });

    app.get('/download', (req, res) => {

        const finalBuffer = Buffer.concat(uploadedFiles);
        uploadedFiles.splice(0, uploadedFiles.length);
        const fileName = req.query.name || `file_${crypto.randomUUID()}`;
        const contentType = uploadedFileType || 'application/octet-stream';

        const tempDir = os.tmpdir();
        const filePath = path.join(tempDir, fileName);
        fs.writeFileSync(filePath, finalBuffer);
        console.log(`Merged file saved to ${filePath}`);

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', contentType);
        res.download(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).send("Error sending file");
            } else {
                fs.unlinkSync(filePath);
                console.log(`File ${filePath} deleted after download`);
            }
        });
    });

    app.listen(PORT, () => {
        console.log(`Backend service is available on port:${PORT}.`);
    });
}

main()
    .catch(err => {
        console.error("Backend failed to start.");
        console.error(err && err.stack || err);
    });