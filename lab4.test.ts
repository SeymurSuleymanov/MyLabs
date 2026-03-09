import { describe, it, expect } from 'vitest';
import { query, Where, Sort, GroupBy, Having } from './lab4';

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

const where: Where<User> = (key, value) => (data) => 
    data.filter((item) => item[key] === value);

const sort: Sort<User> = (key) => (data) => 
    [...data].sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    });

const groupBy: GroupBy<User> = (key) => (data) => {
    const groups: Record<string, any> = {};
    
    for (const item of data) {
        const groupKey = String(item[key]);
        if (!groups[groupKey]) {
            groups[groupKey] = { 
                key: item[key as keyof User], 
                items: [] 
            };
        }
        groups[groupKey].items.push(item);
    }
    
    return Object.values(groups);
};

const having: Having<User> = (predicate) => (groups) => 
    groups.filter(predicate);

describe("query pipeline", () => {
    it("фильтрация и сортировка", () => {
        const pipeline = query<User>(
            where("name", "John"),
            where("surname", "Doe"),
            sort("age")
        );

        const result = pipeline(users);
        
        expect(result).toEqual([
            { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
            { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
            { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
        ]);
    });

    it("группировка и фильтр по группам", () => {
        const pipeline = query<User>(
            groupBy("city"),
            having((group) => group.items.length > 1)
        );

        const result = pipeline(users);
        
        expect(result).toEqual([
            { key: "NY", items: [users[0], users[1]] },
            { key: "LA", items: [users[2], users[3]] }
        ]);
    });

    it("комбинированный конвейер", () => {
        const pipeline = query<User>(
            where("surname", "Doe"),
            groupBy("city"),
            having((group) => group.items.some((u) => u.age > 34))
        );

        const result = pipeline(users);
        
        expect(result).toEqual([
            { key: "LA", items: [users[2], users[3]] }
        ]);
    });
});