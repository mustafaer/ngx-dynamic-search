import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ngxDynamicSearch',
  standalone: true
})
export class DynamicSearchPipe implements PipeTransform {

  /**
   * Filer items[]
   * @param items List of items to filter
   * @param term  a string term to compare with every property of the list
   * @param isCaseSensitive check term compare is case-sensitive
   * @param excludes List of keys which will be ignored during search
   */
  private static filter<T>(items: T[], term: string, isCaseSensitive: boolean = false, excludes: string[] = []): T[] {
    let toCompare: string = term;

    if (!isCaseSensitive) {
      toCompare = term.toLowerCase();
    }

    /**
     * Check filterable object props
     */
    function checkInside(item: any, term: string): boolean {

      let compareItem = item.toString();

      if (!isCaseSensitive) {
        compareItem = item.toString().toLowerCase();
      }

      if (typeof item === 'string' && compareItem.includes(toCompare)) {
        return true;
      }

      for (let property in item) {
        const datum = item[property];

        if (datum === null || datum == undefined || excludes.includes(property)) {
          continue;
        }

        let compareDatum = datum.toString();

        if (!isCaseSensitive) {
          compareDatum = datum.toString().toLowerCase();
        }

        if (typeof datum === 'object') {
          if (checkInside(datum, term)) {
            return true;
          }
        } else if (compareDatum.includes(toCompare)) {
          return true;
        }
      }
      return false;
    }

    return items.filter(function (item: T) {
      return checkInside(item, term);
    });
  }

  /**
   * Search Filter Pipe
   * @param items object from array
   * @param term term's search
   * @param isCaseSensitive variable for compare type
   * @param excludes array of strings which will ignored during search
   */
  public transform<T>(items: any, term: string, isCaseSensitive: boolean = false, excludes: string[] = []): any {
    if (!term || !items) return items;

    return DynamicSearchPipe.filter(items, term, isCaseSensitive, excludes);
  }
}
