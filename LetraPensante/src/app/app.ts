import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('LetraPensante');
  searchTerm: string = '';
  items: string[] = [
    'Angular',
    'TypeScript',
    'Tailwind CSS',
    'JavaScript',
    'HTML',
    'CSS',
    'Node.js',
    'RxJS',
    'NgRx',
    'Express',
    'MongoDB',
    'Firebase',
    'Jest',
    'Jasmine',
    'Karma',
    'Webpack',
    'Vite',
    'ESLint',
    'Prettier',
    'JSDoc',
  ];
  filteredItems: string[] = [...this.items];

  constructor(private http: HttpClient) {}

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      // POST request to localhost/search (commented out for now)
      // this.http.post<any>('http://localhost/search', { query: this.searchTerm }).subscribe({
      //   next: (response) => {
      //     // You can update filteredItems based on response if needed
      //     // this.filteredItems = response.items;
      //   },
      //   error: (err) => {
      //     // Handle error if needed
      //   }
      // });
      // Example: local filtering
      this.filteredItems = this.items.filter(item => item.toLowerCase().includes(term));
    } else {
      this.filteredItems = [...this.items];
    }
  }
}
