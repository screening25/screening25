const fs = require("fs");
let ans = fs.readFileSync(0).toString().trim(); 

console.log(`Your score is ${ans} point.`);
