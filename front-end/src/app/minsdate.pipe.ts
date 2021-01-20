import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minsdate'
})
export class MinsdatePipe implements PipeTransform {

  transform(value: any): string {
    const date = new Date(value)
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }
}
