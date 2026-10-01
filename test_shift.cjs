const fs = require('fs');

let prev = [{id: '1', start: 0, end: 1000}, {id: '2', start: 2000, end: 3000}];
let offsetMs = 500;

let next = prev.map(block => ({
    ...block,
    start: Math.max(0, block.start + offsetMs),
    end: Math.max(100, block.end + offsetMs)
}));

console.log(next);
