import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { forkJoin, of } from 'rxjs';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { ApiUnitService } from 'src/app/core/api/api-unit.service';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ICategory } from 'src/app/shared/models/category.model';
import { IUnit } from 'src/app/shared/models/unit.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product.model';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { switchMap } from 'rxjs/operators';
import { IConfirmation } from 'src/app/shared/models/confirmation.model';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Products', path: '/products', isLink: true }];

  categories: ICategory[];
  units: IUnit[];

  mongodbMongooseTime: number;

  productId: string;
  product: IProduct;

  productForm: FormGroup;

  pageTitle = 'Loading...';

  isNewProduct: boolean;

  showPageData = false;

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
      forkJoin(
        this.productApi.getProduct(this.productId),
        this.categoryApi.getCategories(),
        this.unitApi.getUnits()
      ).subscribe((res) => {
        const [productRes, categoryRes, unitRes] = res;
        this.product = productRes.res;
        this.categories = categoryRes.res;
        this.units = unitRes.res;
        this.mongodbMongooseTime = this.utils.getGreatestTime([categoryRes.time, unitRes.time]);
        this.pageTitle = 'Edit product';
        this.createProductForm();
        this.initFormData(this.product);
        this.showPageData = true;
      });
    } else {
      forkJoin(this.categoryApi.getCategories(), this.unitApi.getUnits()).subscribe((res) => {
        const [categoryRes, unitRes] = res;
        this.categories = categoryRes.res;
        this.units = unitRes.res;
        this.mongodbMongooseTime = this.utils.getGreatestTime([categoryRes.time, unitRes.time]);
        this.pageTitle = 'New product';
        this.createProductForm();
        this.showPageData = true;
      });
    }
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
      inventory: this.fb.group({
        currentAmount: [0, Validators.required],
        minAmount: [0, [Validators.required, Validators.min(0)]],
        maxAmount: [null, Validators.min(0)],
      }),
    });
  }

  initFormData(product: IProduct): void {
    this.productForm.reset();
    this.productForm.patchValue(product);
  }

  compareSelect(option: any, selection: any) {
    return option?._id === selection?._id;
  }

  generateSKU(): string {
    return Date.now().toString(16).split('').reverse().join('').toUpperCase();
  }

  formatProduct(product: any): IProduct {
    product.category = product.category?._id || undefined;
    product.unit = product.unit?._id;
    return product;
  }

  refreshPage(): void {
    this.ngOnInit();
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      if (this.isNewProduct) {
        const product = this.formatProduct(this.productForm.value);
        this.sharedComponents
          .openLoadingDialog(this.productApi.createProduct(product))
          .beforeClosed()
          .subscribe((productRes: IHttpRes) => {
            this.router.navigate(['/products', 'edit', productRes.res._id]);
          });
      } else {
        const product = this.formatProduct(this.productForm.value);
        this.sharedComponents
          .openLoadingDialog(this.productApi.editProduct(this.productId, product))
          .beforeClosed()
          .subscribe((productRes) => {
            this.initFormData(productRes.res);
          });
      }
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
              .openLoadingDialog(this.productApi.removeProduct(this.productId))
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
