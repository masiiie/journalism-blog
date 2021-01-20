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
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {

  iconfolder = faFolder
  flecha = faArrowAltCircleUp
  removeicon = faTrashAlt

  galleryForm: FormGroup;
  imageFile: File = null;
  imageDesc = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  fotos: Gallery[] = []
  files:number[] = []

  @Input() fotos_importadas: string[];

  constructor(
    private api: GalleryService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  onFormSubmit(): void {
    var lastModified = this.galleryForm.get('imageFile').value._files[0].lastModified
    if(this.files.includes(lastModified)) return
    this.isLoadingResults = true;
    this.api.addGallery(this.galleryForm.value, this.galleryForm.get('imageFile').value._files[0])
      .then((res: any) => {
        this.isLoadingResults = false;
        if (res.body) {
          //this.router.navigate(['/gallery-details', res.body._id]);
          this.api.getGalleryById(res.body._id).then(gallery => {
            this.files.push(lastModified)
            this.fotos.push(gallery)
          })
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

    if(this.fotos_importadas){
      this.fotos_importadas.forEach((v,i,arr) => {
        this.api.getGalleryById(v)
        .then(gallery => {
          this.fotos.push(gallery)
        })
      })
    }
  }

  renovar():void {
    this.fotos.forEach((g, i, arr) => {
      this.api.deleteGallery(g._id)
      .then(res => console.log(res))
    })
    this.fotos = []
  }
}