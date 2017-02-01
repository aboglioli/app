import { Plex } from 'andes-plex/src/lib/core/service';
import { Observable } from 'rxjs/Rx';
import { IAgenda } from './../../interfaces/turnos/IAgenda';
import { Component, OnInit, Input } from '@angular/core';
import { AgendaService } from './../../services/turnos/agenda.service';
import * as moment from 'moment';
type Estado = 'noSeleccionado' | 'seleccionado'
@Component({
    // tslint:disable-next-line:component-selector-prefix
    selector: 'clonar-agenda',
    templateUrl: 'clonar-agenda.html'
})

export class ClonarAgendaComponent implements OnInit {
    private _agenda: any;
    private fecha: Date = new Date();
    private calendario: any = [];
    private estado: Estado = 'noSeleccionado';
    private seleccionados: any[] = [];
    private agendas: IAgenda[] = []; // Agendas del mes seleccionado
    private agendasPrestaciones: String[] = []; // Ids de Agendas del mes seleccionado con al menos una prestacion en comun con la original
    private agendasFiltradas: IAgenda[] = []; // Las agendas que hay en el día, cuando se selecciona una fecha para clonar
    private inicioMesMoment: moment.Moment;
    private inicioMesDate;
    private finMesDate;
    private original: boolean = true;
    private inicioAgenda: Date;
    public danger = 'list-group-item-danger';
    @Input('agenda')
    set agenda(value: any) {
        this._agenda = value;
    }
    get agenda(): any {
        return this._agenda;
    }
    constructor(private serviceAgenda: AgendaService, public plex: Plex) { }

    ngOnInit() {
        // Cableado
        // this.serviceAgenda.getById('583dbcf713593558cca963aa').subscribe(agenda => {
        //     this.agenda = agenda;
        //     this.actualizar();
        // });
        this.inicioAgenda = new Date(this.agenda.horaInicio);
        this.inicioAgenda.setHours(0, 0, 0, 0);
        this.actualizar();
    }

    private actualizar() {
        if (this.seleccionados.indexOf(this.inicioAgenda.getTime()) < 0) {
            this.seleccionados.push(this.inicioAgenda.getTime());
        }
        this.inicioMesMoment = moment(this.fecha).startOf('month').startOf('week');
        this.inicioMesDate = this.inicioMesMoment.toDate();
        this.finMesDate = (moment(this.fecha).endOf('month').endOf('week')).toDate();
        let params = {
            fechaDesde: this.inicioMesDate,
            fechaHasta: this.finMesDate,
        };
        this.serviceAgenda.get(params).subscribe(agendas => { this.agendas = agendas; });
        params['prestaciones'] = JSON.stringify(this.agenda.prestaciones.map(elem => { elem.id; return elem; }));
        this.serviceAgenda.get(params).subscribe(agendas => {
            this.agendasPrestaciones = agendas.map(function (ag) { return ag.id; });
        });
        this.cargarCalendario();
    }

    private cargarCalendario() {
        let dia: any = {};
        this.calendario = [];

        for (let r = 1; r <= 5; r++) {
            let week = [];
            this.calendario.push(week);
            for (let c = 1; c <= 7; c++) {
                this.inicioMesMoment.add(1, 'day');
                this.inicioMesDate = this.inicioMesMoment.toDate();
                let indice = -1;
                if (this.seleccionados) {
                    indice = this.seleccionados.indexOf(this.inicioMesDate.getTime());
                }
                if (indice >= 0) {
                    if (indice === 0) {
                        dia = {
                            fecha: this.inicioMesMoment.toDate(),
                            estado: 'seleccionado',
                            original: true
                        };
                    } else {
                        dia = {
                            fecha: this.inicioMesMoment.toDate(),
                            estado: 'seleccionado',
                            original: false
                        };
                    }
                } else {
                    dia = {
                        fecha: this.inicioMesMoment.toDate(),
                        estado: this.estado,
                        original: false
                    };
                }
                week.push(dia);
            }
        }
    }

    public cambiarMes(signo) {
        if (signo === '+') {
            this.fecha = moment(this.fecha).add(1, 'M').toDate();
        } else {
            this.fecha = moment(this.fecha).subtract(1, 'M').toDate();
        }
        this.actualizar();
    }

    public seleccionar(dia: any) {
        // Mostrar las agendas que coincidan con las prestaciones de la agenda seleccionada en ese dia
        if (dia.original) {
            this.original = true;
        } else {
            this.original = false;
        }
        if (dia.estado === 'noSeleccionado' && this.original !== true) {
            dia.estado = 'seleccionado';
            this.seleccionados.push(dia.fecha.getTime());
            this.agendasFiltradas = this.agendas.filter(
                function (value) {
                    return (moment(dia.fecha).isSame(moment(value.horaInicio), 'day'));
                }
            );
        } else {
            this.agendasFiltradas = [];
            if (this.original !== true) {
                dia.estado = 'noSeleccionado';
                let i: number = this.seleccionados.indexOf(dia.fecha.getTime());
                this.seleccionados.splice(i, 1);
            }
        }
        console.log('agendas filtradas ', this.agendasFiltradas);
    }

    combinarFechas(fecha1, fecha2) {
        if (fecha1 && fecha2) {
            let horas: number;
            let minutes: number;
            let auxiliar: Date;

            auxiliar = new Date(fecha1);
            horas = fecha2.getHours();
            minutes = fecha2.getMinutes();
            auxiliar.setHours(horas, minutes, 0, 0);
            return auxiliar;
        } else {
            return null;
        }
    }

    public clonar() {
        let seleccionada = new Date(this.seleccionados[0]);
        let operaciones: Observable<IAgenda>[] = [];
        let operacion: Observable<IAgenda>;
        this.seleccionados.forEach((seleccion, index0) => {
            seleccionada = new Date(seleccion);
            if (seleccionada && index0 > 0) {
                let newHoraInicio = this.combinarFechas(seleccionada, new Date(this.agenda.horaInicio));
                let newHoraFin = this.combinarFechas(seleccionada, this.agenda.horaFin);
                this.agenda.horaInicio = newHoraInicio;
                this.agenda.horaFin = newHoraFin;
                let newIniBloque: any;
                let newFinBloque: any;
                let newIniTurno: any;
                this.agenda.bloques.forEach((bloque, index) => {
                    newIniBloque = this.combinarFechas(seleccionada, bloque.horaInicio);
                    newFinBloque = this.combinarFechas(seleccionada, bloque.horaFin);
                    bloque.horaInicio = newIniBloque;
                    bloque.horaFin = newFinBloque;
                    bloque.turnos.forEach((turno, index1) => {
                        newIniTurno = this.combinarFechas(seleccionada, turno.horaInicio);
                        turno.horaInicio = newIniTurno;
                    });
                });
                delete this.agenda._id;
                delete this.agenda.id;
                operacion = this.serviceAgenda.save(this.agenda);
                operaciones.push(operacion);
            }
        });
        Observable.forkJoin(operaciones).subscribe(
            function (x) {
                console.log('Next: %s', x);
            },
            function (err) {
                console.log('Error: %s', err);
            },
            function () {
                console.log('Completed');
                alert('La agenda se clonó correctamente');
                // TODO: ver pq no puedo usar el plex alert
                // this.plex.alert('La agenda se clonó correctamente');
            }
        );
    }
}
