import { Component, Input, Output, EventEmitter, ViewChild, 
	ElementRef }			                         					from '@angular/core';

import { Loader, Logger, MkFormService, MkForm }						from 'mk';
import { Router, ActivatedRoute } 										from '@angular/router';

import { UserService } 													from '../../services/user.service';

import { Observable, BehaviorSubject, Subscription } 					from "rxjs/Rx";

import { Producto, ProductoInterface }				    				from '../../models/producto.model';			

import { Http }															from '@angular/http';

import { environment }													from '../../../environments/environment';
import { CertificatesService } 											from '../../services/certificates.service';
		

@Component({
	selector: 'certificate-request',
	templateUrl: './certificate-request.component.html',
	styleUrls: ['./certificate-request.component.scss']
})
export class CertificateRequestComponent
{
	@ViewChild('button') private _button: ElementRef;	
	@Output ('close') _close: EventEmitter<null> = new EventEmitter<null>()
	@Output ('submit') _submit: EventEmitter<null> = new EventEmitter<null>()

	@Input('code') set code ( c : any ) {
		this.userCode = c;
	}

	private _form: MkForm;
	private _subscriptions: Array<Subscription>;
	private userCode : any;
	private _userInfo : any;

	public constructor ( 
		private loader: Loader, 
		private logger: Logger, 
		private _route: ActivatedRoute, 
		private _fs: MkFormService, 
		private _http: Http, 
		private _cfs: CertificatesService,
		private _us: UserService 
	)

	{ 
		logger.log('CERTIFICATE REQUEST COMPONENT');
	}

	public ngOnInit () : void
	{
		this._us.getUserData(this.userCode)
		.subscribe( info => {
			this._userInfo = info;
		},
		(err) => {},
		() => {
			this._subscriptions = [	
				this.subscribeQuestionForm()
			];
			this.loader.dismiss('form-request');
		});
	}

	private falseClick() {
        let clickableButton = this._button.nativeElement;

        clickableButton.click();
    }

	private close () : void
	{
		this._close.emit();
	}

	private send () : void
	{
		let data: any = this._fs.getFormData('certificate-request').formGroup.getRawValue();
		this.logger.log(data);
		this._cfs.register(data);
		this._submit.emit();
	}

	 private subscribeQuestionForm () : Subscription
    {
    	return this._fs.forms
        .map( forms => forms.find( form => form.name === 'certificate-request' ))
        .subscribe( form =>
        {
            if (form) 
            { 
				this._form = form;
				this._form.formGroup.patchValue(this._userInfo);
            }
        });
    }
}