// -- Angular imports -----------------------------------------------------------------------------------------
import { Component, OnInit, Inject, ViewContainerRef, ViewChild, ElementRef, Renderer2 }                         							from '@angular/core';
import { AbstractControl, FormGroup, Validators }        									from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } 							from "rxjs/Rx"; 
import { Http, Response, Headers, RequestOptions } 								from '@angular/http';
import { Router } 																from '@angular/router';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA}                               from '@angular/material';

import { Logger, MkFormService, MkForm, Loader, MkSelectValidator }								from 'mk';	

import { RegistroService }                                                      from '../../services/registro.service';

import { RegistroDialogComponent }                                              from '../registro-dialog/registro-dialog.component'

import { environment }                                                          from './../../../environments/environment';

const redirect_url: string = environment.domain + '/public/login';

const especialidad: any = {
    "Médico": [
        { "value":"Alergia e Inmunología Clínica", "text": " Alergia e Inmunología Clínica"},
        { "value":"Anestesiología", "text": " Anestesiología"},
        { "value":"Auditoría Médica", "text": " Auditoría Médica"},
        { "value":"Cardiología", "text": " Cardiología"},
        { "value":"Cirugía", "text": " Cirugía"},
        { "value":"Dermatología", "text": " Dermatología"},
        { "value":"Diagnostico por Imágenes", "text": " Diagnostico por Imágenes"},
        { "value":"Emergentología", "text": " Emergentología"},
        { "value":"Endocrinología", "text": " Endocrinología"},
        { "value":"Farmacologia Clinica", "text": " Farmacologia Clinica"},
        { "value":"Gastroterología", "text": " Gastroterología"},
        { "value":"Geriatría y gerontología", "text": " Geriatría y gerontología"},
        { "value":"Ginecología", "text": " Ginecología"},
        { "value":"Hematología", "text": " Hematología"},
        { "value":"Hemoterapia e Inmunohematologia", "text": " Hemoterapia e Inmunohematologia"},
        { "value":"Hepatología", "text": " Hepatología"},
        { "value":"Infectologia", "text": " Infectologia"},
        { "value":"Mastología", "text": " Mastología"},
        { "value":"Medicina Crítica y Terapia Intensiva", "text": " Medicina Crítica y Terapia Intensiva"},
        { "value":"Medicina del Deporte", "text": " Medicina del Deporte"},
        { "value":"Medicina del Trabajo", "text": " Medicina del Trabajo"},
        { "value":"Medicina Estética", "text": " Medicina Estética"},
        { "value":"Medicina Familiar", "text": " Medicina Familiar"},
        { "value":"Medicina Física y Rehabilitación", "text": " Medicina Física y Rehabilitación"},
        { "value":"Medicina Interna", "text": " Medicina Interna"},
        { "value":"Medicina Reproductiva", "text": " Medicina Reproductiva"},
        { "value":"Nefrología y Medio Interno", "text": " Nefrología y Medio Interno"},
        { "value":"Neonatología", "text": " Neonatología"},
        { "value":"Neumonología", "text": " Neumonología"},
        { "value":"Neurocirugía", "text": " Neurocirugía"},
        { "value":"Neurología", "text": " Neurología"},
        { "value":"Nutrición", "text": " Nutrición"},
        { "value":"Obstetricia", "text": " Obstetricia"},
        { "value":"Oftalmología", "text": " Oftalmología"},
        { "value":"Oncología", "text": " Oncología"},
        { "value":"Ortopedia y Traumatología", "text": " Ortopedia y Traumatología"},
        { "value":"Osteopatias Médicas", "text": " Osteopatias Médicas"},
        { "value":"Otorrinolaringología", "text": " Otorrinolaringología"},
        { "value":"Patología", "text": " Patología"},
        { "value":"Pediatría", "text": " Pediatría"},
        { "value":"Psiquiatría", "text": " Psiquiatría"},
        { "value":"Radioterapia", "text": " Radioterapia"},
        { "value":"Reumatología", "text": " Reumatología"},
        { "value":"Terapia intensiva", "text": " Terapia intensiva"},
        { "value":"Tocoginecología", "text": " Tocoginecología"},
        { "value":"Toxicología", "text": " Toxicología"},
        { "value":"Urología ", "text": " Urología "}
    ],
    "Licenciado de la salud": [
        { "value":"COSMETOLOGÍA", "text": " COSMETOLOGÍA"},
        { "value":"FONOAUDIOLOGÍA", "text": " FONOAUDIOLOGÍA"},
        { "value":"GERONTOLOGÍA", "text": " GERONTOLOGÍA"},
        { "value":"HEMOTERAPIA E INMUNOHEMATOLOGÍA", "text": " HEMOTERAPIA E INMUNOHEMATOLOGÍA"},
        { "value":"INTRUMENTACIÓN QUIRURGICA", "text": " INTRUMENTACIÓN QUIRURGICA"},
        { "value":"KINESIOLOGÍA Y FISITRÍA", "text": " KINESIOLOGÍA Y FISITRÍA"},
        { "value":"NUTRICIÓN", "text": " NUTRICIÓN"},
        { "value":"OBSTETRICIA ", "text": " OBSTETRICIA "},
        { "value":"PODOLOGÍA", "text": " PODOLOGÍA"},
        { "value":"PRÁCTICAS CARDIOLÓGICAS", "text": " PRÁCTICAS CARDIOLÓGICAS"},
        { "value":"PSICOLOGÍA", "text": " PSICOLOGÍA"},
        { "value":"RADIOLOGÍA", "text": " RADIOLOGÍA"}
    ],
    "Enfermero": [
        { "value":"Cardiología", "text": " Cardiología"},
        { "value":"Cuidados Intensivos", "text": " Cuidados Intensivos"},
        { "value":"Gerontología", "text": " Gerontología"},
        { "value":"Nefrología y Medio Interno", "text": " Nefrología y Medio Interno"},
        { "value":"Neonatología", "text": " Neonatología"},
        { "value":"Oncología", "text": " Oncología"},
        { "value":"Pediatría", "text": " Pediatría"},
        { "value":"Salud Mental", "text": " Salud Mental"}
    ]
};

