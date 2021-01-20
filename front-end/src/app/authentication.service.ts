import { Injectable, Inject } from '@angular/core';
import { BROWSER_STORAGE } from '../clases/storage'
import { Usuario } from '../clases/usuario'
import { AuthResponse } from '../clases/authresponse'
import { PersonasService } from './personas.service'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(@Inject(BROWSER_STORAGE) private storage : Storage,
  private personsService: PersonasService) { }

  public getToken() : string {
    return this.storage.getItem('misuper-token')
  }

  public saveToken(token: string) : void {
    this.storage.setItem('misuper-token', token)
  }

  public register(user: Usuario) : Promise<any> {
    return this.personsService.register(user)
    .then((authResp) => {

      this.saveToken(authResp.token)
    })
  }

  public login(user: any) : Promise<any> {
    return this.personsService.login(user)
    .then((authResp: AuthResponse) => {
      console.log(`Mira la cosita fea ${authResp}`)
      this.saveToken(authResp.token)
    })
  }

  public logout():void{
    this.storage.removeItem('misuper-token')
  }

  public isLoggedIn():boolean{
    const token:string = this.getToken()
    if(token){
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp > (Date.now()/1000)
    }
    else return false
   
  }

  public getCurrentUser(): any{
    if(this.isLoggedIn()){
      const token:string = this.getToken()
      const {_id, correo, name, exp, tipo, foto} = JSON.parse(atob(token.split('.')[1]))
      return {_id, correo, name, tipo, foto}
      /*return atob(token.split('.')[1])*/
    }
  }
}