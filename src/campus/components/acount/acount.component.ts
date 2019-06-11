import { Component, Inject, ViewContainerRef, ViewChild, ElementRef, SimpleChange, SimpleChanges, Renderer2, HostListener } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from "rxjs/Rx";

import { environment } from '../../../environments/environment';

import { Logger, MkFormService, MkForm } from 'mk';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { UserJobsDialogComponent } from '../dialogs/user-jobs/user-jobs-dialog.component';

import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../services/user.service';

import { User } from '../../models/user.model';

import { Loader } from 'mk';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { Response, Http, ResponseOptions } 								from "@angular/http";

@Component({
	templateUrl: './acount.component.html',
	styleUrls: ['./acount.component.scss']
})
export class AcountComponent
{
	@ViewChild('input_file') private inputFile:ElementRef;
	@ViewChild('input_file_name') private inputFileName:ElementRef;

	@ViewChild('button') private _button: ElementRef;
	@HostListener('window : resize') onresize() {
		this._currentWindowWidth = window.innerWidth;
	}

	private _form: MkForm;
	private _form_group: FormGroup;
	private _subscriptions: Array<Subscription>;

	private _onl1: Array<string>;
	private _onl2: Array<string>;
	private _onl3: Array<string>;
	private _key: string;

	private _ids: any;

	private _pass_change: string;

	private _response_obj: {title:string,text:string,img:string,btn:string,callback:any};
	private _sent: boolean;

	private _user : any;

	private _user_files: any;

	private currentUser : Object;

	private accountDetails : Object;
	private initDetails : Array<string>;

	private inactive : boolean;
	private _currentWindowWidth: number;

	private _fieldError: boolean;

	private _terms_and_conditions: string;

	private _input_file: any;
	private _input_file_name: any;
	private _file: any;

    private file_disabled: boolean;

	public constructor ( 
		private logger: Logger, 
		private _fs: MkFormService, 
		private _dialog: MatDialog, 
		private _vcr: ViewContainerRef, 
		private _as: AuthService,
		private _us: UserService,
		private _loader: Loader,
		private _router: Router,
        private _renderer: Renderer2) 
	{ 
		logger.log('ACOUNT COMPONENT'); 

		this._onl1 = ['oauth_user_first_name', 'oauth_user_last_name'];
		this._onl2 = ['user_details_prefix', 'oauth_user_phone'];
		this._onl3 = ['oauth_user_dni', 'oauth_user_email'];
	 	this._key = environment.icon_key;
	 	this._ids = null;

	 	this._pass_change = environment.pathPasswordChange;
		this._form = null;

		this._response_obj = {
            title: '',
            text: '',
            img: '',
            btn: '',
            callback: null
		};
		this._sent = false;

		this.currentUser = {
			'user_details_job' : '',
			'user_details_especialization' : '',
			'user_details_college' : ''
		}

		this.inactive = true;

		this._fieldError = false;

		this._terms_and_conditions = new Array(environment.pathCampus,environment.pathTermsAndConditions).join('/');
		
        this._user_files = [];
        
        this.file_disabled = true;
	}

	public ngOnInit () : void
	{
		this._currentWindowWidth = window.innerWidth;
		let source: User = this._us.users.getValue().find( (usr:User) => usr['token'] === this._as.getToken() );
		let obs: Observable<any> = source ? Observable.of(source) : this._us.get(this._as.getToken());

		this._loader.show('acount');

		this._input_file = this.inputFile.nativeElement;
		this._input_file_name = this.inputFileName.nativeElement;

		this._subscriptions = [ 
			this.subscribeUserCurrentDetails(), 
			this.subscribeUserForm(obs), 
			this.subscribeUserCurrentFiles() ,
			this.subscribeFileInput()
		];

        this._us.refreshFilesNeded$
        .subscribe(()=>{
            
            this.subF();
        });
    }

    private fileNameChange ()
    {
        debugger
        let v = this._input_file_name.value;

        if ( v.trim().length > 0 && this._file )
        {
            this.file_disabled = false;
        }
        else
        {
            this.file_disabled = true;
        }
    }

