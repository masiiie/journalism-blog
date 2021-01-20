import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tomayuscula'
})
export class TomayusculaPipe implements PipeTransform {

  transform(input: string): string {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }

}