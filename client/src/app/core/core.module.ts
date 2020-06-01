import { NgModule, SkipSelf, Optional, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerInterceptor } from './interceptors/server.interceptor';
import { GlobalErrorHandler } from './classes/global-error-handler';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [HttpClientModule, CommonModule],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
