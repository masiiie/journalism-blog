import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { GalleryService } from '../gallery.service';
import { Gallery } from '../../clases/gallery';

@Component({
  selector: 'app-gallery-details',
  templateUrl: './gallery-details.component.html',
  styleUrls: ['./gallery-details.component.css']
})
export class GalleryDetailsComponent implements OnInit {
  gallery: Gallery = { _id: '', imageUrl: '', imageDesc: '', uploaded: null };
  isLoadingResults = true;

  constructor(
    private route: ActivatedRoute,
    private api: GalleryService
  ) { }

  getGalleryDetails(id: string): void {
    this.api.getGalleryById(id)
      .then((data: Gallery) => {
        this.gallery = data;
        this.isLoadingResults = false;
      });
  }

  ngOnInit(): void {
    this.getGalleryDetails(this.route.snapshot.paramMap.get('id'));
  }
}