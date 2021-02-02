import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-elemet-search-input',
  templateUrl: './elemet-search-input.component.html',
  styleUrls: ['./elemet-search-input.component.scss'],
})
export class ElemetSearchInputComponent implements OnInit {
  formControl = new FormControl();

  @Input() placeholder: string;
  @Output() onFormControlValueChanges = new EventEmitter<FormControl>();

  constructor() {}

  ngOnInit(): void {
    this._onFormControlValueChanges();
  }

  _onFormControlValueChanges(): void {
    this.formControl.valueChanges.subscribe((value) => {
      this.onFormControlValueChanges.emit(value);
    });
  }
}
