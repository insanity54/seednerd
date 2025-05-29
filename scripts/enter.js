// scripts/enter.js
// every 2 seconds, has a random chance to press Enter button


const { exec } = require('child_process');
const { promisify } = require('util');


const execAsync = promisify(exec);

// Check if xdotool is available
async function assertXdotoolExists() {
    try {
        await execAsync('xdotool --version');
    } catch (err) {
        throw new Error('xdotool is not installed or not found in $PATH.');
    }
}

// Press Enter key
async function pressEnter() {
    try {
        await execAsync('xdotool search --class Luanti | xargs -I{} xdotool key --window {} Return');
        console.log('↵ Enter key pressed');
    } catch (err) {
        console.error('Failed to press Enter:', err);
    }
}

// Randomized loop
async function mainLoop() {
    await assertXdotoolExists();

    setInterval(() => {
        const shouldPress = Math.random() < 0.33; // 33% chance
        if (shouldPress) {
            pressEnter();
        } else {
            console.log('No key press this time.');
        }
    }, 2000);
}

mainLoop();
