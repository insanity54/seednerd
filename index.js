// index.js

const concurrently = require('concurrently');
const path = require('path')

const { result } = concurrently(
    [
        { command: 'npm:macro', name: 'macro' },
        { command: 'npm:luanti', name: 'luanti' }
    ],
    {
        prefix: 'name',
        killOthers: ['failure', 'success'],
        cwd: path.resolve(__dirname, 'scripts'),
    },
);


result.then(
    () => console.log('✅ All processes exited successfully.'),
    (err) => {
        console.error('❌ One or more processes failed:');
        console.error(err);
        process.exit(1); // Optional: force a non-zero exit
    }
);