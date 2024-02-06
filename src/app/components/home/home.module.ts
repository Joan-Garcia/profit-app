import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,

        ChartModule,
        SkeletonModule,
    ]
})
export class HomeModule { }
