import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { ApiUnitService } from 'src/app/core/api/api-unit.service';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ICategory } from 'src/app/shared/models/views.model';
import { IUnit } from 'src/app/shared/models/views.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IProduct } from 'src/app/shared/models/views.model';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { switchMap } from 'rxjs/operators';
import { IConfirmation } from 'src/app/shared/models/confirmation.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';

declare interface IInitialRequests {
  product?: Observable<IHttpResponse>;
  category: Observable<IHttpResponse>;
  unit: Observable<IHttpResponse>;
}

declare interface IInitialResponse {
  product?: IHttpResponse;
  category: IHttpResponse;
  unit: IHttpResponse;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Products', path: '/products', isLink: true }];

  databaseTimes: IDatabaseTimes;

  categories: ICategory[];
  units: IUnit[];

  productId: string;
  associatedIds: IAssociatedIds;
  product: IProduct;

  endpointPaths: IPaths;

  productForm: FormGroup;

  pageTitle = 'Loading...';

  isNewProduct: boolean;

  showPageData = false;
  showLoadingArea = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoryApi: ApiCategoryService,
    private unitApi: ApiUnitService,
    private productApi: ApiProductService,
    private sharedComponents: SharedComponentsService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isNewProduct = this.productId ? false : true;
    if (!this.isNewProduct) {
      this.showLoadingArea = true;
      this.route.params
        .pipe(
          switchMap((params) => {
            this.associatedIds = this.getAssociatedIds(params);
            this.endpointPaths = this.utils.getEndpointPaths('/products', this.associatedIds);
            const initialRequests: IInitialRequests = {
              category: this.categoryApi.getCategories(),
              unit: this.unitApi.getUnits(),
              product: this.productApi.getProduct(this.endpointPaths),
            };
            return forkJoin(initialRequests);
          })
        )
        .subscribe((res: IInitialResponse) => {
          this.databaseTimes = this.utils.setGreatestTimes(res);
          const { category: categoryRes, unit: unitRes, product: productRes } = res;
          this.categories = this.getCategories(categoryRes);
          this.units = this.getUnits(unitRes);
          this.product = this.getProduct(productRes);
          this.pageTitle = 'Edit product';
          this.createProductForm();
          this.initFormData(this.product);
          this.showPageData = true;
        });
    } else {
      const initialRequests: IInitialRequests = {
        category: this.categoryApi.getCategories(),
        unit: this.unitApi.getUnits(),
      };
      forkJoin(initialRequests).subscribe((res: IInitialResponse) => {
        this.databaseTimes = this.utils.setGreatestTimes(res);
        const { category: categoryRes, unit: unitRes } = res;
        this.categories = this.getCategories(categoryRes);
        this.units = this.getUnits(unitRes);
        this.pageTitle = 'New product';
        this.createProductForm();
        this.showPageData = true;
      });
    }
  }

  getAssociatedIds(params: Params): IAssociatedIds {
    return { mongodbMongooseId: params.id, postgresSequelizeId: params.postgresSequelize };
  }

  getCategories(res: IHttpResponse): ICategory[] {
    const categoriesByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(categoriesByServer, 'path');
  }

  getUnits(res: IHttpResponse): IUnit[] {
    const unitsByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(unitsByServer, 'unit');
  }

  getProduct(res: IHttpResponse): IProduct {
    const product = res.mongodbMongoose.res;

    if (product.unit) {
      product.unit.associatedIds = this.units.find((unit) => unit._id === product.unit._id)?.associatedIds;
    }

    if (product.category) {
      product.category.associatedIds = this.categories.find(
        (category) => category._id === product.category._id
      )?.associatedIds;
    }

    return { ...product, associatedIds: this.associatedIds };
  }

  createProductForm(): void {
    this.productForm = this.fb.group({
      sku: [this.generateSKU(), Validators.required],
      name: [null, Validators.required],
      description: null,
      category: null,
      unit: [null, Validators.required],
      salePrice: [null, Validators.required],
      costPrice: [null],
      currentAmount: [
        { value: null, disabled: !this.isNewProduct },
        this.isNewProduct ? [Validators.required, Validators.min(0)] : [],
      ],
      minAmount: [0, this.isNewProduct ? [Validators.required, Validators.min(0)] : []],
      maxAmount: [null, this.isNewProduct ? Validators.min(0) : []],
    });
  }

  generateSKU(): string {
    return Date.now().toString(16).split('').join('').toUpperCase();
  }

  initFormData(product: IProduct): void {
    this.productForm.reset();
    this.productForm.patchValue(product);
  }

  compareSelect(option: any, selection: any) {
    return option?._id === selection?._id;
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else if (this.isNewProduct) {
      const product = this.productForm.value;
      this.sharedComponents
        .openLoadingDialog(this.productApi.createProduct(product))
        .beforeClosed()
        .subscribe((res: IHttpResponse) => {
          const params = {
            postgresSequelize: res.postgresSequelize.res._id,
          };
          this.router.navigateByUrl('/products');
        });
    } else {
      const product = this.productForm.value;
      this.sharedComponents
        .openLoadingDialog(this.productApi.editProduct(this.endpointPaths, product))
        .beforeClosed()
        .subscribe((res: IHttpResponse) => {
          this.product = this.getProduct(res);
          this.initFormData(this.product);
        });
    }
  }

  removeProduct(): void {
    const message =
      '<p>This product will be removed. Your sales will not be affected, but all information about the product will be lost. Are you sure?</p>';
    this.sharedComponents
      .openDialogConfirmation('warning', 'warn', 'Remove product', message, 'Remove product')
      .beforeClosed()
      .pipe(
        switchMap((confirmation: IConfirmation) => {
          if (confirmation?.confirmed) {
            return this.sharedComponents
              .openLoadingDialog(this.productApi.removeProduct(this.endpointPaths))
              .beforeClosed();
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
