const { KokoroTTS } = require("kokoro-js");
const { execa } = require('execa');
const { join } = require('path');
const { tmpdir } = require('os');

// https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md#american-english
const voices = [
    "af_heart",
    "af_alloy",
    "af_aoede",
    "af_bella",
    "af_jessica",
    "af_kore",
    "af_nicole",
    "af_nova",
    "af_river",
    "af_sarah",
    "af_sky",
    "am_adam",
    "am_echo",
    "am_eric",
    "am_fenrir",
    "am_liam",
    "am_michael",
    "am_onyx",
    "am_puck",
    "am_santa"
];

function getRandomVoice() {
    return voices[Math.floor(Math.random() * voices.length)]
}

async function speak(text) {
    // execa('espeak', [text]);
    const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
    const tts = await KokoroTTS.from_pretrained(model_id, {
        dtype: "q4", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
        device: "cpu", // Options: "wasm", "webgpu" (web) or "cpu" (node). If using "webgpu", we recommend using dtype="fp32".
    });

    const voice = getRandomVoice()
    console.log(`speak() using voice=${voice}`);
    // console.log('generating speech')
    // console.log(tts.list_voices())
    const audio = await tts.generate(text, {
        voice
    });
    const filePath = join(tmpdir(), 'audio.wav')
    await audio.save(filePath);
    // console.log('playing ' + filePath)
    execa('aplay', [filePath]);

}

module.exports = {
    speak,
}