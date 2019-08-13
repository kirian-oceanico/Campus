// --- Angular imports --------------------------------------------------------------------------------------------------------------
import {NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { Http }																								from '@angular/http';

// --- App imports ------------------------------------------------------------------------------------------------------------------
import { Loader, Logger, MkFormService }																	from 'mk';
import { CampusServiceModule }																				from './campus-service.module'
import { CampusWidgetModule }																				from './campus-widget.module';

import { CoursesService }																					from './services/courses.service';
import { UserService }																						from './services/user.service';

import { SharedModule } from '../shared/shared.module'

@NgModule({
	imports: 		[
		CampusServiceModule.forRoot(),
		CampusWidgetModule,
		SharedModule
	],
	entryComponents:[ ],
	declarations: 	[ ],
	exports: 		[ CampusWidgetModule ],
	providers: 		[ Loader, Logger ]
})
export class CampusModule
{
	public constructor ( private logger: Logger, private fs: MkFormService, private cs: CoursesService, private us: UserService )
	{
		this.logger.log('CAMPUS-MODULE');

		fs.addServices([cs, us]);
	}
}
