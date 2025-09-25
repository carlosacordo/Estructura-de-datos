

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldTranslatePipe } from './field-translate.pipe';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FormsModule, HttpClientModule, FieldTranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

  

export class App {
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  protected readonly title = signal('LetraPensante');
  searchTerm: string = '';
  libro: any = null;
  notFound: boolean = false;
  notFoundMessage: string = '';


  showInsertForm: boolean = false;
  insertData: any = { id: '', nombre: '', autor: '', editorial: '', anioEdicion: '', ubicacion: '' };

  constructor(private http: HttpClient) {}

  toggleInsertForm() {
    this.showInsertForm = !this.showInsertForm;
    if (!this.showInsertForm) {
      this.insertData = { id: '', nombre: '', autor: '', editorial: '', anioEdicion: '', ubicacion: '' };
    }
  }

  onInsert() {
    if (Object.values(this.insertData).some(v => !v)) {
      return;
    }
    // Clear form data immediately
    this.insertData = { id: '', nombre: '', autor: '', editorial: '', anioEdicion: '', ubicacion: '' };
    this.http.post<any>('https://letrapensanteapi.azurewebsites.net/libros', this.insertData).subscribe({
      next: (data) => {
        // Close the form and reset all main page state
        this.showInsertForm = false;
        this.insertData = { id: '', nombre: '', autor: '', editorial: '', anioEdicion: '', ubicacion: '' };
        this.searchTerm = '';
        this.libro = null;
        this.notFound = false;
        this.notFoundMessage = '';
      },
      error: (err) => {
        this.notFoundMessage = err?.error?.message || (typeof err?.error === 'string' ? err.error : 'Error al insertar libro.');
        this.notFound = true;
        this.libro = null;
      }
    });
  }

  onSearch() {
    const term = this.searchTerm.trim();
    this.libro = null;
    this.notFound = false;
    this.notFoundMessage = '';
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (term) {
      this.searchTimeout = setTimeout(() => {
        this.http.get<any>(`https://letrapensanteapi.azurewebsites.net/libros/${encodeURIComponent(term)}`).subscribe({
          next: (data) => {
            if (data && Object.keys(data).length > 0) {
              this.libro = data;
              this.notFound = false;
              this.notFoundMessage = '';
            } else {
              this.libro = null;
              this.notFound = true;
              this.notFoundMessage = 'No se encontraron resultados.';
            }
          },
          error: (err) => {
            this.libro = null;
            this.notFound = true;
            this.notFoundMessage = err?.error?.message || (typeof err?.error === 'string' ? err.error : 'No se encontraron resultados.');
          }
        });
      }, 500);
    }
  }

  onCreate() {
    this.http.post<any>('https://letrapensanteapi.azurewebsites.net/libros/crearArchivo', {}).subscribe({
      next: (data) => {
        this.notFoundMessage = data?.message || 'Archivo creado correctamente.';
        this.notFound = true;
        this.libro = null;
      },
      error: (err) => {
        this.notFoundMessage = err?.error?.message || (typeof err?.error === 'string' ? err.error : 'Error al crear archivo.');
        this.notFound = true;
        this.libro = null;
      }
    });
  }

  onDelete() {
    this.http.delete<any>('https://letrapensanteapi.azurewebsites.net/libros').subscribe({
      next: (data) => {
        this.notFoundMessage = data?.message || 'Archivo eliminado correctamente.';
        this.notFound = true;
        this.libro = null;
      },
      error: (err) => {
        this.notFoundMessage = err?.error?.message || (typeof err?.error === 'string' ? err.error : 'Error al eliminar archivo.');
        this.notFound = true;
        this.libro = null;
      }
    });
  }
}
