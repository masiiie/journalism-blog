import { Injectable, Inject } from '@angular/core';
import { ArticulosService } from './articulos.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BROWSER_STORAGE } from '../clases/storage'
import { Reaccion } from '../clases/post'
//import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
//import { AngularFireAuth } from 'angularfire2/auth';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  //emojiList = ['like', 'love', 'wow', 'haha', 'sad', 'angry']
  emojiList = [] // = ['Me encanta', 'Me gusta', 'Me ha hecho reflexionar']
  apiBaseUrl = 'http://localhost:3000/api'

  /*
  groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  */

    groupBy = (lista:any[], property:string) => {
    var counter: any = {}
    lista.forEach((v,i,arr) =>{
        if(counter[v[property]]) counter[v[property]] = counter[v[property]] + 1
        else counter[v[property]] = 1
    })
    return counter}

  constructor(private articulosService:ArticulosService, 
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage : Storage) {
      for(var x in Reaccion) this.emojiList.push(Reaccion[x])
    }

  getReactions(postid): Promise<any> {
    /*
    router
    .route('/reactions/:postid')
    .get(post_controllers.get_reactions)
    */ 
    return this.http.get(`${this.apiBaseUrl}/reactions/${postid}`)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError)
  }


  updateReaction(postid:string, reaction:Reaccion) : Promise<any>{
    //.route('/reactions/:postid').put(auth, post_controllers.update_reaction)
    const httOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}`
      })
    }
    
    return this.http.put(`${this.apiBaseUrl}/reactions/${postid}`, {reaction: reaction}, httOptions)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError)
  }

  removeReaction(postid) : Promise<any>{
    //.route('/reactions/:postid').put(auth, post_controllers.update_reaction)
    const httOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('misuper-token')}`
      })
    }
    
    return this.http.put(`${this.apiBaseUrl}/reactions/${postid}`, {delete: true}, httOptions)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError)
  }

  countReactions(reactions: Array<any>) {
    //return _.mapValues(_.groupBy(reactions), 'length')
    return this.groupBy(reactions, 'valor') as {String; Number;}
  }

  userReaction(reactions: Array<any>, user : String) : string {
    //return _.get(reactions, this.userId)
    return reactions.find((v,i,arr) => v.user == user).valor
  }

  private handleError(error: any) {
    console.error('Paso algo raro en ReactionService', error)
    return Promise.reject(error.error.message || error)
  }
}