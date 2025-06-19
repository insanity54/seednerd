const { execa } = require('execa');
const { smoothMouseMove, directionKeyMap } = require('./controls.js');
const { getRandomPhrase } = require('./random.js');
const { speak } = require('./tts.js')

const commands = [
    'walk',
    'say',
    'jump',
    'activate',
    'punch',
    'select',
    'enter',
    'spawn',
    'home',
    'sethome',
    'drop',
    'look',
    'turn',
    'screenshot',
    'esc',
];




function assertWid(wid) {
    if (!wid) throw new Error('first arg wid required');
}

async function esc(wid) {
    await execa('xdotool', ['key', '--window', wid, 'Escape']);
}

async function enter(wid) {
    await execa('xdotool', ['key', '--window', wid, 'Return']);
}

async function home(wid) {
    await execa('xdotool', ['key', '--window', wid, 'slash']);
    await execa('xdotool', ['type', '--window', wid, '--delay', '25', 'home']);
    await execa('xdotool', ['key', '--window', wid, 'Return']);
}

async function sethome(wid) {
    await execa('xdotool', ['key', '--window', wid, 'slash']);
    await execa('xdotool', ['type', '--window', wid, '--delay', '25', 'sethome']);
    await execa('xdotool', ['key', '--window', wid, 'Return']);
}

async function screenshot(wid) {
    await execa('xdotool', ['key', '--window', wid, 'F12']);
}

async function spawn(wid) {
    await execa('xdotool', ['key', '--window', wid, 'slash']);
    await execa('xdotool', ['type', '--window', wid, '--delay', '25', 'spawn']);
    await execa('xdotool', ['key', '--window', wid, 'Return']);
}

async function walk(wid, direction = 'forward') {
    assertWid(wid)
    if (!direction) throw new Error('second arg direction required');
    const key = directionKeyMap[direction];
    if (!key) {
        console.error(`Unknown direction "${direction}"`);
        return;
    }

    try {

        await execa('xdotool', ['keydown', '--window', wid, key]);
        console.log(`holding ${key.toUpperCase()} for walk ${direction}`);

        await new Promise(resolve => setTimeout(resolve, 3000));

        await execa('xdotool', ['keyup', '--window', wid, key]);
        console.log(`released ${key.toUpperCase()}`);
    } catch (err) {
        console.error(`Failed to walk ${direction}:`, err);
    }
}


async function jump(wid, direction = 'forward') {
    assertWid(wid)
    if (!direction) throw new Error('second arg direction required');
    const key = directionKeyMap[direction];
    if (!key) {
        console.error(`Unknown direction "${direction}"`);
        return;
    }

    try {

        await execa('xdotool', ['keydown', '--window', wid, key]);
        await execa('xdotool', ['keydown', '--window', wid, 'space']);
        console.log(`holding ${key.toUpperCase()} and SPACE for jump ${direction}`);

        await new Promise(resolve => setTimeout(resolve, 3000));

        await execa('xdotool', ['keyup', '--window', wid, key]);
        await execa('xdotool', ['keyup', '--window', wid, 'space']);
        console.log(`released ${key.toUpperCase()} and SPACE`);
    } catch (err) {
        console.error(`Failed to jump ${direction}:`, err);
    }
}


async function turn(wid, direction = 'right', distance = 3, durationSeconds = 0.5) {
    assertWid(wid);

    // Convert "distance" to pixels, preserving direction
    const dx = distance * 100 * (direction === 'right' ? 1 : -1);
    const durationMs = Math.min(2000, durationSeconds * 1000);

    try {
        console.log(`Turning ${direction} smoothly for distance ${distance}`);
        await smoothMouseMove(wid, dx, 0, durationMs);
        console.log(`Finished turning ${direction}`);
    } catch (err) {
        console.error(`Failed to turn ${direction}:`, err);
    }
}


async function look(wid, direction = 'up', duration = 0.5) {
    assertWid(wid)
    duration = Math.min(2000, duration * 1000)
    const offsetY = {
        up: -250,
        down: 250
    }[direction];

    if (offsetY === undefined) {
        console.error(`Unknown look direction: "${direction}"`);
        return;
    }

    try {
        console.log(`Looking ${direction} smoothly`);
        await smoothMouseMove(wid, 0, offsetY, duration);
        console.log(`Finished looking ${direction}`);
    } catch (err) {
        console.error(`Failed to look ${direction}:`, err);
    }
}




async function say(wid, ...parts) {
    assertWid(wid)
    const msg = parts ? parts.join(' ') : getRandomPhrase();
    try {

        console.log(`Saying: ${msg}`);
        await speak(msg)

        await execa('xdotool', ['key', '--window', wid, 'T']);
        await execa('xdotool', ['type', '--window', wid, '--delay', '5', msg]);
        await execa('xdotool', ['key', '--window', wid, 'Return']);

    } catch (err) {
        console.error('Failed to say message:', err);
    }
}



async function punch(wid, duration = 3) {
    assertWid(wid)
    duration = Math.min(6000, duration * 1000)
    try {
        console.log('Punching...');
        await execa('xdotool', ['mousedown', '--window', wid, '1']);
        await new Promise(resolve => setTimeout(resolve, duration));
        await execa('xdotool', ['mouseup', '--window', wid, '1']);
        console.log('Finished punch.');
    } catch (err) {
        console.error('Failed to punch:', err);
    }
}




async function activate(wid) {
    assertWid(wid)
    try {
        console.log('Activating (right-click)...');
        await execa('xdotool', ['click', '--window', wid, '3']);
    } catch (err) {
        console.error('Failed to activate:', err);
    }
}


async function drop(wid) {
    assertWid(wid)
    try {
        console.log('Dropping item...');
        await execa('xdotool', ['key', '--window', wid, 'q']);
    } catch (err) {
        console.error('Failed to drop item:', err);
    }
}

async function select(wid, n = 0) {
    assertWid(wid)
    try {
        const number = typeof n === 'number' ? n : Math.floor(Math.random() * 8) + 1;
        if (number < 1 || number > 8) {
            throw new Error('select(n) must be between 1 and 8');
        }

        console.log(`Selecting item ${number}`);
        await execa('xdotool', ['key', '--window', wid, number]);
    } catch (err) {
        console.error(`Failed to select item ${n}:`, err);
    }
}


async function screenshot(wid) {
    assertWid(wid)
    await execa('xdotool', ['key', '--window', wid, 'F12']);
}



module.exports = {
    say,
    drop,
    select,
    activate,
    punch,
    look,
    turn,
    jump,
    walk,
    enter,
    screenshot,
    sethome,
    home,
    spawn,
    esc,
    commands,
}