import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Products', path: '/products', isLink: true }];
  pageTitle: string;
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private utils: UtilsService) {}

  ngOnInit(): void {
    this.pageTitle = 'New product';
    this.createProductForm();
  }

  createProductForm(): void {
    this.productForm = this.fb.group({
      sku: [Date.now().toString(16).toUpperCase(), Validators.required],
      name: [null, Validators.required],
      description: null,
      category: null,
      unit: [null, Validators.required],
      salePrice: [null, Validators.required],
      costPrice: [null],
      inventory: this.fb.group({
        currentAmount: [0, Validators.required],
        minAmount: [0, Validators.required],
        maxAmount: null,
      }),
    });
  }
}
