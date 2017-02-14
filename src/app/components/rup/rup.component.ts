import { PrestacionEjecucionComponent } from './ejecucion/prestacionEjecucion.component';
import { ITipoPrestacion } from './../../interfaces/ITipoPrestacion';
import { IPaciente } from './../../interfaces/IPaciente';
import { TipoPrestacionService } from './../../services/rup/tipoPrestacion.service';
import { PacienteService } from './../../services/paciente.service';

// [Andrrr] 2107-02-07: Hay que esperar a un nuevo release de Angular para poder cargarlos dinámicamente
import { RUP_COMPONENTS } from '../../rup.module';

import {
    Component, ViewContainerRef, ComponentFactoryResolver,
    Output, Input,
    OnInit, OnChanges, OnDestroy,
    EventEmitter
} from '@angular/core';

@Component({
    moduleId: 'RupModule',
    selector: 'rup',
    template: ''

})

export class RupComponent implements OnInit, OnChanges, OnDestroy {

    @Input() paciente: IPaciente;
    @Input() tipoPrestacion: ITipoPrestacion;
    @Output() evtData: EventEmitter<any> = new EventEmitter<any>();

    pacientePrestacion: any = {};
    // resultados a devolver
    //ejecucion: Object[] = [];
    data: Object = {};

    // Componente a cargar
    private componentContainer: any;

    tiposPrestaciones: Object[] = [];

    // Referencia al componente para poder manejarlo
    private componentReference: any;

    // Asegurar que el View está inicializado
    private isViewInitialized: boolean = false;

    // viewContainerRef es una referencia al padre del componente que queremos cargar
    constructor(private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private pacienteService: PacienteService,
        private tipoPrestacionService: TipoPrestacionService) {

        // Objeto que se rellena con todos los datos del Schema prestacionPaciente
        // TODO: Agregar datos faltantes (estado, solicitud, prestacionesSolicitadas)
        // this.pacientePrestacion = {
        //     estado: [],
        //     paciente: {},
        //     solicitud: {
        //         prioridad: null,
        //         procedencia: null,
        //         proposito: [],
        //         listaProblemas: [],
        //         organizacion: {},
        //         profesional: {}

        //     },
        //     ejecucion: {
        //         evoluciones: []
        //     },
        //     prestacionesSolicitadas: []
        // };

    }

    ngOnInit() {

        // El View ya está inicializado
        this.isViewInitialized = true;

        // Datos del paciente
        // this.pacienteService.getById('588650849b85192d94fb9c0b').subscribe(paciente => {
        //     console.log(paciente);
        //     this.pacientePrestacion.paciente = paciente;
        // });

        // Inicializamos la lista de Componentes RUP
        for (let comp of RUP_COMPONENTS) {
            this.tiposPrestaciones.push({
                'nombre': comp.name,
                'component': comp
            });
        }

        // Cargamos o actualizamos el componente 'Signos Vitales'
        this.loadComponent();

    }

    // TODO: revisar si hace falta
    ngOnChanges() {
        // this.loadComponent('ConsultaGeneralClinicaMedica');
        //this.evtData.emit(this.pacientePrestacion);
    }

    ngOnDestroy() {

    }

    // Método para cargar Components
    loadComponent() {

        // La creación dinámica de un Component tiene que darse después que se inicialize el View
        if (!this.isViewInitialized) {
            return;
        }

        // tslint:disable-next-line:no-console
        console.info('Cargando tipo de prestación: ', this.tipoPrestacion.key);

        // Buscamos la prestación con key de "Signos Vitales"
        // this.tipoPrestacionService.get({ key: key }).subscribe(resultado => {

        // No se puede cargar un componente pasando un string, buscamos en el "diccionario" de tipos de prestaciones
        this.componentContainer = this.tiposPrestaciones.find(prestacion => {
            let p;
            p = prestacion;
            return p.nombre === this.tipoPrestacion.componente.nombre;
        });

        // Cargamos el componente
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentContainer.component);

        // Creamos el componente
        this.componentReference = this.viewContainerRef.createComponent(componentFactory);

        // Activamos la detección de cambios
        this.componentReference.changeDetectorRef.detectChanges();

        // Agarramos la instancia
        let datosComponente = this.componentReference.instance;

        // tslint:disable-next-line:no-console
        console.info('datosComponente: ', datosComponente);

        // Generamos valores de la ejecución
        // TODO: debe ser un array
        let valores = {};
        let key = String(this.tipoPrestacion.key);
        valores[key] = this.componentReference.instance.data;

        datosComponente.evtData.subscribe(e => {
            // console.log("CAMBIOS");
            // console.log(e);
            this.evtData.emit(valores);
        });
    }

}