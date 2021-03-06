import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@andes/auth';
import { Plex } from '@andes/plex';
import { TipoPrestacionService } from './../../../services/tipoPrestacion.service';
import { ProfesionalService } from './../../../services/profesional.service';
import { EspacioFisicoService } from './../../../services/turnos/espacio-fisico.service';
import { AgendaService } from './../../../services/turnos/agenda.service';
import { IAgenda } from './../../../interfaces/turnos/IAgenda';

import * as enumerado from './../enums';
import * as moment from 'moment';
import { enumToArray } from '../../../utils/enums';

@Component({
    selector: 'gestor-agendas',
    templateUrl: 'gestor-agendas.html'
})

export class GestorAgendasComponent implements OnInit {
    showReasignarTurnoAgendas: boolean;
    @HostBinding('class.plex-layout') layout = true;  // Permite el uso de flex-box en el componente

    agendasSeleccionadas: IAgenda[] = [];

    public showGestorAgendas = true;
    public showTurnos = false;
    public showReasignarTurno = false;
    public showReasignarTurnoAutomatico = false;
    public showBotonesAgenda = false;
    public showClonar = false;
    public showDarTurnos = false;
    public showEditarAgenda = false;
    public showEditarAgendaPanel = false;
    public showInsertarAgenda = false;
    public showAgregarNotaAgenda = false;
    public showAgregarSobreturno = false;
    public showRevisionAgenda = false;
    public showListadoTurnos = false;
    public fechaDesde: any;
    public fechaHasta: any;
    public agendas: any = [];
    public agenda: any = {};
    public modelo: any = {};
    public hoy = false;
    public autorizado = false;
    public mostrarMasOpciones = false;
    public estadosAgenda = enumerado.EstadosAgenda;
    public estadosAgendaArray = enumToArray(enumerado.EstadosAgenda);

    // Contador de turnos suspendidos por agenda, para mostrar notificaciones
    turnosSuspendidos: any[] = [];

    searchForm: FormGroup;

    ag: IAgenda;
    // vistaAgenda: IAgenda;
    reasignar: IAgenda;
    editaAgenda: IAgenda;

    items: any[];

    constructor(public plex: Plex, private formBuilder: FormBuilder, public servicioPrestacion: TipoPrestacionService,
        public serviceProfesional: ProfesionalService, public servicioEspacioFisico: EspacioFisicoService,
        public serviceAgenda: AgendaService, private router: Router,
        public auth: Auth) { }

    ngOnInit() {
        this.autorizado = this.auth.getPermissions('turnos:planificarAgenda:?').length > 0;

        // No está autorizado para ver esta pantalla?
        if (!this.autorizado) {
            this.redirect('inicio');
        } else {

            this.items = [
                { label: 'Inicio', route: '/inicio' },
                { label: 'MPI', route: '/' },
                { label: 'Agendas', route: '/gestor_agendas' }
            ];

            // Por defecto cargar/mostrar agendas de hoy
            this.hoy = true;
            this.loadAgendas();

            // Reactive De-Form
            this.searchForm = this.formBuilder.group({
                // Debe respetarse el tipo de dato Date, o el componente datepicker no funciona
                fechaDesde: [new Date()],
                fechaHasta: [new Date()],
                prestaciones: [''],
                profesionales: [''],
                espacioFisico: [''],
                estado: ['']
            });

            // Un buen día los formularios reactivos volarán...
            this.searchForm.valueChanges.debounceTime(200).subscribe((value) => {

                let fechaDesde = moment(value.fechaDesde).startOf('day');
                let fechaHasta = moment(value.fechaHasta).endOf('day');
                let params = {};

                if (fechaDesde.isValid() || fechaHasta.isValid()) {
                    params = {
                        fechaDesde: fechaDesde.isValid() ? fechaDesde.format() : moment().format(),
                        fechaHasta: fechaHasta.isValid() ? fechaHasta.format() : moment().format(),
                        organizacion: this.auth.organizacion._id
                    };
                } else {
                    // Demos tiempo para que seleccionen una fecha válida, claro papá
                    return;
                }

                // Filtro de Tipos de Prestaciones (si está vacío, trae todas)
                if (value.prestaciones) {
                    params['idTipoPrestacion'] = value.prestaciones.id;
                }
                if (value.profesionales) {
                    params['idProfesional'] = value.profesionales.id;
                }
                if (value.espacioFisico) {
                    params['espacioFisico'] = value.espacioFisico.id;
                }
                if (value.estado) {
                    params['estado'] = value.estado.id;
                }

                this.getAgendas(params);

                this.fechaDesde = fechaDesde;
                this.fechaHasta = fechaHasta;
            });

        }

    }

