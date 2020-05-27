import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-element-form-field',
  templateUrl: './element-form-field.component.html',
  styleUrls: ['./element-form-field.component.scss'],
})
export class ElementFormFieldComponent implements OnInit {
  @Input() _formControl: FormControl;
  @Input() _placehoder: string;
  @Input() _label: string;
  @Input() _required: boolean;
  @Input() minWidth: string;

  constructor() {}

  ngOnInit(): void {}
}