    private sendFile ()
	{
        let v = this._input_file_name.value;

		this._us.saveFile(v, this._file)
		.subscribe( (resp:any) => {
            
		});
	}
    
    private selectFile ()
    {
        this._input_file.click();
    }

    private deleteFile ( id )
    {   
        this._us.deleteFile( id )
        .subscribe( (resp:any) => {
            
        });
    }

	private subscribeUserCurrentFiles () : Subscription
	{
		return this._us.getUserFiles()
		.subscribe( (files:any) => {
			console.log(files);

			this._user_files = files.data;
		});
	}

    private subF () { 
        
        this._us.getUserFiles()
		.subscribe( (files:any) => {
			console.log(files);
            
			this._user_files = files.data;
        }); 
    }

	private subscribeUserCurrentDetails () : Subscription
	{
		return this._us.users
		.map( users => users.find(user => user['token'] === this._as.getToken()) )
		.subscribe( (user:any) =>
		{
			if ( user )
			{
				this.currentUser = user;
				this.accountDetails = {
					'oauth_user_first_name' : user.oauth_user_first_name,
					'oauth_user_last_name' : user.oauth_user_last_name,
					'oauth_user_dni' : user.oauth_user_dni,
					'oauth_user_email' : user.oauth_user_email,
					'user_details_prefix' : user.user_details_prefix,
					'oauth_user_phone' : user.oauth_user_phone,
					'oauth_user_password' : ''
				};
				this.initDetails = Object.values(this.accountDetails);
			}
		});
	}

	public ngOnDestroy () : void 
    { 
        this._subscriptions.forEach( sub => sub.unsubscribe() );
		//this.fileUpload = fileName;
        this._subscriptions.length = 0;
		this._loader.dismiss('acount'); 
    }
    
	private subscribeFileInput ()
	{
		return Observable.fromEvent(this._input_file, 'change')
        .subscribe( (x:Event) => {
			const reader = new FileReader();
			let tar:any = x.target;

            if(tar.files && tar.files.length) 
            {
                let f = tar.files[0];
                let fileName = f.name;

                const [file] = tar.files;
                reader.readAsDataURL(file);
            
                reader.onload = () => {
                    /*this._form_group.patchValue({
                        file: reader.result
                    });*/
				
				
                    this._file = reader.result;
                    
                    let v = this._input_file_name.value;

                    if ( v.trim().length > 0 && this._file )
                    {
                        this.file_disabled = false;
                    }
                    else
                    {
                        this.file_disabled = true;
                    }
                    // need to run CD since file load runs outside of zone
                    //this.cd.markForCheck();
                };
            }
		});
	}

    private subscribeUserForm ( observable: Observable<any> ) : Subscription
    {
    	return observable
    	.switchMap( ( user:any, i:number ) => 
    	{
    		if ( user.oauth_user_id === undefined ) {
    			this._as.logout();
			}
			this._ids = {'user': user.oauth_user_id }; 
    		return this._fs.forms.map( forms => forms.find( form => form.name === "user" ));
    	})
    	.subscribe( form =>
        {
        	if (form) 
            { 	
				this._form = form;
				this._form_group = this._form.formGroup;
				this.getFieldChange(this._form_group.controls);

				this._loader.dismiss('acount');
			}
        },
        (error) => {},
        () => {
			this._loader.dismiss('acount')
		});
	}

	private getFieldChange (groupControls) {

		let controls : Array<string> = Object.keys(groupControls);

		this.initDetails.forEach( detail => detail === undefined ? detail = '' : detail )

		controls.forEach( control => {			
			groupControls[control].valueChanges
				.debounceTime(1000)
				.distinctUntilChanged()
				.subscribe( sub => {				
					let currentDetails = [];
					for (let control in groupControls) {
						let value = groupControls[control].value;
						currentDetails.push(value)
					};
					
					this.arraysAreEqual(currentDetails, this.initDetails) ? 
						this.disableButton() : 
						this.enableButton();
				});
		});
	}

