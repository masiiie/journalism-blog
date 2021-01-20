import { Injectable, Inject } from '@angular/core';
import { Usuario, Persona, Usuario_Tipo } from '../clases/usuario'
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GalleryService } from './gallery.service'

import { AuthResponse } from '../clases/authresponse'
import { BROWSER_STORAGE } from '../clases/storage'



@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  private apiBaseurl = 'http://localhost:3000/api'

  personas: Persona[];

  search_ids = (res : Usuario, i, arr) => {
    if(res.foto){
      this.galleryService.getGalleryById(res.foto).then(
        f => res.foto = f
      ).catch(this.handleError)
    }
  }

  constructor(
    private http: HttpClient, private galleryService : GalleryService,
    @Inject(BROWSER_STORAGE) private storage : Storage) { }

  register(data:any) : Promise<any>{
    const url = `${this.apiBaseurl}/register`
    return this.http.post(url, data)
    .toPromise()
    .then(response => response)
    .catch(this.handleError)
  }

  login(data:any): Promise<any>{
    const url = `${this.apiBaseurl}/login`
    return this.http.post(url, data)
    .toPromise()
    .then(response => response)
    .catch(this.handleError)
  }

  edituser(id:string, data:any) : Promise<any>{
    // router.put('/users/:userid', user_controllers.update_one)
    const url = `${this.apiBaseurl}/users/${id}`
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}` })
    };

    return this.http.put(url, data, httpOptions)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError)
  }

  namesearch(name1, name2, apellido1, apellido2) : Promise<Usuario[]>{
    console.log(`Llamado a nameseach!!`)
    return this.http.get<Usuario[]>
    (`${this.apiBaseurl}/user_query?name1=${name1}&name2=${name2}&apellido1=${apellido1}&apellido2=${apellido2}`)
    .toPromise()
    .then(res => {
      res.forEach(this.search_ids)
      return res as Usuario[]
    })
    .catch(this.handleError)
  }

  getusuario(id:string) : Promise<Usuario>{
    return this.http
    .get<Usuario>(`${this.apiBaseurl}/users/${id}`)
    .toPromise()
    .then(res => {
      this.search_ids(res, 0, [])
      return res as Usuario
    })
    .catch(this.handleError)
  }

  deleteusuario(id:string) : Promise<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}` })
    };

    return this.http.delete(`${this.apiBaseurl}/users/${id}`, httpOptions)
    .toPromise()
    .then(response => response as any)
    //.catch(this.handleError)
    .catch((error) => {return error.error.message})
  }


  getallusers() : Promise<Usuario[]> {
    return this.http
    .get<Usuario[]>(`${this.apiBaseurl}/users`)
    .toPromise()
    .then(res => {
      res.forEach(this.search_ids)
      return res as Usuario[]
    })
    .catch(this.handleError)
  }

  get_users_type(tipo: Usuario_Tipo) : Promise<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiBaseurl}/users`)
    .toPromise()
    .then(res => {
      res.forEach(this.search_ids)
      return (res as Usuario[]).filter((value, i, array) => array[i].tipo == tipo)
    })
    .catch(this.handleError)
  }


  private handleError(error: any) {
    console.error('Paso algo raro en PersonasService', error)
    return Promise.reject(error.message || error)
  }
}