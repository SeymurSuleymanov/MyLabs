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

console.log("-------------------");
console.log("Part2:")
type Genre = 'fiction' | 'non-fiction';
interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

function createBook(book: Book): Book {
    return book;
}

const books = createBook({
    title: "Война и мир",
    author: "Толстой",
    year: 1963,
    genre: "fiction"
    }
);

const books2 = createBook({
    title: "Реввизор",
    author: "Гоголь",
    genre: "non-fiction"
    }
);

console.log(books);
console.log(books2);
console.log("-------------------");
console.log("Part 3:\n")

function calculateArea(shape: 'circle', radius: number) : number;
function calculateArea(shape: 'square', side: number) : number;

function calculateArea(shape: 'circle' | 'square', amount: number) : number {
    if (shape == 'circle') {
        return Math.PI * amount * amount;
    } else {
        return amount * amount;
    }
}

const part3 = calculateArea('circle', 10);
const part3_2 = calculateArea('square', 10);
console.log(part3);
console.log(part3_2);

console.log("-------------------");
console.log("Part 4:\n");

type Status = 'active' | 'inactive' | 'new';
function getStatusColor(status: Status) : string {
    switch (status) {
        case('active'):
            return 'green';
        case('inactive'):
            return 'blue';
        case('new'):
            return 'yellow';
        default:
            return "Not that's color";
    }
}

console.log(getStatusColor('active'));
console.log(getStatusColor('inactive'));
console.log(getStatusColor('new'));

console.log("-------------------");
console.log("Part 5:\n");

type StringFormatter = (str: string, uppercase?: boolean) => string;

const capitalizeFirst: StringFormatter = (str: string): string => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const trimAndTransform: StringFormatter = (str: string, uppercase: boolean = false): string => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

console.log("\nPart 5:");
console.log("capitalizeFirst('hello world'):", capitalizeFirst("hello world"));    
console.log("capitalizeFirst('javaSCRIPT'):", capitalizeFirst("javaSCRIPT"));      

console.log("trimAndTransform('  hello  '):", trimAndTransform("  hello  "));    
console.log("trimAndTransform('  hello  ', true):", trimAndTransform("  hello  ", true)); 

function getFirstElement<T>(arr: T[]) : T | undefined {
    return arr.length > 0 ? arr[0] : undefined;
}

const examples = [1, 2, 3, 4, 5];

console.log(getFirstElement(examples));

console.log("-------------------");
console.log("Part 6:\n");

interface HasID {
    id: number;
}

function findById<T extends HasID>(Items: T[], id: number) : T | undefined {
    return Items.find(Item => Item.id == id);
}

interface Person extends HasID {
    name: string;
    salary: number;
}

const persons: Person[] = [
    { id: 1, name: "Анна", salary: 5002 },
    { id: 2, name: "Петр", salary: 4002 },
    { id: 3, name: "Мария", salary: 1004 }
];

const results = findById(persons, 2);

console.log(results);

