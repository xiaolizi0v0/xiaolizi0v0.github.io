# JavaScript 基础知识

## 变量声明
JavaScript 中有三种声明变量的方式：
- `var` - 函数作用域
- `let` - 块级作用域  
- `const` - 块级作用域，常量

```javascript
// 示例代码
let name = 'John';
const age = 30;
var isActive = true;
```

## 数据类型
JavaScript 有7种基本数据类型：
1. Number
2. String
3. Boolean
4. Undefined
5. Null
6. Symbol
7. BigInt

## 函数
函数是 JavaScript 中的一等公民：

```javascript
// 函数声明
function greet(name) {
    return `Hello, ${name}!`;
}

// 箭头函数
const add = (a, b) => a + b;
```

## 对象和数组

```javascript
// 对象
const person = {
    name: 'Alice',
    age: 25,
    hobbies: ['reading', 'coding']
};

// 数组
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
```

## 异步编程

```javascript
// Promise
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

// Async/Await
async function getData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
```

## ES6+ 新特性

- 模板字符串
- 解构赋值
- 扩展运算符
- 模块化
- 类语法

```javascript
// 解构赋值
const { name, age } = person;
const [first, second] = numbers;

// 扩展运算符
const newNumbers = [...numbers, 6, 7];
const newPerson = { ...person, city: 'Beijing' };
