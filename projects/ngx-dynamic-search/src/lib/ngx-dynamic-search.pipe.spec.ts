import { DynamicSearchPipe } from './ngx-dynamic-search.pipe';

describe('DynamicSearchPipe', () => {
  let pipe: DynamicSearchPipe;

  beforeEach(() => {
    pipe = new DynamicSearchPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if items is null', () => {
    const result = pipe.transform(null, 'test');
    expect(result).toEqual([]);
  });

  it('should return items if term is empty', () => {
    const items = [{ name: 'test' }];
    const result = pipe.transform(items, '');
    expect(result).toEqual(items);
  });

  it('should filter items based on string property', () => {
    const items = [
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Cherry' }
    ];
    const result = pipe.transform(items, 'an');
    expect(result).toEqual([{ name: 'Banana' }]);
  });

  it('should filter items case-insensitive by default', () => {
    const items = [
      { name: 'Apple' },
      { name: 'Banana' }
    ];
    const result = pipe.transform(items, 'apple');
    expect(result).toEqual([{ name: 'Apple' }]);
  });

  it('should filter items case-sensitive when specified', () => {
    const items = [
      { name: 'Apple' },
      { name: 'apple' }
    ];
    const result = pipe.transform(items, 'Apple', true);
    expect(result).toEqual([{ name: 'Apple' }]);
  });

  it('should filter nested objects', () => {
    const items = [
      { user: { name: 'John', details: { city: 'New York' } } },
      { user: { name: 'Jane', details: { city: 'London' } } }
    ];
    const result = pipe.transform(items, 'York');
    expect(result).toEqual([{ user: { name: 'John', details: { city: 'New York' } } }]);
  });

  it('should exclude specified properties', () => {
    const items = [
      { name: 'John', secret: 'hidden' },
      { name: 'Jane', secret: 'visible' }
    ];
    const result = pipe.transform(items, 'hidden', false, ['secret']);
    expect(result).toEqual([]);
  });

  it('should handle arrays within objects', () => {
    const items = [
      { tags: ['red', 'green'] },
      { tags: ['blue', 'yellow'] }
    ];
    const result = pipe.transform(items, 'green');
    expect(result).toEqual([{ tags: ['red', 'green'] }]);
  });

  it('should handle numbers', () => {
    const items = [
      { id: 123 },
      { id: 456 }
    ];
    const result = pipe.transform(items, '12');
    expect(result).toEqual([{ id: 123 }]);
  });
});
