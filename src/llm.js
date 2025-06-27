// llm.js
const { TokenJS } = require('token.js');
const { readFileSync } = require('fs');
const path = require('path');
const { scrot } = require('./scrot.js');

systemPrompt = `
You are a competitive Minetest player, "scooter" who plans every move carefully to survive and dominate on an Anarchy server.  
You seek to become the most powerful player by accumulating resources, securing a base, and eliminating rivals.  
You think strategically about long-term dominance: early game gathering, mid game fortification, late game combat.  

You do not act directly but provide a precise sequence of commands to control your agent.  
Commands must use the restricted list provided. Your output is a JSON array of commands with correct arguments.  
Every plan you generate aligns with your strategic priorities and adapts to the current situation.

Your display size is 1920x1080.
`

userPrompt = `
You are the planning module for a Minetest player agent in an anarchy world.

Given the current situation, your job is to choose the best sequence of actions using a restricted set of commands.

Your output should be a JSON array, where each entry is a command with the proper command name and required args.

Use only the commands listed below. Each command must include the correct arguments.

DO NOT invent commands. Only use those in the list.
✅ Available Commands
Movement

    walk: Move in a direction for a number of seconds.

        args: { "direction": "forward" | "backward" | "left" | "right", "duration": number (seconds) }

    jump: Jump in a direction.

        args: { "direction": "forward" | "backward" | "left" | "right", "duration": number (seconds) }

    turn: Turn the camera left or right.

        args: { "direction": "left" | "right", "distance": number (1–10), "duration": number (seconds) }

    look: Look up or down.

        args: { "direction": "up" | "down", "duration": number (seconds) }

Interaction

    say: Say something aloud. This should only be used when another player is talking to you.

        args: { "text": string }

    activate: Use the current object (e.g., press button).

        args: {}

    punch: Attack or break.

        args: {}

    select: Change hotbar selection.

        args: { "index": number (1–9) }

    drop: Drop the held item. This should not be used unless our inventory is completely full.

        args: {}

Teleport

    spawn: Teleport to spawn using chat. This should be used when we find ourselves in darkness.

        args: {}

    home: Teleport home using chat. This should be used to escape being killed by another player.

        args: {}

    sethome: Set current location as home. This should not be used.

        args: {}

Inventory / UI

    inventory: Open the inventory.

        args: {}

    itab: Click on an inventory tab.

        args: { "number": number (1–n) }

    igrid: Click on a crafting grid slot.

        args: { "number": number (1–10) }

    iinv: Click on a player inventory slot.

        args: { "number": number (1–32) }

    esc: Press the escape key.

        args: {}

Misc

    enter: Press the Enter key.

        args: {}

    camera: Toggle camera mode.

        args: {}

    screenshot: Take a screenshot.

        args: {}

🎯 Example Situations:

"The player is trapped in a cave."
✅ Example Output:

[
  { "command": "spawn", "args": {} }
]

"The player is fighting another player"

[
    {"command": "jump": "args": { "direction": "forward", "duration": 1 }},
    {"command": "punch": "args": {"duration": 2 }}
]

Now, given the following situation, what should the agent do? Output only the JSON array of commands.
`




function b64Img(imagePath) {
    if (!imagePath) throw new Error('first argument imagePath missing.')
    const file = readFileSync(imagePath); // no encoding = Buffer
    const base64Image = file.toString('base64');
    return 'data:image/png;base64,' + base64Image;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const tokenjs = new TokenJS({
    baseURL: 'https://api.venice.ai/api/v1'
})

async function* readAi() {
    while (true) {
        const screenshotImgPath = await scrot();
        try {


            const completion = await tokenjs.chat.completions.create({
                provider: 'openai-compatible',
                model: 'qwen-2.5-vl',
                messages: [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user', content: [
                            {
                                type: 'text',
                                text: `${userPrompt} ${b64Img(screenshotImgPath)}`
                            }

                        ]
                    }
                ],
            })
            console.log(completion.choices[0])
            const message = completion.choices?.[0]?.message?.content || 'aaaaaa'

            yield { message }; // same shape as `chat` to fit your main loop
        } catch (err) {
            console.error('AI request failed:', err);
        }
        await delay(60_000); // wait 1 minute
    }
}

module.exports = {
    readAi,
};
