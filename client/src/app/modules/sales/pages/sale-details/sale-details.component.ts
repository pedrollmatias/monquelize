import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/core/services/utils.service';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';
import { forkJoin, Observable, of } from 'rxjs';
import { IPaymentMethod } from 'src/app/shared/models/payment-method.model';
import { ISaleProduct } from 'src/app/shared/models/sale-product.model';
import { startWith, map, switchMap } from 'rxjs/operators';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { ApiSaleService } from 'src/app/core/api/api-sale.service';
import { IConfirmation } from 'src/app/shared/models/confirmation.model';

export const SALE_STATUS_ENUM = {
  '100': 'Draft',
  '200': 'Budget',
  '300': 'Done',
  '400': 'Canceled',
};

declare interface IProduct {
  productRef: string;
  sku: string;
  description?: string;
  amount: number;
  price: number;
  subtotal?: number;
}

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.scss'],
})
export class SaleDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Sales', path: '/sales', isLink: true }];

  saleId: string;
  sale: any;
  products: ISaleProduct[];
  paymentMethods: IPaymentMethod[];

  mongodbMongooseTime: number;

  saleForm: FormGroup;
  paymentMethodFormControl = new FormControl(null, Validators.required);
  totalValue = 0;

  pageTitle = 'Loading...';

  isNewSale: boolean;

  showPageData = false;

  saleStatus = SALE_STATUS_ENUM;
  productsDataSource: MatTableDataSource<AbstractControl>;
  productTableColumns = ['product', 'amount', 'value', 'subtotal', 'remove'];

  searchInputs: FormControl[] = [];
  filteredProductsArray$: Observable<any[]>[] = new Array();

  constructor(
    private fb: FormBuilder,
    private saleApi: ApiSaleService,
    private productApi: ApiProductService,
    private paymentMethodApi: ApiPaymentMethodService,
    private sharedComponents: SharedComponentsService,
    private route: ActivatedRoute,
    public utils: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.saleId = this.route.snapshot.paramMap.get('id');
    this.isNewSale = this.saleId ? false : true;
    if (!this.isNewSale) {
      // forkJoin(
      //   this.productApi.getProducts(),
      //   this.paymentMethodApi.getPaymentMethods()
      // ).subscribe((res) => {
      //   const [productRes, paymentMethodRes] = res;
      //   this.sale = saleRes.res;
      //   this.categories = categoryRes.res;
      //   this.units = unitRes.res;
      //   this.mongodbMongooseTime = this.getGreatestTime([categoryRes.time, unitRes.time]);
      //   this.pageTitle = 'Edit sale';
      //   this.createSaleForm();
      //   this.initFormData(this.sale);
      //   this.showPageData = true;
      // });
    } else {
      forkJoin(this.productApi.getProducts(), this.paymentMethodApi.getPaymentMethods()).subscribe((res) => {
        const [productRes, paymentMethodRes] = res;
        this.products = productRes.res;
        this.paymentMethods = paymentMethodRes.res;
        this.mongodbMongooseTime = this.utils.getGreatestTime([productRes.time, paymentMethodRes.time]);
        this.createSaleForm();
        this.addProduct();
        this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
        this.listenSearchInputChages();
        this.listenProductChanges();
        this.pageTitle = 'New sale';
        this.showPageData = true;
      });
    }
  }

  get saleStatusArr(): string[] {
    return Object.keys(this.saleStatus);
  }

  getSaleStatusText(code: string): string {
    return this.saleStatus[code];
  }

  setProductsDataSource(formArray: FormArray): void {
    const controls = formArray.controls;
    this.productsDataSource = new MatTableDataSource(controls);
  }

  createSaleForm(): void {
    this.saleForm = this.fb.group({
      customer: null,
      status: ['300', Validators.required],
      date: new Date(),
      seller: null,
      products: this.fb.array([], Validators.required),
      paymentMethod: this.fb.group(
        {
          paymentMethodRef: [null, Validators.required],
          name: [null, Validators.required],
        },
        Validators.required
      ),
    });
  }

  listenSearchInputChages(): void {
    this.searchInputs.forEach((searchInput, index) => {
      this.filteredProductsArray$[index] = searchInput.valueChanges.pipe(
        startWith(''),
        map((value: any) => (typeof value === 'object' ? value?.name : value)),
        map((value: any) => (value ? this.filterProducts(value) : this.products.slice()))
      );
    });
  }

  filterProducts(name: string): ISaleProduct[] {
    const value = name.toLowerCase();
    return this.products.filter((product) => {
      const nameStr = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedProductStr = `(${product.sku}) ${nameStr}`;
      const optionStr = `(${product.sku}) ${product.name}`;
      return normalizedProductStr.toLowerCase().includes(value) || optionStr.toLowerCase().includes(value);
    });
  }

  listenProductChanges(): void {
    const control = <FormArray>this.saleForm.get('products');
    control.valueChanges.subscribe(() => this.calculateTotalValue());
  }

  calculateTotalValue(): void {
    const control = <FormArray>this.saleForm.get('products');
    const value = control.value.reduce((value, product) => (value += product.amount * product.price), 0) || 0;
    this.totalValue = this.utils.round(value, 2);
  }

  displayProduct(product: ISaleProduct): string {
    return product ? `(${product.sku}) ${product.name}` : '';
  }

  createProduct(): FormGroup {
    return this.fb.group({
      productRef: [null, Validators.required],
      sku: [null, Validators.required],
      name: [null, Validators.required],
      category: null,
      unit: null,
      amount: [{ value: null, disabled: true }, Validators.required],
      price: [{ value: null, disabled: true }, Validators.required],
      subtotal: null,
    });
  }

  addProduct(): void {
    const control = <FormArray>this.saleForm.get('products');
    control.push(this.createProduct());
    this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
    this.addSearchInput();
    this.addFilteredProducts$();
    this.listenSearchInputChages();
  }

  removeProduct(index: number): void {
    const control = this.utils.getFormArrayControl(this.saleForm, ['products']);
    control.removeAt(index);
    this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
    this.removerSearchInput(index);
    this.removerFilteredProducts$(index);
    this.listenSearchInputChages();
  }

  addSearchInput(): void {
    this.searchInputs.push(new FormControl(null, Validators.required));
  }

  addFilteredProducts$(): void {
    this.filteredProductsArray$.push(of([]));
  }

  removerSearchInput(index: number): void {
    this.searchInputs = this.searchInputs.filter((_, i) => i !== index);
  }

  removerFilteredProducts$(index: number): void {
    this.filteredProductsArray$ = this.filteredProductsArray$.filter((_, i) => i !== index);
  }

  handleProductSelection(product: any, index: number): void {
    const control = <FormArray>this.saleForm.get('products');
    const productAlreadyAdded = control.value.find((addedProduct) => addedProduct.productRef === product._id);
    if (productAlreadyAdded) {
      this.sharedComponents.openSnackbarWarning('Product already added');
      control.at(index).reset();
      this.searchInputs[index].reset();
    } else {
      this.initProductData(product, index);
    }
  }

  initProductData(product: any, index: number): void {
    const controle = <FormArray>this.saleForm.get('products');
    const productFormValue = {
      ...product,
      productRef: product._id,
      amount: 1,
      price: product.salePrice,
      subtotal: product.salePrice,
    };
    if (product.unit) {
      productFormValue.unit = {
        unitRef: product.unit._id,
        shortUnit: product.unit.shortUnit,
      };
    }
    controle.at(index).patchValue(productFormValue);
    controle.at(index).get('amount').enable();
    controle.at(index).get('price').enable();
  }

  getProductTotalValue(index: number): number {
    const control = <FormArray>this.saleForm.get('products');
    const amount = control.at(index).get('amount').value;
    const price = control.at(index).get('price').value;
    return this.utils.round(amount * price, 2) || 0;
  }

  validateAmount(index: number): void {
    const control = <FormArray>this.saleForm.get('products');
    const amount = control.at(index).get('amount').value;
    if (amount <= 0) {
      this.sharedComponents.openSnackbarWarning('Invalid amount');
      control.at(index).patchValue({ amount: 1 });
    }
  }

  validatePrice(index: number): void {
    const controle = <FormArray>this.saleForm.get('products');
    const price = controle.at(index).get('price').value;
    if (price <= 0) {
      this.sharedComponents.openSnackbarWarning('Invalid price');
      controle.at(index).patchValue({ price: controle.at(index).get('price').value });
    }
  }

  isLastFormArrayItemInvalid(): boolean {
    const control = <FormArray>this.saleForm.get('products');
    return control.at(control.length - 1).invalid;
  }

  handlePaymentMethodSelection(payment: any): void {
    const paymentMethodFormValue = { ...payment, paymentMethodRef: payment._id };
    this.saleForm.get('paymentMethod').patchValue(paymentMethodFormValue);
  }

  compareSelection(option: any, selection: any) {
    return option?._id === selection?.paymentMethodRef;
  }

  saveSale(): void {
    if (this.saleForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      if (this.isNewSale) {
        const sale = this.saleForm.value;
        this.sharedComponents
          .openLoadingDialog(this.saleApi.createSale(sale))
          .beforeClosed()
          .subscribe((saleRes: IHttpRes) => {
            if (saleRes) {
              this.router.navigate(['/sale', 'edit', saleRes.res._id]);
            }
          });
      } else {
        // const product = this.formatProduct(this.productForm.value);
        // this.sharedComponents
        //   .openLoadingDialog(this.productApi.editProduct(this.productId, product))
        //   .beforeClosed()
        //   .subscribe((productRes) => {
        //     this.initFormData(productRes.res);
        //   });
      }
    }
  }

  removeSale(): void {
    const message = '<p>This sale will be removed. Product amount will be recovered. Are you sure?</p>';
    this.sharedComponents
      .openDialogConfirmation('warning', 'warn', 'Remove sale', message, 'Remove sale')
      .beforeClosed()
      .pipe(
        switchMap((confirmation: IConfirmation) => {
          if (confirmation?.confirmed) {
            return this.sharedComponents.openLoadingDialog(this.saleApi.removeSale(this.saleId)).beforeClosed();
          }
          return of();
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.router.navigate(['/products']);
        }
      });
  }
}
