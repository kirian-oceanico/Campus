import { Component, Inject, ViewContainerRef, ViewChild, ElementRef }   from '@angular/core';
import { Location }                                                     from '@angular/common'
import { Observable, BehaviorSubject, Subscription } 					from "rxjs/Rx";

import { Router }                                                       from '@angular/router';

import { environment }													from '../../../environments/environment';

import { UserService }                                                  from '../../services/user.service';

import { Logger, MkFormService, MkForm, Loader }						from 'mk';

@Component({
	templateUrl: './password-change.component.html',
	styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent
{
    @ViewChild('button') private _button: ElementRef;
    private _form: MkForm;
    private _form_group;
	private _subscriptions: Array<Subscription>;
	
    private _showResponse: boolean;
    private _response_obj: {title:string,text:string,img:string,btn:string,callback:any};

	public constructor ( private _logger: Logger, private _router: Router, private _fs: MkFormService, private _us: UserService, private _loader: Loader, private _location : Location ) 
	{ 
		_logger.log('PasswordChangeComponent');

        this._showResponse = false;
        this._response_obj = {title:'',text:'',img:'',btn:'',callback:null};
	}

	public ngOnInit () : void
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

    private subscribeQuestionForm () : Subscription
    {
    	return this._fs.forms
        .map( forms => forms.find( form => form.name === "password-change" ))
        .subscribe( form =>
        {
            if (form) 
            { 
                this._form = form;
                this._form_group = this._form.formGroup
            }
        });
    }

    private falseClick() {
        let clickMe = this._button.nativeElement;

        clickMe.click();
    }

    private send () : void
    {
        let data: any = this._form.getRawData();

        this._loader.show('change-password');

        this._us.passwordChange(data)
        .subscribe( 
            (response:any) => {
                if ( response.code === 200 )
                {
                    this.setResponseObjOk();
                }
                else
                {
                    this.setResponseObjBad();
                }
                this._loader.dismiss('change-password');
            },
            ( err:any ) => {
                this.setResponseObjBad();
            },
            ( ) => {
                this._showResponse = true;
                this._loader.dismiss('change-password');
            }
        );
    }

    private setResponseObjOk () : void
    {
        this._response_obj = {title:'Tu contraseña ha sido actualizada',text:'',img:'/assets/img/icon-confirm.png',btn:'ACEPTAR',callback: this.goToAcount};
    }

    private setResponseObjBad () : void
    {
        this._response_obj = {title:'Ha habido un error en la actualización de la contraseña',text:'',img:'',btn:'ACEPTAR',callback: this.goToAcount};
    }

    private goToAcount () : void
    {
        this._router.navigate([environment.pathCampus + '/' + environment.pathAcount])
    }

    private backClick() {
		this._location.back();
	}
}

