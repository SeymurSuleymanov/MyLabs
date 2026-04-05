import { describe, it, expectTypeOf } from 'vitest';
import type { DeepReadonly, PickedByType, EventHandlers } from './lab6';

describe('DeepReadonly', () => {
  it('рекурсивно делает все свойства readonly', () => {
    type Obj = {
      a: number;
      b: { c: string; d: { e: boolean } };
    };
    
    type Result = DeepReadonly<Obj>;
    
    expectTypeOf<Result>().toEqualTypeOf<{
      readonly a: number;
      readonly b: { readonly c: string; readonly d: { readonly e: boolean } };
    }>();
  });
});

describe('PickedByType', () => {
  it('выбирает свойства только указанного типа', () => {
    type Obj = {
      id: number;
      name: string;
      age: number;
      active: boolean;
    };
    
    type Result = PickedByType<Obj, number>;
    
    expectTypeOf<Result>().toEqualTypeOf<{
      id: number;
      age: number;
    }>();
  });
});

describe('EventHandlers', () => {
  it('генерирует обработчики с префиксом on', () => {
    type Events = {
      click: { x: number };
      change: string;
    };
    
    type Result = EventHandlers<Events>;
    
    expectTypeOf<Result>().toEqualTypeOf<{
      onClick: (event: { x: number }) => void;
      onChange: (event: string) => void;
    }>();
  });
});