    getAgendas(params: any) {
        this.serviceAgenda.get(params).subscribe(agendas => {
            // this.agendasSeleccionadas = [];
            this.turnosSuspendidos = [];
            agendas.forEach(agenda => {
                let count = 0;
                agenda.bloques.forEach(bloque => {
                    bloque.turnos.forEach(turno => {

                        // Cuenta la cantidad de turnos suspendidos (no reasignados) con paciente en cada agenda
                        if ((turno.paciente && turno.paciente.id) && ((turno.estado === 'suspendido') || (agenda.estado === 'suspendida')) && (!turno.reasignado || !turno.reasignado.siguiente)) {
                            count++;
                        }

                    });
                });
                this.turnosSuspendidos = [... this.turnosSuspendidos, { count: count }];
            });

            this.hoy = false;
            this.agendas = agendas;

        }, err => {
            if (err) {
                console.log(err);
            }
        });
    }

    loadAgendas() {
        let fecha = moment().format();

        if (this.hoy) {
            this.fechaDesde = moment(fecha).startOf('day').toDate();
            this.fechaHasta = moment(fecha).endOf('day').toDate();
        }

        const params = {
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta,
            organizacion: this.auth.organizacion._id,
            idTipoPrestacion: '',
            idProfesional: '',
            idEspacioFisico: ''
        };

        this.getAgendas(params);
    }

    agregarNotaAgenda() {
        this.showClonar = false;
        this.showDarTurnos = false;
        this.showEditarAgenda = false;
        this.showEditarAgendaPanel = false;
        this.showTurnos = false;
        this.showRevisionAgenda = false;
        this.showReasignarTurno = false;
        this.showReasignarTurnoAutomatico = false;
        this.showListadoTurnos = false;
        this.showAgregarNotaAgenda = true;
    }

    agregarSobreturno() {
        this.showGestorAgendas = false;
        this.showAgregarSobreturno = true;
    }

    cancelaAgregarNotaAgenda() {
        this.showTurnos = true;
        this.showAgregarNotaAgenda = false;
    }

    saveAgregarNotaAgenda() {
        this.loadAgendas();
        this.showTurnos = true;
        this.showAgregarNotaAgenda = false;
    }

    clonar() {
        this.showGestorAgendas = false;
        this.showClonar = true;
    }

    // Volver al gestor luego de hacer algo
    volverAlGestor() {
        this.showGestorAgendas = true;
        this.showDarTurnos = false;
        this.showEditarAgenda = false;
        this.showInsertarAgenda = false;
        this.showAgregarNotaAgenda = false;
        this.showAgregarSobreturno = false;
        this.showClonar = false;
        this.showRevisionAgenda = false;
        this.showReasignarTurno = false;
        this.showReasignarTurnoAutomatico = false;
        this.showListadoTurnos = false;
        this.loadAgendas();
    }

    reasignaTurno(reasTurno) {
        this.reasignar = reasTurno;
        this.showGestorAgendas = false;
        this.showDarTurnos = true;
    }

    showVistaTurnos(showTurnos: boolean) {
        this.showTurnos = showTurnos;
        this.showEditarAgendaPanel = false;
        this.showAgregarNotaAgenda = false;
    }

    insertarAgenda() {
        this.showInsertarAgenda = true;
        this.showGestorAgendas = false;
    }

    editarAgenda(agenda) {
        this.editaAgenda = agenda;

        if (this.editaAgenda.estado === 'planificacion') {
            this.showGestorAgendas = false;
            this.showEditarAgenda = true;
            this.showEditarAgendaPanel = false;
        } else {
            this.showGestorAgendas = true;
            this.showEditarAgenda = false;
            this.showEditarAgendaPanel = true;
            this.showTurnos = false;
        }
        this.showAgregarNotaAgenda = false;
        this.showRevisionAgenda = false;
        this.showReasignarTurno = false;
        this.showListadoTurnos = false;
        this.showReasignarTurnoAutomatico = false;
    }


    revisionAgenda(agenda) {
        this.showGestorAgendas = false;
        this.showRevisionAgenda = true;
    }

    loadPrestaciones(event) {
        this.servicioPrestacion.get({ turneable: 1 }).subscribe(event.callback);
    }

    loadProfesionales(event) {
        if (event.query) {
            let query = {
                nombreCompleto: event.query
            };
            this.serviceProfesional.get(query).subscribe(event.callback);
        } else {
            event.callback([]);
        }
    }

    // loadEspaciosFisicos(event) {
    //     this.servicioEspacioFisico.get({ organizacion: this.auth.organizacion._id }).subscribe(event.callback);
    // }

    loadEdificios(event) {
        // this.OrganizacionService.getById(this.auth.organizacion._id).subscribe(respuesta => {
        //     event.callback(respuesta.edificio);
        // });
        if (event.query) {
            let query = {
                edificio: event.query,
                // organizacion: this.auth.organizacion._id
            };
            this.servicioEspacioFisico.get(query).subscribe(listaEdificios => {
                event.callback(listaEdificios);
            });
        } else {
            event.callback(this.modelo.edificios || []);
        }
    }

