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
var provincia_service_1 = require('./../../services/provincia.service');
var ProfesionalUpdateComponent = (function () {
    function ProfesionalUpdateComponent(formBuilder, provinciaService, profesionalService) {
        this.formBuilder = formBuilder;
        this.provinciaService = provinciaService;
        this.profesionalService = profesionalService;
        this.data = new core_1.EventEmitter();
        this.tipos = ["DNI", "LC", "LE", "PASS"];
        this.localidades = [];
    }
    ProfesionalUpdateComponent.prototype.ngOnInit = function () {
        var _this = this;
        //CArga de combos
        this.provinciaService.get()
            .subscribe(function (resultado) { return _this.provincias = resultado; });
        this.provinciaService.getLocalidades(this.ProfesionalHijo.domicilio.provincia)
            .subscribe(function (resultado) { _this.localidades = resultado[0].localidades; });
        debugger;
        this.fechaNac = this.cammbiarFecha(this.ProfesionalHijo.fechaNacimiento);
        this.updateForm = this.formBuilder.group({
            _id: [this.ProfesionalHijo._id],
            nombre: [this.ProfesionalHijo.nombre, forms_1.Validators.required],
            apellido: [this.ProfesionalHijo.apellido],
            tipoDni: [this.ProfesionalHijo.tipoDni],
            numeroDni: [this.ProfesionalHijo.numeroDni, forms_1.Validators.required],
            fechaNacimiento: [this.fechaNac],
            domicilio: this.formBuilder.group({
                calle: [this.ProfesionalHijo.domicilio.calle, forms_1.Validators.required],
                numero: [this.ProfesionalHijo.domicilio.numero],
                provincia: [this.ProfesionalHijo.domicilio.provincia],
                localidad: []
            }),
            telefono: [this.ProfesionalHijo.telefono],
            email: [this.ProfesionalHijo.email],
            matriculas: this.formBuilder.array([])
        });
        debugger;
        this.ProfesionalHijo.matriculas.forEach(function (element) {
            _this.addMatricula(element);
        });
        this.myLocalidad = this.ProfesionalHijo.domicilio.localidad;
        this.myProvincia = this.ProfesionalHijo.domicilio.provincia;
    };
    ProfesionalUpdateComponent.prototype.cammbiarFecha = function (myDate) {
        var fecha1 = myDate.toString();
        var fecha2 = new Date(Date.parse(fecha1));
        var mes = fecha2.getMonth() + 1;
        var fechaSal = fecha2.getDate().toString() + "/" + mes.toString() + "/" + fecha2.getFullYear().toString();
        return fechaSal;
    };
    ProfesionalUpdateComponent.prototype.iniMatricula = function (objMatricula) {
        // Inicializa matrículas
        debugger;
        if (objMatricula) {
            var fechaIni = this.cammbiarFecha(objMatricula.fechaInicio);
            var fechaFin = this.cammbiarFecha(objMatricula.fechaVencimiento);
            return this.formBuilder.group({
                numero: [objMatricula.numero, forms_1.Validators.required],
                descripcion: [objMatricula.descripcion],
                fechaInicio: [fechaIni],
                fechaVencimiento: [fechaFin],
                vigente: [objMatricula.vigente]
            });
        }
        else {
            return this.formBuilder.group({
                numero: ['', forms_1.Validators.required],
                descripcion: [''],
                fechaInicio: [''],
                fechaVencimiento: [''],
                vigente: [false]
            });
        }
    };
    ProfesionalUpdateComponent.prototype.addMatricula = function (objMatricula) {
        // agrega formMatricula 
        var control = this.updateForm.controls['matriculas'];
        control.push(this.iniMatricula(objMatricula));
    };
    ProfesionalUpdateComponent.prototype.removeMatricula = function (i) {
        // elimina formMatricula
        var control = this.updateForm.controls['matriculas'];
        control.removeAt(i);
    };
    ProfesionalUpdateComponent.prototype.onSave = function (model, isvalid) {
        var _this = this;
        debugger;
        if (isvalid) {
            var profOperation = void 0;
            model.habilitado = true;
            model.domicilio.localidad = this.myLocalidad;
            profOperation = this.profesionalService.put(model);
            profOperation.subscribe(function (resultado) { _this.data.emit(resultado); });
        }
        else {
            alert("Complete datos obligatorios");
        }
    };
    ProfesionalUpdateComponent.prototype.getLocalidades = function (index) {
        this.localidades = this.provincias[index].localidades;
    };
    ProfesionalUpdateComponent.prototype.onCancel = function () {
        this.data.emit(null);
    };
    __decorate([
        core_1.Input('selectedProfesional'), 
        __metadata('design:type', Object)
    ], ProfesionalUpdateComponent.prototype, "ProfesionalHijo", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ProfesionalUpdateComponent.prototype, "data", void 0);
    ProfesionalUpdateComponent = __decorate([
        core_1.Component({
            selector: 'profesional-update',
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES],
            templateUrl: 'components/profesional/profesional-update.html'
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, provincia_service_1.ProvinciaService, profesional_service_1.ProfesionalService])
    ], ProfesionalUpdateComponent);
    return ProfesionalUpdateComponent;
}());
exports.ProfesionalUpdateComponent = ProfesionalUpdateComponent;
//# sourceMappingURL=profesional-update.component.js.map