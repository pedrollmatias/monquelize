import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { FormGroup, AbstractControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss'],
})
export class PurchaseDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Purchases', path: '/purchases', isLink: true }];
  pageTitle = 'Loading...';
  saleForm: FormGroup;
  totalValue = 0;

  productsDataSource: MatTableDataSource<AbstractControl>;
  productTableColumns = ['product', 'amount', 'cost', 'totalCost', 'remove'];

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
