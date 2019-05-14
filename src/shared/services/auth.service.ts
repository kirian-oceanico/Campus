import { Injectable, Inject }                                                   from '@angular/core';
import { Http, Response }                                                       from '@angular/http';
import { Observable }                                                           from 'rxjs/Observable';

import { RouterModule, Routes, Router }                                         from '@angular/router';

import { StorageService }                                                       from './storage.service';
import { environment }                                                          from '../../environments/environment';
import { Logger, Loader }	                                                    from 'mk';

@Injectable()
export class AuthService 
{
	// store the URL so we can redirect after logging in
  	private _redirectUrl: string;
	private _ssoLogin: string;

    private _user_id: string;

	public constructor ( private _http: Http, private _logger: Logger, private _loader: Loader, private _storage: StorageService, private _router: Router )
	{
		this._ssoLogin = environment.ssoLoginUrl;
        this._user_id = 'token';
        this.clearRedirect();
	}

	public get redirectUrl () : string { return this._redirectUrl; }

	public set redirectUrl ( url: string ) { this._redirectUrl = url; }

  	public login( data: any ): Observable<Response> 
  	{
  	  	return this._http.post( this._ssoLogin, data )
        .map( (response:any) => {
            let res: any = response.json();
			if ( res.access_token )
            {
                res.ok = true;
                this._storage.set(this._user_id, res.access_token);
            }
            this.clearRedirect();
            return res;
        });
  	}
	
  	public logout(): void 
  	{
  	  	this._storage.clear();
        this._redirectUrl = null;
        this._router.navigateByUrl('');
  	}

  	public isLoggedIn () : boolean
  	{
        let token: string = this._storage.get(this._user_id);
  		return token && token != 'undefined';
	}
	
	public getToken () 
	{
		return this._storage.get(this._user_id);
	}

    private clearRedirect () : void
    {
        this._redirectUrl = null;
    }

    public setSession (data: any): Observable<Response> 
    {
        return this._http.post( environment.ssoUrl + '/sso/set_no_redirect', data );
    }
}