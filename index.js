// index.js

const { assertLuantiExists, launch } = require("./src/luanti.js");
const { chatClient, readChat, startChatClient } = require('./src/chat.js');
const { actOnMessage } = require('./src/bot.js');
const { assertXdotoolExists } = require("./src/controls.js");
const { getRandomChatMessage } = require('./src/random.js');

async function main() {
    await assertLuantiExists();
    await assertXdotoolExists();
    startChatClient(chatClient);

    const chat = readChat();   // async iterator for chat messages
    const luanti = launch();   // async iterator for luanti process lifecycle

    // Start both generators
    let nextChat = chat.next();
    let nextLuanti = luanti.next();
    let currentPid = null;
    let lastChatTimestamp = Date.now();

    // Periodically check for idle chat
    const idleCheckInterval = 3_000; // 3 seconds
    const idleThreshold = 30_000;     // 30 seconds

    setInterval(async () => {
        const now = Date.now();
        if (now - lastChatTimestamp > idleThreshold) {
            const fakeMessage = getRandomChatMessage();
            console.log("Chat idle. Sending synthetic message: " + fakeMessage);
            await actOnMessage(currentPid, fakeMessage);
            lastChatTimestamp = now; // reset the timer so we don't spam
        }
    }, idleCheckInterval);

    while (true) {
        const result = await Promise.race([
            nextChat.then(value => ({ source: 'Chat', value })),
            nextLuanti.then(value => ({ source: 'Luanti', value })),
        ]);


        console.debug(`Got value from generator ${result.source}: ${JSON.stringify(result.value.value)}.`);
        console.log(result.value.value)


        // Only advance the generator that just yielded a value
        if (result.source === 'Chat') {
            await actOnMessage(currentPid, result.value.value.message)
            nextChat = chat.next();
        } else {
            currentPid = result.value.value.pid; // 🧠 store the PID for future use
            nextLuanti = luanti.next();
        }
    }
}



main()