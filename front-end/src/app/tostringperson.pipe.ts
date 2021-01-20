import { Pipe, PipeTransform } from '@angular/core';
import { Usuario, Persona } from '../clases/usuario'

@Pipe({
  name: 'tostringperson'
})

export class TostringpersonPipe implements PipeTransform {
  name:string;

  transform(user:{name1:string, name2:string, apellido1:string, apellido2:string}): string {
    this.name = user.name2
    if(!this.name) this.name = ''
    return user.name1 + " " + this.name + " " + user.apellido1 + " " + user.apellido2
  }
}
