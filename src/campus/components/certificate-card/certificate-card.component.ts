import { Component, Input, Output, EventEmitter }                         					from '@angular/core';

import { Logger }														from 'mk';

import { Producto, ProductoInterface }				    				from '../../models/producto.model';			
import { Router } 																from '@angular/router';

import { environment }													from '../../../environments/environment';
		

@Component({
	selector: 'certificate-card',
	templateUrl: './certificate-card.component.html',
	styleUrls: ['./certificate-card.component.scss']
})
export class CertificateCardComponent
{
	@Input('certificate') set certificate ( c: any )
	{
		this._id = c.id;
		this._title = c.name;
		this._img = this._suite + '/' + c.multimidia.default_image;
		this._code = c.license.code;
	}

	@Output('request') _request: EventEmitter<string> = new EventEmitter<string>();

	private _suite: string;

	private _id: number|string;
	private _title: string;
	private _img: string;
	private	_code: string;

	public constructor ( private logger: Logger, private _router: Router ) 
	{ 
		logger.log('CERTIFICATE CARD COMPONENT');
		this._suite = environment.suiteUrl;
		//this._request = environment.pathCampus + '/' + environment.pathCertificateRequest;
	}

	public ngOnInit () : void
	{
	}

	private go () : void
	{
		//this._router.navigate([this._request, { code: this._code }] );
		this._request.emit(this._code);
	}
}