import { Plex } from '@andes/plex';
import { Observable } from 'rxjs/Rx';
import { Component, AfterViewInit, HostBinding } from '@angular/core';
import { Auth } from '@andes/auth';
import { Wizard } from './../../classes/wizard.class';

@Component({
    templateUrl: 'inicio.html',
    styleUrls: ['inicio.scss']
})
export class InicioComponent implements AfterViewInit {
    @HostBinding('class.plex-layout') layout = true;

    constructor(private plex: Plex, public auth: Auth) { }

    ngAfterViewInit() {
        // let wizard = new Wizard('turnos');
        // wizard.addStep('Bienvenido al módulo de Agendas & Turnos', 'Este asistente lo ayudará a empezar a trabajar');
        // wizard.addStep('Crear la agenda', 'El primer paso es crear una agenda a través del Gestor de Agendas');
        // wizard.addStep('Publica la agenda', 'Luego la agenda debe publicarse para que esté lista para dar turnos');
        // wizard.addStep('Dar Turnos', 'Ahora pueden otorgarse turnos');
        // wizard.addStep('Acceso de profesionales', 'El personal de Salud puede acceder a los turnos dados desde el consultorio, incluso otorgar nuevos turnos');
        // wizard.addStep('Comenzar a usar', 'La aplicación ya está lista para que comiences a utilizarla');
        // wizard.render();
    }
}
