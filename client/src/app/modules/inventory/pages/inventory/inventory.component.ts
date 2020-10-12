import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IProduct } from 'src/app/shared/models/views.model';
import { ApiProductService } from 'src/app/core/api/api-product.service';
import { MatPaginator } from '@angular/material/paginator';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiInventoryService } from 'src/app/core/api/api-inventory.service';
import { IAssociatedIds } from 'src/app/shared/models/associated-ids.model';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb.model';
import { IDatabaseTimes } from 'src/app/shared/models/database-times';
import { IHttpResponse } from 'src/app/shared/models/http.model';
import { IServersResponseData } from 'src/app/shared/models/servers-response-data';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  breadcrumb: IBreadcrumb = [{ label: 'Settings', isLink: true, path: '/settings' }];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.inventoryDataSource.paginator = paginator;
  }

  inventoryColumns: string[] = ['sku', 'name', 'category', 'unit', 'currentAmount'];
  inventoryDataSource = new MatTableDataSource<IProduct>();

  products: IProduct[];

  databaseTimes: IDatabaseTimes;
  associatedIds: IAssociatedIds;

  constructor(
    private inventoryApi: ApiInventoryService,
    private route: ActivatedRoute,
    private router: Router,
    public utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.inventoryApi.getInventory().subscribe((res: IHttpResponse) => {
      this.databaseTimes = this.utils.setTimes(res);
      this.products = this.getProducts(res);
      this.setDataSource(this.products);
    });
  }

  getProducts(res: IHttpResponse): IProduct[] {
    const productByServer: IServersResponseData = this.utils.splitResponsesByServerId(res);
    return this.utils.appendAssociatedIdsByUniqueCommonData(productByServer, 'sku');
  }

  setDataSource(product: IProduct[]): void {
    this.inventoryDataSource = new MatTableDataSource(product);
    this.inventoryDataSource.paginator = this.paginator;
  }

  navigateToProductInventoryDetails(product: IProduct): void {
    const params = {
      ...(product.associatedIds.postgresSequelizeId && {
        postgresSequelize: product.associatedIds.postgresSequelizeId,
      }),
    };
    const options = { relativeTo: this.route };
    this.router.navigate([product._id, params], options);
  }

  resetData(): void {
    this.databaseTimes = this.utils.resetTimes();
    this.products = undefined;
  }

  refreshComponent(): void {
    this.resetData();
    this.fetchData();
  }
}
