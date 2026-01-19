import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StockDetailComponent } from './features/stock-detail/stock-detail.component';

const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "stock/:symbol", component: StockDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
