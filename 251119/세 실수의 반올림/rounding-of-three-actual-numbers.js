const fs = require("fs");
const input = fs.readFileSync(0).toString().trim().split('\n');

console.log(Number(input[0]).toFixed(3))
console.log(Number(input[1]).toFixed(3))
console.log(Number(input[2]).toFixed(3))

// input.forEach(line => {
//     const number = Number(line)

//     console.log(number.toFixed(3))
// })

