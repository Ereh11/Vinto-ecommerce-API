const { google } = require('googleapis');
const fs = require('node:fs');
const path = require('path');
const dotenv = require("dotenv");
const mime = require('mime-types');


const filePath = path.join(__dirname, '../../.env');
const envParams = dotenv.config({ path: filePath }).parsed;

const CLIENT_ID = envParams.CLIENT_ID;
const CLIENT_SECRET = envParams.CLIENT_SECRET;
const REDIRECT_URL = envParams.REDIRECT_URL;

const REFRESH_TOKEN = envParams.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);
console.log(CLIENT_ID)
console.log(CLIENT_SECRET)
console.log(REDIRECT_URL)
console.log(REFRESH_TOKEN)

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

// const filePath = path.join(__dirname, 'test.jpg');

function generateRandomImageName(extension) {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now();
    return `img_${timestamp}_${randomNumber}.${extension}`;
}


async function uploadFile(image) {
    const filePath = path.join(__dirname, `../../${image}`);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    const extension = path.extname(filePath).slice(1) || 'jpg';

    try {
        const response = await drive.files.create({
            requestBody: {
                name: generateRandomImageName(extension),
                mimeType: mimeType,
                parents: ['17F3zxq0a8XL4WgJFk_P1muQn_ql54l4P'],
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath)
            }
        })
        return response.data.id;
    } catch (err) {
        console.log(err.message);
    }
}


// uploadFile();


async function deleteFile() {
    try {
        const response = await drive.files.delete({
            fileId: '1-EGhfjtwLORxdopMHl6Bm7uiY5e0_rcd',
        })
        console.log(response.data, response.status)
    } catch (err) {
        console.log(err.message);
    }
}


// deleteFile();

async function generatePublicUrl(image) {
    try {
        const fileId = await uploadFile(image);
        await drive.permissions.create({
            fileId: fileId,
            requestBody: { role: 'reader', type: 'anyone' }
        });

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        });

        let src = `https://lh3.googleusercontent.com/d/${result.data.webViewLink.split('/')[5]}=w1000?authuser=1/view`;
        return src;
    } catch (err) { console.log(err.message) }
}

module.exports = generatePublicUrl;

