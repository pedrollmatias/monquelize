import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { FormGroup, AbstractControl, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IOperationProduct } from 'src/app/shared/models/operation-product.model';
import { IPaymentMethod } from 'src/app/shared/models/payment-method.model';
import { IUser } from 'src/app/shared/models/user.model';
import { Observable, forkJoin, of } from 'rxjs';
import { ApiPurchaseService } from 'src/app/core/api/api-purchase.service';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';
import { ApiUserService } from 'src/app/core/api/api-user.service';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, map, switchMap } from 'rxjs/operators';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { IConfirmation } from 'src/app/shared/models/confirmation.model';

export const PURCHASE_STATUS_ENUM = {
  '100': 'Draft',
  '300': 'Done',
  '400': 'Canceled',
};

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss'],
})
export class PurchaseDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Purchase', path: '/purchases', isLink: true }];

  purchaseId: string;
  purchase: any;
  products: IOperationProduct[];
  paymentMethods: IPaymentMethod[];
  users: IUser[];

  mongodbMongooseTime: number;

  purchaseForm: FormGroup;
  paymentMethodFormControl = new FormControl(null, Validators.required);
  buyerFormControl = new FormControl();
  totalValue = 0;

  pageTitle = 'Loading...';

  isNewPurchase: boolean;

  showPageData = false;

  removedProducts: any[] = [];

  purchaseStatus = PURCHASE_STATUS_ENUM;
  productsDataSource: MatTableDataSource<AbstractControl>;
  productTableColumns = ['product', 'amount', 'value', 'subtotal', 'remove'];

  searchInputs: FormControl[] = [];
  filteredProductsArray$: Observable<any[]>[] = new Array();

  constructor(
    private fb: FormBuilder,
    private purchaseApi: ApiPurchaseService,
    private productApi: ApiProductService,
    private paymentMethodApi: ApiPaymentMethodService,
    private usersApi: ApiUserService,
    private sharedComponents: SharedComponentsService,
    private route: ActivatedRoute,
    public utils: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.purchaseId = this.route.snapshot.paramMap.get('id');
    this.isNewPurchase = this.purchaseId ? false : true;
    if (!this.isNewPurchase) {
      forkJoin(
        this.purchaseApi.getPurchase(this.purchaseId),
        this.productApi.getProducts(),
        this.paymentMethodApi.getPaymentMethods(),
        this.usersApi.getUsers()
      ).subscribe((res) => {
        const [purchaseRes, productRes, paymentMethodRes, userRes] = res;
        this.purchase = purchaseRes.res;
        this.products = productRes.res;
        this.paymentMethods = paymentMethodRes.res;
        this.users = userRes.res;
        this.mongodbMongooseTime = this.utils.getGreatestTime([
          purchaseRes.time,
          productRes.time,
          paymentMethodRes.time,
          userRes.time,
        ]);
        this.purchase.products = this.removeExcludedProducts();
        this.createPurchaseForm();
        this.listenSearchInputChages();
        this.listenProductChanges();
        this.initFormControlsData();
        this.activateFilters();
        this.setProductsDataSource(this.utils.getFormArrayControl(this.purchaseForm, ['products']));
        this.pageTitle = 'Edit purchase';
        this.showPageData = true;
      });
    } else {
      forkJoin(
        this.productApi.getProducts(),
        this.paymentMethodApi.getPaymentMethods(),
        this.usersApi.getUsers()
      ).subscribe((res) => {
        const [productRes, paymentMethodRes, userRes] = res;
        this.products = productRes.res;
        this.paymentMethods = paymentMethodRes.res;
        this.users = userRes.res;
        this.mongodbMongooseTime = this.utils.getGreatestTime([productRes.time, paymentMethodRes.time, userRes.time]);
        this.createPurchaseForm();
        this.listenSearchInputChages();
        this.listenProductChanges();
        this.addProduct();
        this.setProductsDataSource(this.utils.getFormArrayControl(this.purchaseForm, ['products']));
        this.pageTitle = 'New purchase';
        this.showPageData = true;
      });
    }
  }

  get purchaseStatusArr(): string[] {
    return Object.keys(this.purchaseStatus);
  }

  getPurchaseStatusText(code: string): string {
    return this.purchaseStatus[code];
  }

  setProductsDataSource(formArray: FormArray): void {
    const controls = formArray.controls;
    this.productsDataSource = new MatTableDataSource(controls);
  }

  createPurchaseForm(): void {
    this.purchaseForm = this.fb.group({
      vendor: null,
      status: ['300', Validators.required],
      date: new Date(),
      buyer: null,
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

  initFormControlsData(): void {
    this.purchaseForm.reset();
    this.purchaseForm.patchValue(this.purchase);
    this.purchase.products.forEach((product: any) => {
      this.addProduct(product);
    });
    this.paymentMethodFormControl.setValue(this.purchaseForm.get('paymentMethod').value);
    this.buyerFormControl.setValue(this.purchaseForm.get('buyer').value);
  }

  activateFilters(): void {
    const control = <FormArray>this.purchaseForm.get('products');
    control.value.forEach((product: any, index: number) => {
      this.searchInputs[index].setValue(product);
    });
  }

  removeExcludedProducts(): any[] {
    return this.purchase.products.filter((product) => {
      if (product.productRef) {
        return true;
      } else {
        this.removedProducts.push(`(${product.sku}) ${product.name}`);
        return false;
      }
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

  filterProducts(name: string): IOperationProduct[] {
    const value = name.toLowerCase();
    return this.products.filter((product) => {
      const nameStr = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedProductStr = `(${product.sku}) ${nameStr}`;
      const optionStr = `(${product.sku}) ${product.name}`;
      return normalizedProductStr.toLowerCase().includes(value) || optionStr.toLowerCase().includes(value);
    });
  }

  listenProductChanges(): void {
    const control = <FormArray>this.purchaseForm.get('products');
    control.valueChanges.subscribe(() => this.calculateTotalValue());
  }

  calculateTotalValue(): void {
    const control = <FormArray>this.purchaseForm.get('products');
    const value = control.value.reduce((value, product) => (value += product.amount * product.price), 0) || 0;
    this.totalValue = this.utils.round(value, 2);
  }

  displayProduct(product: IOperationProduct): string {
    return product ? `(${product.sku}) ${product.name}` : '';
  }

  createProduct(product: any = null): FormGroup {
    return this.fb.group({
      productRef: [product?.productRef || product?._id || null, Validators.required],
      sku: [product?.sku || null, Validators.required],
      name: [product?.name || null, Validators.required],
      category: product?.category || null,
      unit: product?.unit || null,
      amount: [{ value: product?.amount || null, disabled: product ? false : true }, Validators.required],
      price: [{ value: product?.price || null, disabled: product ? false : true }, Validators.required],
      subtotal: product?.amount && product.price ? product.amount * product.price : null,
    });
  }

  addProduct(product: any = null): void {
    this.addSearchInput();
    this.addFilteredProducts$();
    const control = <FormArray>this.purchaseForm.get('products');
    control.push(this.createProduct(product));
    this.setProductsDataSource(this.utils.getFormArrayControl(this.purchaseForm, ['products']));
    this.listenSearchInputChages();
  }

  removeProduct(index: number): void {
    const control = this.utils.getFormArrayControl(this.purchaseForm, ['products']);
    control.removeAt(index);
    this.setProductsDataSource(this.utils.getFormArrayControl(this.purchaseForm, ['products']));
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
    const control = <FormArray>this.purchaseForm.get('products');
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
    const controle = <FormArray>this.purchaseForm.get('products');
    const productFormValue = {
      ...product,
      productRef: product._id,
      amount: 1,
      price: product.costPrice || 0,
      subtotal: product.purchasePrice,
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
    const control = <FormArray>this.purchaseForm.get('products');
    const amount = control.at(index).get('amount').value;
    const price = control.at(index).get('price').value;
    return this.utils.round(amount * price, 2) || 0;
  }

  validateAmount(index: number): void {
    const control = <FormArray>this.purchaseForm.get('products');
    const amount = control.at(index).get('amount').value;
    if (amount <= 0) {
      this.sharedComponents.openSnackbarWarning('Invalid amount');
      control.at(index).patchValue({ amount: 1 });
    }
  }

  validatePrice(index: number): void {
    const controle = <FormArray>this.purchaseForm.get('products');
    const price = controle.at(index).get('price').value;
    if (price <= 0) {
      this.sharedComponents.openSnackbarWarning('Invalid price');
      controle.at(index).patchValue({ price: controle.at(index).get('price').value });
    }
  }

  isLastFormArrayItemInvalid(): boolean {
    const control = <FormArray>this.purchaseForm.get('products');
    return control.at(control.length - 1).invalid;
  }

  handlePaymentMethodSelection(payment: any): void {
    const paymentMethodFormValue = { ...payment, paymentMethodRef: payment._id };
    this.purchaseForm.get('paymentMethod').patchValue(paymentMethodFormValue);
  }

  handleBuyerSelection(buyer: IUser): void {
    this.purchaseForm.get('buyer').setValue(buyer._id);
  }

  comparePaymentMethod(option: any, selection: any) {
    return (
      option &&
      selection &&
      (option._id === selection.paymentMethodRef || option.paymentMethodRef === selection.paymentMethodRef)
    );
  }

  compareBuyer(option: any, selection: any) {
    return option && selection && option._id === selection._id;
  }

  savePurchase(): void {
    if (this.purchaseForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      if (this.isNewPurchase) {
        const purchase = this.purchaseForm.value;
        this.sharedComponents
          .openLoadingDialog(this.purchaseApi.createPurchase(purchase))
          .beforeClosed()
          .subscribe((purchaseRes: IHttpRes) => {
            if (purchaseRes) {
              this.router.navigate(['/purchases', 'edit', purchaseRes.res._id]);
            }
          });
      } else {
        const purchase = this.purchaseForm.value;
        this.sharedComponents
          .openLoadingDialog(this.purchaseApi.editPurchase(this.purchaseId, purchase))
          .beforeClosed()
          .subscribe((purchaseRes: IHttpRes) => {
            if (purchaseRes) {
              this.ngOnInit();
            }
          });
      }
    }
  }

  removePurchase(): void {
    const message = '<p>This purchase will be removed. Product amount will be recovered. Are you sure?</p>';
    this.sharedComponents
      .openDialogConfirmation('warning', 'warn', 'Remove purchase', message, 'Remove purchase')
      .beforeClosed()
      .pipe(
        switchMap((confirmation: IConfirmation) => {
          if (confirmation?.confirmed) {
            return this.sharedComponents
              .openLoadingDialog(this.purchaseApi.removePurchase(this.purchaseId))
              .beforeClosed();
          }
          return of();
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.router.navigate(['/purchases']);
        }
      });
  }
}
