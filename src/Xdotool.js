const { execa } = require('execa');
const { smoothMouseMove, directionKeyMap } = require('./controls.js');
const { getRandomPhrase } = require('./random.js');
const { speak } = require('./tts.js');
const { sleep } = require('./timers.js');

const commands = [
    'activate',
    'camera',
    'drop',
    'enter',
    'esc',
    'home',
    'inventory',
    'itab',
    'igrid',
    'iinv',
    'jump',
    'look',
    'punch',
    'say',
    'select',
    'screenshot',
    'sethome',
    'spawn',
    'turn',
    'walk',
];



export class Xdotool {
    constructor(wid) {
        if (!wid) throw new Error('wid is required');
        this.wid = wid;
    }



    async activate() {
        try {
            console.log('Activating (right-click)...');
            await execa('xdotool', ['click', '--window', this.wid, '3']);
        } catch (err) {
            console.error('Failed to activate:', err);
        }
    }



    async click(button = 1) {
        await execa('xdotool', ['click', '--window', this.wid, String(button)]);
    }

    async drop() {
        try {
            console.log('Dropping item...');
            await execa('xdotool', ['key', '--window', this.wid, 'q']);
        } catch (err) {
            console.error('Failed to drop item:', err);
        }
    }
    async delay(ms) {
        await sleep(ms);
    }

    async esc() {
        await this.press('Escape');
    }

    async enter() {
        await this.press('Return');
    }

    async hold(key, duration = 1000) {
        await this.keydown(key);
        await sleep(duration);
        await this.keyup(key);
    }
    async inventory() {
        await this.press('I');
    }
    async keydown(key) {
        await execa('xdotool', ['keydown', '--window', this.wid, key]);
    }

    async keyup(key) {
        await execa('xdotool', ['keyup', '--window', this.wid, key]);
    }


    async mousemove(x, y) {
        await execa('xdotool', ['mousemove', '--window', this.wid, String(x), String(y)]);
    }

    async press(key) {
        await execa('xdotool', ['key', '--window', this.wid, key]);
    }

    async screenshot() {
        await execa('xdotool', ['key', '--window', this.wid, 'F12']);
    }

    async select(n = 0) {
        try {
            const number = typeof n === 'number' ? n : Math.floor(Math.random() * 8) + 1;
            if (number < 1 || number > 8) {
                throw new Error('select(n) must be between 1 and 8');
            }

            console.log(`Selecting item ${number}`);
            await execa('xdotool', ['key', '--window', this.wid, number]);
        } catch (err) {
            console.error(`Failed to select item ${n}:`, err);
        }
    }

    async say(text) {
        await this.press('T')
        await this.type(text)
        await this.press('Return')
    }

    async type(text) {
        await execa('xdotool', ['type', '--window', this.wid, '--delay', '5', text]);
    }


    async walk(direction = 'forward', duration = 3) {
        const directionKeyMap = {
            forward: 'w',
            back: 's',
            left: 'a',
            right: 'd',
        };

        const key = directionKeyMap[direction];
        if (!key) throw new Error(`Unknown direction "${direction}"`);

        const durationMs = Math.min(6000, duration * 1000);

        await this.keydown(key);
        console.log(`Walking ${direction} (${key}) for ${durationMs}ms`);
        await sleep(durationMs);
        await this.keyup(key);
    }
}
