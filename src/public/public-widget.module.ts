// --- Angular imports --------------------------------------------------------------------------------------------------------------
import {NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } 										from '@angular/common';

import { RouterModule, Routes } 								from '@angular/router';

import { FormsModule, ReactiveFormsModule } 											from '@angular/forms';

// --- Mk imports -----------------------------------------------------------------------
import { Logger, CoreModule, CommonModule as MkC, FormModule }	from 'mk';

// --- App imports ----------------------------------------------------------------------
import { publicRoutes }											from './public.routes';

import { PublicComponent }										from './components/main/public.component';
import { LoginComponent }										from './components/login/login.component';
import { RegistroComponent }									from './components/registro/registro.component';
import { PasswordRecoveryComponent }							from './components/password-recovery/password-recovery.component';
//import { PasswordChangeComponent }							from './components/password/password-change.component';
import { RegistroDialogComponent } from './components/registro-dialog/registro-dialog.component'


import { SharedModule }											from '../shared/shared.module';

/**
 *	Widget module for common components and directives
 */
@NgModule({
	imports: 		[
		CommonModule,
		RouterModule.forChild(publicRoutes),

		CoreModule.forRoot(),
    	MkC,
    	FormModule,

    	ReactiveFormsModule,

    	SharedModule
	],
	entryComponents:[ RegistroDialogComponent ],
	declarations: 	[
		PublicComponent,
		LoginComponent,
		RegistroComponent,
		PasswordRecoveryComponent,
		RegistroDialogComponent,
		/*PasswordChangeComponent, DialogTermsAndConditionsComponent,*/ ],
	exports: 		[ PublicComponent ]
})
export class PublicWidgetModule
{
	public constructor ( private logger: Logger ) { this.logger.log('PUBLIC-WIDGET-MODULE'); }
}
