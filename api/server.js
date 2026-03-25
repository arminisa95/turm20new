const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } }); // 500MB limit

// R2 S3-compatible client
const s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT, // https://<account>.r2.cloudflarestorage.com
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
});

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL; // https://pub-xxx.r2.dev or your custom domain

app.use(cors({
    origin: ['https://arminisa95.github.io', 'http://localhost:*'],
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Simple auth check - compare to secret token
const checkAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Upload endpoint
app.post('/upload', checkAuth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const filename = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        await s3.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: filename,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }));

        const url = `${PUBLIC_URL}/${filename}`;

        res.json({
            success: true,
            url: url,
            filename: filename,
            size: req.file.size
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'turm20-upload' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Upload server running on port ${PORT}`);
});
