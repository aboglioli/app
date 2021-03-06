import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';
import { environment } from '../../../environments/environment';

@Injectable()
export class TurnoService {
    private turnoUrl = '/modules/turnos';  // URL to web api

    constructor(private server: Server) { }

    get(params: any): Observable<any[]> {
        return this.server.get(this.turnoUrl + '/turno/', { params: params, showError: true });
    }

    getTurnos(params: any): Observable<any[]> {
        return this.server.get(this.turnoUrl + '/turno', { params: params, showError: true });
    }

    save(turno: any): Observable<any> {
        if (turno.idAgenda) {
            return this.server.patch(this.turnoUrl + '/turno/' + turno.idTurno + '/bloque/' + turno.idBloque + '/agenda/' + turno.idAgenda, turno);
        }
    }

    put(turno: any): Observable<any> {
        if (turno.idAgenda) {
            return this.server.put(this.turnoUrl + '/turno/' + turno.idTurno + '/bloque/' + turno.idBloque + '/agenda/' + turno.idAgenda, turno);
        }
    }
}
