export type Transform<T> = (data: T[]) => T[];

export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

export type Group<T, K extends keyof T> = {
    key: T[K];
    items: T[];
};

export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>[]>;

export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

export type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;

export type InitialState = { __brand: 'initial' };
export type WhereState = { __brand: 'where' };
export type GroupByState = { __brand: 'groupby' };
export type HavingState = { __brand: 'having' };
export type SortState = { __brand: 'sort' };

export class QueryBuilder<T, State = InitialState> {
    private steps: Array<(data: any[]) => any[]> = [];

    where<K extends keyof T>(
        key: K, 
        value: T[K]
    ): State extends InitialState | WhereState 
        ? QueryBuilder<T, WhereState> 
        : never {
        
        this.steps.push((data: T[]) => 
            data.filter(item => item[key] === value)
        );
        
        return this as any;
    }

    groupBy<K extends keyof T>(
        key: K
    ): State extends InitialState | WhereState 
        ? QueryBuilder<Group<T, K>, GroupByState> 
        : never {
        
        this.steps.push((data: T[]) => {
            const groups = new Map<any, Group<T, K>>();
            
            for (const item of data) {
                const groupKey = item[key];
                if (!groups.has(groupKey)) {
                    groups.set(groupKey, {
                        key: groupKey,
                        items: []
                    });
                }
                groups.get(groupKey)!.items.push(item);
            }
            
            return Array.from(groups.values());
        });
        
        return this as any;
    }

    having<K extends keyof T>(
        predicate: (group: Group<T, K>) => boolean
    ): State extends GroupByState 
        ? QueryBuilder<T, HavingState> 
        : never {
        
        this.steps.push((groups: Group<T, K>[]) => 
            groups.filter(predicate)
        );
        
        return this as any;
    }

    sort<K extends keyof T>(
        key: K
    ): State extends HavingState | GroupByState | WhereState | InitialState
        ? QueryBuilder<T, SortState>
        : never {
        
        this.steps.push((data: any[]) => 
            [...data].sort((a, b) => {
                const aVal = a[key];
                const bVal = b[key];
                if (aVal < bVal) return -1;
                if (aVal > bVal) return 1;
                return 0;
            })
        );
        
        return this as any;
    }

    build(): Transform<any> {
        return (data: any[]) => {
            return this.steps.reduce((acc, step) => step(acc), data);
        };
    }
}

export function query<T>(): QueryBuilder<T, InitialState> {
    return new QueryBuilder<T, InitialState>();
}