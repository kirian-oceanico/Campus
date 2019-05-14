// -- Angular imports -----------------------------------------------------------------------------------------
import { Component, OnInit, Inject, ViewChild, ElementRef }                     from '@angular/core';
import { AbstractControl, FormGroup }        									from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } 							from "rxjs/Rx"; 
import { Http, Response, Headers, RequestOptions } 								from '@angular/http';
import { Router, ActivatedRoute } 										        from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA }                             from '@angular/material';

import { environment }                                                          from '../../../environments/environment';


import { Logger, Loader, MkFormService, MkForm }					            from 'mk';

import { PasswordService }                                                      from '../../services/password.service';


@Component({
	templateUrl: './password-recovery.component.html',
    styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent
{
    @ViewChild('button') private _button: ElementRef;

    private _subscriptions: Array<any>;

    private _title: string;
    private _text: string;
    private _img: string;
    private _btn: string;
    private _form: FormGroup;

    private _usr: string;

    private _recovery: boolean;
    private _change: boolean;

    private _show_response: boolean;

    private _response_obj: {title:string,text:string,img:string,btn:string,callback:any};

    private _publicUrl: string;

    private _fieldError: boolean;

    constructor ( 
        private _logger: Logger, 
        private _loader: Loader, 
        private _router: Router, 
        private _route: ActivatedRoute, 
        private _ps: PasswordService, 
        private _fs: MkFormService )
    {
        this._logger.log('PASSWORD-RECOVERY.COMPONENT');

        this._subscriptions = new Array();

        this._usr = _route.snapshot.params['usr'];
        this._recovery = this._usr ? false : true;
        this._change = !this._recovery;

        this._show_response = false;

        this._title = this._recovery ? 'Vamos a buscar tu cuenta' : 'Ingresa tu nueva contraseña';
        this._text = this._recovery ? 'Introduce tu dirección de correo electrónico o tu número de teléfono' : '';
        this._img = this._recovery ? 'assets/img/icon-search.png' : 'assets/img/icon-text.png';
        this._btn = this._recovery ? 'RECUPERAR CONTRASEÑA' : 'CAMBIAR CONTRASEÑA';
        this._form = null;

        this._publicUrl = environment.pathPublic;

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

    private falseClick() {
        let clickableButton = this._button.nativeElement;

        clickableButton.click();
    }

    private send ( ) : void
    {
        let form: any;
        if ( this._recovery )
        {
            form = this._form.getRawValue();
            this._loader.show('password');
            this._ps.recoveryMail({email: form.recover, url: environment.domain})
            .subscribe( (response:any) =>
            {
                let res: any = response.json();
                if ( res.code === 200 )
                {
                    //handle the response in case of phone or e-mail submitted
                    isNaN(form.recover) === true ? this.setResponseRecoveryMail(res) : this.setResponseRecoveryPhone(res);
                }
                else 
                {
                    this.setResponseError(res);
                }
                this._show_response = true;
                this._loader.dismiss('password');
            });
        }
        else
        {
            form = this._form.getRawValue();
            if ( form.new_passwd === form.passwd ) 
            {
                form.token = this._usr;
                this._loader.show('password');
            
                this._ps.newPass(form)
                .subscribe( (response:any) =>
                {
                    let res: any = response.json();
                    if ( res.code === 200 )
                    {
                        this.setResponseNewPass(res);
                    }
                    this._show_response = true;
                    this._loader.dismiss('password');
                });
            }
        }
        
    }

    private goToLogin () : void 
    {
        this._router.navigateByUrl(this._publicUrl);
    }

    private mustShow () : boolean
    {
        return !this._show_response;
    }

    private setResponseRecoveryMail ( res: any ) : void
    {
        this._response_obj = {
            title: 'Te acabamos de enviar un enlace',
            text: 'Comprueba tu correo electrónico y haz clic en el enlace, revisa tu carpeta de spam',
            img: 'assets/img/icon-plane.png',
            btn: 'REENVIAR ENLACE',
            callback: this.send
        };
    }

    private setResponseRecoveryPhone ( res: any ) : void
    {
        this._response_obj = {
            title: 'Te acabamos de enviar un SMS',
            text: 'Sigue las instrucciones para completar la petición',
            img: 'assets/img/icon-plane.png',
            btn: 'REENVIAR MENSAJE',
            callback: this.send
        };
    }

    private setResponseNewPass ( res: any ) : void
    {
        this._response_obj = {
            title: 'Tu constraseña ha sido modificada con éxito.',
            text: '',
            img: 'assets/img/icon-confirm.png',
            btn: 'INGRESAR',
            callback: this.goToLogin
        };
    }

    private setResponseError ( res: any ) : void
    {
        this._response_obj = {
            title: 'HA OCURRIDO UN ERROR',
            text: 'No se ha podido procesar su petición. Por favor, inténtelo más tarde.',
            img: '',
            btn: 'VOLVER A LOG IN',
            callback: this.goToLogin
        }
    }

    private subscribeQuestionForm () : Subscription
    {
        if (this._recovery) return this._fs.forms
            .map( forms => forms.find( form => form.name === 'recovery-password' ))
            .subscribe( form =>
            {
                if (form) { 
                    this._form = form.formGroup;
                    this._form.reset();
                }
            });
        if (this._change) return this._fs.forms
            .map( forms => forms.find( form => form.name === 'passchange' ))
            .subscribe( form =>
            {
                if (form) { 
                    this._form = form.formGroup; 
                    this._form.reset();
                }
            });
    }

    private checkError () 
    {
        this._fieldError = true;
    }
}    