import { Component }                from '@angular/core';
import { Router }					from '@angular/router';
import { environment }				from '../../../environments/environment';		

@Component({
    selector: 'terms-footer',
	templateUrl: './footer_terms.component.html',
    styleUrls: ['./footer_terms.component.scss']
})
export class FooterTermsComponent {

    private _terms_and_conditions: string;

    constructor ( private _router: Router ) {
		this._terms_and_conditions = new Array(environment.pathCampus,environment.pathTermsAndConditions).join('/');
    }
}