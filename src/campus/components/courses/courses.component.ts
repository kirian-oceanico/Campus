import { Component, ViewChildren, ElementRef, ViewChild, 
	QueryList, Renderer2, HostListener }                    							from '@angular/core';
import { Observable, BehaviorSubject, Subscription } 					from "rxjs/Rx"; 

import { Logger, Loader }												from 'mk';

import { CoursesService }												from '../../services/courses.service';			

@Component({
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.scss']
})
export class CoursesComponent
{
	@ViewChildren('curso') private _curso : any;
	@ViewChild('carousel') private _carousel : any;
	@HostListener('window : resize') onresize() {
		this._currentWindowWidth = window.innerWidth;
	}
	private _subscriptions: Array<any>;
	private _courses: Array<any>;
	public amount : any;
	private _first : boolean;
	private _last : boolean;
	private _cardsShown : any;
	private progressBarWidth : any;
	private progressBarWidthPerCard : any;
	private showInicio : boolean;
	private _currentCourse : any;

	private _currentWindowWidth : number;

	public constructor ( 
		private logger: Logger, 
		private _cs: CoursesService, 
		private _loader: Loader, 
		private renderer: Renderer2 ) 
	{ 
		logger.log('COURSES COMPONENT'); 
		this._subscriptions = new Array();
		this.amount = 0;
		this.progressBarWidth = 0;
		this.showInicio = false;
	}

	public ngOnInit () : void
	{
		this._currentWindowWidth = window.innerWidth;
		this._subscriptions = [
            this.subscribeCourses()
        ];

        if ( this._cs.subject.getValue().length <= 0 )
        {
			setTimeout(()=>{
				//este loader se borra en COURSES SERVICE
				this._loader.show('courses');
			}, 100);

        	this._cs.load();
		};

		this._first = true;
	}

	public ngOnDestroy () : void 
    { 
        this._subscriptions.forEach( sub => sub.unsubscribe());
		this._subscriptions.length = 0;
	}
	
	private subscribeCourses () : Subscription
    {
    	return this._cs.courses.subscribe( courses => {
			this._courses = courses;
		});
	}
	
	public plusSlide () : void {
		let cardWidth = this._curso._results[0].nativeElement.clientWidth;
		let containerWidth = this._carousel.nativeElement.clientWidth;

		this._cardsShown = containerWidth / cardWidth;

		let totalCards = this._curso._results.length;

		let maxValueTranslateX = cardWidth * (totalCards - this._cardsShown);

		this.progressBarWidthPerCard = ( 100 / (this._courses.length) );

		if ( this.progressBarWidth === 0 ) this.progressBarWidth =  this.progressBarWidthPerCard * this._cardsShown;	
		
        //el valor de translateX tiene que disminuir para avanzar
		if ( cardWidth < maxValueTranslateX + this.amount ) {
			this.amount -= cardWidth;
			this.progressBarWidth += this.progressBarWidthPerCard;
			this._first = false;
		} else if ( maxValueTranslateX > -this.amount ) {
			let resto = maxValueTranslateX + this.amount;
			this.amount -= resto;
		} 
		
		if ( maxValueTranslateX === -this.amount ) {
			this._last = true;
			this.progressBarWidth = 100;
		}
	};

	public minusSlide () : void {
		let cardWidth = this._curso._results[0].nativeElement.clientWidth;

        //el valor de translateX tiene que aumentar para retroceder
		if ( -this.amount >= cardWidth ) {
			this.amount += cardWidth;
			this.progressBarWidth -= this.progressBarWidthPerCard
			this._last = false;
		} else {
			this.amount = 0;
		}

		if ( this.amount === 0 ) this._first = true;
	};

	// ABRIR-CERRAR EL COMPONENTE DE ACTIVACION DE CURSO 

	private onInicio(init) {
		this.showInicio = true;
		this._currentCourse = init;
	}

	private onClose(action) {
		action ? this.showInicio = false : this.showInicio = true;
	}
}