import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tonormaldate'
})
export class TonormaldatePipe implements PipeTransform {
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  transform(value:any): string {
    return (new Date(value)).toLocaleDateString('es-ES', this.options)
  }
}