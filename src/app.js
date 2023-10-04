const express = require('express');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const convert = require('heic-convert');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, '../public');
const convertPath = path.join(__dirname);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use(express.static(convertPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.post('/convert', upload.single('heicFile'), async (req, res) => {
    try {
        const heicFileBuffer = req.file.buffer;
        const outputBuffer = await convert({
            buffer: heicFileBuffer,
            format: 'JPEG',
            quality: 1
        });

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(outputBuffer);
    } catch (error) {
        console.error('Error converting HEIC to JPEG:', error);
        res.status(500).send('Error converting HEIC to JPEG');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});
 