    loadEspacios(event) {
        // this.servicioEspacioFisico.get({ organizacion: this.auth.organizacion._id }).subscribe(event.callback);
        // this.servicioEspacioFisico.get({}).subscribe(event.callback);

        let listaEspaciosFisicos = [];
        if (event.query) {
            let query = {
                nombre: event.query,
                // organizacion: this.auth.organizacion._id
            };
            this.servicioEspacioFisico.get(query).subscribe(resultado => {
                if (this.modelo.espacioFisico) {
                    listaEspaciosFisicos = resultado ? this.modelo.espacioFisico.concat(resultado) : this.modelo.espacioFisico;
                } else {
                    listaEspaciosFisicos = resultado;
                }
                event.callback(listaEspaciosFisicos);
            });
        } else {
            event.callback(this.modelo.espacioFisico || []);
        }

    }

    verAgenda(agenda, multiple, e) {

        this.showBotonesAgenda = false;
        this.showTurnos = false;

        this.serviceAgenda.getById(agenda.id).subscribe(ag => {
            // Actualizo la agenda local
            agenda = ag;
            // Actualizo la agenda global (modelo)
            this.agenda = ag;

            if (!multiple) {
                this.agendasSeleccionadas = [];
                this.agendasSeleccionadas = [...this.agendasSeleccionadas, ag];
            } else {
                let index;
                if (this.estaSeleccionada(agenda)) {
                    agenda.agendaSeleccionadaColor = 'success';
                    index = this.agendasSeleccionadas.indexOf(agenda);
                    this.agendasSeleccionadas.splice(index, 1);
                    this.agendasSeleccionadas = [...this.agendasSeleccionadas];
                } else {
                    this.agendasSeleccionadas = [...this.agendasSeleccionadas, ag];
                }
            }

            this.setColorEstadoAgenda(agenda);

            // Reseteo el panel de la derecha
            this.showEditarAgendaPanel = false;
            this.showAgregarNotaAgenda = false;
            this.showAgregarSobreturno = false;
            this.showRevisionAgenda = false;
            this.showTurnos = false;
            this.showReasignarTurno = false;
            this.showReasignarTurnoAutomatico = false;
            this.showListadoTurnos = false;
            this.showBotonesAgenda = true;

            if (this.hayAgendasSuspendidas()) {
                // this.showGestorAgendas = false;
                this.showReasignarTurnoAutomatico = true;
                // this.agendasSeleccionadas[0] = ag;
            } else {
                this.showTurnos = true;
            }

        });

    }

    hayAgendasSuspendidas() {
        return this.agendasSeleccionadas.filter((x) => { return x.estado === 'suspendida'; }).length > 0;
    }

    estaSeleccionada(agenda: any) {
        return this.agendasSeleccionadas.find(x => x.id === agenda._id);
    }

    setColorEstadoAgenda(agenda) {
        if (agenda.estado === 'suspendida') {
            agenda.agendaSeleccionadaColor = 'danger';
        } else {
            agenda.agendaSeleccionadaColor = 'success';
        }
    }

    suspensionAvisada(agenda: any) {
        if (agenda.avisos) {
            return agenda.avisos.findIndex(item => item.estado === 'suspende') >= 0;
        }
        return false;
    }

    redirect(pagina: string) {
        this.router.navigate(['./' + pagina]);
        return false;
    }

    gestorAgendas() {
        this.showGestorAgendas = false;
    }

    darTurnos() {
        this.showGestorAgendas = false;
        this.showDarTurnos = true;
    }

    actualizarEstadoEmit() {
        this.showTurnos = false;
        this.showEditarAgenda = false;
        this.showEditarAgendaPanel = false;
        this.showAgregarNotaAgenda = false;
        this.showReasignarTurno = false;
        this.showReasignarTurnoAutomatico = false;
        this.showRevisionAgenda = false;

        let temporal = this.agendasSeleccionadas;

        this.loadAgendas();
        this.agendasSeleccionadas = temporal;
        this.agendasSeleccionadas.forEach((as) => {
            if (this.agendasSeleccionadas.length === 1) {
                this.verAgenda(as, false, null);
            } else {
                this.verAgenda(as, true, null);
            }
        });

        if (this.agendasSeleccionadas.length === 1) {
            this.showTurnos = true;
        }
    }

    reasignarTurnos() {
        this.showGestorAgendas = false;
        this.showReasignarTurno = true;
    }

    reasignarTurnosAgendas() {
        this.showReasignarTurnoAgendas = true;
    }

    listarTurnos(agenda) {
        this.showGestorAgendas = false;
        this.showListadoTurnos = true;
    }


}
