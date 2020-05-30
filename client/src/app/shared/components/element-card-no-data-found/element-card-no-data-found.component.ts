import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-element-card-no-data-found',
  templateUrl: './element-card-no-data-found.component.html',
  styleUrls: ['./element-card-no-data-found.component.scss'],
})
export class ElementCardNoDataFoundComponent implements OnInit {
  @Input() text: string;

  constructor() {}

  ngOnInit(): void {}
}