	private arraysAreEqual (arr1, arr2) {
		if ( arr1.length !== arr2.length ) return false;

		for ( var i = arr1.length; i--; ) {
			if ( arr1[i] !== arr2[i] ) return false;
		}
	
		return true;
	}

	private enableButton() {
		this.inactive = false;
		this._renderer.addClass(this._button.nativeElement, 'submit__button_active')
	}

	private disableButton() {
		this.inactive = true;
		this._renderer.removeClass(this._button.nativeElement, 'submit__button_active')
	}

	private openFirstDialog() : void
    {
    	let dialogRef = this._dialog.open(UserJobsDialogComponent, {
    		id: 'user-jobs-dialog',
    		panelClass: 'custom-dialog',
			viewContainerRef: this._vcr,
			disableClose: true,
      		data: { 
				ids: this._ids,
				ref: this._vcr
			}
		})
		.afterClosed().subscribe( result => {
			if (result.sent) {
				this._sent = true;
				this._response_obj = {
					title: '',
					text: 'Sus datos se han actualizado correctamente',
					img: '/assets/img/icon-confirm.png',
					btn: 'VOLVER',
					callback: this.goToAccount
				}
			} else if (result.error) {
				this._sent = true;
				this._response_obj = {
					title: '',
					text: 'Ha habido un error a la hora de actualizar sus datos. Por favor, vuelva a intentarlo',
					img: '',
					btn: 'VOLVER',
					callback: this.goToAccount
				}
			}
		});
	}

	private goToAccount () : void {
		this._sent = false;
		this.inactive = true;
		this._renderer.removeClass(this._button.nativeElement, 'submit__button_active')
	}

	private send () : void {
		this._loader.show('updating');
		let aux = this._form_group.getRawValue();
            
		let data = {
			'first_name': aux.oauth_user_first_name,
			'last_name': aux.oauth_user_last_name,
			'dni' : aux.oauth_user_dni,
			'email' : aux.oauth_user_email,
			'phone': aux.oauth_user_phone,
			'details': [{key: 'prefix', value: aux.user_details_prefix}]
		};

		let updatedDetails = {
			'oauth_user_first_name' : aux.oauth_user_first_name,
			'oauth_user_last_name' : aux.oauth_user_last_name,
			'oauth_user_dni' : aux.oauth_user_dni,
			'oauth_user_email' : aux.oauth_user_email,
			'user_details_prefix' : aux.user_details_prefix,
			'oauth_user_phone' : aux.oauth_user_phone,
			'oauth_user_password' : ''
		};

		this.initDetails = Object.values(updatedDetails);

		this._us.update(data)
        .subscribe( (response: any ) =>
        {
            let user : any = this._us.data.find((user : any) => {
                return user.oauth_user_id == this._ids.user
            })
            
            user.oauth_user_first_name = aux.oauth_user_first_name;
			user.oauth_user_last_name = aux.oauth_user_last_name;
			user.oauth_user_dni = aux.oauth_user_dni;
			user.oauth_user_email = aux.oauth_user_email;
            user.oauth_user_phone = aux.oath_user_phone;
            user.user_details_prefix = aux.user_details_prefix;
		},
		( error : any ) => {
			this._sent = true;
			this._response_obj = {
				title: '',
				text: 'Ha habido un error a la hora de actualizar sus datos. Por favor, vuelva a intentarlo',
				img: '',
				btn: 'VOLVER',
				callback: this.goToAccount
			};
			this._loader.dismiss('updating')
        },
        () => {
			this._sent = true;
			this._response_obj = {
				title: '',
				text: 'Sus datos se han actualizado correctamente',
				img: '/assets/img/icon-confirm.png',
				btn: 'VOLVER',
				callback: this.goToAccount
			};
			this._loader.dismiss('updating')
        }
        );
	}

	private falseClick() 
	{
        let clickableButton = this._button.nativeElement;

        clickableButton.click();
	}

	private showError() {
		this._fieldError = true;
	}
}