import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.css']
})
export class AboutmeComponent implements OnInit {

  foto = '../../assets/roxy.jpg';

  constructor() { }

  ngOnInit(): void {
  }

}
