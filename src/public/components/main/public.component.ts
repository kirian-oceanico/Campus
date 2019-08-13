import { Component }                         							from '@angular/core';

import { Logger }														from 'mk';

@Component({
	templateUrl: './public.component.html',
	styleUrls: ['./public.component.scss']
})
export class PublicComponent
{
	public constructor ( private logger: Logger ) { logger.log('PUBLIC COMPONENT'); }
}
