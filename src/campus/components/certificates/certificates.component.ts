import { Component, ViewChild, ViewChildren, Renderer2, HostListener }				from '@angular/core';
import { Observable, BehaviorSubject, Subscription } 					from "rxjs/Rx"; 
import { Logger, Loader }														from 'mk';
import { CoursesService }												from '../../services/courses.service';

@Component({
	templateUrl: './certificates.component.html',
	styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent
{
    @ViewChild('carousel') private _carousel : any;
    @ViewChildren('certificado') private _certificado : any;
    @HostListener('window : resize') onresize() {
        this._currentWindowWidth = window.innerWidth;
    }
	private _subscriptions: Array<any>;
    private _certificates: Array<any>;
    
    private amount : any;
    private _first : boolean;
    private _last : boolean;
    private _cardsShown : any;
    private progressBarWidth : any;
    private progressBarWidthPerCard : any;

    private _showRequest: boolean;
    private _sent: boolean;
    private _response_obj: {title:string,text:string,img:string,btn:string,callback:any};
    private _code : any;

    private _currentWindowWidth: number;

	public constructor ( 
        private logger: Logger, 
        private _loader: Loader, 
        private _cs: CoursesService,
        private renderer: Renderer2 ) 
	{ 
        logger.log('CERTIFICATES COMPONENT');
        this._subscriptions = new Array();
        this._showRequest = false;
        this._sent = false;

        this.amount = 0;
        this.progressBarWidth = 0;

        this._response_obj = {
            title: '',
            text: '',
            img: '',
            btn: '',
            callback: null
        };
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
                // este loader se borra en COURSES SERVICE
                this._loader.show('courses');
            }, 100);

            this._cs.load();
        }

        this._first = true;
    }
	
	public ngOnDestroy () : void 
    { 
        this._subscriptions.forEach( sub => sub.unsubscribe());
        this._subscriptions.length = 0;
    }

    private subscribeCourses () : Subscription
    {
        return this._cs.courses.subscribe( ( certificates : any ) => {
            this._certificates = certificates.filter( certificate => certificate.license.status === 'terminated' );          
        });
    }

    public plusSlide () : void {
        let cardWidth = this._certificado._results[0].nativeElement.clientWidth;
        let containerWidth = this._carousel.nativeElement.clientWidth;

        this._cardsShown = containerWidth / cardWidth;

        let totalCards = this._certificado._results.length;

        let maxValueTranslateX = cardWidth * (totalCards - this._cardsShown);

        this.progressBarWidthPerCard = 100 / this._certificates.length;

        if ( this.progressBarWidth === 0 ) this.progressBarWidth = this.progressBarWidthPerCard * this._cardsShown;

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
        let cardWidth = this._certificado._results[0].nativeElement.clientWidth;

        //el valor de translateX tiene que aumentar para retroceder
        if ( -this.amount >= cardWidth ) {
            this.amount += cardWidth;
            this.progressBarWidth -= this.progressBarWidthPerCard;
            this._last = false;
        } else {
            this.amount = 0;
        }

        if ( this.amount === 0 ) this._first = true;
    }

    private showRequest ( code: string ) : void
    {
        this._showRequest = true;
        this._code = code;
        this._loader.show('form-request');
    }    

    private closeRequest() : void {
        this._showRequest = false;
    }

    private requestCompleted () : void 
    {
        this._showRequest = false;
        this._sent = true;

        this._response_obj = {
            title: '',
            text: 'Su certificado ha sido solicitado correctamente',
            img: '',
            btn: 'VOLVER',
            callback: this.goBack
        }
    }

    private goBack() : void {
        this._sent = false;
    }
}