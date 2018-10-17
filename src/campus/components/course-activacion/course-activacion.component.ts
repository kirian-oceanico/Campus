import { Component, Inject, ViewContainerRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from "rxjs/Rx";
import { AbstractControl, FormGroup } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

import { Loader, Logger, MkFormService, MkForm } from 'mk';      

import { UserService } from '../../services/user.service';

@Component({
    selector: 'course-activacion',
    templateUrl: 'course-activacion.component.html',
    styleUrls: ['course-activacion.component.scss']
})
export class CourseActivacionComponent 
{

    // @ViewChild('button') private _button: ElementRef;
    @Output() close = new EventEmitter<boolean>();
    @Input('course') set course ( c: any )
	{
		this._id = c.id;
		this._title = c.name;
		this._img = this._suite + '/' + c.multimidia.default_image;
		this._redirect = c.url_access;
		this._code = c.license ? c.license.code : null;
		this._state = c.license ? c.license.status : null;
		this._entidad_id = c.certifying_entity ? c.certifying_entity.ce_id : null;
	}

	private _suite: string;

	private _id: number|string;
	private _title: string;
	private _img: string;
	private _redirect: string;
	private	_code: string;
	private _state: string;
	private _ids: any;
	private _entidad_id : any;

    private _form_activar : any;
    private _user_previous_info : any;

    private _form_act: MkForm;
    private _form_act_group: FormGroup;
    private _form_ced: MkForm;
    private _form_ced_group: FormGroup;
    private _subscriptions: Array<any>;

    private _activar : boolean;
    private _ceder : boolean;
    private _cederSuccess : boolean;

    constructor( 
        private _fs: MkFormService, 
        private _http: Http, 
        private _router: Router, 
        private _us: UserService,
        private _loader : Loader
    ) 
    {
        this._form_act_group = new FormGroup({});
        this._form_ced_group = new FormGroup({});
        this._subscriptions = new Array();
        this._activar = false;
        this._ceder = false;
        this._cederSuccess = false;
    }

    public ngOnInit ()
	{
        this._us.getUserData(this._code)
		.subscribe( info => {
            this._user_previous_info = info;
        },
        (err) => {},
        () => {
            this._subscriptions.push(this.subscribeQuestionFormActivar());
            this._loader.dismiss('form-activar')
        })

        this._form_activar = "course_entidad_" + this._entidad_id + "_default";
        
		this._subscriptions.push(this.subscribeQuestionFormCeder());
    }

	public ngOnDestroy () : void 
    { 
        this._subscriptions.forEach( sub => {
            sub.unsubscribe()
        });
        this._subscriptions.length = 0;
    }

    private subscribeQuestionFormActivar () : Subscription
    {
        return this._fs.forms
        .map( forms => forms.find( form => form.name === this._form_activar ) )
        .subscribe( form =>
        {
            if (form) 
            { 
                this._form_act = form; 
                this._form_act_group = this._form_act.formGroup;

                this._form_act_group.patchValue(this._user_previous_info);            
            }
        });
    }

    private subscribeQuestionFormCeder () : Subscription
    {
        return this._fs.forms
        .map( forms => forms.find( form => form.name === 'ceder_licencia' ) )
        .subscribe( form =>
        {
            if (form) 
            { 
                this._form_ced = form; 
                this._form_ced_group = this._form_ced.formGroup;
            }
        });
    }

    // private falseClick() {
    //     let clickMe = this._button.nativeElement;

    //     clickMe.click();
    // }

    // private next () : void
    // {
    //     let aux: any;
    //     let data: any;

    //     aux = this._form_group.getRawValue();
    //     data = {
    //         'nombre': aux.nombre,
    //         'apellido1': aux.apellido1,
    //         'apellido2': aux.apellido2,
    //         'dni_nie': aux.dni_nie,
    //         'direccion': aux.direccion,
    //         'pais_nombre': aux.pais_nombre,
    //         'mail': aux.mail,
    //         'mail2': aux.mail2,
    //         'telefono': aux.telefono,
    //         'file1': aux.file1,
    //         'file': aux.file
    //     };

    //     if (this._form_group.status === 'VALID') {
    //         this.send(data);
    //     }
    // }

    // private send (data: {[key:string]:any}) : void 
    // {

    //     let route = '';

    //     this._id === 1 || this._id === 2 ? route = 'alcala' : route = 'defaultHandler';

    //     this._us.updateBeforeCourse(data, route, this._code)
    //     .subscribe( (response: any ) =>
    //     { 

    //         console.log(response)
    //         console.log(data)
    //     });
    // }

    private activar() {
        this._activar = true;
        this._loader.show('form-activar')
    }

    private cederLicencia () {
        let aux : any;
        let data : any;

        aux = this._form_ced_group.getRawValue();
        data = { 'mail' : aux.email };

        if (this._form_ced_group.status === 'VALID') {
            console.log(data);
            //llamada al back con la info del usuario
            this._ceder = false;
            this._cederSuccess = true;
        }
    }

    private back (ans) {
        this.close.emit(ans);
    }
}