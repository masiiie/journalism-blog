import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service'
import { PersonasService } from '../personas.service'

@Component({
  selector: 'app-editperfil',
  templateUrl: './editperfil.component.html',
  styleUrls: ['./editperfil.component.css']
})
export class EditperfilComponent implements OnInit {
  toedit :any;
  

  constructor(private authenticationService:AuthenticationService,
  private personservice:PersonasService) { }

  ngOnInit(): void {    
    this.personservice.getusuario(this.authenticationService.getCurrentUser()._id)
    .then(x => {
      console.log(`Mira el valor d x = ${x}, ${x.name1}`)
      this.toedit = {
        _id: x._id,
        name1: x.name1,
        name2: x.name2,
        apellido1: x.apellido1,
        apellido2: x.apellido2,
        tipo: x.tipo,
        correo: x.correo,
        foto: x.foto
      }
    })
  }
}
