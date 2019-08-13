import { Inject, Injectable, Optional }							from '@angular/core';
import { Response, Http } 										from "@angular/http";
import { Observable, BehaviorSubject,Subscription } 			from "rxjs/Rx";

import { environment }											from '../../environments/environment';

import { DataServiceInterface }									from 'mk';
import { DataService }											from 'mk';

import { Logger }												from 'mk';
import { Loader }												from 'mk';

import { Producto, ProductoInterface }				    		from '../models/producto.model';

import { Sello, SelloInterface }                				from '../models/sello.model';
import { EntidadCertificadora, EntidadCertificadoraInterface } 	from '../models/entidad-certificadora.model';
import { Licencia, LicenciaInterface }              			from '../models/licencia.model';
import { AuthService } from '../../shared/services/auth.service';

export class CoursesService extends DataService<Producto>
{
	private _prodUrl: string = environment.getConsumerProducts;

	public constructor (
		private http: Http,
		private loader: Loader,
		private logger: Logger,
		private _as: AuthService )
	{
		super(Producto, logger, loader);
	}

	public get courses () : Observable<Array<Producto>> { return this.subject.asObservable(); }

	public getById ( id: number|string ) : Observable<any>
	{
		return null
	};

	public load ( data: {[key:string]:any} = {} ) : Subscription
	{
		let user_id = this._as.getToken();

		return this.http.get(this._prodUrl + user_id, data)
		// return this.http.get(this._prodUrl)
		.subscribe( (resp: any) =>
		{
			let datos: any = resp.json();
			let productos: Array<Producto> = new Array();
			let aux: any;

			for (let p of datos.data)
			{
				aux = p;
				aux.stamp = new Sello(aux.stamp);
				aux.certifying_entity = new EntidadCertificadora(aux.certifying_entity);
				aux.license = new Licencia(aux.license);
				productos.push(new Producto(aux));
			}

			this.loader.dismiss('courses');

			for(let prod of productos)
			{
				this.updateData(prod);
			}
            this.emit();
		});
	}
}
