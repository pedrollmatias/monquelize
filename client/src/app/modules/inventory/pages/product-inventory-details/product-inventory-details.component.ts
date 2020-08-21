import { Component, OnInit, ViewChild } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IProduct, IHistory } from 'src/app/shared/models/views.model';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogInventoryAdjustmentComponent } from '../../components/dialog-inventory-adjustment/dialog-inventory-adjustment.component';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

declare interface IInfoCard {
  icon: string;
  iconColor: string;
  title: string;
  value: any;
}

@Component({
  selector: 'app-product-inventory-details',
  templateUrl: './product-inventory-details.component.html',
  styleUrls: ['./product-inventory-details.component.scss'],
})
export class ProductInventoryDetailsComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Inventory', path: '/inventory', isLink: true }];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.historyDataSouce.paginator = paginator;
  }

  mongodbMongooseTime: number;

  productId: string;
  product: IProduct;

  pageTitle = 'Loading...';
  showPageData = false;

  infoCards: IInfoCard[];

  historyColumns: string[] = ['date', 'movementType', 'amount'];
  historyDataSouce = new MatTableDataSource<IHistory>();

  constructor(private productApi: ApiProductService, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    // this.productId = this.route.snapshot.paramMap.get('id');
    // this.productApi.getProduct(this.productId).subscribe((productRes: IHttpRes) => {
    //   this.product = productRes.res;
    //   this.mongodbMongooseTime = productRes.time;
    //   this.pageTitle = `Product inventory - ${this.product.name} (${this.product.sku})`;
    //   this.initInfoCards(this.product);
    //   this.setHistoryDataSource(this.product.history || []);
    //   this.showPageData = true;
    // });
  }

  // initInfoCards(product: IProduct): void {
  //   this.infoCards = [
  //     {
  //       icon: 'vertical_align_center',
  //       iconColor: 'primary',
  //       title: 'Current amount',
  //       value: product.inventory?.currentAmount || 0,
  //     },
  //     {
  //       icon: 'vertical_align_bottom',
  //       iconColor: 'warn',
  //       title: 'Minimum amount',
  //       value: product.inventory?.minAmount || '-',
  //     },
  //     {
  //       icon: 'vertical_align_top',
  //       iconColor: 'primary',
  //       title: 'Maximum amount',
  //       value: product.inventory?.maxAmount || '-',
  //     },
  //     {
  //       icon: 'attach_money',
  //       iconColor: 'primary',
  //       title: 'Inventory value',
  //       value: product.salePrice * product.inventory.currentAmount || '-',
  //     },
  //   ];
  // }

  // setHistoryDataSource(history: IHistory[]): void {
  //   this.historyDataSouce = new MatTableDataSource(history);
  // }

  // openCategoryDetailsDialog(categoryId: string = null): void {
  //   const dialogRef = this.dialog.open(DialogInventoryAdjustmentComponent, {
  //     autoFocus: false,
  //     restoreFocus: false,
  //     width: '70vw',
  //     data: {
  //       productId: this.productId,
  //       product: this.product,
  //     },
  //   });

  //   dialogRef
  //     .beforeClosed()
  //     .pipe(
  //       switchMap((confirmed) => {
  //         if (confirmed) {
  //           return this.productApi.getProduct(this.productId);
  //         } else {
  //           const productRes: IHttpRes = { res: this.product, time: this.mongodbMongooseTime };
  //           return of(productRes);
  //         }
  //       })
  //     )
  //     .subscribe((productRes: IHttpRes) => {
  //       this.product = <IProduct>productRes.res;
  //       this.mongodbMongooseTime = productRes.time;
  //       this.setHistoryDataSource(this.product.history);
  //       this.initInfoCards(this.product);
  //     });
  // }
}
