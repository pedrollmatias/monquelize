import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { forkJoin } from 'rxjs';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { ApiUnitService } from 'src/app/core/api/api-unit.service';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ICategory } from 'src/app/shared/models/category.model';
import { IUnit } from 'src/app/shared/models/unit.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product.model';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { IHttpRes } from 'src/app/shared/models/http-res.model';

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

  dataReady = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiCategory: ApiCategoryService,
    private apiUnit: ApiUnitService,
    private apiProduct: ApiProductService,
    private sharedComponents: SharedComponentsService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isNewProduct = this.productId ? false : true;
    if (!this.isNewProduct) {
    } else {
      forkJoin(this.apiCategory.getCategories(), this.apiUnit.getUnits()).subscribe((res) => {
        const [categoryRes, unitRes] = res;
        this.categories = categoryRes.res;
        this.units = unitRes.res;
        this.mongodbMongooseTime = this.getGreatestTime([categoryRes.time, unitRes.time]);
        this.pageTitle = 'New product';
        this.createProductForm();
        this.dataReady = true;
      });
    }
  }

  getGreatestTime(times: number[]) {
    return times.reduce((acc, value) => (acc > value ? acc : value));
  }

  createProductForm(): void {
    this.productForm = this.fb.group({
      sku: [this.generateSKU(), Validators.required],
      name: [null, Validators.required],
      description: null,
      category: '',
      unit: ['', Validators.required],
      salePrice: [null, Validators.required],
      costPrice: [null],
      inventory: this.fb.group({
        currentAmount: [0, Validators.required],
        minAmount: [0, [Validators.required, Validators.min(0)]],
        maxAmount: [null, Validators.min(0)],
      }),
    });
  }

  generateSKU(): string {
    return Date.now().toString(16).split('').reverse().join('').toUpperCase();
  }

  formatProduct(product: any): IProduct {
    product.category = product.category?._id || undefined;
    product.unit = product.unit?._id;
    return product;
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.sharedComponents.openSnackbarWarning('There are fields with invalid values');
    } else {
      const product = this.formatProduct(this.productForm.value);
      this.apiProduct.createProduct(product).subscribe((res: IHttpRes) => {
        console.log(res);
      });
    }
  }
}
