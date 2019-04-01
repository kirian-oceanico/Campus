import { Component, ViewChild, HostListener }                         							from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } 						from '@angular/router';

import { Observable, BehaviorSubject, Subscription } 					from "rxjs/Rx";

import { Logger }														from 'mk';

import { environment }													from '../../../environments/environment';		

@Component({
	templateUrl: './campus.component.html',
	styleUrls: ['./campus.component.scss'],
})
export class CampusComponent
{
	@HostListener('window : resize') onresize() {
		this._currentWindowWidth = window.innerWidth;
	}
	private _subscriptions: Array<Subscription>;
	private _courses: string;
	private _certificates: string;
	private _acount: string;
	private _terms_and_conditions: string;

	private _outer_class: string;

	private _cuenta : boolean;
	private _cursos : boolean;
	private _certificados : boolean;
	private _terminos : boolean;
	private _password : boolean;

	private _currentWindowWidth: number;

	public constructor ( private _logger: Logger, private _router: Router, private _route: ActivatedRoute ) 
	{ 
		this._logger.log('CAMPUS COMPONENT'); 
		this._acount =  new Array(environment.pathCampus,environment.pathAcount).join('/');
		this._courses = new Array(environment.pathCampus,environment.pathCourses).join('/');
		this._certificates = new Array(environment.pathCampus,environment.pathCertificates).join('/');
		this._terms_and_conditions = new Array(environment.pathCampus,environment.pathTermsAndConditions).join('/');
		this._subscriptions = new Array();
		this._outer_class = '';

		this._cuenta = true;
		this._cursos = false;
		this._certificados = false;
		this._terminos = false;
	}

	public ngOnInit () : void
	{
		this._currentWindowWidth = window.innerWidth;
		this._outer_class = this.getSegment();
		this.activeClass(this._outer_class);
		this._subscriptions = [	
			this.subscribeRouterEvents()
		];
	}

	public ngOnDestroy () : void 
    { 
        this._subscriptions.forEach( sub => {
            sub.unsubscribe()
        });
        this._subscriptions.length = 0;
    }

	private getSegment () : string
	{
		let reg: any = new RegExp('\/.*\/([^;]*)|\/?');
		let segment = this._router.url;
		let res: any = reg.exec(segment);
		return res[1];
	}

	private subscribeRouterEvents () : Subscription
	{
		return this._router.events
  		.filter((event) => event instanceof NavigationEnd)
  		.map(() => this._route)
  		.subscribe((event) => {
			this._outer_class = this.getSegment();
			this.activeClass(this._outer_class);
  		});
	}

	private activeClass (cl) {
		cl === 'mi-cuenta' ? this._cuenta = true : this._cuenta = false;

		cl === 'mis-cursos' ? this._cursos = true : this._cursos = false;

		cl === 'mis-certificaciones' ? this._certificados = true : this._certificados = false;

		cl === 'terminos-y-condiciones' ? this._terminos = true : this._terminos = false;

		cl === 'cambiar-contrasena' ? this._password = true : this._password = false;
	}
}