import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-element-button-icon-text',
  templateUrl: './element-button-icon-text.component.html',
  styleUrls: ['./element-button-icon-text.component.scss'],
})
export class ElementButtonIconTextComponent implements OnInit {
  @Input() icon: string;
  @Input() text: string;
  @Input() color: string;
  @Input() style: string;
  @Input() btnType: string;
  @Input() disabled: boolean;
  @Output() btnClick = new EventEmitter<boolean>();
  @Input() tooltipText: string;
  @Input() tooltipPosition: string;

  constructor() {}

  ngOnInit() {
    this.color = this.color ? `mat-${this.color}` : '';
    this.style = this.style || 'mat-flat-button';
    this.btnType = this.btnType || 'button';
    this.disabled = this.disabled || false;
  }
}
