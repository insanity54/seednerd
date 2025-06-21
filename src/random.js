

const { directions, directionAliases } = require('./directions');
const { all } = require('./phrases.js');

const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function randomOne(array) {
    return array[Math.floor(Math.random() * array.length)];
}


function getRandomChatMessage(commands) {
    if (!commands) throw new Error('getRandomChatMessage requires commands as first arg');

    // Generate random args based on command
    function getArgs(cmd) {
        let duration;
        switch (cmd) {
            case 'walk':
                // walk direction and maybe steps
                duration = Math.floor(Math.random() * 10) + 1;
                return [directions[Math.floor(Math.random() * directions.length)], duration];
            case 'say':
                // say some random phrase
                return [all[Math.floor(Math.random() * all.length)]];
            case 'itab':
                return [randomOne(slots)];
            case 'igrid':
                return [randomOne(slots)];
            case 'iinv':
                const invSlots = Array.from({ length: 32 }, (_, i) => i + 1);
                return [randomOne(invSlots)]
            case 'jump':
                duration = Math.floor(Math.random() * 10) + 1;
                return [directions[Math.floor(Math.random() * directions.length)], duration];
            case 'activate':
                return [duration];
            case 'punch':
                duration = Math.floor(Math.random() * 10) + 1;
                return [duration];
            case 'turn':
                duration = Math.floor(Math.random() * 10) + 1;
                return [directions[Math.floor(Math.random() * directions.length)], duration];
            case 'enter':
                return []
            case 'select':
                return [slots[Math.floor(Math.random() * slots.length)]];
            default:
                return [];
        }
    }

    // we dont want the bot to use certain commands unless a human tells it to.
    const disabled = ['screenshot', 'sethome', 'spawn', 'look', 'esc', 'home', 'say'];
    const availableCommands = commands.filter(c => !disabled.includes(c));


    const command = availableCommands[Math.floor(Math.random() * availableCommands.length)];
    const args = getArgs(command);

    return `!${command} ${args.join(' ')}`.trim();
}


function getRandomPhrase() {
    const index = Math.floor(Math.random() * all.length);
    return all[index];
}

module.exports = {
    getRandomChatMessage,
    getRandomPhrase,
    randomOne,
}

