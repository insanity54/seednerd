

const { directions, directionAliases } = require('./directions');
const { commands } = require('./commands.js');
const { silly } = require('./phrases.js');

function pickWeighted(actions) {
    const totalWeight = actions.reduce((sum, action) => sum + action.weight, 0);
    const r = Math.random() * totalWeight;
    let acc = 0;

    for (const action of actions) {
        acc += action.weight;
        if (r < acc) return action;
    }

    return actions[0]; // fallback
}




function getRandomChatMessage() {

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
                return [silly[Math.floor(Math.random() * silly.length)]];
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
                const slots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                return [slots[Math.floor(Math.random() * slots.length)]];
            default:
                return [];
        }
    }

    const command = commands[Math.floor(Math.random() * commands.length)];
    const args = getArgs(command);

    return `!${command} ${args.join(' ')}`.trim();
}

function getRandomPhrase() {
    const ph = phrases.all
    return ph[Math.floor(Math.random() * ph.length)];
}

module.exports = {
    getRandomChatMessage,
    pickWeighted,
    getRandomPhrase,
}