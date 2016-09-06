import { EstablecimientoComponent } from './components/establecimiento/establecimiento.component';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';

import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [ BrowserModule, ReactiveFormsModule ],
  declarations: [ AppComponent, EstablecimientoComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
