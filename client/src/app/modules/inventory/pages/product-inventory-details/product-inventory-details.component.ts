import { Component, OnInit } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IProduct, IHistory } from 'src/app/shared/models/product.model';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { IHttpRes } from 'src/app/shared/models/http-res.model';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

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

  mongodbMongooseTime: number;

  productId: string;
  product: IProduct;

  pageTitle = 'Loading...';
  showPageData = false;

  infoCards: IInfoCard[];

  historyColumns: string[] = ['date', 'movementType', 'amount'];
  historyDataSouce = new MatTableDataSource<IHistory>();

  constructor(private productApi: ApiProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.productApi.getProduct(this.productId).subscribe((productRes: IHttpRes) => {
      this.product = productRes.res;
      this.mongodbMongooseTime = productRes.time;
      this.pageTitle = 'Product inventory';
      this.initInfoCards(this.product);
      this.setHistoryDataSource(this.product.history || []);
      this.showPageData = true;
    });
  }

  initInfoCards(product: IProduct): void {
    this.infoCards = [
      {
        icon: 'vertical_align_center',
        iconColor: 'primary',
        title: 'Current amount',
        value: product.inventory?.currentAmount || 0,
      },
      {
        icon: 'vertical_align_bottom',
        iconColor: 'primary',
        title: 'Minimum amount',
        value: product.inventory?.minAmount || '-',
      },
      {
        icon: 'vertical_align_top',
        iconColor: 'primary',
        title: 'Maximum amount',
        value: product.inventory?.maxAmount || '-',
      },
      {
        icon: 'attach_money',
        iconColor: 'primary',
        title: 'Inventory value',
        value: product.costPrice * product.inventory.currentAmount || '-',
      },
    ];
  }

  setHistoryDataSource(history: IHistory[]): void {
    this.historyDataSouce = new MatTableDataSource(history);
  }
}
