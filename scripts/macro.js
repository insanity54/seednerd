// scripts/enter.js
// every 2 seconds, has a random chance to do an action


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

async function getLuantiWindowId() {
    const { stdout } = await execAsync('xdotool search --class Luanti | head -n1');
    return stdout.trim();
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
async function walkForward() {
    try {
        // Get the window ID of the Luanti application
        const { stdout: windowId } = await execAsync('xdotool search --class Luanti | head -n1');

        // Press and hold the W key
        await execAsync(`xdotool keydown --window ${windowId.trim()} w`);

        console.log('holding W');

        // Wait for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Release the W key
        await execAsync(`xdotool keyup --window ${windowId.trim()} w`);

        console.log('released W');
    } catch (err) {
        console.error('Failed to walk forward:', err);
    }
}
async function jumpForward() {
    try {
        // Get the window ID of the Luanti application
        const { stdout: windowId } = await execAsync('xdotool search --class Luanti | head -n1');
        const win = windowId.trim();

        // Hold down W and Space
        await execAsync(`xdotool keydown --window ${win} w`);
        await execAsync(`xdotool keydown --window ${win} space`);
        console.log('holding W and Space');

        // Wait for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Release W and Space
        await execAsync(`xdotool keyup --window ${win} w`);
        await execAsync(`xdotool keyup --window ${win} space`);
        console.log('released W and Space');
    } catch (err) {
        console.error('Failed to jump forward:', err);
    }
}

async function smoothMouseMove(dx, dy, durationMs = 3000, steps = 60) {
    const stepX = dx / steps;
    const stepY = dy / steps;
    const stepDelay = durationMs / steps;

    for (let i = 0; i < steps; i++) {
        await execAsync(`xdotool mousemove_relative -- ${stepX} ${stepY}`);
        await new Promise(resolve => setTimeout(resolve, stepDelay));
    }
}

async function turnRight() {
    try {
        console.log('Turning Right smoothly');
        await smoothMouseMove(500, 0, 3000);
        console.log('Finished Turning Right');
    } catch (err) {
        console.error('Failed to turn right:', err);
    }
}

async function turnLeft() {
    try {
        console.log('Turning Left smoothly');
        await smoothMouseMove(-500, 0, 3000);
        console.log('Finished Turning Left');
    } catch (err) {
        console.error('Failed to turn left:', err);
    }
}

async function lookUp() {
    try {
        console.log('Looking Up smoothly');
        await smoothMouseMove(0, -500, 3000);
        console.log('Finished Looking Up');
    } catch (err) {
        console.error('Failed to look up:', err);
    }
}

async function lookDown() {
    try {
        console.log('Looking Down smoothly');
        await smoothMouseMove(0, 500, 3000);
        console.log('Finished Looking Down');
    } catch (err) {
        console.error('Failed to look down:', err);
    }
}

async function say(message) {
    try {
        const windowId = await getLuantiWindowId();
        const messages = [
            "woof", "meow", "quack", "moo", "baa", "neigh", "oink", "ribbit", "buzz", "hiss",
            "roar", "chirp", "tweet", "caw", "growl", "howl", "cluck", "bleat", "croak", "snort",
            "squeak", "bark", "purr", "honk", "coo", "hoot", "snarl", "whinny", "screech", "gobble",
            "warble", "yowl", "trill", "bray", "click", "drum", "squawk", "bellow", "huff", "peep",
            "grunt", "yap", "mew", "chirrup", "gurgle", "hum", "whimper", "shriek", "pant", "whistle",
            "meep", "nya", "arf", "yiff", "eeek", "squee", "eep", "blub", "cackle", "sniff",
            "thrum", "nicker", "twit-twoo", "grrr", "chirble", "bloop", "dook", "rawr", "cooo", "cheep",
            "keek", "yarp", "woooo", "nyaa", "nyaan", "bork", "nyoom", "squeee", "eep-eep", "screeb",
            "wark", "graww", "reee", "snurk", "tweep", "twirp", "gyaaa", "fweep", "hurk", "meorw",
            "pew", "shree", "meugh", "fwip", "glerk", "blep", "mrow", "boof", "wheeze", "cchirp"
        ];;

        const msg = message || messages[Math.floor(Math.random() * messages.length)];
        console.log(`Saying: ${msg}`);

        await execAsync(`xdotool key --window ${windowId} T`);
        await execAsync(`xdotool type --window ${windowId} --delay 50 "${msg}"`);
        await execAsync(`xdotool key --window ${windowId} Return`);
    } catch (err) {
        console.error('Failed to say message:', err);
    }
}

async function punch() {
    try {
        const windowId = await getLuantiWindowId();
        console.log('Punching...');
        await execAsync(`xdotool windowactivate ${windowId} mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await execAsync(`xdotool windowactivate ${windowId} mouseup 1`);
        console.log('Finished punch.');
    } catch (err) {
        console.error('Failed to punch:', err);
    }
}
async function activate() {
    try {
        const windowId = await getLuantiWindowId();
        console.log('Activating...');
        await execAsync(`xdotool windowactivate ${windowId} click 3`);
    } catch (err) {
        console.error('Failed to activate:', err);
    }
}
async function select(n) {
    try {
        const number = typeof n === 'number' ? n : Math.floor(Math.random() * 8) + 1;
        if (number < 1 || number > 8) {
            throw new Error('select(n) must be between 1 and 8');
        }

        const windowId = await getLuantiWindowId();
        console.log(`Selecting item ${number}`);
        await execAsync(`xdotool key --window ${windowId} ${number}`);
    } catch (err) {
        console.error(`Failed to select item ${n}:`, err);
    }
}





async function punch() {
    try {
        console.log('Punching...');
        await execAsync(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await execAsync(`xdotool mouseup 1`);
        console.log('Finished punch.');
    } catch (err) {
        console.error('Failed to punch:', err);
    }
}


async function activate() {
    try {
        console.log('Activating (right-click)...');
        await execAsync(`xdotool click 3`);
    } catch (err) {
        console.error('Failed to activate:', err);
    }
}


async function drop() {
    try {
        const windowId = await getLuantiWindowId();
        console.log('Dropping item...');
        await execAsync(`xdotool key --window ${windowId} q`);
    } catch (err) {
        console.error('Failed to drop item:', err);
    }
}


async function mainIter() {
    await assertXdotoolExists();

    const actions = [
        pressEnter,
        walkForward,
        jumpForward,
        lookDown,
        lookUp,
        turnLeft,
        turnRight,
        // say,
        drop,
        punch,
        activate,
        select,
    ];

    while (true) {
        const shouldAct = Math.random() < 0.90;

        if (shouldAct) {
            const action = actions[Math.floor(Math.random() * actions.length)];
            console.log(`Performing action: ${action.name}`);
            try {
                await action();
            } catch (err) {
                console.error(`Action ${action.name} failed:`, err);
            }
        } else {
            console.log('No action this time.');
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

mainIter()