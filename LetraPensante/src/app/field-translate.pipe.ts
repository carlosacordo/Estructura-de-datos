import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldTranslate',
  standalone: true
})
export class FieldTranslatePipe implements PipeTransform {
  private map: { [key: string]: string } = {
    anioedicion: 'Año Edición',
    autor: 'Autor',
    editorial: 'Editorial',
    id: 'ID',
    nombre: 'Nombre',
    ubicacion: 'Ubicación'
  };
  transform(value: unknown): string {
    if (typeof value !== 'string') return '';
    const normalized = value.replace(/\s+/g, '').toLowerCase();
    return this.map[normalized] || value;
  }
}
