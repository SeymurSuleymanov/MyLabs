export function csvToJSON(input: string[], delimiter: string): Record<string, string>[] {
    if (!input || input.length === 0) {
        throw new Error("Array can be empty!");
    }
    if (!delimiter || delimiter.length === 0) {
        throw new Error("Array can be empty!");
    }

    const firstRow = input[0];
    if (!firstRow) {
        throw new Error("First row is empty!");
    }
    
    const headers = firstRow.split(delimiter);
    if (headers.length === 0) {
        throw new Error("Empty");
    }

    const visibly = headers.length;

    for (let i = 1; i < input.length; i++) {
        const currentRow = input[i];
        if (!currentRow) {
            throw new Error(`Row ${i} is empty!`);
        }
        
        const row = currentRow.split(delimiter);
        if (row.length !== visibly) {
            throw new Error("Not allied their lenht");
        }
    }

    const result: Record<string, string>[] = [];
    for (let k = 1; k < input.length; k++) {
        const currentRow = input[k];
        if (!currentRow) {
            throw new Error(`Row is empty!`);
        }
        
        const value = currentRow.split(delimiter);
        const obj: Record<string, string> = {};

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]!] = value[j]!; 
        }
        result.push(obj);
    }
    return result;
}

let res = csvToJSON(["p1;p2;p3;p4", "1;A;b;c", "2;B;v;d"], ';'); 
console.log(res);