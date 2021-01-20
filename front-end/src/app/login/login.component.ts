import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service'
import { Router } from '@angular/router'
import { HistoryService } from '../history.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formError:string = ''
  public usuario = {
    correo: '',
    password: ''
  }

  constructor(private authenticationService: AuthenticationService,
  private router:Router, private historyService:HistoryService) { }

  ngOnInit(): void {
  }

  submit():void{
    this.formError = ''
    if(!this.usuario.correo || !this.usuario.password){
      this.formError = 'Todos los campos son requeridos, intente de nuevo'
    }
    else this.doLogin()
  }

  private doLogin():void{
    this.authenticationService.login(this.usuario)
    .then(() => this.router.navigateByUrl(this.historyService.getLastNonLoginUrl()))
    .catch((message) => {
      this.formError = message
    })
  }
}
