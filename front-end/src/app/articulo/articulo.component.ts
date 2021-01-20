import { Component, OnInit, Input } from '@angular/core';
import {Post, Tipo} from '../../clases/post'
import {Usuario, Usuario_Tipo} from '../../clases/usuario'
//import {Tag} from '../clases/tag'
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

//import { faCoffee, faTimes, faCalendar, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt, faFolder, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { ArticulosService } from '../articulos.service'
import { PersonasService } from '../personas.service'
import { AuthenticationService } from '../authentication.service'
import { Router } from '@angular/router';

import { faEdit, faPlusSquare } from '@fortawesome/free-regular-svg-icons'


@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit {
  constructor(private articuloservice:ArticulosService,
    private location:Location, private route:ActivatedRoute, private router:Router,
    private authenticationService:AuthenticationService) {
   }

  posts : Post[];
  autores : Usuario[] = []
  reloj = faCalendarAlt
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  editing = false
  toedit : any;
  editicon = faEdit
  removeicon = faTrashAlt
  

   getposts():void{ 
    var s = this.location.path()
    
    var rutas: { [id: string] : Tipo; } = {
      '/posts/Historia':Tipo.Historia,
      '/posts/Entrevista':Tipo.Entrevista,
      '/posts/Actualidad':Tipo.Actualidad,
      '/posts/Juventud':Tipo.Juventud,
    };

    if(s == '/posts') this.articuloservice.getall().then(x=> this.posts = x)
    else this.articuloservice.get_post_type(rutas[s]).then(x => this.posts = x)
   }


   eliminar(id:string) : void {
    this.articuloservice.deletepost(id)
    .then(v => {
      console.log(`Retorno al eliminar un post ${v}`)
      location.reload()
    })
  }

  editar(id:string) : void {
    this.articuloservice.getpost(id, false)
    .then(x => {
      if(x){
      this.toedit = {
        _id: x._id,
        titulo: x.titulo,
        autor: x.autor,
        fecha: x.fecha,
        tipo: x.tipo,
        entrevistado: x.entrevistado,
        fotos: x.fotos,
        tags: x.tags,
        comments: x.comments, 
        contenido: x.contenido,
        frase: x.frase
      }
      this.editing = true
      }
    })
  }

  ngOnInit(): void {
    this.getposts()
  }

  getusertype() : string{
    return this.authenticationService.isLoggedIn() ?
    this.authenticationService.getCurrentUser().tipo : ''
  }

}