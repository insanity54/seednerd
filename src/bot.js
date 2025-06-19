

const {
    say,
    jump,
    walk,
    punch,
    activate,
    enter,
    select,
    home,
    sethome,
    spawn,
    screenshot,
    look,
    turn,
    esc,
    drop,
} = require('./commands.js');
const { getLuantiWindowId } = require('./luanti.js');

// Map command strings to actual functions
const commandMap = {
    say,
    jump,
    walk,
    punch,
    activate,
    enter,
    select,
    home,
    sethome,
    spawn,
    screenshot,
    look,
    turn,
    esc,
    drop,
};

/**
 * Parse a message string like "!walk left 4"
 * into an object: { name: "walk", args: ["left", "4"] }
 */
function getCommand(message) {
    if (!message || typeof message !== 'string') return null;
    if (!message.startsWith('!')) return null;

    const [rawName, ...args] = message.slice(1).trim().split(/\s+/);
    const name = rawName.toLowerCase();
    console.log(`rawName=${rawName}, name=${name}`)

    if (!commandMap[name]) return null;

    return {
        name,
        args,
        fn: commandMap[name],
    };
}

async function actOnMessage(pid, message) {
    console.log(`actOnMessage called with pid=${pid} message=${message}`)

    if (!pid) throw new Error('first param passed to actOnMessage must be Luanti process ID');
    if (!message) throw new Error('second param passed to actOnMessage must be a message');

    console.debug(`actOnMessage with pid=${pid} and message=${message}`)

    try {
        const wid = await getLuantiWindowId(pid)
        console.debug(`Luanti wid=${wid}`)
        const command = getCommand(message);
        if (!command) return;
        console.debug(`command:${JSON.stringify(command)}, message=${message}, pid=${pid}`)

        try {
            await command.fn(wid, ...command.args);
        } catch (err) {
            console.error(`Failed to run command "${command.name}":`, err);
        }
    } catch (e) {
        console.error(`error while acting on message pid=${pid} message=${message}. Error as follows.`);
        console.error(e)
        console.warn('@TODO we need to re-try acting on this message')
    }
}

module.exports = {
    actOnMessage,
    getCommand,
};
