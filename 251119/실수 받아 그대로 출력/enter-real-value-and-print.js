const fs = require("fs")
const N = parseFloat(fs.readFileSync(0).toString().trim(), 10)

console.log(N.toFixed(2))