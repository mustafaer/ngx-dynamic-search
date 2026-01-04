import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngxDynamicSearch',
  standalone: true
})
export class DynamicSearchPipe implements PipeTransform {

  /**
   * Search Filter Pipe
   * @param items List of items to filter
   * @param term Search term
   * @param isCaseSensitive Whether the search is case-sensitive
   * @param excludes List of keys to ignore during search
   */
  public transform<T>(items: T[] | null | undefined, term: string, isCaseSensitive: boolean = false, excludes: string[] = []): T[] {
    if (!items) return [];
    if (!term) return items;

    const toCompare = isCaseSensitive ? term : term.toLowerCase();

    return items.filter(item => this.checkInside(item, toCompare, isCaseSensitive, excludes));
  }

  /**
   * Recursive check for term in item
   */
  private checkInside(item: any, term: string, isCaseSensitive: boolean, excludes: string[]): boolean {
    if (item === null || item === undefined) {
      return false;
    }

    // Handle primitives (string, number, boolean)
    if (typeof item !== 'object') {
      const value = item.toString();
      const compareValue = isCaseSensitive ? value : value.toLowerCase();
      return compareValue.includes(term);
    }

    // Handle Date objects
    if (item instanceof Date) {
      const value = item.toString();
      const compareValue = isCaseSensitive ? value : value.toLowerCase();
      return compareValue.includes(term);
    }

    // Handle Arrays
    if (Array.isArray(item)) {
      for (const element of item) {
        if (this.checkInside(element, term, isCaseSensitive, excludes)) {
          return true;
        }
      }
      return false;
    }

    // Handle Objects
    // Using Object.keys to iterate over own enumerable properties
    const keys = Object.keys(item);
    for (const key of keys) {
      if (excludes.includes(key)) {
        continue;
      }

      const value = item[key];
      if (this.checkInside(value, term, isCaseSensitive, excludes)) {
        return true;
      }
    }

    return false;
  }
}
