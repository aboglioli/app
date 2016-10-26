"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
// import { FORM_DIRECTIVES } from '@angular/common';
var profesional_service_1 = require('./../../services/profesional.service');
var pais_service_1 = require('./../../services/pais.service');
var provincia_service_1 = require('./../../services/provincia.service');
var localidad_service_1 = require('./../../services/localidad.service');
var especialidad_service_1 = require('./../../services/especialidad.service');
var enumerados = require('./../../utils/enumerados');
var ProfesionalCreateComponent = (function () {
    function ProfesionalCreateComponent(formBuilder, profesionalService, paisService, provinciaService, localidadService, especialidadService) {
        this.formBuilder = formBuilder;
        this.profesionalService = profesionalService;
        this.paisService = paisService;
        this.provinciaService = provinciaService;
        this.localidadService = localidadService;
        this.especialidadService = especialidadService;
        this.data = new core_1.EventEmitter();
        this.paises = [];
        this.provincias = [];
        this.localidades = [];
        this.todasProvincias = [];
        this.todasLocalidades = [];
        this.todasEspecialidades = [];
    }
    ProfesionalCreateComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Carga arrays
        this.sexos = enumerados.getSexo();
        this.generos = enumerados.getGenero();
        this.tipoComunicacion = enumerados.getTipoComunicacion();
        this.estadosCiviles = enumerados.getEstadoCivil();
        this.paisService.get().subscribe(function (resultado) { _this.paises = resultado; });
        this.provinciaService.get().subscribe(function (resultado) { return _this.todasProvincias = resultado; });
        this.localidadService.get().subscribe(function (resultado) { return _this.todasLocalidades = resultado; });
        this.especialidadService.get().subscribe(function (resultado) { _this.todasEspecialidades = resultado; });
        this.createForm = this.formBuilder.group({
            nombre: ['', forms_1.Validators.required],
            apellido: ['', forms_1.Validators.required],
            documento: ['', forms_1.Validators.required],
            contacto: this.formBuilder.array([
                this.initContacto(1)
            ]),
            fechaNacimiento: ['', forms_1.Validators.required],
            fechaFallecimiento: [''],
            sexo: [],
            genero: [''],
            direccion: this.formBuilder.array([
                this.formBuilder.group({
                    valor: [''],
                    codigoPostal: [''],
                    ubicacion: this.formBuilder.group({
                        pais: [''],
                        provincia: [''],
                        localidad: ['']
                    }),
                    ranking: ['1'],
                    latitud: [''],
                    longitud: [''],
                    activo: [true]
                })
            ]),
            estadoCivil: [''],
            foto: [''],
            rol: ['', forms_1.Validators.required],
            especialidad: this.formBuilder.array([]),
            matriculas: this.formBuilder.array([
                this.iniMatricula()
            ])
        });
    };
    /*Código de matriculas*/
    ProfesionalCreateComponent.prototype.iniMatricula = function () {
        // Inicializa matrículas
        return this.formBuilder.group({
            numero: ['', forms_1.Validators.required],
            descripcion: [''],
            fechaInicio: [''],
            fechaVencimiento: [''],
            activo: [true]
        });
    };
    ProfesionalCreateComponent.prototype.addMatricula = function () {
        // agrega formMatricula 
        var control = this.createForm.controls['matriculas'];
        control.push(this.iniMatricula());
    };
    ProfesionalCreateComponent.prototype.removeMatricula = function (i) {
        // elimina formMatricula
        var control = this.createForm.controls['matriculas'];
        control.removeAt(i);
    };
    /*Código de especialidad*/
    ProfesionalCreateComponent.prototype.setEspecialidad = function (id, nbe) {
        return this.formBuilder.group({
            id: [id],
            nombre: [nbe],
        });
    };
    ProfesionalCreateComponent.prototype.addEspecialidad = function () {
        var e = (document.getElementById("ddlEspecialidades"));
        var indice = e.selectedIndex;
        var id = this.todasEspecialidades[indice].id;
        var nombre = this.todasEspecialidades[indice].nombre;
        var control = this.createForm.controls['especialidad'];
        control.push(this.setEspecialidad(id, nombre));
    };
    ProfesionalCreateComponent.prototype.removeEspecialidad = function (i) {
        var control = this.createForm.controls['especialidad'];
        control.removeAt(i);
    };
    /*Código de filtrado de combos*/
    ProfesionalCreateComponent.prototype.filtrarProvincias = function (indiceSelected) {
        var idPais = this.paises[indiceSelected].id;
        this.provincias = this.todasProvincias.filter(function (p) { return p.pais.id == idPais; });
        this.localidades = [];
    };
    ProfesionalCreateComponent.prototype.filtrarLocalidades = function (indiceSelected) {
        var idProvincia = this.provincias[indiceSelected].id;
        this.localidades = this.todasLocalidades.filter(function (p) { return p.provincia.id == idProvincia; });
    };
    /*Código de contactos*/
    ProfesionalCreateComponent.prototype.initContacto = function (rank) {
        // Inicializa contacto
        var cant = 0;
        var fecha = new Date();
        return this.formBuilder.group({
            tipo: [''],
            valor: [''],
            ranking: [rank],
            ultimaActualizacion: [fecha],
            activo: [true]
        });
    };
    ProfesionalCreateComponent.prototype.addContacto = function () {
        var control = this.createForm.controls['contacto'];
        control.push(this.initContacto(control.length + 1));
    };
    ProfesionalCreateComponent.prototype.removeContacto = function (indice) {
        var control = this.createForm.controls['contacto'];
        control.removeAt(indice);
    };
    /*Guardar los datos*/
    ProfesionalCreateComponent.prototype.onSave = function (model, isvalid) {
        var _this = this;
        debugger;
        if (isvalid) {
            var profOperation = void 0;
            model.activo = true;
            profOperation = this.profesionalService.post(model);
            profOperation.subscribe(function (resultado) { return _this.data.emit(resultado); });
        }
        else {
            alert("Complete datos obligatorios");
        }
    };
    ProfesionalCreateComponent.prototype.onCancel = function () {
        this.data.emit(null);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ProfesionalCreateComponent.prototype, "data", void 0);
    ProfesionalCreateComponent = __decorate([
        core_1.Component({
            selector: 'profesional-create',
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES],
            templateUrl: 'components/profesional/profesional-create.html'
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, profesional_service_1.ProfesionalService, pais_service_1.PaisService, provincia_service_1.ProvinciaService, localidad_service_1.LocalidadService, especialidad_service_1.EspecialidadService])
    ], ProfesionalCreateComponent);
    return ProfesionalCreateComponent;
}());
exports.ProfesionalCreateComponent = ProfesionalCreateComponent;
//# sourceMappingURL=profesional-create.component.js.map