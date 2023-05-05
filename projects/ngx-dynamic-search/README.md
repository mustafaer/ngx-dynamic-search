# NGX DYNAMIC SEARCH

Runtime search for angular applications.

Supported version:

```
Angular 16
```

## Installation

To install this library, run:

```bash
npm i ngx-dynamic-search
```

## Usage

```angular2html

<div style="width: 100%; height: 100%">
  <input type="text" [(ngModel)]="searchValue" id="search" name="search" placeholder="Search..">
  <table>
    <tr>
      <th>Company</th>
      <th>Contact</th>
      <th>Country</th>
    </tr>
    <tr *ngFor="let item of items | ngxDynamicSearch: searchValue : true: ['contact', 'country']">
      <td>{{item.company}}</td>
      <td>{{item.contact}}</td>
      <td>{{item.country}}</td>
    </tr>
  </table>
</div>
```

```typescript
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicSearchPipe} from "ngx-dynamic-search";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DynamicSearchPipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchValue = '';
  items: Item[] = [
    {
      company: 'Alfreds Futterkiste',
      contact: 'Maria Anders',
      country: 'Germany'
    },
    {
      company: 'Centro comercial Moctezuma',
      contact: 'Francisco Chang',
      country: 'Mexico'
    },
    {
      company: 'Ernst Handel',
      contact: 'Roland Mendel',
      country: 'Austria'
    },
    {
      company: 'Island Trading',
      contact: 'Helen Bennett',
      country: 'UK'
    },
    {
      company: 'Laughing Bacchus Winecellars',
      contact: 'Yoshi Tannamuri',
      country: 'Canada'
    },
  ]
}

export interface Item {
  company: string;
  contact: string;
  country: string;
}

```

```
   * Filer items[]
   * @param items List of items to filter
   * @param term  a string term to compare with every property of the list
   * @param isCaseSensitive check term compare is case-sensitive
   * @param excludes List of keys which will be ignored during search
```
