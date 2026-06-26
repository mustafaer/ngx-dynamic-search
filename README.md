# ngx-dynamic-search

[![npm version](https://img.shields.io/npm/v/ngx-dynamic-search.svg?style=flat-square)](https://www.npmjs.com/package/ngx-dynamic-search)
[![npm downloads](https://img.shields.io/npm/dm/ngx-dynamic-search.svg?style=flat-square)](https://www.npmjs.com/package/ngx-dynamic-search)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Angular Version](https://img.shields.io/badge/angular-v22-red.svg?style=flat-square)](https://angular.dev/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/ngx-dynamic-search?style=flat-square)](https://bundlephobia.com/package/ngx-dynamic-search)

A high-performance, lightweight, and zero-dependency standalone Angular pipe designed for **dynamic, deep-nested search filtering** across complex objects and arrays. 

Optimized for **Angular 22**, **Signals**, and **Zoneless** applications, it features **global multilingual diacritic-insensitivity** (supporting Turkish, German, Polish, Scandinavian, Greek, Arabic, etc.), whitelisting/blacklisting keys, and multiple keyword search matching modes.

---

## ✨ Features

* 🔍 **Deep Recursion Search**: Recursively traverses nested objects and arrays to find matches anywhere in your data structure.
* 🌐 **Global Multilingual Normalization**: Accent and diacritic-insensitive search by default. Automatically handles:
  * **Turkish** (`ş, ı, ğ, ç, ö, ü` matching `s, i, g, c, o, u` and dotless-i rules).
  * **German** (`ß` matching `ss` and umlauts).
  * **Polish/Slavic** (`ł` -> `l`, `đ` -> `d`).
  * **Scandinavian** (`æ` -> `ae`, `ø` -> `o`).
  * **Greek** (accent tonos stripping).
  * **Arabic & Hebrew** (Tashkeel vowels and Niqqud stripping).
* ⚡ **High Performance (Pure Pipe)**: Exploits Angular's pure pipe change detection strategy to avoid recalculations unless input arguments change by reference.
* ⚙️ **Targeted Keys (`includes`) & Exclusions (`excludes`)**: Search only within specific paths (e.g. `user.profile.name`) or exclude keys (e.g. `secret`) using dot-notation.
* 🔀 **Flexible Search Modes (`matchMode`)**:
  * `'includes'` (Default): Substring matching.
  * `'startsWith'`: Matches properties starting with the search term.
  * `'words'`: Splits search terms by space and matches if all words are present anywhere in the object (order-independent).
* 🛡️ **Circular Reference & Type Safe**: Traversal-safety cycles prevention and graceful fallback handling for `Date` objects, `null`, `undefined`, arrays, and primitives.
* 🧩 **100% Standalone & Zoneless Ready**: Zero boilerplate, fully compatible with Angular 22 Signals and Zoneless change detection.

---

## 📦 Installation

Install the package via npm:

```bash
npm install ngx-dynamic-search
```

---

## 🛠 Basic Usage

### 1. Import the Pipe
Import the standalone `DynamicSearchPipe` directly into your Angular component:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicSearchPipe } from 'ngx-dynamic-search';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicSearchPipe],
  template: `
    <input type="text" [(ngModel)]="searchTerm" placeholder="Search users...">
    
    <ul>
      <li *ngFor="let user of users | ngxDynamicSearch: searchTerm">
        {{ user.name }} - {{ user.address.city }}
      </li>
    </ul>
  `
})
export class AppComponent {
  searchTerm = '';
  users = [
    { name: 'John Doe', address: { city: 'New York' } },
    { name: 'Jane Smith', address: { city: 'London' } }
  ];
}
```

---

## 🚀 Advanced Usage

### 1. Using with Angular 22 Signals & Modern template syntax (`@for`)
This pure pipe is optimized for Angular Signals, triggering change detection only when the signals emit new references.

```typescript
import { Component, signal } from '@angular/core';
import { DynamicSearchPipe, SearchOptions } from 'ngx-dynamic-search';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [DynamicSearchPipe],
  template: `
    <input #searchBox (input)="term.set(searchBox.value)" placeholder="Search...">

    <ul>
      @for (item of (items() | ngxDynamicSearch: term(): searchConfig); track item.id) {
        <li>{{ item.name }} (Bio: {{ item.profile.bio }})</li>
      }
    </ul>
  `
})
export class AdvancedSearchComponent {
  term = signal('');
  items = signal([
    { id: 1, name: 'Mustafa ER', profile: { bio: 'Angular Architect', secretToken: '123' } },
    { id: 2, name: 'Jane Doe', profile: { bio: 'UI Designer', secretToken: '456' } }
  ]);

