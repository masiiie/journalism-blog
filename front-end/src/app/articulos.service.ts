import { Injectable, Inject } from '@angular/core';
import { Post, Tipo, Reaccion } from '../clases/post'
import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PersonasService } from './personas.service'
import { GalleryService } from './gallery.service'
import { Usuario } from '../clases/usuario'

import { BROWSER_STORAGE } from '../clases/storage'
import { AuthResponse } from '../clases/authresponse'

@Injectable({
  providedIn: 'root'
})


export class ArticulosService {

  private apiBaseurl = 'http://localhost:3000/api'
  articulos: Post[];
  

  comparingposts_bydate = function (a:Post, b:Post) {
    if(a.fecha < b.fecha) return 1
    else if(a.fecha==b.fecha) return 0
    else return -1
  }
  
  constructor(
    private http: HttpClient, private personservice : PersonasService,
    private galleryService : GalleryService,
    @Inject(BROWSER_STORAGE) private storage : Storage
    ) { }

  getall() : Promise<Post[]> {
    return this.http.get<Post[]>(`${this.apiBaseurl}/posts`)
    .toPromise()
    .then(x => {
      x.forEach(this.search_ids)
      return x
    })
  }
  getpost(id:string, search:boolean) : Promise<Post>{
    return this.http.get<Post>(`${this.apiBaseurl}/posts/${id}`)
    .toPromise()
    .then(x => {
      if(search) this.search_ids(x, 0, [])
      console.log('Terminamos en search_ids de articulos_service!')
      return x
    })
  }

  deletepost(id:string) : Promise<any>{
    console.log("Llamado a deletepost en articulosService!!")
    const httOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}`
      })
    }

    return this.http.delete<Post>(`${this.apiBaseurl}/posts/${id}`, httOptions)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError)
  }

  editpost(id:string, body:any) : Promise<any>{
    // router.put('/posts/:postid', post_controllers.update_one)
    const httOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}`
      })
    }

    return this.http
    .put<Post>(`${this.apiBaseurl}/posts/${id}`, body, httOptions)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError)
  }

  get_post_type(tipo: Tipo) : Promise<Post[]> {
    return this.http
    .get<Post[]>(`${this.apiBaseurl}/post/${tipo}`)
    .toPromise()
    .then(posts => {
      posts.forEach(this.search_ids)
      return posts
    })
    .catch(this.handleError)
  } 

  addnewpost(data:any) : Promise<any>{
    const url = `${this.apiBaseurl}/posts`
    const httOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}`
      })
    } 
    return this.http.post(url, data, httOptions)
    .toPromise()
    //.then(response => response as any)
    .catch(this.handleError)
  }

  add_comment(id : string, comment : any) : Promise<any>{
    //posts_comment/:postid
    const url = `${this.apiBaseurl}/posts_comment/${id}`
    const httOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}`
      })
    }

    return this.http.put(url, comment, httOptions)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError)
  }

  delete_comment(postid:string, userid:string, date:Date) : Promise<any>{
    const url = `${this.apiBaseurl}/posts_comment_delete/${postid}`
    const httOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}`
      })
    }

    return this.http.put(url, {
      user: userid,
      date: date
    }, httOptions)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError)
  }



  post_query(titulo, autor, tipo) : Promise<Post[]>{
    return this.http.get<Post[]>
    (`${this.apiBaseurl}/post_query?titulo=${titulo}&autor=${autor}&tipo=${tipo}`)
    .toPromise()
    .then(res => res as Post[])
    .catch(this.handleError)
  }

  update_visits(postid){
    //router.put('/posts_visit/:postid', post_controllers.increment_visit)
    return this.http.put(`${this.apiBaseurl}/posts_visit/${postid}`, {})
    .toPromise()
    .then(res => res)
    .catch(this.handleError)
  }

  update_visitants(postid){
    /*
    router
        .route('/posts_visitants/:postid')
        .put(auth, post_controllers.update_visitans) 
    */
    const httOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}`
      })
    }

    return this.http.put(`${this.apiBaseurl}/posts_visitants/${postid}`, {}, httOptions)
    .toPromise()
    .then(res => res)
    .catch(this.handleError)    
  }

  search_ids = (v:Post, i:number, arr:Post[]) => {
    console.log('Empezando... en search_ids de articulos_service!')
    this.personservice.getusuario(v.autor).then(y => {
      v.autor = y
      if(v.tipo == 'Entrevista'){
        this.personservice.getusuario(v.entrevistado).then(
          entr => v.entrevistado = entr
        )
      }
    })

    if(v.fotos) v.fotos.forEach((f, index, v2) => {
      this.galleryService.getGalleryById(f)
      .then(gall => v.fotos[index] = gall)
    })

    if(v.comments) v.comments.forEach((com, i, arr) => {
      this.personservice.getusuario(com.user).then(user => {
        com.user = user
      })
    })

    if(v.reacciones) v.reacciones.forEach((reaction, i, arr) => {
      this.personservice.getusuario(reaction.user).then(user => reaction.user = user)
    })
  }
  
  private handleError(error: any) {
    console.error('Paso algo raro en ArticulosService', error)
    return Promise.reject(error.error.message || error)
  }
}