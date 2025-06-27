require('@dotenvx/dotenvx').config()
const { z } = require('zod');

const EnvSchema = z.object({
    LUANTI_USERNAME: z.string(),
    LUANTI_PASSWORD: z.string(),
    LUANTI_ADDRESS: z.string(),
    LUANTI_WORLD_PATH: z.string().optional(),
    TWITCH_CHANNEL: z.string(),
    TWITCH_CLIENT_ID: z.string(),
    TWITCH_ACCESS_TOKEN: z.string(),
    TWITCH_BOT_NAME: z.string(),
    ONLINE: z.coerce.boolean(),
    TEST: z.coerce.boolean(),
    OPENAI_COMPATIBLE_API_KEY: z.string(),

    WINDOW_XY: z
        .string()
        .default('0,0')
        .transform(val => val.split(',').map(Number))
        .refine(arr => arr.length === 2 && arr.every(n => !isNaN(n)), {
            message: 'WINDOW_XY must be two comma-separated numbers (e.g., "100,200")',
        }),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}

module.exports = {
    env: parsed.data,
};

