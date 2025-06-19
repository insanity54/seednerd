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
    'screenshot',
    'drop',
    'look',
    'turn',
];




function assertWid(wid) {
    if (!wid) throw new Error('first arg wid required');
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


async function turn(wid, direction) {
    assertWid(wid)
    if (!direction) throw new Error('second arg direction required');
    const distance = direction === 'right' ? 500 : -500;
    try {
        console.log(`Turning ${direction.charAt(0).toUpperCase() + direction.slice(1)} smoothly`);
        await smoothMouseMove(wid, distance, 0, 3000);
        console.log(`Finished Turning ${direction.charAt(0).toUpperCase() + direction.slice(1)}`);
    } catch (err) {
        console.error(`Failed to turn ${direction}:`, err);
    }
}


async function look(wid, direction = 'up') {
    assertWid(wid)
    if (!direction) throw new Error('seocnd arg direction required');
    const offsetY = {
        up: -500,
        down: 500
    }[direction];

    if (offsetY === undefined) {
        console.error(`Unknown look direction: "${direction}"`);
        return;
    }

    try {
        console.log(`Looking ${direction} smoothly`);
        await smoothMouseMove(wid, 0, offsetY, 3000);
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



async function punch(wid) {
    assertWid(wid)
    try {
        console.log('Punching...');
        await execa('xdotool', ['mousedown', '--window', wid, '1']);
        await new Promise(resolve => setTimeout(resolve, 3000));
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
    commands,
}