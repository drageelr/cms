# CCA Management System - JavaScript Coding Conventions and Practices

## Style Guide

### 1. Naming Convention
#### Rules:
1. Use **camelCase** for *variable* names and *function* names.
2. All names must start with a **letter**.
3. Use **UPPERCASE** for *global variable* names and *constant* names.

#### Examples:
1. Local variables and function names:
```javascript=1
firstName = "Hammad";
lastName = "Nasir";

function getFullName(fName, lName) {
  return fName + " " + lName;
}

console.log(getFullName(firstName, lastName));
```
2. Global variables and functions:
```javascript=1
// Global Variables:
FIRSTNAME = "Hammad";
LASTNAME = "Nasir";

// Constant:
PI = "3.14";
```

### 2. Spaces Around Operators
Always put spaces around operators (+ - = * /) and after commas:
```javascript=10
var a = b - c;
var names = ["Hammad", "Zoraiz", "Farrukh"];
```

### 3. Indentation
Always use 2 spaces for indentation of code blocks:
```javascript=5
function getSum(x, y) {
  return x + y;
}
```
==**Note:** **Do not use *tabs* for indentation**. It doesn't mean not to add indentation by pressing the *tab* button. This is just an editor setting which specifies how to add indentation, using *tab* character or *space* character.==

### 4. Statement Rules
#### Rules:
##### Simple Statements:
1. Put a semicolon at the end of a statement *(Applies to both simple and complex)*.
##### Complex Statements:
2. Put the opening bracket at the end of the first line.
3. Use one space before the opening bracket.
4. Put the closing bracket on a new line, **without leading spaces.**
##### Multiline Statement:
1. Use semicolon at the end of the last line in case of multiline statement *(Not necessary if statement is bounded by curly braces `{}`)*.
2. A Line should never start with parenthesis `()` or square bracket `[]`. If so, add a semicolon in the beginning of line *(or end of previous line)*.

#### Examples:
##### Simple Statements:
```javascript=15
// Correct Approach:
var firstName = "Hammad";

// Incorrect Approach:
var lastName = "Nasir";
```
##### Complex Statements:
```javascript=20
// Functions:
function getSum(x, y) {
  return x + y;
}

// Loops:
for (i = 0; i < 10; i++) {
  console.log(i);
}

// Conditionals:
if (true) {
  console.log("TRUE");
} else {
  console.log("FALSE");
}
```

### 5. Object Rules
#### Rules:
1. Place the opening bracket on the same line as the object name.
2. Use colon plus one space between each property and its value.
3. Use **double quotes** around string values, not around numeric values.
4. Do not add a comma after the last property-value pair.
5. Place the closing bracket on a new line, **without leading spaces.**
6. Place semicolon at the end of the object.

#### Examples:
```javascript=35
// Big Objects:
var car = {
  company: "Honda",
  model: "Civic",
  year: 2020,
  price: 4500000
};

// Small Objects:
var car = {company: "Honda", model: "Civic"};
```

### 6. Line Length:
Every line must consist of **less than 80 characters**.

### 7. File Extensions:
JavaScript files should have a **.js** extension.

### 8. File Naming Convention:
1. Use **lowercase** file names.
2. Use **hip-hens** if needed.

---

## Coding Practices

### 1. Global Variables
1. Use as few of these as possible (especialy on front-end) since *they can be overwritten by other scripts on front-end*.

### 2. Local Variable Decleration
1. Local variables must be declared with `var` or `let`
2. Detailed discussion is on this [link](https://www.geeksforgeeks.org/difference-between-var-and-let-in-javascript/) for clarification on their usage and differences.

### 3. Declerations On Top
Always declare variables of a particular scope on the top:
```javascript=1
// Declare at top:
var firstName, lastName, price, discount;

// Use later:
firstName = "Hammad";
lastName = "Nasir";

price = 20;
discount = 0.10;
```
Same case for loops:
```javascript=1
// Declare at top:
var i;

for (i = 0; i < 10; i++) {
  console.log(i);
}
```

### 4. Intialize Variables
Always intialize variables when declaring

### 5. Never Declare Number, String, or Boolean Objects
Always treat numbers, strings, or booleans as primitive values. Not as objects.

Declaring these types as objects, slows down execution speed, and produces nasty side effects:
```javascript=15
var x = "Hello";
var y = new String("Hello");
(x === y); // is false because x is a string and y is an object. 
```
Or even worse:
```javascript=15
var x = new String("Hello");
var y = new String("Hello");
(x == y); // is false because you cannot compare objects. 
```

### 6. Don't Use `new Object()`

- Use `{}` instead of `new Object()`
- Use `""` instead of `new String()`
- Use `0` instead of `new Number()`
- Use `false` instead of `new Boolean()`
- Use `[]` instead of `new Array()`
- Use `/()/` instead of `new RegExp()`
- Use `function (){}` instead of `new Function()`
```javascript=1
var x1 = {};           // new object
var x2 = "";           // new primitive string
var x3 = 0            // new primitive number
var x4 = false;        // new primitive boolean
var x5 = [];           // new array object
var x6 = /()/;         // new regexp object
var x7 = function(){}; // new function object 
```

### 7. Beware of Automatic Type Conversions
Beware that numbers can accidentally be converted to strings or `NaN` (Not a Number).

When doing mathematical operations, JavaScript can convert numbers to strings:
```javascript=1
var x = 5 + 7;       // x.valueOf() is 12,  typeof x is a number
var x = 5 + "7";     // x.valueOf() is 57,  typeof x is a string
var x = "5" + 7;     // x.valueOf() is 57,  typeof x is a string
var x = 5 - 7;       // x.valueOf() is -2,  typeof x is a number
var x = 5 - "7";     // x.valueOf() is -2,  typeof x is a number
var x = "5" - 7;     // x.valueOf() is -2,  typeof x is a number
var x = 5 - "x";     // x.valueOf() is NaN, typeof x is a number
```
Subtracting a string from a string, does not generate an error but returns `NaN` (Not a Number):
```javascript=1
"Hello" - "Hi"; // returns NaN
```

### 8. Use `===` Comparison
The `==` comparison operator always converts (to matching types) before comparison.

The `===` operator forces comparison of values and type:
```javascript=1
0 == "";        // true
1 == "1";       // true
1 == true;      // true

0 === "";       // false
1 === "1";      // false
1 === true;     // false
```

### 9. Avoid Using `eval()`
The `eval()` function is used to run text as code. In almost all cases, it should not be necessary to use it.

Because it allows arbitrary code to be run, it also represents a security problem.

### 10. Asynchronous Convention
Use `async`/`await` approach combined with `promises`.
This is discussed in depth on [MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await).

### 11. Arrow Functions
As opposed to normal declaration of functions, the arrow approach will be used:
```javascript=1
// Normal Approach:
function getSum(a, b) {
  return a + b
}

// Arrow Approach 1:
var getSumA1 = (a, b) => a + b

// Arrow Approach 2:
var getSumA2 = (a, b) => {
  return a + b
}
```
This concept is discussed on [ECMAScript 6 Official Website](http://es6-features.org/)

---
## Acknowledgements
- https://www.w3schools.com/js/js_conventions.asp
- https://www.w3schools.com/js/js_best_practices.asp
- https://www.w3schools.com/js/js_function_closures.asp
- http://xahlee.info/js/js_semicolon.html
- https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
- http://es6-features.org/
