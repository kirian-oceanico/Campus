// -- Angular imports -------------------------------------------------------------------------------
import { RouterModule, Routes } from '@angular/router';

// -- App imports -----------------------------------------------------------------------------------
import { CampusComponent }										from './components/main/campus.component';
import { AcountComponent }										from './components/acount/acount.component';
import { CoursesComponent }										from './components/courses/courses.component';
import { CertificatesComponent }								from './components/certificates/certificates.component';
import { CertificateRequestComponent }							from './components/certificate-request/certificate-request.component';
import { PasswordChangeComponent }								from './components/password-change/password-change.component';
import { TermsAndConditionsComponent }							from './components/terms-and-conditions/terms-and-conditions.component';

import { AuthGuard }											from '../shared/services/auth-guard.service';


import { environment }											from '../environments/environment';

export const campusRoutes: Routes = 
[
	{ 
		path: environment.pathCampus, 
		component: CampusComponent,
		canActivate: [AuthGuard],
		children: [
			{	
				path: '',
				canActivateChild: [AuthGuard],
				children: [
					{ path: '', redirectTo: environment.pathAcount, pathMatch: 'full' },
					{ path: environment.pathAcount, component: AcountComponent },
					{ path: environment.pathCourses, component: CoursesComponent },
					{ path: environment.pathCertificates, component: CertificatesComponent },
					{ path: environment.pathPasswordChange, component: PasswordChangeComponent },
					{ path: environment.pathTermsAndConditions, component: TermsAndConditionsComponent }
				],
				//component: CampusComponent
			}
		]
	}
];