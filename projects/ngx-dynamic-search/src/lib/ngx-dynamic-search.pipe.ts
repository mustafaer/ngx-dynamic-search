import { Pipe, PipeTransform } from '@angular/core';

export interface SearchOptions {
  /** Whether the search is case-sensitive. Defaults to false. */
  isCaseSensitive?: boolean;
  /** Whether the search is diacritic/accent sensitive. Defaults to false (accent-insensitive). */
  diacriticSensitive?: boolean;
  /** List of keys or paths (e.g. 'user.secret') to ignore during search. */
  excludes?: string[];
  /** List of keys or paths (e.g. 'user.name') to target during search. If provided, only these fields are searched. */
  includes?: string[];
  /** The matching mode to use. Defaults to 'includes'. */
  matchMode?: 'includes' | 'startsWith' | 'words';
}

@Pipe({
  name: 'ngxDynamicSearch',
  standalone: true
})
export class DynamicSearchPipe implements PipeTransform {

  /**
   * Search Filter Pipe (Studio Edition)
   * 
   * @param items List of items to filter
   * @param term Search term
   * @param optionsOrCaseSensitive Configuration options or boolean for case sensitivity (backward compatibility)
   * @param excludes List of keys to ignore (backward compatibility, used if third argument is boolean)
   */
  public transform<T>(
    items: T[] | null | undefined,
    term: string,
    optionsOrCaseSensitive?: SearchOptions | boolean,
    excludes: string[] = []
  ): T[] {
    if (!items) return [];
    if (!Array.isArray(items)) return [];
    if (!term || term.trim() === '') return items;

    // Backward compatibility resolution
    const options: SearchOptions = typeof optionsOrCaseSensitive === 'object'
      ? optionsOrCaseSensitive
      : { isCaseSensitive: !!optionsOrCaseSensitive, excludes };

    const diacriticSensitive = !!options.diacriticSensitive;
    const caseSensitive = !!options.isCaseSensitive;
    const matchMode = options.matchMode || 'includes';

    // Normalize search term
    const normalizedTerm = this.normalizeString(term, diacriticSensitive, caseSensitive);

    if (matchMode === 'words') {
      const words = normalizedTerm.split(/\s+/).filter(word => word.length > 0);
      if (words.length === 0) return items;

      return items.filter(item => {
        // Every word must be found somewhere within the item
        return words.every(word => {
          const singleWordOptions: SearchOptions = { ...options, matchMode: 'includes' };
          return this.checkInside(item, word, singleWordOptions, new Set<any>());
        });
      });
    } else {
      return items.filter(item => {
        return this.checkInside(item, normalizedTerm, options, new Set<any>());
      });
    }
  }

  /**
   * Recursive check for search term in item
   */
  private checkInside(
    item: any,
    term: string,
    options: SearchOptions,
    visited: Set<any>,
    currentPath?: string
  ): boolean {
    if (item === null || item === undefined) {
      return false;
    }

    // Circular reference protection
    if (typeof item === 'object') {
      if (visited.has(item)) {
        return false;
      }
      visited.add(item);
    }

    const diacriticSensitive = !!options.diacriticSensitive;
    const caseSensitive = !!options.isCaseSensitive;
    const matchMode = options.matchMode || 'includes';
    const excludes = options.excludes || [];
    const includes = options.includes || [];

    // 1. Target key targeting (includes) at root level
    if (!currentPath && includes.length > 0) {
      for (const path of includes) {
        const val = this.resolvePath(item, path);
        // Set path as currentPath and trace recursively with a clone of visited list
        if (this.checkInside(val, term, options, new Set<any>(visited), path)) {
          return true;
        }
      }
      return false;
    }

    // 2. Exclusion check
    if (currentPath && this.isExcluded(currentPath, excludes)) {
      return false;
    }

    // Handle Arrays
    if (Array.isArray(item)) {
      for (const element of item) {
        if (this.checkInside(element, term, options, new Set<any>(visited), currentPath)) {
          return true;
        }
      }
      return false;
    }

    // Handle primitives (string, number, boolean, Date)
    if (typeof item !== 'object' || item instanceof Date) {
      const valueStr = item.toString();
      const normalizedValue = this.normalizeString(valueStr, diacriticSensitive, caseSensitive);

      if (matchMode === 'startsWith') {
        return normalizedValue.startsWith(term);
      } else {
        return normalizedValue.includes(term);
      }
    }

    // Handle plain Objects
    const keys = Object.keys(item);
    for (const key of keys) {
      const nextPath = currentPath ? `${currentPath}.${key}` : key;
      if (this.isExcluded(nextPath, excludes)) {
        continue;
      }

      const value = item[key];
      if (this.checkInside(value, term, options, visited, nextPath)) {
        return true;
      }
    }

    // Return false if nothing matched
    return false;
  }

  /**
   * Helper to normalize strings for case/diacritic insensitivity across all languages
   */
  private normalizeString(str: string, diacriticSensitive: boolean, caseSensitive: boolean): string {
    if (!str) return '';
    let result = str;

    if (!caseSensitive) {
      result = result.toLowerCase();
    }

    if (!diacriticSensitive) {
      // Decompose standard Unicode accents (Latin, Greek, Cyrillic, etc.)
      // and strip combining marks:
      // - \u0300-\u036f: Standard Combining Diacritical Marks
      // - \u064b-\u0652\u0640: Arabic Tashkeel (vowels) and Tatweel (elongation)
      // - \u05b0-\u05c4\u05c7: Hebrew Niqqud (vowels/pronunciation marks)
      result = result.normalize('NFD').replace(/[\u0300-\u036f\u064b-\u0652\u0640\u05b0-\u05c4\u05c7]/g, '');

      // Multilingual localized diacritic mappings for characters that don't decompose standardly
      const globalDiacriticMap: Record<string, string> = {
        // Turkish
        'ı': 'i', 'ş': 's', 'ğ': 'g', 'ç': 'c', 'ö': 'o', 'ü': 'u',
        'ı́': 'i', 'ş': 's', 'ğ': 'g', 'ç': 'c', 'ö': 'o', 'ü': 'u',
        // German
        'ß': 'ss',
        // Scandinavian
        'æ': 'ae', 'ø': 'o',
        // Polish / Slavic
        'ł': 'l', 'đ': 'd',
        // Icelandic
        'ð': 'd', 'þ': 'th'
      };

      result = result.replace(/[ışğçöüßæøłđðþ]/g, m => globalDiacriticMap[m] || m);
    }

    return result;
  }

  /**
   * Resolves a nested dot-notation path inside an object
   */
  private resolvePath(obj: any, path: string): any {
    if (obj === null || obj === undefined) return undefined;

    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) return undefined;

      if (Array.isArray(current)) {
        return current.map(item => this.resolvePath(item, part)).filter(val => val !== undefined);
      }

      current = current[part];
    }

    return current;
  }

  /**
   * Check if a path or property key is in the excludes list
   */
  private isExcluded(path: string, excludes: string[]): boolean {
    if (excludes.length === 0) return false;
    if (excludes.includes(path)) return true;

    // Also check if the base property name itself is excluded (e.g. 'secret' matches 'user.secret')
    const segments = path.split('.');
    const lastSegment = segments[segments.length - 1];
    return excludes.includes(lastSegment);
  }
}
