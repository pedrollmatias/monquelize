import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ApiSaleService } from 'src/app/core/api/api-sale.service';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';
import { ICategory, IOperationProduct } from 'src/app/shared/models/views.model';
import { DialogPaymentComponent } from '../../components/dialog-payment/dialog-payment.component';

const DEFAULT_AMOUNT = 1;

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss'],
})
export class NewSaleComponent implements OnInit {
  showPos = false;
  showData = false;

  categories: ICategory[];

  currentCategory: ICategory;
  currentCategories: ICategory[];
  currentParentCategories: ICategory[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  products: IOperationProduct[];
  productsList: IOperationProduct[] = [];
  totalValue = 0;

  destroy$: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private sharedComponents: SharedComponentsService,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.utils
      .multiRequests('GET', this.endpointPaths, { params: { getProducts: true } })
      .subscribe((res: IHttpResponse) => {
        this.databaseTimes = this.utils.setTimes(res);
        this.categories = this.getCategories(res);
        this.currentCategories = this.getRootCategories(this.categories);
        [this.currentCategory] = this.currentCategories;
        this.showData = true;
      });
  }

  get endpointPaths(): IPaths {
    return {
      mongodbMongoose: '/categories',
      postgresSequelize: '/categories/products',
    };
  }

  getCategories(res: IHttpResponse): ICategory[] {
    return res.mongodbMongoose.res.map((category: ICategory) => {
      const mongodbMongooseProducts = category.products;
      const postgresSequelizeEquivalentCategory = res.postgresSequelize.res.find(
        (category: ICategory) => category.path === category.path
      );
      const postgresSequelizeProducts = postgresSequelizeEquivalentCategory.products;
      const productByServer: IServersResponseData = {
        mongodbMongoose: mongodbMongooseProducts,
        postgresSequelize: postgresSequelizeProducts,
      };
      const associatedIdsProducts = this.utils.appendAssociatedIdsByUniqueCommonData(productByServer, 'sku');
      return { ...category, products: associatedIdsProducts };
    });
  }

  getRootCategories(categories: ICategory[]): ICategory[] {
    return categories.filter((category) => !category.parent);
  }

  onCategoryClick(category: ICategory) {
    this.showData = false;
    this.currentCategory = category;
    const currentCategoriesBkp = [...this.currentCategories];
    const childrenCategories = this.getCurrentCategoryChildren(this.currentCategory, this.categories);
    this.currentCategories = childrenCategories?.length ? childrenCategories : currentCategoriesBkp;
    this.showData = true;
  }

  onBackCategoryClick() {
    this.showData = false;

    const parentCategory = this.getCurrentCategoryParent(this.currentCategory, this.categories);
    const parentOfParentCategory = this.getParentOfParentCategory(parentCategory, this.categories);

    this.currentCategory = parentCategory || this.currentCategory;

    this.currentCategories = parentOfParentCategory
      ? this.getCurrentCategoryChildren(parentOfParentCategory, this.categories)
      : this.getRootCategories(this.categories);

    this.showData = true;
  }

  getCurrentCategoryChildren(category: ICategory, categories: ICategory[]): ICategory[] {
    return categories.filter((_category) => _category.parent === category._id);
  }

  getCurrentCategoryParent(currentCategory: ICategory, categories: ICategory[]): ICategory {
    return categories.find((_category) => _category._id === currentCategory.parent);
  }

  getParentOfParentCategory(parentCategory: ICategory, categories: ICategory[]): ICategory {
    return categories.find((_category) => _category._id === parentCategory?.parent);
  }

  hasParentCategories(): boolean {
    let category;

    if (this.currentCategories?.length) {
      [category] = this.currentCategories;
    } else {
      category = this.currentCategory;
    }

    return Boolean(category?.parent);
  }

  getProducts(categories: ICategory[]): IOperationProduct[] {
    return categories.reduce((products, category) => [...products, ...category.products], []);
  }

  createProduct(product: IOperationProduct, categoryId: string): IOperationProduct {
    const productCopy = Object.assign({}, product);
    productCopy.amount = DEFAULT_AMOUNT;
    productCopy.category = categoryId;
    productCopy.subtotal = productCopy.salePrice * DEFAULT_AMOUNT;

    return productCopy;
  }

  addProduct(product: any): void {
    const productIndex = this.productsList.findIndex((_product) => _product._id === product._id);
    if (productIndex > -1) {
      this.addProductAmount(productIndex);
    } else {
      const newProduct = this.createProduct(product, this.currentCategory._id);
      this.productsList.push(newProduct);
      this.totalValue = this.calculateTotalValue(this.productsList);
    }
  }

  removeProduct(index: number): void {
    this.productsList.splice(index, 1);
    this.totalValue = this.calculateTotalValue(this.productsList);
  }

  addProductAmount(index: number): void {
    this.productsList[index].amount++;
    this.productsList[index].subtotal = this.calculateSubtotal(this.productsList[index]);
    this.totalValue = this.calculateTotalValue(this.productsList);
  }

  subProductAmount(index: number): void {
    this.productsList[index].amount--;
    this.productsList[index].subtotal = this.calculateSubtotal(this.productsList[index]);
    this.totalValue = this.calculateTotalValue(this.productsList);
  }

  calculateTotalValue(productsList: IOperationProduct[]): number {
    return productsList.reduce((totalValue, product, index) => {
      if (product.amount <= 0 || !product.amount) {
        this.productsList[index].subtotal = product.salePrice;
      } else {
        this.productsList[index].subtotal = product.amount * product.salePrice;
      }
      return (totalValue += this.productsList[index].subtotal);
    }, 0);
  }

  calculateSubtotal(product: IOperationProduct): number {
    return product.amount * product.salePrice;
  }

  ongoingSale(): boolean {
    return !this.productsList.length && !this.totalValue ? false : true;
  }

  resetPage(): void {
    this.productsList = [];
    this.totalValue = 0;
    this.currentCategories = this.getRootCategories(this.categories);
    [this.currentCategory] = this.currentCategories;
  }

  cancelSale(): void {
    if (this.ongoingSale()) {
      const message = 'Current sale data will be lost. Are you sure?';
      const dialogConfirmacaoRef = this.sharedComponents.openDialogConfirmation(
        'warning',
        'warn',
        'Attention',
        message,
        'Cance sale'
      );
      dialogConfirmacaoRef.beforeClosed().subscribe((data) => {
        if (data?.confirmed) {
          this.resetPage();
        }
      });
    }
  }

  openDialogPayment(): void {
    const dialogRef = this.dialog.open(DialogPaymentComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        products: this.productsList,
      },
    });

    dialogRef.beforeClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.resetPage();
      }
    });
  }
}