@Component({
	templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.scss']
})
export class RegistroComponent
{
    @ViewChild('button') private _button: ElementRef;
    @ViewChild('wrapper') private _wrapper: ElementRef;

    private _step: number;
    private _steps: Array<Array<string>>;
    private _showIngresar: boolean;
	private _butonLabel: string;
    private _form: MkForm;
	private _form_group: FormGroup;
	private _subscriptions: Array<any>;
    private _ids: any;
    private _showTerms: boolean;

    private _question: any;

    private _sent: boolean;
    private _response_obj: {title:string,text:string,img:string,btn:string,callback:any};
    private _error: boolean;
    private _fieldError: boolean;

	public constructor ( 
        private _logger: Logger, 
        private _fs: MkFormService, 
        private _http: Http, 
        private _router: Router, 
        private _rs: RegistroService,
        private _dialog: MatDialog,
        private _vcr: ViewContainerRef,
        private _loader: Loader,
        private renderer: Renderer2 ) 
	{ 
		_logger.log('REGISTRO COMPONENT'); 

        this._showTerms = false;

        this._step = 0;
        this._steps = [
            new Array("registro_first_name", "registro_last_name", "registro_email", "registro_password", "registro_password1", "registro_password2" ),
            new Array("registro_job"),
            new Array("registro_especialization"),
            new Array("registro_college"),
            new Array("registro_first_name", "registro_email", "registro_job_2", "registro_especialization_2", "registro_college_2")
        ];
        this._showIngresar = true;
        this._butonLabel = 'SIGUIENTE';
		this._form_group = new FormGroup({});
        this._subscriptions = new Array();
        
        this._sent = false;
        this._response_obj = {
            title: '',
            text: '',
            img: '',
            btn: '',
            callback: null
        };

        this._error = false;

        this._fieldError = false;
	}

	public ngOnInit ()
	{
		this._subscriptions = [
            this.subscribeQuestionForm()
        ];
	}

	public ngOnDestroy () : void 
    { 
        this._subscriptions.forEach( sub => {
            sub.unsubscribe()
        });
        this._subscriptions.length = 0;
    }

    private onChanges () 
    {
        this._form_group.get('registro_job_2').valueChanges.subscribe((val) => {
            this._fs.getFormQuestions('registro').map( (q:any) => {
                let college_changed = this._form.find('registro_college');
                let new_college = college_changed.value;
        
                let especialization_to_reset = this._form.find('registro_especialization_2');

                if ( q.key == 'registro_especialization_2' ) {
                    q.options = especialidad[val];

                    especialization_to_reset.setValue(null);

                    let aux = this._steps[4].concat(new Array())

                    this._steps[4] = aux;
                };

                if ( q.key == 'registro_job_2' ) {
                    q.value = val;
                }

                if ( q.key == 'registro_college_2' ) {
                    q.value = new_college;
                }
            });
        });
    }

