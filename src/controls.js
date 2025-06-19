const { execa } = require('execa');
const { env } = require('./config.js');

// Check if xdotool is available
async function assertXdotoolExists() {
    try {
        await execa('xdotool', ['--version']);
    } catch (err) {
        throw new Error('xdotool is not installed or not found in $PATH.');
    }
}


const directionKeyMap = {
    forward: 'w',
    backward: 's',
    left: 'a',
    right: 'd'
};

async function centerMouse(wid) {
    const x = env.WINDOW_XY[0]
    const y = env.WINDOW_XY[1]
    await execa('xdotool', ['windowactivate', wid])
    await execa('xdotool', ['mousemove', x, y])
}

// async function smoothMouseMove(wid, dx, dy, durationMs = 250, steps = 120) {
//     const stepX = dx / steps;
//     const stepY = dy / steps;
//     const stepDelay = durationMs / steps;

//     await centerMouse(wid)
//     for (let i = 0; i < steps; i++) {
//         await execa('xdotool', ['mousemove_relative', '--', stepX, stepY]);
//         await new Promise(resolve => setTimeout(resolve, stepDelay));
//     }
// }
async function smoothMouseMove(wid, dx, dy, durationMs = 500, steps = 120) {
    await centerMouse(wid);

    const stepDelay = durationMs / steps;

    let accX = 0;
    let accY = 0;

    for (let i = 0; i < steps; i++) {
        accX += dx / steps;
        accY += dy / steps;

        const moveX = Math.round(accX);
        const moveY = Math.round(accY);

        if (moveX !== 0 || moveY !== 0) {
            await execa('xdotool', ['mousemove_relative', '--', moveX.toString(), moveY.toString()]);
            accX -= moveX;
            accY -= moveY;
        }

        await new Promise(resolve => setTimeout(resolve, stepDelay));
    }
}




// async function mainIter() {
//     await assertXdotoolExists();

//     const actions = [
//         { fn: press, args: ['enter'], weight: 10 },
//         { fn: walk, args: ['left'], weight: 2 },
//         { fn: walk, args: ['right'], weight: 2 },
//         { fn: walk, args: ['forward'], weight: 20 },
//         { fn: walk, args: ['backward'], weight: 20 },
//         { fn: jump, args: ['forward'], weight: 20 },
//         { fn: jump, args: ['backward'], weight: 20 },
//         { fn: jump, args: ['left'], weight: 2 },
//         { fn: jump, args: ['right'], weight: 2 },
//         { fn: look, args: ['up'], weight: 3 },
//         { fn: look, args: ['down'], weight: 3 },
//         { fn: turn, args: ['left'], weight: 5 },
//         { fn: turn, args: ['right'], weight: 5 },
//         { fn: say, weight: 1 },
//         { fn: drop, weight: 5 },
//         { fn: punch, weight: 15 },
//         { fn: activate, weight: 5 },
//         { fn: select, weight: 5 },
//     ];

//     while (true) {
//         const shouldAct = Math.random() < 0.90;

//         if (shouldAct) {
//             const action = pickWeighted(actions);
//             const name = action.fn.name || 'anonymous';

//             console.log(`Performing action: ${name}`);

//             try {
//                 if (action.args) {
//                     await action.fn(...action.args);
//                 } else {
//                     await action.fn();
//                 }
//             } catch (err) {
//                 console.error(`Action ${name} failed:`, err);
//             }
//         } else {
//             console.log('No action this time.');
//         }

//         await new Promise(resolve => setTimeout(resolve, 2000));
//     }
// }


module.exports = {
    directionKeyMap,
    smoothMouseMove,
    assertXdotoolExists,
}