# NGX DYNAMIC SEARCH

[![npm version](https://img.shields.io/npm/v/ngx-dynamic-search.svg)](https://www.npmjs.com/package/ngx-dynamic-search)
[![npm downloads](https://img.shields.io/npm/dm/ngx-dynamic-search.svg)](https://www.npmjs.com/package/ngx-dynamic-search)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ngx-dynamic-search** is a high-performance, lightweight, and standalone Angular pipe designed for dynamic, deep search filtering across complex nested objects and arrays. It seamlessly integrates with modern Angular applications (Angular 14+), providing a robust solution for client-side filtering.

## 🚀 Features

*   **🔍 Deep Search**: Recursively searches through nested objects and arrays to find matches anywhere in your data structure.
*   **⚡ High Performance**: Optimized for speed, ensuring smooth filtering even with large datasets.
*   **🛡️ Type Safe**: Gracefully handles `null`, `undefined`, `Date` objects, and various primitive types without crashing.
*   **🧩 Standalone**: Built as a standalone pipe, making it easy to import and use in any Angular component without `NgModule` boilerplate.
*   **⚙️ Customizable**: Supports case-sensitive search and the ability to exclude specific properties from the search scope.

## 📦 Installation

Install the library via npm:

```bash
npm install ngx-dynamic-search
```

## 🛠 Usage

### 1. Import the Pipe

Since `ngxDynamicSearch` is a standalone pipe, simply add it to the `imports` array of your standalone component.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicSearchPipe } from 'ngx-dynamic-search';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicSearchPipe], // Import here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchValue = '';
  
  items = [
    {
      company: 'Alfreds Futterkiste',
      contact: 'Maria Anders',
      country: 'Germany',
      details: { sector: 'Food', employees: 50 }
    },
    {
      company: 'Centro comercial Moctezuma',
      contact: 'Francisco Chang',
      country: 'Mexico',
      details: { sector: 'Retail', employees: 120 }
    },
    // ... more items
  ];
}
```

### 2. Use in Template

Apply the pipe to your `*ngFor` loop.

```html
<div class="search-container">
  <input type="text" [(ngModel)]="searchValue" placeholder="Search...">
  
  <table>
    <tr>
      <th>Company</th>
      <th>Contact</th>
      <th>Country</th>
    </tr>
    <!-- 
      Usage: items | ngxDynamicSearch : searchTerm : isCaseSensitive : excludedKeys
    -->
    <tr *ngFor="let item of items | ngxDynamicSearch: searchValue : false : ['id', 'secretField']">
      <td>{{item.company}}</td>
      <td>{{item.contact}}</td>
      <td>{{item.country}}</td>
    </tr>
  </table>
</div>
```

## 📚 API Reference

### `ngxDynamicSearch` Pipe

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `any[]` | - | The array of objects to filter. |
| `term` | `string` | - | The search string to match against object properties. |
| `isCaseSensitive` | `boolean` | `false` | (Optional) If `true`, performs a case-sensitive search. |
| `excludes` | `string[]` | `[]` | (Optional) An array of property keys to ignore during the search. |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue on [GitHub](https://github.com/mustafaer/ngx-dynamic-search).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  Made with ❤️ by <a href="https://github.com/mustafaer">Mustafa ER</a>
</div>
