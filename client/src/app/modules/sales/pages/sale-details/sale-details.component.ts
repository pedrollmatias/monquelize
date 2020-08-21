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
import { IPaymentMethod } from 'src/app/shared/models/views.model';
import { IOperationProduct } from 'src/app/shared/models/views.model';
import { startWith, map, switchMap } from 'rxjs/operators';
import { ApiSaleService } from 'src/app/core/api/api-sale.service';
import { IConfirmation } from 'src/app/shared/models/confirmation.model';
import { ApiUserService } from 'src/app/core/api/api-user.service';
import { IUser } from 'src/app/shared/models/views.model';

export const SALE_STATUS_ENUM = {
  '100': 'Draft',
  '200': 'Budget',
  '300': 'Done',
  '400': 'Canceled',
};

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.scss'],
})
export class SaleDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Sales', path: '/sales', isLink: true }];

  saleId: string;
  sale: any;
  products: IOperationProduct[];
  paymentMethods: IPaymentMethod[];
  users: IUser[];

  mongodbMongooseTime: number;

  saleForm: FormGroup;
  paymentMethodFormControl = new FormControl(null, Validators.required);
  sellerFormControl = new FormControl();
  totalValue = 0;

  pageTitle = 'Loading...';

  isNewSale: boolean;

  showPageData = false;

  removedProducts: any[] = [];

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
    private usersApi: ApiUserService,
    private sharedComponents: SharedComponentsService,
    private route: ActivatedRoute,
    public utils: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.saleId = this.route.snapshot.paramMap.get('id');
    // this.isNewSale = this.saleId ? false : true;
    // if (!this.isNewSale) {
    //   forkJoin(
    //     this.saleApi.getSale(this.saleId),
    //     // this.productApi.getProducts(),
    //     this.paymentMethodApi.getPaymentMethods(),
    //     this.usersApi.getUsers()
    //   ).subscribe((res) => {
    //     // const [saleRes, productRes, paymentMethodRes, userRes] = res;
    //     // this.sale = saleRes.res;
    //     // this.products = productRes.res;
    //     // this.paymentMethods = paymentMethodRes.res;
    //     // this.users = userRes.res;
    //     // this.mongodbMongooseTime = this.utils.getGreatestTime([
    //     //   saleRes.time,
    //     //   productRes.time,
    //     //   paymentMethodRes.time,
    //     //   userRes.time,
    //     // ]);
    //     // this.sale.products = this.removeExcludedProducts();
    //     // this.createSaleForm();
    //     // this.listenSearchInputChages();
    //     // this.listenProductChanges();
    //     // this.initFormControlsData();
    //     // this.activateFilters();
    //     // this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
    //     // this.pageTitle = 'Edit sale';
    //     // this.showPageData = true;
    //   });
    // } else {
    //   forkJoin(
    //     // this.productApi.getProducts(),
    //     this.paymentMethodApi.getPaymentMethods(),
    //     this.usersApi.getUsers()
    //   ).subscribe((res) => {
    //     // const [productRes, paymentMethodRes, userRes] = res;
    //     // this.products = productRes.res;
    //     // this.paymentMethods = paymentMethodRes.res;
    //     // this.users = userRes.res;
    //     // this.mongodbMongooseTime = this.utils.getGreatestTime([productRes.time, paymentMethodRes.time, userRes.time]);
    //     // this.createSaleForm();
    //     // this.listenSearchInputChages();
    //     // this.listenProductChanges();
    //     // this.addProduct();
    //     // this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
    //     // this.pageTitle = 'New sale';
    //     // this.showPageData = true;
    //   });
    // }
  }

  // get saleStatusArr(): string[] {
  //   return Object.keys(this.saleStatus);
  // }

  // getSaleStatusText(code: string): string {
  //   return this.saleStatus[code];
  // }

  // setProductsDataSource(formArray: FormArray): void {
  //   const controls = formArray.controls;
  //   this.productsDataSource = new MatTableDataSource(controls);
  // }

  // createSaleForm(): void {
  //   this.saleForm = this.fb.group({
  //     customer: null,
  //     status: ['300', Validators.required],
  //     date: new Date(),
  //     seller: null,
  //     products: this.fb.array([], Validators.required),
  //     paymentMethod: this.fb.group(
  //       {
  //         paymentMethodRef: [null, Validators.required],
  //         name: [null, Validators.required],
  //       },
  //       Validators.required
  //     ),
  //   });
  // }

  // initFormControlsData(): void {
  //   this.saleForm.reset();
  //   this.saleForm.patchValue(this.sale);
  //   this.sale.products.forEach((product: any) => {
  //     this.addProduct(product);
  //   });
  //   this.paymentMethodFormControl.setValue(this.saleForm.get('paymentMethod').value);
  //   this.sellerFormControl.setValue(this.saleForm.get('seller').value);
  // }

  // activateFilters(): void {
  //   const control = <FormArray>this.saleForm.get('products');
  //   control.value.forEach((product: any, index: number) => {
  //     this.searchInputs[index].setValue(product);
  //   });
  // }

  // removeExcludedProducts(): any[] {
  //   return this.sale.products.filter((product) => {
  //     if (product.productRef) {
  //       return true;
  //     } else {
  //       this.removedProducts.push(`(${product.sku}) ${product.name}`);
  //       return false;
  //     }
  //   });
  // }

  // listenSearchInputChages(): void {
  //   this.searchInputs.forEach((searchInput, index) => {
  //     this.filteredProductsArray$[index] = searchInput.valueChanges.pipe(
  //       startWith(''),
  //       map((value: any) => (typeof value === 'object' ? value?.name : value)),
  //       map((value: any) => (value ? this.filterProducts(value) : this.products.slice()))
  //     );
  //   });
  // }

  // filterProducts(name: string): IOperationProduct[] {
  //   const value = name.toLowerCase();
  //   return this.products.filter((product) => {
  //     const nameStr = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  //     const normalizedProductStr = `(${product.sku}) ${nameStr}`;
  //     const optionStr = `(${product.sku}) ${product.name}`;
  //     return normalizedProductStr.toLowerCase().includes(value) || optionStr.toLowerCase().includes(value);
  //   });
  // }

  // listenProductChanges(): void {
  //   const control = <FormArray>this.saleForm.get('products');
  //   control.valueChanges.subscribe(() => this.calculateTotalValue());
  // }

  // calculateTotalValue(): void {
  //   const control = <FormArray>this.saleForm.get('products');
  //   const value = control.value.reduce((value, product) => (value += product.amount * product.price), 0) || 0;
  //   this.totalValue = this.utils.round(value, 2);
  // }

  // displayProduct(product: IOperationProduct): string {
  //   return product ? `(${product.sku}) ${product.name}` : '';
  // }

  // createProduct(product: any = null): FormGroup {
  //   return this.fb.group({
  //     productRef: [product?.productRef || product?._id || null, Validators.required],
  //     sku: [product?.sku || null, Validators.required],
  //     name: [product?.name || null, Validators.required],
  //     category: product?.category || null,
  //     unit: product?.unit || null,
  //     amount: [{ value: product?.amount || null, disabled: product ? false : true }, Validators.required],
  //     price: [{ value: product?.price || null, disabled: product ? false : true }, Validators.required],
  //     subtotal: product?.amount && product.price ? product.amount * product.price : null,
  //   });
  // }

  // addProduct(product: any = null): void {
  //   this.addSearchInput();
  //   this.addFilteredProducts$();
  //   const control = <FormArray>this.saleForm.get('products');
  //   control.push(this.createProduct(product));
  //   this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
  //   this.listenSearchInputChages();
  // }

  // removeProduct(index: number): void {
  //   const control = this.utils.getFormArrayControl(this.saleForm, ['products']);
  //   control.removeAt(index);
  //   this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
  //   this.removerSearchInput(index);
  //   this.removerFilteredProducts$(index);
  //   this.listenSearchInputChages();
  // }

  // addSearchInput(): void {
  //   this.searchInputs.push(new FormControl(null, Validators.required));
  // }

  // addFilteredProducts$(): void {
  //   this.filteredProductsArray$.push(of([]));
  // }

  // removerSearchInput(index: number): void {
  //   this.searchInputs = this.searchInputs.filter((_, i) => i !== index);
  // }

  // removerFilteredProducts$(index: number): void {
  //   this.filteredProductsArray$ = this.filteredProductsArray$.filter((_, i) => i !== index);
  // }

  // handleProductSelection(product: any, index: number): void {
  //   const control = <FormArray>this.saleForm.get('products');
  //   const productAlreadyAdded = control.value.find((addedProduct) => addedProduct.productRef === product._id);
  //   if (productAlreadyAdded) {
  //     this.sharedComponents.openSnackbarWarning('Product already added');
  //     control.at(index).reset();
  //     this.searchInputs[index].reset();
  //   } else {
  //     this.initProductData(product, index);
  //   }
  // }

  // initProductData(product: any, index: number): void {
  //   const controle = <FormArray>this.saleForm.get('products');
  //   const productFormValue = {
  //     ...product,
  //     productRef: product._id,
  //     amount: 1,
  //     price: product.salePrice,
  //     subtotal: product.salePrice,
  //   };
  //   if (product.unit) {
  //     productFormValue.unit = {
  //       unitRef: product.unit._id,
  //       shortUnit: product.unit.shortUnit,
  //     };
  //   }
  //   controle.at(index).patchValue(productFormValue);
  //   controle.at(index).get('amount').enable();
  //   controle.at(index).get('price').enable();
  // }

  // getProductTotalValue(index: number): number {
  //   const control = <FormArray>this.saleForm.get('products');
  //   const amount = control.at(index).get('amount').value;
  //   const price = control.at(index).get('price').value;
  //   return this.utils.round(amount * price, 2) || 0;
  // }

  // validateAmount(index: number): void {
  //   const control = <FormArray>this.saleForm.get('products');
  //   const amount = control.at(index).get('amount').value;
  //   if (amount <= 0) {
  //     this.sharedComponents.openSnackbarWarning('Invalid amount');
  //     control.at(index).patchValue({ amount: 1 });
  //   }
  // }

  // validatePrice(index: number): void {
  //   const controle = <FormArray>this.saleForm.get('products');
  //   const price = controle.at(index).get('price').value;
  //   if (price <= 0) {
  //     this.sharedComponents.openSnackbarWarning('Invalid price');
  //     controle.at(index).patchValue({ price: controle.at(index).get('price').value });
  //   }
  // }

  // isLastFormArrayItemInvalid(): boolean {
  //   const control = <FormArray>this.saleForm.get('products');
  //   return control.at(control.length - 1).invalid;
  // }

  // handlePaymentMethodSelection(payment: any): void {
  //   const paymentMethodFormValue = { ...payment, paymentMethodRef: payment._id };
  //   this.saleForm.get('paymentMethod').patchValue(paymentMethodFormValue);
  // }

  // handleSellerSelection(seller: IUser): void {
  //   this.saleForm.get('seller').setValue(seller._id);
  // }

  // comparePaymentMethod(option: any, selection: any) {
  //   return (
  //     option &&
  //     selection &&
  //     (option._id === selection.paymentMethodRef || option.paymentMethodRef === selection.paymentMethodRef)
  //   );
  // }

  // compareSeller(option: any, selection: any) {
  //   return option && selection && option._id === selection._id;
  // }

  // saveSale(): void {
  //   if (this.saleForm.invalid) {
  //     this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
  //   } else {
  //     if (this.isNewSale) {
  //       const sale = this.saleForm.value;
  //       this.sharedComponents
  //         .openLoadingDialog(this.saleApi.createSale(sale))
  //         .beforeClosed()
  //         .subscribe((saleRes: IHttpRes) => {
  //           if (saleRes) {
  //             this.router.navigate(['/sales', 'edit', saleRes.res._id]);
  //           }
  //         });
  //     } else {
  //       const sale = this.saleForm.value;
  //       this.sharedComponents
  //         .openLoadingDialog(this.saleApi.editSale(this.saleId, sale))
  //         .beforeClosed()
  //         .subscribe((saleRes: IHttpRes) => {
  //           if (saleRes) {
  //             this.ngOnInit();
  //           }
  //         });
  //     }
  //   }
  // }

  // removeSale(): void {
  //   const message = '<p>This sale will be removed. Product amount will be recovered. Are you sure?</p>';
  //   this.sharedComponents
  //     .openDialogConfirmation('warning', 'warn', 'Remove sale', message, 'Remove sale')
  //     .beforeClosed()
  //     .pipe(
  //       switchMap((confirmation: IConfirmation) => {
  //         if (confirmation?.confirmed) {
  //           return this.sharedComponents.openLoadingDialog(this.saleApi.removeSale(this.saleId)).beforeClosed();
  //         }
  //         return of();
  //       })
  //     )
  //     .subscribe((res: any) => {
  //       if (res) {
  //         this.router.navigate(['/sales']);
  //       }
  //     });
  // }
}
