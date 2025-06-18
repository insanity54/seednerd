const { KokoroTTS } = require("kokoro-js");
const { execa } = require('execa');
const { join } = require('path');
const { tmpdir } = require('os');

async function speak(text) {
    // execa('espeak', [text]);
    const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
    const tts = await KokoroTTS.from_pretrained(model_id, {
        dtype: "q8", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
        device: "cpu", // Options: "wasm", "webgpu" (web) or "cpu" (node). If using "webgpu", we recommend using dtype="fp32".
        voice: 'af_alloy'
    });


    // console.log('generating speech')
    // console.log(tts.list_voices())
    const audio = await tts.generate(text, {
        voice: "am_adam",
    });
    const filePath = join(tmpdir(), 'audio.wav')
    await audio.save(filePath);
    console.log('playing ' + filePath)
    execa('aplay', [filePath]);

}

module.exports = {
    speak,
}