  // Advanced search options configuration
  searchConfig: SearchOptions = {
    isCaseSensitive: false,
    diacriticSensitive: false,
    matchMode: 'words', // Match terms regardless of word order
    includes: ['name', 'profile.bio'], // Search ONLY in name and bio fields
    excludes: ['secretToken'] // Completely ignore this field
  };
}
```

### 2. Global Multilingual Search Demo
Our normalization engine makes character variants, accents, and localized rules search-friendly:

```html
<!-- Input: "kobenhavn" -> Matches: "København" -->
<!-- Input: "strasse"    -> Matches: "Straße" -->
<!-- Input: "lodz"       -> Matches: "Łódź" -->
<!-- Input: "محمد"       -> Matches: "مُحَمَّد" (Tashkeel vowels ignored) -->
<!-- Input: "sahin"      -> Matches: "Şahin" (Turkish specific) -->

<tr *ngFor="let item of locations | ngxDynamicSearch: searchTerm">
  <td>{{ item.name }}</td>
</tr>
```

---

## 📚 API Reference

### `ngxDynamicSearch` Pipe Signature

```typescript
transform<T>(
  items: T[] | null | undefined,
  term: string,
  optionsOrCaseSensitive?: SearchOptions | boolean,
  excludes: string[] = []
): T[]
```

#### Positional Arguments (Backward Compatibility)
For simple applications, you can use the traditional positional arguments:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `T[] \| null \| undefined` | - | The array of objects to filter. |
| `term` | `string` | - | The search string to match against object properties. |
| `isCaseSensitive` | `boolean` | `false` | (Optional) If `true`, performs a case-sensitive search. |
| `excludes` | `string[]` | `[]` | (Optional) An array of property keys or paths to ignore. |

---

### `SearchOptions` Interface Properties
Pass this object as the 3rd argument for enterprise-grade control:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isCaseSensitive` | `boolean` | `false` | If `true`, search will be case-sensitive. |
| `diacriticSensitive` | `boolean` | `false` | If `true`, character accents/diacritics will NOT be normalized (e.g. `é` won't match `e`). |
| `matchMode` | `'includes' \| 'startsWith' \| 'words'` | `'includes'` | **`includes`**: standard substring search.<br>**`startsWith`**: property value must start with search term.<br>**`words`**: splits terms by space and matches if all words are present anywhere in the object. |
| `includes` | `string[]` | `[]` | **Whitelist**. List of property keys or nested paths (e.g., `user.address.zip`) to target. If provided, only these paths are searched. |
| `excludes` | `string[]` | `[]` | **Blacklist**. List of property keys or nested paths to ignore during traversal. Base property names (e.g. `'secret'`) will be ignored everywhere in the object tree. |

---

## ⚡ Performance Best Practices

1. **Keep it Pure**: The pipe is `pure: true`. To update the list dynamically, ensure you push a new array reference (e.g. `this.items = [...newItems]`) or update Angular Signals.
2. **Whitelist Searching**: For heavy objects with thousands of rows, define `includes` in `SearchOptions` to target only the properties you want to search. This skips deep recursive traversals and increases filtering speed.
3. **Blacklist Heavy Fields**: Exclude large binary fields, parent references, or metadata keys via `excludes` to avoid unnecessary string conversions.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue on the [GitHub Repository](https://github.com/mustafaer/ngx-dynamic-search).

### Development Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Build the library: `npm run build`
4. Run unit tests: `npm run test`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/mustafaer">Mustafa ER</a>
</div>
