import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Gallery } from '../clases/gallery';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  private apiUrl = 'http://localhost:3000/api/gallery';

  constructor(private http: HttpClient) { }

  getGalleryById(id: string): Promise<Gallery> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Gallery>(url)
    .toPromise()
    .then(res => res as Gallery)
    .catch(this.handleError)
  }

  deleteGallery(id:string) : Promise<any>{
    // router.delete('/gallery/:id', gallery_controllers.delete_one)
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
    .toPromise()
    .then(res => res)
    .catch(this.handleError)
  }

  addGallery(gallery: Gallery, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if(gallery.imageDesc && gallery.imageDesc.length > 0) formData.append('imageDesc', gallery.imageDesc);
    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const req = new HttpRequest('POST', this.apiUrl, formData, options);
    return this.http.request(req)
    .toPromise()
    .then(response => response as any)
    .catch(this.handleError)
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
