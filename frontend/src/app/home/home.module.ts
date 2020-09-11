import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';

@NgModule({
  declarations: [NavComponent],
  exports: [],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
