import { Component }      									from '@angular/core';
import { Location }											from '@angular/common';
import { PrivacyService }									from '../../services/privacy.service';
import { AuthService } 										from '../../../shared/services/auth.service';
import { UserService }										from '../../services/user.service';
import { Loader }											from 'mk';


@Component({
	templateUrl: './terms-and-conditions.component.html',
	styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent
{
	private _privacyText: any;

	public constructor ( 
		private _location : Location, 
		private _ps : PrivacyService, 
		private _us : UserService, 
		private _as : AuthService, 
		private _loader : Loader ) 
	{ 
		
	}

	ngOnInit() {
		this._us.get(this._as.getToken())
			.subscribe((user : any) => {
				if ( user.oauth_user_country === 'Argentina' ) this.getText('argentina');
				else this.getText('default')
			});
	}

	private backClick() {
		this._location.back();
	}

	private getText(string) {
		this._ps.getPrivacyTerms(string)
			.subscribe(response => {
				this._privacyText = JSON.parse(response._body).html.join('');
			})
	}

}
