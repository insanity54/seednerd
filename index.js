// index.js

const { assertLuantiExists, launch } = require("./src/luanti.js");
const { chatClient, readChat, startChatClient } = require('./src/chat.js');
const { actOnMessage, actOnJSON } = require('./src/bot.js');
const { assertXdotoolExists } = require("./src/controls.js");
const { getRandomChatMessage } = require('./src/random.js');
const commands = require('./src/commands.js');
const { readAi } = require('./src/llm.js');

async function main() {
    await assertLuantiExists();
    await assertXdotoolExists();
    startChatClient(chatClient);

    const chat = readChat();   // async iterator for chat messages
    const luanti = launch();   // async iterator for luanti process lifecycle
    const ai = readAi();       // async iterator for AI responses

    // Start generators
    let nextChat = chat.next();
    let nextLuanti = luanti.next();
    let nextAi = ai.next();
    let currentPid = null;
    let lastChatTimestamp = Date.now();

    // Periodically check for idle chat
    const idleCheckInterval = 3_000; // 3 seconds
    const idleThreshold = 300000;     // 5 minutes

    setInterval(async () => {
        const now = Date.now();
        // console.log(`checking now=${now} lastChatTimestamp=${lastChatTimestamp} idleThreshold=${idleThreshold}`);
        if (now - lastChatTimestamp > idleThreshold) {
            const fakeMessage = getRandomChatMessage(commands);
            console.log("Chat idle. Sending synthetic message: " + fakeMessage);
            await actOnMessage(currentPid, fakeMessage);
        }
    }, idleCheckInterval);

    while (true) {
        const result = await Promise.race([
            nextAi.then(value => ({ source: 'AI', value })),
            nextChat.then(value => ({ source: 'Chat', value })),
            nextLuanti.then(value => ({ source: 'Luanti', value })),
        ]);

        console.debug(`Got value from generator ${result.source}: ${JSON.stringify(result.value.value)}.`);
        console.log(result.value.value)

        // Only advance the generator that just yielded a value
        if (result.source === 'Chat') {
            const payload = result.value.value
            console.log(`payload:${JSON.stringify(payload)}`)
            const isActed = await actOnMessage(currentPid, result.value.value.message)
            if (isActed) {
                // we got a message that caused an action, so we reset the idle timer.
                lastChatTimestamp = Date.now(); // reset the timer so we aren't considered idle
            }
            nextChat = chat.next();
        } else if (result.source === 'AI') {
            const instructions = result.value.value.message
            console.log(`AI source. instructions=${JSON.stringify(instructions)}`)
            await actOnJSON(currentPid, result.value.value.message)
            nextAi = ai.next();
        } else if (result.source === 'Luanti') {
            currentPid = result.value.value.pid; // 🧠 store the PID for future use
            nextLuanti = luanti.next();
        } else {
            throw new Error(`Unhandled result.source=${result.source}. This is a bug where the async iterater source is not handled. Dev, please implement.`);
        }
    }
}



main()