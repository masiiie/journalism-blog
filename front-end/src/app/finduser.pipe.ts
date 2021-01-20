import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../clases/usuario'
import { PersonasService } from './personas.service'

@Pipe({
  name: 'finduser'
})
export class FinduserPipe implements PipeTransform {

  transform(id:string): Usuario {
    return 
  }

}
