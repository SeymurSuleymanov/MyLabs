import { describe, it, expect } from 'vitest';
import { createUser, createBook, calculateArea, getStatusColor, capitalizeFirst, trimAndTransform, getFirstElement, findById } from './lab1_functions';

describe('Задание 1: createUser', () => {
    it('должен создавать пользователя со всеми полями', () => {
        const user = createUser(1, "Erzhan", "ww@gmail.com", true);
        expect(user).toEqual({
            id: 1,
            name: "Erzhan",
            email: "ww@gmail.com",
            isActive: true
        });
    });

    it('должен создавать пользователя с isActive по умолчанию (true)', () => {
        const user = createUser(2, "Makvin", "haveago@gmail.com");
        expect(user.isActive).toBe(true);
    });

    it('должен создавать пользователя с isActive = false', () => {
        const user = createUser(3, "Test", "test@mail.com", false);
        expect(user.isActive).toBe(false);
    });
});

describe('Задание 2: createBook', () => {
    it('должен создавать книгу со всеми полями', () => {
        const book = createBook({
            title: "Война и мир",
            author: "Толстой",
            year: 1963,
            genre: "fiction"
        });
        expect(book).toEqual({
            title: "Война и мир",
            author: "Толстой",
            year: 1963,
            genre: "fiction"
        });
    });

    it('должен создавать книгу без года', () => {
        const book = createBook({
            title: "Ревизор",
            author: "Гоголь",
            genre: "non-fiction"
        });
        expect(book.year).toBeUndefined();
    });
});

describe('Задание 3: calculateArea', () => {
    it('должен вычислять площадь круга', () => {
        expect(calculateArea('circle', 10)).toBeCloseTo(314.159, 2);
    });

    it('должен вычислять площадь квадрата', () => {
        expect(calculateArea('square', 10)).toBe(100);
    });
});

describe('Задание 4: getStatusColor', () => {
    it('должен возвращать правильные цвета', () => {
        expect(getStatusColor('active')).toBe('green');
        expect(getStatusColor('inactive')).toBe('blue');
        expect(getStatusColor('new')).toBe('yellow');
    });
});

describe('Задание 5: StringFormatter', () => {
    describe('capitalizeFirst', () => {
        it('должен делать первую букву заглавной', () => {
            expect(capitalizeFirst('hello')).toBe('Hello');
            expect(capitalizeFirst('HELLO')).toBe('Hello');
        });
    });

    describe('trimAndTransform', () => {
        it('должен обрезать пробелы', () => {
            expect(trimAndTransform('  hello  ')).toBe('hello');
        });

        it('должен приводить к верхнему регистру', () => {
            expect(trimAndTransform('  hello  ', true)).toBe('HELLO');
        });
    });
});

describe('Задание 6: getFirstElement', () => {
    it('должен возвращать первый элемент', () => {
        expect(getFirstElement([1, 2, 3])).toBe(1);
        expect(getFirstElement(['a', 'b'])).toBe('a');
        expect(getFirstElement([])).toBeUndefined();
    });
});

describe('Задание 7: findById', () => {
    const persons = [
        { id: 1, name: "Анна", salary: 5002 },
        { id: 2, name: "Петр", salary: 4002 }
    ];

    it('должен находить по id', () => {
        expect(findById(persons, 2)).toEqual({ id: 2, name: "Петр", salary: 4002 });
        expect(findById(persons, 99)).toBeUndefined();
    });
});