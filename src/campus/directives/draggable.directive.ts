import {Directive, EventEmitter, HostListener, Inject, Input } from '@angular/core';
//import { DOM } from 'angular2/src/core/dom/dom_adapter';
import {ElementRef} from '@angular/core';
import { Observable, BehaviorSubject, Subscription }           from "rxjs/Rx";

import { DOCUMENT } from '@angular/platform-browser';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective 
{
    @HostListener('mousedown', ['$event']) 
    @HostListener ('touchstart', ['$event']) onMousedown(event) { return this._dragStart.next(event); }
    @Input('draggable') set _enabled (state:boolean )
    { 
        this._element.nativeElement.style.position = state ? 'relative' : 'static';
    };

    private _switches: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _query: Observable<any> = this._switches.distinctUntilChanged().takeWhile(on => on);

    private _dragImage: Observable<any>;
    private _dragUp: Observable<any>;
    private _dragStart: EventEmitter<any> = new EventEmitter();
    private _dragMove: Observable<any>;

    private _subscriptions: Array<Subscription>;

    public constructor ( private _element: ElementRef, @Inject(DOCUMENT) private _document: any )  
    {
        // --- Styling for drag -------------------------
        this._element.nativeElement.style.position = 'relative';
        this._element.nativeElement.style.cursor = 'pointer';

        let mouseMove = Observable.fromEvent( _document, 'mousemove' );
        let mouseUp = Observable.fromEvent( _document, 'mouseup' );
        
        let touchMove = Observable.fromEvent( _document, 'touchmove' );
        let touchUp = Observable.fromEvent( _document, 'touchend' );
        
        this._dragMove = Observable.merge( mouseMove, touchMove );
        this._dragUp = Observable.merge( mouseUp, touchUp );

        this._dragImage = this.dragImage();
    }

    public ngOnInit() : void
    {
        this._subscriptions = [    
            this.subscribeDragging()
        ];
    }

    public ngOnDestroy () : void 
    { 
        this._subscriptions.forEach( sub => {
            sub.unsubscribe()
        });
        this._subscriptions.length = 0;
    }

    private dragImage () : Observable<any>
    {
        let el: HTMLElement = this._element.nativeElement;
        let pa: HTMLElement = el.parentElement; 
        
        return this._dragStart.map( (event:any) => 
        {
            event.preventDefault();

            let clientX = event.clientX ? event.clientX : event.changedTouches[0].clientX;
            let clientY = event.clientY ? event.clientY : event.changedTouches[0].clientY;

            let left: number = clientX + (pa.offsetLeft - Math.abs(el.offsetLeft));
            let top: number = clientY + (pa.offsetTop - Math.abs(el.offsetTop));
            
            return { top: top, left: left };
        })
        .flatMap( imageOffset => 
        { 
            return this._dragMove.map( (pos:any) => 
            {
                let posX = pos.clientX ? pos.clientX : pos.changedTouches[0].clientX;
                let posY = pos.clientY ? pos.clientY : pos.changedTouches[0].clientY;

                let posTop = posY - imageOffset.top;
                let posLeft = posX - imageOffset.left;
                
                return { top: posTop, left: posLeft }
            })
            .takeUntil( this._dragUp );
        });

    }

    private subscribeDragging () : Subscription
    {
        return this._dragImage
        .subscribe( (pos:any) => 
        {
            // Update position
            this._element.nativeElement.style.top  = pos.top  + 'px';
            this._element.nativeElement.style.left = pos.left + 'px';
        });
    }

}