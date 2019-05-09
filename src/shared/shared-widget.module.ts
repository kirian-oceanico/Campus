// --- Angular imports --------------------------------------------------------------------------------------------------------------
import { NgModule, ModuleWithProviders }      					from '@angular/core';
import { CommonModule } 										from '@angular/common'; 
import { RouterModule } 								from '@angular/router';

import { FormsModule, ReactiveFormsModule } 					from '@angular/forms';

// --- Mk imports -----------------------------------------------------------------------
import { Logger, CoreModule, CommonModule as MkC, FormModule }	from 'mk';

import { ResponseComponent }									from './components/response/response.component';
import { FooterTermsComponent }									from './components/footer_terms/footer_terms.component';

/**
 *	Widget module for common components and directives
 */
@NgModule({
	imports: 		[ 
		CommonModule,
		RouterModule,
		CoreModule.forRoot(),
    	MkC,
    	FormModule,
    	ReactiveFormsModule
	],
	entryComponents:[ ],
	declarations: 	[ ResponseComponent, FooterTermsComponent ],
	exports: 		[ ResponseComponent, FooterTermsComponent ]
})
export class SharedWidgetModule
{
	public constructor ( private logger: Logger ) { this.logger.log('SHARED-WIDGET-MODULE'); }
}