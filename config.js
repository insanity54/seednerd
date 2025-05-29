const { z } = require('zod');

const EnvSchema = z.object({
    LUANTI_USERNAME: z.string(),
    LUANTI_PASSWORD: z.string(),
    LUANTI_ADDRESS: z.string()
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}

module.exports = {
    env: parsed.data,
};
