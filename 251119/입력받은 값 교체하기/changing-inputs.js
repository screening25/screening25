const fs = require("fs")
let input = fs.readFileSync(0).toString().trim().split(" ")

let a = Number(input[0]); 
let b = Number(input[1]);
let temp 

temp = a 
a = b 
b = temp
console.log(a, b)