// -- Angular imports -----------------------------------------------------------------------------------------
import { Component, OnInit, ViewChild, ElementRef }                         							from '@angular/core';
import { AbstractControl, FormGroup }        									from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } 							from "rxjs/Rx"; 
import { Http, Response, Headers, RequestOptions } 								from '@angular/http';
import { Router } 																from '@angular/router';

import { Logger, MkFormService, MkForm }                                        from 'mk';

import { environment }                                                          from '../../../environments/environment';

import { AuthService }                                                          from '../../../shared/services/auth.service';


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent
{
    @ViewChild('button') private _button: ElementRef;

    private _campusUrl: string = '/' + environment.pathCampus;
	private _form: MkForm;
	private _form_group: FormGroup;
    private _subscriptions: Array<any>;
    private _error: boolean;
    private _fieldError: boolean;

	public constructor ( private _logger: Logger, private _fs: MkFormService, private _http: Http, private _router: Router, private _as: AuthService ) 
	{ 
		_logger.log('LOGIN COMPONENT'); 

		this._form_group = new FormGroup({});
        this._subscriptions = new Array();
        this._error = false;
        this._fieldError = false;
	}

	public ngOnInit () : void
	{
		this._subscriptions = [
            this.subscribeQuestionForm()
        ];
	}
	
	public ngOnDestroy () : void 
    { 
        this._subscriptions.forEach( sub => sub.unsubscribe());
        this._subscriptions.length = 0;
    }

    private subscribeQuestionForm () : Subscription
    {
        return this._fs.forms
        .map( forms => forms.find( form => form.name === "login" ) )
        .subscribe( form =>
        {
            if (form) 
            { 
                this._form = form; 
                this._form_group = this._form.formGroup;
                this._form_group.reset();
            }
        });
    }

    private falseClick() {
        let clickableButton = this._button.nativeElement;

        clickableButton.click();
    }

    private send () : void
    {
    	let obj: any = this._form_group.getRawValue();
        let url: string = this._as.redirectUrl ? this._as.redirectUrl : this._campusUrl;

    	obj.product_id = 0;
        obj.grant_type = 'password';
    	this._as.login(obj)
    	.first()
        .subscribe( ( response: Response ) =>
    	{
            if ( response['ok'] )
            {
                let aux: any = {
                    access_token: response['access_token'],
                    refresh_token: response['refresh_token'],
                    _token: response['_token'],
                    expires_in: response['expires_in'],
                    product_id: 0
                };
                
                this._as.setSession(aux).first().subscribe((response: Response) =>
                {
                    
                });

                this._router.navigateByUrl(url);
            }
            else
            {
                this._logger.log(response['error_description']);
                this._error = true;
            }            
    	});
    }

    private checkError () {
        this._fieldError = true;
    }
}