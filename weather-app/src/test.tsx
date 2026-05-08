// const products = [
//     { name: 'хлеб', price: 50 },
//     { name: 'молоко', price: 80 },
//     { name: 'сыр', price: 300 },
//     { name: 'масло', price: 150 },
//     { name: 'йогурт', price: 60 },
//     { name: 'печенье', price: 90 }
// ];

import { log } from "node:console";


// const second = products.slice(0, 3);


// const result = map(item => (
//     const name = "Название: ${second.name}, Цена: ${second.price}";
// ))

// const temperatures = [-5, 0, 12, 23, 30, -2];

// const slicer = temperatures.slice(0, temperatures.length);

// const resullt = slicer.map(temp => { 
//     if (temp > 0 ) {
//         return (`+${temp}`);
//     }
//     else if (temp === 0 ) {
//         return(`${temp}`);
//     } else {
//         return(`${temp}`);
//     }
// }) 

// console.log(resullt);

// let oddNumbers = [];

// for (let i = 1; i < 21; i++) {
//     let result = i % 2 != 0 ? oddNumbers.push(i) : "";
// }

// console.log(oddNumbers);

// const products = [
//     { name: 'хлеб', price: 50 },
//     { name: 'молоко', price: 80 },
//     { name: 'сыр', price: 300 },
//     { name: 'масло', price: 150 },
//     { name: 'йогурт', price: 60 },
//     { name: 'печенье', price: 90 }
// ];

// const first_three = products.slice(0, 3);


// const result = first_three.map(item => {
//     return (`${item.name} - ${item.price}`);
// })

// console.log(result);

// const tasks = ['купить хлеб', 'погулять с собакой', 'позвонить маме', 'сделать дз'];

// const result = tasks.map((temp, index) => {
//     return(`${index+1}, ${temp}`);
// })

// console.log(result);

// const nums : number[] = [2, 4, 6, 8, 12];

// const exapmle : number[] = [];

// for (let i : number = 0; i < nums.length; i++) {
//     exapmle.push(nums[i] * 2);
// }

// console.log(exapmle);

//Реализуйте функцию vecZip, которая принимает два вектора одинаковой длины и возвращает
//вектор пар. Тип результата должен сохранять длину N и типы элементов A, B.

// const x = [1, 2];
// const y = ["a", "b"];

// function vecZip<A, B> (vec1 : A[], vec2 : B[]) {
//     if (vec1.length != vec2.length) {
//         throw new Error("The type counts gotta be similiar")
//     }
//     const result = [];
//     for (let i = 0; i < vec1.length; i++) {
//         result.push([vec1[i], vec2[i]]);
//     }
//     return result;
// }

// console.log(vecZip(x, y));

// const test = [1, 2, 3, 4, 5];
// const none = 4;
// type Drop<N, T>(te : N[], no: T)

// const x = [2, 5, 124, 52];
// const y = [2.5, 52.4, 98.1, 1.1];
// function vecZip<A, B> (vec1: A[], vec2: B[]) {
//     if (vec1.length != vec2.length) {
//         throw new Error("They gotta be similiar length");
//     }
//     const result = [];
//     for (let i = 0; i < vec1.length; i++) {
//         result.push([vec1[i], vec2[i]]);
//     }

//     return result;
// }

// console.log(vecZip(x, y));

// const x = [2, 5, 124, 52];
// const y = 2

// function Drop<N, T>(removee: N, kortezh: T[]) {
//     const news = kortezh.slice(removee);
//     return news;
// }

// console.log(Drop(y, x)); //124, 52









