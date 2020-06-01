import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-element-loading-area',
  templateUrl: './element-loading-area.component.html',
  styleUrls: ['./element-loading-area.component.scss'],
})
export class ElementLoadingAreaComponent implements OnInit {
  @Input() mongodbMongooseTime: number;

  constructor(public utils: UtilsService) {}

  ngOnInit(): void {}
}
