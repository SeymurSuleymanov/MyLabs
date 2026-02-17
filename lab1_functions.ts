export interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

export function createUser(id: number, name: string, email: string, isActive: boolean = true) : User {
    return { id, name, email, isActive };
}

export type Genre = 'fiction' | 'non-fiction';
export interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

export function createBook(book: Book): Book {
    return book;
}

export function calculateArea(shape: 'circle', radius: number) : number;
export function calculateArea(shape: 'square', side: number) : number;
export function calculateArea(shape: 'circle' | 'square', amount: number) : number {
    if (shape == 'circle') {
        return Math.PI * amount * amount;
    } else {
        return amount * amount;
    }
}

export type Status = 'active' | 'inactive' | 'new';
export function getStatusColor(status: Status) : string {
    switch (status) {
        case('active'): return 'green';
        case('inactive'): return 'blue';
        case('new'): return 'yellow';
        default: return "Not that's color";
    }
}

export type StringFormatter = (str: string, uppercase?: boolean) => string;

export const capitalizeFirst: StringFormatter = (str: string): string => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const trimAndTransform: StringFormatter = (str: string, uppercase: boolean = false): string => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

export function getFirstElement<T>(arr: T[]) : T | undefined {
    return arr.length > 0 ? arr[0] : undefined;
}

export interface HasID { id: number; }
export function findById<T extends HasID>(Items: T[], id: number) : T | undefined {
    return Items.find(Item => Item.id == id);
}

export interface Person extends HasID {
    name: string;
    salary: number;
}