    private subscribeQuestionForm () : Subscription
    {
        return this._fs.forms
        .map( forms => forms.find( form => form.name === "registro" ) )
        .subscribe( form =>
        {
            if ( form ) 
            { 
                this._form = form; 
                this._form_group = this._form.formGroup;
                this._form_group.reset();
                this.onChanges();
            }
        });
    }

    private falseClick() {
        let clickableButton = this._button.nativeElement;

        clickableButton.click();
    }

    private nextStep () : void
    {
        this._fieldError = false;
        let aux: any;
        let data: any;
        let len: number = this._steps.length - 1;

        let control_job = this._form.find('registro_job');
        let control_college = this._form.find('registro_college');

        if ( this._step < len ) {
            this._step++;
            this._showIngresar = this._step >= 1 && this._step < len ? false : true;
            this._butonLabel = this._step === len ? 'REGISTRARSE' : 'SIGUIENTE';

            if ( this._step == 2 ) {
                let job:any = this._form.find('registro_job').value || 'Médico';

                this._fs.getFormQuestions('registro').map( (q:any) => {
                    if( q.key == 'registro_especialization' ) {
                        q.options = especialidad[job.value];

                        this._question = q;
                    };
                });
            };

            if ( this._step == 3 ) {
                this._fs.getFormQuestions('registro').map( (q:any) => {
                    if ( q.key == 'registro_college' ) {
                        q.value = 'Sin colegio';
                    };
                });
            };

            if ( this._step == 4 ) {
                let job:any = control_job.value || 'Médico';
                let college:any = control_college.value;

                this._fs.getFormQuestions('registro').map( (q:any) => {
                    // asignar options de especialidad y reset de validators
                    if(q.key == 'registro_especialization_2') {
                        q.options = especialidad[job.value];

                        let validar_esp = this._form.find('registro_especialization_2')

                        validar_esp.setValidators(Validators.required)
                        validar_esp.updateValueAndValidity()
                    };

                    // set value para evitar error en select text
                    if(q.key == 'registro_job_2') {
                        q.value = job.value
                    };

                    if(q.key == 'registro_college_2') {
                        q.value = college.value
                    };
                });
            };
        } else {
            aux = this._form_group.getRawValue();
            data = {
                'first_name': aux.registro_first_name,
                'last_name': aux.registro_last_name,
                'email': aux.registro_email,
                'password': aux.registro_password1,
                'role': 2,
                'details': [
                    { 'job': aux.registro_job },
                    { 'especialization': aux.registro_especialization },
                    { 'college': aux.registro_college }
                ],
                'redirect': redirect_url
            };

            if ( aux.registro_accepted_terms === true ) {
                this.send(data);
            } else {
                let dialogRef = this._dialog.open(RegistroDialogComponent, {
                    id: 'registro-dialog',
                    viewContainerRef: this._vcr,
                    data: {
                        texto: 'acepte los términos y condiciones'
                    }
                });    
            };
        };
    }

    private openTerms () : void
    {
        this._showTerms = true;
    }

    private acceptTerms () : void
    {
        this._showTerms = false;
        this._form_group.patchValue({'registro_accepted_terms': true});
    }

    private send ( data: {[key:string]:any}) : void
    {
        this._loader.show('registro');
        this._rs.register(data)
        .subscribe( 
            ( response: any ) => { 
                this._logger.info('Mail enviado');
                this._response_obj = {
                    title: '',
                    text: 'Se le ha enviado un email para la verificación de sus datos.',
                    img: '',
                    btn: 'INGRESAR',
                    callback: this.goToLogin
                };

            },      
            ( error: any ) => { 
                this._logger.error('Error');
                this._response_obj = {
                    title: '',
                    text: 'Ha habido un error en el proceso de registro.',
                    img: '',
                    btn: 'DE ACUERDO',
                    callback: this.goToRegistro
                };
                this._error = true;
            },
            ( ) => { 
                this._loader.dismiss('registro');
                this._sent = true;
            }
        );
    }

    private goToLogin () : void
    {
        this._router.navigateByUrl('/public/login');
    }

    private goToRegistro () : void
    {
         this._router.navigateByUrl('/public/registro');   
    }

    private checkError () {
        this._fieldError = true;
    }
}