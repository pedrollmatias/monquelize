import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Products', path: '/products', isLink: true }];
  pageTitle: string;
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.pageTitle = 'New product';
    this.createProductForm();
  }

  createProductForm(): void {
    this.productForm = this.fb.group({
      sku: [null, Validators.required],
      name: [null, Validators.required],
      description: null,
      category: null,
      unit: [null, Validators.required],
      salePrice: [null, Validators.required],
      costPrice: [null],
      inventory: this.fb.group({
        initialAmount: null,
        minimumAmount: null,
        maximumAmount: null,
      }),
    });
  }
}
