import { Component, OnInit, ViewChild } from '@angular/core';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IProduct, IHistory } from 'src/app/shared/models/views.model';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { ApiInventoryService } from 'src/app/core/api/api-inventory.service';
import { IPaths } from 'src/app/shared/models/paths.model';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { DialogAddInventoryMovementComponent } from '../../components/dialog-add-inventory-movement/dialog-add-inventory-movement.component';
import { DialogAdjustProductInventoryComponent } from '../../components/dialog-inventory-adjustment/dialog-adjust-product-inventory.component';

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

  databaseTimes: IDatabaseTimes;

  associatedIds: IAssociatedIds;
  product: IProduct;

  endpointPaths: IPaths;

  pageTitle = 'Loading...';
  showPageData = false;

  infoCards: IInfoCard[];

  historyColumns: string[] = ['date', 'movementType', 'amount'];
  historyDataSouce = new MatTableDataSource<IHistory>();

  constructor(
    private inventoryApi: ApiInventoryService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.associatedIds = this.getAssociatedIds(params);
          this.endpointPaths = this.utils.getEndpointPaths('/inventory', this.associatedIds);
          return this.inventoryApi.getProductInventory(this.endpointPaths);
        })
      )
      .subscribe((res: IHttpResponse) => {
        this.databaseTimes = this.utils.setTimes(res);
        this.product = this.getProduct(res);
        this.pageTitle = `Product inventory - ${this.product.name} (${this.product.sku})`;
        this.initInfoCards(this.product);
        this.setHistoryDataSource(this.product.history || []);
        this.showPageData = true;
      });
  }

  getAssociatedIds(params: Params): IAssociatedIds {
    return { mongodbMongooseId: params.id, postgresSequelizeId: params.postgresSequelize };
  }

  getProduct(res: IHttpResponse): IProduct {
    const product = res.mongodbMongoose.res;
    return { ...product, associatedIds: this.associatedIds };
  }

  initInfoCards(product: IProduct): void {
    this.infoCards = [
      {
        icon: 'vertical_align_center',
        iconColor: 'primary',
        title: 'Current amount',
        value: product.currentAmount || 0,
      },
      {
        icon: 'vertical_align_bottom',
        iconColor: 'warn',
        title: 'Minimum amount',
        value: product.minAmount || '-',
      },
      {
        icon: 'vertical_align_top',
        iconColor: 'primary',
        title: 'Maximum amount',
        value: product.maxAmount || '-',
      },
      {
        icon: 'attach_money',
        iconColor: 'primary',
        title: 'Inventory value',
        value: product.salePrice * product.currentAmount || '-',
      },
    ];
  }

  setHistoryDataSource(history: IHistory[]): void {
    this.historyDataSouce = new MatTableDataSource(history);
    this.historyDataSouce.paginator = this.paginator;
  }

  refreshComponent(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.fetchData();
  }

  openDialogAddInventoryMovement(): void {
    const dialogRef = this.dialog.open(DialogAddInventoryMovementComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        product: this.product,
      },
    });
    dialogRef
      .beforeClosed()
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            this.showPageData = false;
            return this.inventoryApi.getProductInventory(this.endpointPaths);
          } else {
            return of();
          }
        })
      )
      .subscribe((res: IHttpResponse) => {
        if (res) {
          this.product = this.getProduct(res);
          this.initInfoCards(this.product);
          this.setHistoryDataSource(this.product.history || []);
          this.showPageData = true;
        }
      });
  }

  openDialogAdjustProductInventory(): void {
    const dialogRef = this.dialog.open(DialogAdjustProductInventoryComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '70vw',
      data: {
        product: this.product,
      },
    });
    dialogRef
      .beforeClosed()
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            this.showPageData = false;
            return this.inventoryApi.getProductInventory(this.endpointPaths);
          } else {
            return of();
          }
        })
      )
      .subscribe((res: IHttpResponse) => {
        if (res) {
          this.product = this.getProduct(res);
          this.initInfoCards(this.product);
          this.setHistoryDataSource(this.product.history || []);
          this.showPageData = true;
        }
      });
  }
}
