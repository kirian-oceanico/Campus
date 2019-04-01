// --- Angular imports --------------------------------------------------------------------------------------------------
import { NgModule, ModuleWithProviders }      													from '@angular/core';
import { Http }																					from '@angular/http';
import { CommonModule }																			from '@angular/common';
import { Logger, Loader }																		from 'mk';

// --- App imports ------------------------------------------------------------------------------------------------------
//import { PasswordRecoveryService }																from './services/password-recovery.service';

import { CoursesService }																		from './services/courses.service';
import { UserService }																			from './services/user.service';

import { AuthService } from '../shared/services/auth.service';
import { CertificatesService } from './services/certificates.service';
import { PrivacyService } 	from './services/privacy.service';


@NgModule({
	imports: 		[ ],
	entryComponents:[ ],
	declarations: 	[ ],
	exports: 		[ ]
})
export class CampusServiceModule
{
	public constructor ( private logger: Logger ) { this.logger.log('PUBLIC-SERVICE-MODULE'); }

	// -- Asegura que los services declarados en el modulo sean singleton --
	static forRoot(): ModuleWithProviders 
	{
		return {
			ngModule: CampusServiceModule,
			providers: [

				{
					provide: CoursesService,
					useClass: CoursesService,
					deps: [ Http, Loader, Logger, AuthService ]
				},
				{
					provide: UserService,
					useClass: UserService,
					deps: [ Http, Loader, Logger, AuthService ]
				},
				{
					provide: CertificatesService,
					useClass: CertificatesService,
					deps: [ Http ]
				},
				{
					provide: PrivacyService,
					useClass: PrivacyService,
					deps: [ Http ]
				}
			]
		}
	}
}