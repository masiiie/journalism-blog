import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticuloComponent } from './articulo/articulo.component'
import { ViewpostComponent } from './viewpost/viewpost.component'
import { NuevoArticuloComponent } from './nuevo-articulo/nuevo-articulo.component'
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component'
import { IndexComponent } from './index/index.component'
import { UsersComponent } from './users/users.component'

import { Tipo } from '../clases/post'


import { GalleryComponent } from './gallery/gallery.component'
import { GalleryDetailsComponent } from './gallery-details/gallery-details.component'
import { LoginComponent } from './login/login.component'
import { EditperfilComponent } from './editperfil/editperfil.component'


const routes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'posts', component:  ArticuloComponent},
  { path: 'posts/Historia', component:  ArticuloComponent},
  { path: 'posts/Entrevista', component:  ArticuloComponent},
  { path: 'posts/Juventud', component:  ArticuloComponent},
  { path: 'posts/Actualidad', component:  ArticuloComponent},
  { path: 'post/:id', component:  ViewpostComponent},
  { path: 'postnew', component: NuevoArticuloComponent},
  { path: 'register', component: NuevoUsuarioComponent},
  { path: 'login', component: LoginComponent},
  { path: 'users', component: UsersComponent},
  { path: 'editp', component: EditperfilComponent},

  { path: 'gallery', component: GalleryComponent},
  { path: 'gallery-details/:id', component: GalleryDetailsComponent}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}