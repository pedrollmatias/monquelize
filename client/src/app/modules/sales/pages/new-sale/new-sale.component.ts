import { Component, OnInit } from '@angular/core';
import { ApiCategoryService } from 'src/app/core/api/api-category.service';
import { ICategory } from 'src/app/shared/models/views.model';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SharedComponentsService } from 'src/app/core/services/shared-components.service';
import { MatDialog } from '@angular/material/dialog';
import { IOperationProduct } from 'src/app/shared/models/views.model';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IPaths } from 'src/app/shared/models/paths.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';

const DEFAULT_AMOUNT = 1;

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss'],
})
export class NewSaleComponent implements OnInit {
  showPageData = false;

  categories: ICategory[];

  currentCategory: ICategory;
  currentChildrenCategories: ICategory[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  products: IOperationProduct[];
  searchInput = new FormControl();
  productsList: IOperationProduct[] = [];
  filteredProducts: Observable<any[]>;
  totalValue = 0;

  destroy$: Subject<void> = new Subject();

  constructor(
    private categoryApi: ApiCategoryService,
    private productApi: ApiProductService,
    private sharedComponents: SharedComponentsService,
    private dialog: MatDialog,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.utils
      .multiRequests('GET', this.endpointPaths, { params: { getProducts: true } })
      .subscribe((res: IHttpResponse) => {
        this.databaseTimes = this.utils.setTimes(res);
        console.log(res);
        //   this.categories = categoryRes.res;
        //   this.mongodbMongooseTime = categoryRes.time;
        //   [this.currentCategory] = this.categories;
        //   this.currentChildrenCategories = this.getCurrentChildrenCategories(this.currentCategory, this.categories);
        //   // this.products = this.getProducts(this.categories);
        //   this.filterProducts();
        //   this.showPageData = true;
      });
  }

  openDatabaseTimesDialog(): void {}

  appendCategoryOnProduct(categories: ICategory[]) {}

  get endpointPaths(): IPaths {
    return {
      mongodbMongoose: '/categories',
      postgresSequelize: '/products/get-by-category',
    };
  }

  // getCurrentChildrenCategories(category: ICategory, categories: ICategory[]): ICategory[] {
  //   return categories.filter((_category) => _category.parent === category._id);
  // }

  // hasParent(category: ICategory): boolean {
  //   return category.parent ? true : false;
  // }

  // changeCurrentCategory(category: ICategory): void {
  //   this.currentCategory = category;
  //   this.currentChildrenCategories = this.getCurrentChildrenCategories(category, this.categories);
  // }

  // backToParentCategory(category: ICategory): void {
  //   const currentCategory = this.categories.find((_category) => _category._id === category.parent);
  //   this.changeCurrentCategory(currentCategory);
  // }

  // getProducts(categories: ICategory[]): IOperationProduct[] {
  //   return categories.reduce((products, category) => [...products, ...category.products], []);
  // }

  // filterProducts() {
  //   this.filteredProducts = this.searchInput.valueChanges.pipe(
  //     startWith<string | any>(''),
  //     map((value) => (typeof value === 'string' ? value : value.name)),
  //     map((name) => (name ? this._filter(name) : this.products.slice()))
  //   );
  // }

  // _filter(name: string): IOperationProduct[] {
  //   const value = name.toLowerCase();
  //   return this.products.filter((product) => {
  //     const nameStr = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  //     const normalizedProductStr = `(${product.sku}) ${nameStr}`;
  //     const optionStr = `(${product.sku}) ${product.name}`;
  //     return normalizedProductStr.toLowerCase().includes(value) || optionStr.toLowerCase().includes(value);
  //   });
  // }

  // createProduct(product: IOperationProduct, categoryId: string): IOperationProduct {
  //   const productCopy = Object.assign({}, product);
  //   productCopy.amount = DEFAULT_AMOUNT;
  //   product.category = categoryId;
  //   productCopy.subtotal = productCopy.salePrice * DEFAULT_AMOUNT;

  //   return productCopy;
  // }

  // addProduct(product: any): void {
  //   product = product instanceof FormControl ? product.value : product;
  //   const productIndex = this.productsList.findIndex((_product) => _product._id === product._id);
  //   if (productIndex > -1) {
  //     this.addProductAmount(productIndex);
  //   } else {
  //     const newProduct = this.createProduct(product, this.currentCategory._id);
  //     this.productsList.push(newProduct);
  //     this.totalValue = this.calculateTotalValue(this.productsList);
  //   }
  //   this.searchInput.setValue('');
  // }

  // removeProduct(index: number): void {
  //   this.productsList.splice(index, 1);
  //   this.totalValue = this.calculateTotalValue(this.productsList);
  // }

  // addProductAmount(index: number): void {
  //   this.productsList[index].amount++;
  //   this.productsList[index].subtotal = this.calculateSubtotal(this.productsList[index]);
  //   this.totalValue = this.calculateTotalValue(this.productsList);
  // }

  // subProductAmount(index: number): void {
  //   this.productsList[index].amount--;
  //   this.productsList[index].subtotal = this.calculateSubtotal(this.productsList[index]);
  //   this.totalValue = this.calculateTotalValue(this.productsList);
  // }

  // calculateTotalValue(productsList: IOperationProduct[]): number {
  //   return productsList.reduce((totalValue, product, index) => {
  //     if (product.amount <= 0 || !product.amount) {
  //       this.productsList[index].subtotal = product.salePrice;
  //     } else {
  //       this.productsList[index].subtotal = product.amount * product.salePrice;
  //     }
  //     return (totalValue += this.productsList[index].subtotal);
  //   }, 0);
  // }

  // calculateSubtotal(product: IOperationProduct): number {
  //   return product.amount * product.salePrice;
  // }

  // ongoingSale(): boolean {
  //   return !this.productsList.length && !this.totalValue ? false : true;
  // }

  // resetPage(): void {
  //   this.productsList = [];
  //   this.totalValue = 0;
  // }

  // cancelSale(): void {
  //   if (this.ongoingSale()) {
  //     const message = 'Current sale data will be lost. Are you sure?';
  //     const dialogConfirmacaoRef = this.sharedComponents.openDialogConfirmation(
  //       'warning',
  //       'warn',
  //       'Attention',
  //       message,
  //       'Cance sale'
  //     );
  //     dialogConfirmacaoRef.beforeClosed().subscribe((data) => {
  //       if (data?.confirmed) {
  //         this.resetPage();
  //       }
  //     });
  //   }
  // }

  // nagevarParaRotaAnterior(): void {
  //   if (this.ongoingSale()) {
  //     const msg = 'Os dados da venda atual serão perdidos. Tem certeza que deseja executar esta ação?';
  //     const dialogConfirmacaoRef = this.sharedComponents.abrirDialogConfirmacao('warning', 'warn', 'Atenção', msg);
  //     dialogConfirmacaoRef.beforeClosed().subscribe((dados) => {
  //       if (dados?.confirmado) {
  //         this.router.navigateByUrl(this.rotaAnterior);
  //       }
  //     });
  //   } else {
  //     this.router.navigateByUrl(this.rotaAnterior);
  //   }
  // }

  // confirmarVenda(): void {
  //   this.confirmar.next({ valorTotal: this.totalValue, produtos: this.productsList });
  //   if (this.ehComanda) {
  //     this.resetarPagina();
  //   }
  // }
}
