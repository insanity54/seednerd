// scripts/luanti.js
// open luanti, connect to server and do random inputs.


const { exec } = require('child_process');
const { promisify } = require('util');
const { env } = require('../config.js')



const execAsync = promisify(exec);

// Check if luanti is available
async function assertLuantiExists() {
    try {
        await execAsync('luanti --version');
    } catch (err) {
        throw new Error('luanti is not installed or not found in $PATH.');
    }
}

async function launch() {
    // await execAsync(`luanti --address ${env.LUANTI_ADDRESS} --name ${env.LUANTI_USERNAME} --password ${env.LUANTI_PASSWORD} --console --go --random-input`);
    await execAsync(`luanti --address ${env.LUANTI_ADDRESS} --name ${env.LUANTI_USERNAME} --password ${env.LUANTI_PASSWORD} --console --go`);
}

// Randomized loop
async function main() {
    await assertLuantiExists()
    launch()
}

main();