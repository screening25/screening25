// math Module  

function add(a, b){
    return a + b;
}

function sub(a, b ){
    return a - b;
}

export function add(a, b){
    return a + b;
}

export function sub(a, b ){
    return a - b;
}

// commonJS
// module.exports = {
//     add: add,
//     sub: sub,
// };

// ES6 Module
export {add, sub};

export default function multiply(a, b){
    return a * b;
}