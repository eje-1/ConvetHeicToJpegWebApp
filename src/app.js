const express = require('express');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const convert = require('heic-convert');
const bodyParser = require('body-parser');
const multer = require('multer');
const os = require('os');

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

/**
 * get index page for user with public path
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});


/**
 * get image file from frontend and convert it
 * when convert is down then post to the fortend
 */
app.post('/convert', upload.single('heicFile'), async (req, res) => {

    try {
        const heicFileBuffer = req.file.buffer;
        const outputBuffer = await convert({
            buffer: heicFileBuffer,
            format: 'JPEG',
            quality: 1
        });

        console.log('file success converted');

        res.setHeader('Content-Type', 'image/jpeg');
        console.log('send back to the page');
        res.send(outputBuffer);

    } catch (error) {
        console.error('Error converting HEIC to JPEG:', error);
        res.status(500).send('Error converting HEIC to JPEG');
    }
});

/**
 * Server listen on port 3000 and localhots or 127.0.0.1
 * console input for user
 * With the method serverTime we can see the Up time
 */
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
    serverTime();
});

// Printing os.uptime() value
function serverTime() {
    let ut_sec = os.uptime();
    let ut_min = ut_sec / 60;
    let ut_hour = ut_min / 60;

    ut_sec = Math.floor(ut_sec);
    ut_min = Math.floor(ut_min);
    ut_hour = Math.floor(ut_hour);

    ut_hour = ut_hour % 60;
    ut_min = ut_min % 60;
    ut_sec = ut_sec % 60;

    console.log("Up time: "
        + ut_hour + " Hour(s) "
        + ut_min + " minute(s) and "
        + ut_sec + " second(s)");
}