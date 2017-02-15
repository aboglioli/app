import { ResumenComponent } from './components/rup/ejecucion/resumen.component';
import { PuntoInicioComponent } from './components/rup/ejecucion/puntoInicio.component';
// import { SignosVitalesComponent } from './components/rup/signos-vitales/signosVitales.component';
// import { TensionArterialComponent } from './components/rup/tension-arterial/tensionArterial.component';
import { ConsultaGeneralClinicaMedicaComponent } from './components/rup/consulta-general-clinica-medica/consultaGeneralClinicaMedica.component';

import { AgendaComponent } from './components/turnos/agenda.component';
import { DarTurnosComponent } from './components/turnos/dar-turnos/dar-turnos.component';
import { ListaEsperaComponent } from './components/turnos/lista-espera/listaEspera.component';
import { ClonarAgendaComponent } from './components/turnos/clonar-agenda';
import { PanelEspacioComponent } from './components/turnos/configuracion/espacio-fisico/panel-espacio.component';
import { FullcalendarComponent } from './components/turnos/configuracion/espacio-fisico/fullcalendar.component';
import { GestorAgendasComponent } from './components/turnos/gestor-agendas.component';

import { EspacioFisicoComponent } from './components/turnos/configuracion/espacio-fisico/espacio-fisico.component';
import { PrestacionComponent } from './components/turnos/configuracion/prestacion/prestacion.component';
import { PacienteComponent } from './components/paciente/paciente.component';
import { PacienteSearchComponent } from './components/paciente/paciente-search.component';
import { EspecialidadComponent } from './components/especialidad/especialidad.component';
import { ProfesionalComponent } from './components/profesional/profesional.component';
import { OrganizacionComponent } from './components/organizacion/organizacion.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

const appRoutes: Routes = [
  { path: 'organizacion', component: OrganizacionComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'profesional', component: ProfesionalComponent },
  { path: 'especialidad', component: EspecialidadComponent },
  { path: 'paciente', component: PacienteComponent },
  { path: 'agendas', component: AgendaComponent },
  { path: 'pacienteSearch', component: PacienteSearchComponent },
  { path: 'espacio_fisico', component: EspacioFisicoComponent },
  { path: 'prestacion', component: PrestacionComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'turnos', component: DarTurnosComponent },
  { path: 'listaEspera', component: ListaEsperaComponent },
  { path: 'clonarAgenda', component: ClonarAgendaComponent },
  { path: 'gestor_agendas', component: GestorAgendasComponent },
  { path: 'panelEspacio', component: PanelEspacioComponent },
  { path: 'fullcalendar', component: FullcalendarComponent },
  { path: 'rup', component: PuntoInicioComponent },
  { path: 'rup/dashboard/:id', component: ResumenComponent },
  // { path: 'rup/:id?*/', component: DashboardComponent },
  { path: '**', redirectTo: 'inicio' }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);