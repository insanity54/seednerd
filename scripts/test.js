const { launch, assertLuantiExists } = require('./luanti.js');


async function main() {

    await assertLuantiExists()
    await launch()
    await assertXdotoolExists();
    await press('Return');
    await walk('forward');
    await jump('left');
    await turn('right');
    await look('up');
    await say(); // random animal noise
    await punch();
    await activate();
    await select(3);
    await drop();
}

main()

