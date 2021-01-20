import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { GalleryService } from '../gallery.service'
import { faFolder, faFile, faArrowAltCircleUp, faEdit, faPlusSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { Gallery } from '../../clases/gallery'


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  iconfolder = faFolder
  flecha = faArrowAltCircleUp
  removeicon = faTrashAlt

  galleryForm: FormGroup;
  imageFile: File = null;
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  foto: Gallery = null;

  @Input() foto_importada: string;

  constructor(
    private api: GalleryService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  onFormSubmit(): void {
    this.isLoadingResults = true;
    this.api.addGallery(this.galleryForm.value, this.galleryForm.get('imageFile').value._files[0])
      .then((res: any) => {
        this.isLoadingResults = false;
        if (res.body) {
          //this.router.navigate(['/gallery-details', res.body._id]);
          this.api.getGalleryById(res.body._id).then(gallery => this.foto = gallery)
        }
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  ngOnInit(): void {
    this.galleryForm = this.formBuilder.group({
      imageFile : [null, Validators.required],
      imageDesc : ['', Validators.required]
    });

    if(this.foto_importada){
      this.api.getGalleryById(this.foto_importada).then(gallery => {
        this.foto = gallery})
    }
  }

  renovar():void {
    this.api.deleteGallery(this.foto._id).then(res => this.foto = null)
  }
}