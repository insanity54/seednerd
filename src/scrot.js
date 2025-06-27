// scrot.js

const { execa } = require('execa');
const os = require('os');
const path = require('path');
const { randomString } = require('./random.js');

// Take a screenshot using `scrot`
// Save to os.tmpdir() and return the image path
async function scrot(wid) {
    const imgPath = path.join(os.tmpdir(), `${randomString()}-scrot.png`);
    await execa('scrot', ['--silent', '--pointer', imgPath]);
    return imgPath;
}

module.exports = {
    scrot
}