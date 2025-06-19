const { ChatClient } = require('@twurple/chat');
const { StaticAuthProvider } = require('@twurple/auth');
const { env } = require('./config.js');
const { getRandomChatMessage } = require('./random.js');



// Twitch credentials
const clientId = env.TWITCH_CLIENT_ID;
const accessToken = env.TWITCH_ACCESS_TOKEN;
const botUsername = env.TWITCH_BOT_NAME;
const channels = [env.TWITCH_CHANNEL];

// Auth
const authProvider = new StaticAuthProvider(clientId, accessToken);

// Chat client
const chatClient = new ChatClient({
    authProvider,
    channels
});

// Store messages in memory
let receivedMessages = [];




// call this once to start reading
function startChatClient(chatClient) {
    chatClient.onMessage((channel, user, message) => {
        // Push message info into the array
        console.log(`[${channel}] <${user}> ${message}`);

        receivedMessages.push({
            channel,
            user,
            message,
            timestamp: new Date(),
            raw: msg
        });
    });

    // Connect
    chatClient.connect();
}


// Read chat as an async generator
async function* readChat() {
    if (env.TEST) {
        setInterval(() => {
            receivedMessages.push(getRandomChatMessage())
        }, 3000)
    }

    while (true) {
        if (receivedMessages.length > 0) {
            yield receivedMessages.shift();
        } else {
            await new Promise(resolve => setTimeout(resolve, 250));
        }
    }
}


module.exports = {
    receivedMessages,
    startChatClient,
    chatClient,
    readChat,
}