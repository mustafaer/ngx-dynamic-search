# NGX DYNAMIC SEARCH

Runtime search for Angular applications.

## Installation

To install this library, run:
https://www.npmjs.com/package/ngx-dynamic-search
```bash
npm i ngx-dynamic-search
```

## Usage

Import the `DynamicSearchPipe` in your component. Since it is a standalone pipe, you can import it directly into your standalone component's `imports` array.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicSearchPipe } from "ngx-dynamic-search";
import { FormsModule } from "@angular/forms";

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
  ];
}

export interface Item {
  company: string;
  contact: string;
  country: string;
}
```

Use the pipe in your template:

```html
<div style="width: 100%; height: 100%">
  <input type="text" [(ngModel)]="searchValue" id="search" name="search" placeholder="Search..">
  <table>
    <tr>
      <th>Company</th>
      <th>Contact</th>
      <th>Country</th>
    </tr>
    <!-- 
      Parameters:
      1. searchValue: The term to search for.
      2. isCaseSensitive (optional, default: false): Whether the search should be case-sensitive.
      3. excludes (optional, default: []): Array of property names to exclude from the search.
    -->
    <tr *ngFor="let item of items | ngxDynamicSearch: searchValue : false : ['contact']">
      <td>{{item.company}}</td>
      <td>{{item.contact}}</td>
      <td>{{item.country}}</td>
    </tr>
  </table>
</div>
```

## API

### `ngxDynamicSearch` Pipe

Filters an array of items based on a search term.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `any[]` | - | The array of items to filter. |
| `term` | `string` | - | The search term to match against properties. |
| `isCaseSensitive` | `boolean` | `false` | If `true`, performs a case-sensitive search. |
| `excludes` | `string[]` | `[]` | A list of property keys to ignore during the search. |

## Features

*   **Deep Search**: Recursively searches through nested objects and arrays.
*   **Type Safe**: Handles `null`, `undefined`, and various data types gracefully.
*   **Performance**: Optimized for Angular applications.
*   **Standalone**: Ready for modern Angular standalone components.
