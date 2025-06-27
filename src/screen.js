
function getSlotPosition(options) {
    const startX = options.startX;
    const startY = options.startY;
    const slotWidth = options.slotWidth;
    const slotHeight = options.slotHeight;
    const marginX = options.marginX || 7;
    const marginY = options.marginY || 7;
    const index = options.index;
    const columns = options.columns || 8;

    const spacingX = slotWidth + marginX;
    const spacingY = slotHeight + marginY;

    const col = index % columns;
    const row = Math.floor(index / columns);

    return {
        x: startX + col * spacingX,
        y: startY + row * spacingY
    };
}


module.exports = {
    getSlotPosition,
}