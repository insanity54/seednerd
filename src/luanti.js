
const { execa } = require('execa');
const { env } = require('./config.js');
const { sleep } = require('./timers.js');

async function getLuantiWindowId(pid, tries = 0) {
    try {
        if (!pid) throw new Error('getLuantiWindowId requires pid as argument.');
        // console.debug(`getLuantiWindowId pid=${pid}`);
        const res = await execa('xdotool', ['search', '--pid', pid]);
        // console.debug(`getLuantiWindowId pid=${pid} with res as follows.`)
        // console.debug(res)
        const { stdout } = res
        return stdout.trim();
    } catch (e) {
        const msg = `failed to get Luanti window ID after ${tries} tries.`
        if (tries > 2) {
            throw new Error(msg)
        } else {
            console.warn(msg);
            await sleep(999)
            return getLuantiWindowId(pid, tries + 1)
        }
    }
}


// Check if luanti is available
async function assertLuantiExists() {
    try {
        const t = await execa('luanti', ['--version']);
        // console.log(t)
    } catch (err) {
        throw new Error('luanti is not installed or not found in $PATH.');
    }
}


async function* launch() {
    while (true) {

        let args = [
            '--console',
            '--go'
        ];
        if (env.ONLINE) {
            args = args.concat(['--address', env.LUANTI_ADDRESS,
                '--name', env.LUANTI_USERNAME,
                '--password', env.LUANTI_PASSWORD,
            ])
        } else {
            args = args.concat([
                '--world', '/home/cj/.minetest/worlds/guns'
            ])
        }


        console.log('[luanti] launching...');
        const proc = execa('luanti', args, {
            stdio: 'inherit', // Still lets luanti output show in terminal
        });

        // reposition the window
        // xdotool windowmove <window_id> <x> <y>
        const wid = await getLuantiWindowId(proc.pid)
        execa('xdotool', ['windowmove', wid, env.WINDOW_XY[0], env.WINDOW_XY[1]])
        await sleep(500)
        await execa('xdotool', ['key', '--window', wid, 'F11']); // fullscreen

        yield { pid: proc.pid, wid } // return the Process ID so we can manipulate the window

        try {
            await proc; // Wait until luanti exits (success or error)
            console.warn('[luanti] exited with code 0. Restarting...');
        } catch (err) {
            console.warn(`[luanti] exited with error: ${err.message || err}. Restarting...`);
        }
    }
}

module.exports = {
    getLuantiWindowId,
    assertLuantiExists,
    launch,
}