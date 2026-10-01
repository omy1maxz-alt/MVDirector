let initStart = 0;
let deltaMs = 100;
let targetBlockStart = 0;

let newStart = Math.max(0, initStart + deltaMs);
let actualShift = newStart - targetBlockStart;

console.log({ newStart, actualShift });

deltaMs = 200;
targetBlockStart = 100; // Updated from previous frame
newStart = Math.max(0, initStart + deltaMs);
actualShift = newStart - targetBlockStart;

console.log({ newStart, actualShift });
