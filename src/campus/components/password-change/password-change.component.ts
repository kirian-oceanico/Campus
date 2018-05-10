import { Component, Inject, ViewContainerRef }                         	from '@angular/core';
import { Observable, BehaviorSubject, Subscription } 					from "rxjs/Rx";

import { Router }                                                       from '@angular/router';

import { environment }													from '../../../environments/environment';

import { UserService }                                                  from '../../services/user.service';

import { Logger, MkFormService, MkForm }								from 'mk';

@Component({
	templateUrl: './password-change.component.html',
	styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent
{
	private _form: MkForm;
	private _subscriptions: Array<Subscription>;
	
    private _showResponse: boolean;

	public constructor ( private _logger: Logger, private _router: Router, private _fs: MkFormService, private _us: UserService ) 
	{ 
		_logger.log('PasswordChangeComponent');

        this._showResponse = false;
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
            }
        });
    }

    private send () : void
    {
        let data: any = this._form.getRawData();

        this._us.passwordChange(data)
        .subscribe( (response:any) => {
            this._showResponse = true;
        },
        (err:any) => {

        });
    }

    private goToAcount () : void
    {
        this._router.navigate([environment.pathCampus + '/' + environment.pathAcount])
    }
}

