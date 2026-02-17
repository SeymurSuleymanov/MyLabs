"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createUser(id, name, email, isActive = true) {
    return {
        id, name, email, isActive
    };
}
const example1 = createUser(1, "Erzhan", "ww@gmail.com", true);
const example2 = createUser(2, "Makvin", "haveago@gmail.com", false);
console.log("-------------------");
console.log(example1);
console.log(example2);
//# sourceMappingURL=lab1.js.map