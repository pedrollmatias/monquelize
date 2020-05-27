import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/core/services/utils.service';

declare interface IProduct {
  productId: string;
  sku: string;
  description: string;
  amount: number;
  value: number;
  totalValue?: number;
}

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.scss'],
})
export class SaleDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Sales', path: '/sales', isLink: true }];
  pageTitle = 'Loading...';
  saleForm: FormGroup;
  totalValue = 0;

  productsDataSource: MatTableDataSource<AbstractControl>;
  productTableColumns = ['product', 'amount', 'value', 'totalValue', 'remove'];

  constructor(private fb: FormBuilder, public utils: UtilsService) {}

  ngOnInit(): void {
    this.createSaleForm();
    this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
    this.pageTitle = 'New sale';
  }

  setProductsDataSource(formArray: FormArray): void {
    const controls = formArray.controls;
    this.productsDataSource = new MatTableDataSource(controls);
  }

  createSaleForm(): void {
    this.saleForm = this.fb.group({
      customer: null,
      status: null,
      date: Date.now(),
      seller: null,
      products: this.fb.array([this.createProduct()], Validators.required),
      paymentType: null,
    });
  }

  createProduct(): FormGroup {
    return this.fb.group({
      product: null,
      amount: null,
      value: null,
      totalValue: null,
    });
  }

  addProduct(): void {
    const control = <FormArray>this.saleForm.get('products');
    control.push(this.createProduct());
    this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
  }

  removeProduct(index: number): void {
    const control = this.utils.getFormArrayControl(this.saleForm, ['products']);
    control.removeAt(index);
    this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
  }
}
