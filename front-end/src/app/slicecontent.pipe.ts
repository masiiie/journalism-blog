import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slicecontent'
})
export class SlicecontentPipe implements PipeTransform {

  transform(input:string, mitad:string): string {
    var splited = input.split('\n')
    var separator = '\n'
    if(splited.length < 2){
      splited = input.split('. ')
      separator = '. '
    }
    var middle = splited.length/2
    return mitad == 'True' ? `${splited.slice(0, middle).join(separator)}${separator}` 
    : splited.slice(middle, splited.length + 1).join(separator)
  }
}