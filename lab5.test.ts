import { describe, it, expect } from 'vitest';
import { query, Group } from './lab5';

type User = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
};

const users: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
    { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
    { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
    { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
];

describe("query pipeline with order control", () => {
    it("должен работать: where -> where -> sort", () => {
        const pipeline = query<User>()
            .where("name", "John")
            .where("surname", "Doe")
            .sort("age")
            .build();

        const result = pipeline(users);
        
        expect(result).toEqual([
            { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
            { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
            { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
        ]);
    });

    it("должен работать: where -> groupBy -> having", () => {
        const pipeline = query<User>()
            .where("surname", "Doe")
            .groupBy("city")
            .having((group: Group<User, "city">) => group.items.length > 1)
            .build();

        const result = pipeline(users);
        
        expect(result).toEqual([
            { key: "NY", items: [users[0], users[1]] },
            { key: "LA", items: [users[2], users[3]] }
        ]);
    });

    it("должен работать: groupBy -> having -> sort", () => {
        const pipeline = query<User>()
            .groupBy("city")
            .having((group) => group.items.length > 1)
            .sort("key")
            .build();

        const result = pipeline(users);
        
        expect(result).toEqual([
            { key: "LA", items: [users[2], users[3]] },
            { key: "NY", items: [users[0], users[1]] }
        ]);
    });

    it("должен работать: полный конвейер", () => {
        const pipeline = query<User>()
            .where("surname", "Doe")
            .groupBy("city")
            .having((group) => group.items.some((u) => u.age > 34))
            .sort("key")
            .build();

        const result = pipeline(users);
        
        expect(result).toEqual([
            { key: "LA", items: [users[2], users[3]] }
        ]);
    });
});