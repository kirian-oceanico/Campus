// --- Angular imports --------------------------------------------------------------------------------------------------------------
import { NgModule, ModuleWithProviders }      					from '@angular/core';
import { CommonModule } 										from '@angular/common'; 

import { RouterModule, Routes } 								from '@angular/router';

import { FormsModule, ReactiveFormsModule } 											from '@angular/forms';

// --- Mk imports -----------------------------------------------------------------------
import { Logger, CoreModule, CommonModule as MkC, FormModule }	from 'mk';

// --- App imports ----------------------------------------------------------------------
import { campusRoutes }											from './campus.routes';

import { CampusComponent }										from './components/main/campus.component';
import { AcountComponent }										from './components/acount/acount.component';
import { CoursesComponent }										from './components/courses/courses.component';
import { CourseCardComponent }									from './components/course-card/course-card.component';
import { CertificatesComponent }								from './components/certificates/certificates.component';
import { CertificateCardComponent }								from './components/certificate-card/certificate-card.component';
import { CertificateRequestComponent }							from './components/certificate-request/certificate-request.component';
import { PasswordChangeComponent }								from './components/password-change/password-change.component';
import { AvatarComponent }										from './components/avatar/avatar.component';
import { CropperComponent }										from './components/cropper/cropper.component';

import { SharedModule }											from '../shared/shared.module';

import { DraggableDirective } 									from './directives/draggable.directive';

import { PopoverModule } 										from 'ngx-popover'

import { CourseActivacionComponent }							from './components/course-activacion/course-activacion.component';

// --- Dialogs --------------------------------------------------------------------------
import { UserJobsDialogComponent } from './components/dialogs/user-jobs/user-jobs-dialog.component';
import { FormErrorDialog } from './components/dialogs/form-error/form-error-dialog.component';
import { CourseClosedDialog } from './components/dialogs/course-closed/course-closed-dialog.component';

import { LogOutComponent } from './components/log-out/log-out.component';

/**
 *	Widget module for common components and directives
 */
@NgModule({
	imports: 		[ 
		CommonModule,
		RouterModule.forChild(campusRoutes),

		CoreModule.forRoot(),
    	MkC,
    	FormModule,
    	
    	ReactiveFormsModule,

		SharedModule,

		PopoverModule
	],
	entryComponents:[ 
		UserJobsDialogComponent, 
		CropperComponent, 
		FormErrorDialog,
		CourseClosedDialog ],
	declarations: 	[ 
		CampusComponent, 
		AcountComponent, 
		CoursesComponent, 
		CourseCardComponent, 
		CertificatesComponent, 
		CertificateCardComponent, 
		CertificateRequestComponent, 
		UserJobsDialogComponent, 
		FormErrorDialog,
		CourseClosedDialog,
		PasswordChangeComponent,
		AvatarComponent, 
		CropperComponent, 
		DraggableDirective,
		LogOutComponent,
		CourseActivacionComponent
	],
	exports: 		[ CampusComponent ]
})
export class CampusWidgetModule
{
	public constructor ( private logger: Logger ) { this.logger.log('CAMPUS-WIDGET-MODULE'); }
}