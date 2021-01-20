import { Component, OnInit } from '@angular/core';
import { faCoffee, faTimes, faCalendar, faSearch } from '@fortawesome/free-solid-svg-icons';
import {faCalendarAlt} from '@fortawesome/free-regular-svg-icons'
import { Tipo } from '../../clases/post'
import { AuthenticationService } from '../authentication.service'
import { PersonasService } from '../personas.service'
import { Router } from '@angular/router'
import { GalleryService } from '../gallery.service'

@Component({
  selector: 'app-barranav',
  templateUrl: './barranav.component.html',
  styleUrls: ['./barranav.component.css']
})
export class BarranavComponent implements OnInit {
  search = faSearch
  tipo = []
  titulos = {
    'Actualidad':'Actualidad', 
    'Juventud cristiana':'Juventud cristiana',
    'Entrevista':'Entrevistas',
    'Historia bíblica':'Historias bíblicas'
  }

  constructor(private authenticationService:AuthenticationService,
  private galleryService:GalleryService,
  private router: Router, private personsService: PersonasService) { }

  ngOnInit(): void {
    for(var x in Tipo) this.tipo.push(Tipo[x])
  }

  public doLogout() : void{
    this.authenticationService.logout() 
    this.router.navigateByUrl(`/`)
  }

  public isLoggedIn() : boolean{
    return this.authenticationService.isLoggedIn()
  }

  public getUsername():string{
    const user = this.authenticationService.getCurrentUser()
    return user ? user.name : 'Invitado'
  }

  public getUserfoto():any{
    const user = this.authenticationService.getCurrentUser()
    return user ? this.galleryService.getGalleryById(user.foto)
    .then(gall => {return gall.imageUrl as string}) : '../../assets/avatar.png'
  }

  public getUserType():string{
    const user = this.authenticationService.getCurrentUser()
    return user ? user.tipo : ''
  }

  public editar_perfil(){
    const user = this.authenticationService.getCurrentUser()
    const id = user ? user._id : ''
    if(id.length > 0){
      this.personsService.getusuario(id)
      .then(x => {
        if(x){
          const toedit = {
            _id: x._id,
            name1: x.name1,
            name2: x.name2,
            apellido1: x.apellido1,
            apellido2: x.apellido2,
            tipo: x.tipo,
            correo: x.correo,
            foto: x.foto
          }
          
          //this.router.navigateByUrl('register', {toedit: toedit})
        }
      })
    }
  }
}