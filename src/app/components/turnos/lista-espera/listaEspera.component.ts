import { IListaEspera } from './../../../interfaces/turnos/IListaEspera';
import { ListaEsperaService } from '../../../services/turnos/listaEspera.service';
import { ListaEsperaCreateUpdateComponent } from './listaEspera-create-update.component';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

const limit = 10;

@Component({
    selector: 'listaEspera',
    templateUrl: 'listaEspera.html'
})
export class ListaEsperaComponent implements OnInit {
    showcreate: boolean = false;
    datos: IListaEspera[] = [];
    searchForm: FormGroup;
    value: any;
    skip: number = 0;
    nombre: string = '';
    activo: Boolean = null;
    loader: boolean = false;
    finScroll: boolean = false;
    tengoDatos: boolean = true;
    checked: boolean = true;

    constructor(private formBuilder: FormBuilder, private listaEsperaService: ListaEsperaService) { }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            nombre: [''],
            activo: true
        });

        this.searchForm.valueChanges.debounceTime(200).subscribe((value) => {
            this.value = value;
            this.skip = 0;
            this.loadDatos(false);
        });
        this.loadDatos(false);
    }

    loadDatos(concatenar: boolean = false) {
        let parametros = {
            'skip': this.skip,
            'limit': limit
        };
        this.listaEsperaService.get(parametros)
            .subscribe(
            datos => {
                if (concatenar) {
                    if (datos.length > 0) {
                        this.datos = this.datos.concat(datos);
                    } else {
                        this.finScroll = true;
                        this.tengoDatos = false;
                    }
                } else {
                    this.datos = datos;
                    this.finScroll = false;
                }
                this.loader = false;
            });
    }

    onReturn(objListaEspera: IListaEspera): void {
        this.showcreate = false;
        this.loadDatos();
    }

    nextPage() {
        if (this.tengoDatos) {
            this.skip += limit;
            this.loadDatos(true);
            this.loader = true;
        }
    }
}