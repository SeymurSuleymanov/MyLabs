interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

function createUser(id: number, name: string, email: string, isActive: boolean = true) : User {
    return {
        id, name, email, isActive
    };
} 

const example1 = createUser(1, "Erzhan", "ww@gmail.com", true);
const example2 = createUser(2, "Makvin", "haveago@gmail.com", false);

console.log("-------------------");
console.log(example1);
console.log(example2);