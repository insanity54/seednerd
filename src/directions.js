const directions = ['forward', 'backward', 'left', 'right'];

// Aliases map: key is alias, value is the canonical direction
const directionAliases = {
    fwd: 'forward',
    back: 'backward',
    f: 'forward',
    b: 'backward',
    l: 'left',
    r: 'right',
};

// Example: normalize user input direction alias to canonical form
function normalizeDirection(input) {
    return directionAliases[input.toLowerCase()] || input.toLowerCase();
}

// Example: pick a random direction
const randomDirection = directions[Math.floor(Math.random() * directions.length)];

module.exports = {
    directions,
    directionAliases,
    normalizeDirection,
    randomDirection,
};


