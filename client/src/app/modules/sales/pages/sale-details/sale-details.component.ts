import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/core/services/utils.service';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ApiPaymentMethodService } from 'src/app/core/api/api-payment-method.service';
import { forkJoin, Observable, of } from 'rxjs';
import { IPaymentMethod, IProduct, ISale } from 'src/app/shared/models/views.model';
import { IOperationProduct } from 'src/app/shared/models/views.model';
import { startWith, map, switchMap } from 'rxjs/operators';
import { ApiSaleService } from 'src/app/core/api/api-sale.service';
import { IConfirmation } from 'src/app/shared/models/confirmation.model';
import { ApiUserService } from 'src/app/core/api/api-user.service';
import { IUser } from 'src/app/shared/models/views.model';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IPaths } from 'src/app/shared/models/paths.model';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';

declare interface IInitialRequests {
  sale?: Observable<IHttpResponse>;
  products: Observable<IHttpResponse>;
  paymentMethods: Observable<IHttpResponse>;
  users: Observable<IHttpResponse>;
}
declare interface IInitialResponse {
  sale?: IHttpResponse;
  products: IHttpResponse;
  paymentMethods: IHttpResponse;
  users: IHttpResponse;
}

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.scss'],
})
export class SaleDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Sales', path: '/sales', isLink: true }];

  databaseTimes: IDatabaseTimes;

  products: IOperationProduct[];
  paymentMethods: IPaymentMethod[];
  users: IUser[];

  saleId: string;
  associatedIds: IAssociatedIds;
  sale: ISale;

  endpointPaths: IPaths;

  saleForm: FormGroup;

  pageTitle = 'Loading...';

  isNewSale: boolean;

  showPageData = false;
  showLoadingArea = false;

  paymentMethodFormControl = new FormControl(null, Validators.required);
  sellerFormControl = new FormControl();
  totalValue = 0;

  removedProducts: any[] = [];

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
    this.saleId = this.route.snapshot.paramMap.get('id');
    this.isNewSale = this.saleId ? false : true;
    if (!this.isNewSale) {
      this.showLoadingArea = true;
      this.route.params
        .pipe(
          switchMap((params) => {
            this.associatedIds = this.getAssociatedIds(params);
            this.endpointPaths = this.utils.getEndpointPaths('/sales', this.associatedIds);
            const initialRequests: IInitialRequests = {
              sale: this.saleApi.getSale(this.endpointPaths),
              products: this.productApi.getProducts(),
              paymentMethods: this.paymentMethodApi.getPaymentMethods(),
              users: this.usersApi.getUsers(),
            };
            return forkJoin(initialRequests);
          })
        )
        .subscribe((res: IInitialResponse) => {
          this.databaseTimes = this.utils.setGreatestTimes(res);
          const { sale: saleRes, products: productsRes, paymentMethods: paymentMethodsRes, users: usersRes } = res;
          this.products = this.getProducts(productsRes);
          this.paymentMethods = this.getPaymentMethods(paymentMethodsRes);
          this.users = this.getUsers(usersRes);
          this.sale = this.getSale(saleRes);
          this.sale.products = this.removeExcludedProducts();
          this.createSaleForm();
          this.listenSearchInputChages();
          this.listenProductChanges();
          this.initFormControlsData();
          this.activateFilters();
          this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
          this.pageTitle = 'Edit sale';
          this.showPageData = true;
        });
    } else {
      const initialRequests: IInitialRequests = {
        products: this.productApi.getProducts(),
        paymentMethods: this.paymentMethodApi.getPaymentMethods(),
        users: this.usersApi.getUsers(),
      };
      forkJoin(initialRequests).subscribe((res: IInitialResponse) => {
        this.databaseTimes = this.utils.setGreatestTimes(res);
        const { products: productsRes, paymentMethods: paymentMethodsRes, users: usersRes } = res;
        this.products = this.getProducts(productsRes);
        this.paymentMethods = this.getPaymentMethods(paymentMethodsRes);
        this.users = this.getUsers(usersRes);
        this.createSaleForm();
        this.listenSearchInputChages();
        this.listenProductChanges();
        this.addProduct();
        this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
        this.pageTitle = 'New sale';
        this.showPageData = true;
      });
    }
  }

  getAssociatedIds(params: Params): IAssociatedIds {
    return { mongodbMongooseId: params.id, postgresSequelizeId: params.postgresSequelize };
  }

  getSale(res: IHttpResponse): ISale {
    const sale = res.mongodbMongoose.res;

    const paymentMethodAssociatedIds = this.paymentMethods.find(
      (paymentMethod) => paymentMethod.name === sale.paymentMethodName
    )?.associatedIds;
    sale.paymentMethod = { ...sale.paymentMethod, associatedIds: paymentMethodAssociatedIds };

    if (sale.seller) {
      const sellerAssociatedIds = this.users.find((user) => user.username === sale.seller.username)?.associatedIds;
      sale.seller = { ...sale.seller, associatedIds: sellerAssociatedIds };
    }

    sale.products = sale.products.map((product: IProduct) => {
      const productAssociatedId = this.products.find((_product) => _product.sku === product.sku)?.associatedIds;

      return { ...product, associatedIds: productAssociatedId };
    });

    return { ...sale, associatedIds: this.associatedIds };
  }

  getProducts(res: IHttpResponse): IOperationProduct[] {
    const productByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(productByServer, 'sku');
  }

  getPaymentMethods(res: IHttpResponse): IPaymentMethod[] {
    const paymentMethodsByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(paymentMethodsByServer, 'name');
  }

  getUsers(res: IHttpResponse): IUser[] {
    const usersByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(usersByServer, 'username');
  }

  setProductsDataSource(formArray: FormArray): void {
    const controls = formArray.controls;
    this.productsDataSource = new MatTableDataSource(controls);
  }

  createSaleForm(): void {
    this.saleForm = this.fb.group({
      customer: null,
      date: new Date(),
      products: this.fb.array([], Validators.required),
      paymentMethod: this.fb.group(
        {
          associatedIds: [null, Validators.required],
          paymentMethodRef: [null, Validators.required],
          name: [null, Validators.required],
        },
        Validators.required
      ),
      seller: null,
    });
  }

  initFormControlsData(): void {
    this.saleForm.reset();
    this.saleForm.patchValue(this.sale);
    this.sale.products.forEach((product: any) => {
      this.addProduct(product);
    });

    this.paymentMethodFormControl.setValue(this.saleForm.get('paymentMethod').value);
    this.sellerFormControl.setValue(this.saleForm.get('seller').value);
  }

  activateFilters(): void {
    const control = <FormArray>this.saleForm.get('products');
    control.value.forEach((product: any, index: number) => {
      this.searchInputs[index].setValue(product);
    });
  }

  removeExcludedProducts(): any[] {
    return this.sale.products.filter((product) => {
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
    const control = <FormArray>this.saleForm.get('products');
    control.valueChanges.subscribe(() => this.calculateTotalValue());
  }

  calculateTotalValue(): void {
    const control = <FormArray>this.saleForm.get('products');
    const value = control.value.reduce((value, product) => (value += product.amount * product.price), 0) || 0;
    this.totalValue = this.utils.round(value, 2);
  }

  displayProduct(product: IOperationProduct): string {
    return product ? `(${product.sku}) ${product.name}` : '';
  }

  createProduct(product: any = null): FormGroup {
    return this.fb.group({
      associatedIds: product?.associatedIds,
      productRef: [product?.productRef || product?._id || null, Validators.required],
      sku: [product?.sku || null, Validators.required],
      name: [product?.name || null, Validators.required],
      category: product?.category?._id || null,
      unitRef: product?.unit?._id || null,
      shortUnit: product?.unit?._id || null,
      amount: [{ value: product?.amount || null, disabled: product ? false : true }, Validators.required],
      price: [{ value: product?.price || null, disabled: product ? false : true }, Validators.required],
      subtotal: product?.amount && product.price ? product.amount * product.price : null,
    });
  }

  addProduct(product: any = null): void {
    this.addSearchInput();
    this.addFilteredProducts$();
    const control = <FormArray>this.saleForm.get('products');
    control.push(this.createProduct(product));
    this.setProductsDataSource(this.utils.getFormArrayControl(this.saleForm, ['products']));
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
      unitRef: product.unit._id,
      shortUnit: product.unit.shortUnit,
      price: product.salePrice,
      subtotal: product.salePrice,
    };

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
    return control.at(control.length - 1)?.invalid;
  }

  handlePaymentMethodSelection(payment: IPaymentMethod): void {
    const paymentMethodFormValue = { ...payment, paymentMethodRef: payment._id };
    this.saleForm.get('paymentMethod').patchValue(paymentMethodFormValue);
  }

  handleSellerSelection(seller: IUser): void {
    this.saleForm.get('seller').setValue(seller);
  }

  comparePaymentMethod(option: any, selection: any) {
    return (
      option &&
      selection &&
      (option._id === selection.paymentMethodRef || option.paymentMethodRef === selection.paymentMethodRef)
    );
  }

  compareSeller(option: any, selection: any) {
    return option && selection && option._id === selection._id;
  }

  saveSale(): void {
    if (this.saleForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      const sale = { ...this.saleForm.value, timestamp: new Date().getTime() };
      if (this.isNewSale) {
        this.sharedComponents
          .openLoadingDialog(this.saleApi.createSale(sale))
          .beforeClosed()
          .subscribe((res: IHttpResponse) => {
            const params = {
              postgresSequelize: res.postgresSequelize.res._id,
            };
            this.router.navigateByUrl('/sales');
          });
      } else {
        this.sharedComponents
          .openLoadingDialog(this.saleApi.editSale(this.endpointPaths, sale))
          .beforeClosed()
          .subscribe((res: IHttpResponse) => {
            this.ngOnInit();
          });
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
            return this.sharedComponents.openLoadingDialog(this.saleApi.removeSale(this.endpointPaths)).beforeClosed();
          }
          return of();
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.router.navigate(['/sales']);
        }
      });
  }
}
