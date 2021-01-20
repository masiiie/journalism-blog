import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarranavComponent } from './barranav/barranav.component';
import { AboutmeComponent } from './aboutme/aboutme.component';
import { ViewpostComponent } from './viewpost/viewpost.component';
import { IndexComponent } from './index/index.component';


import { HttpClientModule }    from '@angular/common/http';


import { NuevoArticuloComponent } from './nuevo-articulo/nuevo-articulo.component';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { TomayusculaPipe } from './tomayuscula.pipe';
import { UsersComponent } from './users/users.component';
import { TostringpersonPipe } from './tostringperson.pipe';
import { TonormaldatePipe } from './tonormaldate.pipe';
import { FinduserPipe } from './finduser.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import * as $ from "jquery";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryDetailsComponent } from './gallery-details/gallery-details.component';
import { MinsdatePipe } from './minsdate.pipe';
import { LoginComponent } from './login/login.component';
import { EditperfilComponent } from './editperfil/editperfil.component';
import { ReactionComponent } from './reaction/reaction.component';
import { SlicecontentPipe } from './slicecontent.pipe';
import { GalleryListComponent } from './gallery-list/gallery-list.component';


@NgModule({
  declarations: [
    AppComponent,
    ArticuloComponent,
    BarranavComponent,
    AboutmeComponent,
    ViewpostComponent,
    IndexComponent,
    NuevoArticuloComponent,
    NuevoUsuarioComponent,
    TomayusculaPipe,
    UsersComponent,
    TostringpersonPipe,
    TonormaldatePipe,
    FinduserPipe,
    GalleryComponent,
    GalleryDetailsComponent,
    MinsdatePipe,
    LoginComponent,
    EditperfilComponent,
    ReactionComponent,
    SlicecontentPipe,
    GalleryListComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    
    BrowserAnimationsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MaterialFileInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }