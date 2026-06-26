import { DynamicSearchPipe } from './ngx-dynamic-search.pipe';

describe('DynamicSearchPipe (Studio Edition)', () => {
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

  it('should exclude specified properties (backward compatibility)', () => {
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

  // --- NEW STUDIO EDITION TESTS ---

  describe('SearchOptions Configuration', () => {
    it('should respect excludes in SearchOptions object', () => {
      const items = [
        { name: 'John', secret: 'hidden' },
        { name: 'Jane', secret: 'visible' }
      ];
      const result = pipe.transform(items, 'hidden', { excludes: ['secret'] });
      expect(result).toEqual([]);
    });

    it('should support target keys restriction (includes)', () => {
      const items = [
        { name: 'John', description: 'He is a developer' },
        { name: 'Developer Jane', description: 'Designer' }
      ];
      // Search for 'developer' but target only 'name'
      const result = pipe.transform(items, 'developer', { includes: ['name'] });
      expect(result).toEqual([{ name: 'Developer Jane', description: 'Designer' }]);
    });

    it('should support target keys with nested dot-notation paths', () => {
      const items = [
        { user: { name: 'John', bio: 'Angular expert' } },
        { user: { name: 'Expert Jane', bio: 'React expert' } }
      ];
      // Target only 'user.name'
      const result = pipe.transform(items, 'Expert', { includes: ['user.name'] });
      expect(result).toEqual([{ user: { name: 'Expert Jane', bio: 'React expert' } }]);
    });
  });

  describe('Diacritic Insensitivity & Multilingual Support', () => {
    it('should match Turkish diacritics / accents when diacriticSensitive is false (default)', () => {
      const items = [
        { word: 'Türkçe' },
        { word: 'Şahin' },
        { word: 'İSTANBUL' },
        { word: 'ıslak' }
      ];

      // Lowercase matching without accents
      expect(pipe.transform(items, 'turkce')).toEqual([{ word: 'Türkçe' }]);
      expect(pipe.transform(items, 'sahin')).toEqual([{ word: 'Şahin' }]);
      expect(pipe.transform(items, 'istanbul')).toEqual([{ word: 'İSTANBUL' }]);
      expect(pipe.transform(items, 'islak')).toEqual([{ word: 'ıslak' }]);
    });

    it('should support multiple languages globally (German, Polish, Scandinavian, Arabic, Greek)', () => {
      const items = [
        { lang: 'de', word: 'Straße' },       // German (ß -> ss)
        { lang: 'pl', word: 'Łódź' },         // Polish (Ł -> l, ź -> z)
        { lang: 'sc', word: 'København' },     // Scandinavian (ø -> o)
        { lang: 'gr', word: 'Αθήνα' },         // Greek (tonos accent stripped)
        { lang: 'ar', word: 'مُحَمَّد' }         // Arabic (Tashkeel vowels stripped)
      ];

      expect(pipe.transform(items, 'strasse')).toEqual([{ lang: 'de', word: 'Straße' }]);
      expect(pipe.transform(items, 'lodz')).toEqual([{ lang: 'pl', word: 'Łódź' }]);
      expect(pipe.transform(items, 'kobenhavn')).toEqual([{ lang: 'sc', word: 'København' }]);
      expect(pipe.transform(items, 'αθηνα')).toEqual([{ lang: 'gr', word: 'Αθήνα' }]);
      expect(pipe.transform(items, 'محمد')).toEqual([{ lang: 'ar', word: 'مُحَمَّد' }]);
    });

    it('should not match diacritics when diacriticSensitive is true', () => {
      const items = [
        { word: 'Türkçe' },
        { word: 'Turkce' }
      ];
      const result = pipe.transform(items, 'turkce', { diacriticSensitive: true });
      expect(result).toEqual([{ word: 'Turkce' }]);
    });
  });

  describe('Search Modes (matchMode)', () => {
    it('should support startsWith mode', () => {
      const items = [
        { name: 'Apple' },
        { name: 'Pineapple' }
      ];
      const result = pipe.transform(items, 'App', { matchMode: 'startsWith' });
      expect(result).toEqual([{ name: 'Apple' }]);
    });

    it('should support words mode (split keywords match anywhere)', () => {
      const items = [
        { name: 'John Doe', city: 'New York' },
        { name: 'Jane Doe', city: 'London' }
      ];
      // Matches both "John" and "York" in the same item, in different fields, in any order
      const result = pipe.transform(items, 'York John', { matchMode: 'words' });
      expect(result).toEqual([{ name: 'John Doe', city: 'New York' }]);
    });

    it('should return all items in words mode if search is empty or whitespace', () => {
      const items = [{ name: 'John' }];
      const result = pipe.transform(items, '   ', { matchMode: 'words' });
      expect(result).toEqual(items);
    });
  });

  describe('Circular Reference Safety', () => {
    it('should not throw infinite recursion error for circular references', () => {
      const child: any = { name: 'Child' };
      const parent: any = { name: 'Parent', child };
      child.parent = parent; // Circular link

      const items = [parent];
      expect(() => {
        const result = pipe.transform(items, 'Child');
        expect(result.length).toBe(1);
      }).not.toThrow();
    });
  });
});
