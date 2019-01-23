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
    private _cardsPerShow : any;
    private barWidth : any;
    private singleWidth : any;

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
        this.barWidth = 0;

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
            let availableCertificates = [];

            for (let certificate of certificates) {
                if ( certificate.license.status === 'terminated' ) {
                    availableCertificates.push(certificate)
                } 
            }
            this._certificates = availableCertificates;
        });
    }

    public plusSlide () : void {
        let cardWidth = this._certificado._results[0].nativeElement.clientWidth;
        let containerWidth = this._carousel.nativeElement.clientWidth;

        this._cardsPerShow = containerWidth / cardWidth;

        let totalCards = this._certificado._results.length;

        let totalWidth = cardWidth * (totalCards - this._cardsPerShow);

        this.singleWidth = 100 / this._certificates.length;

        if ( this.barWidth === 0 ) {
            this.barWidth = this.singleWidth * this._cardsPerShow;
        }

        if ( cardWidth < totalWidth + this.amount ) {
            this.amount -= cardWidth;
            this.barWidth += this.singleWidth;
            this._first = false;
        } else if ( totalWidth > -this.amount ) {
            let resto = totalWidth + this.amount;
            this.amount -= resto;
        }

        if ( totalWidth === -this.amount ) {
            this._last = true;
            this.barWidth = 100;
        }
    };

    public minusSlide () : void {
        let cardWidth = this._certificado._results[0].nativeElement.clientWidth;

        if ( -this.amount >= cardWidth ) {
            this.amount += cardWidth;
            this.barWidth -= this.singleWidth;
            this._last = false;
        } else {
            this.amount = 0;
        }

        if ( this.amount === 0 ) {
            this._first = true;
        }
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