import { Component, ViewChild, Inject, ElementRef, Renderer2 }                         		from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } 						from '@angular/router';

import { Observable, BehaviorSubject, Subscription } 					from "rxjs/Rx";

import { Logger }														from 'mk';

import { environment }													from '../../../environments/environment';		

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA}                 		from '@angular/material';

// TEST
import { DOCUMENT } from '@angular/platform-browser';


@Component({
	selector: 'cropper',
	templateUrl: './cropper.component.html',
	styleUrls: ['./cropper.component.scss'],
})
export class CropperComponent
{
	@ViewChild('img', undefined) _img: ElementRef;
	@ViewChild('cropper', undefined) _cropper: ElementRef;

    public dragEnabled: boolean;
    public cropped: string;

   	private _context: CanvasRenderingContext2D;
    private _subscriptions: Array<Subscription>;

	public constructor ( private _logger: Logger, public dialogRef: MatDialogRef<CropperComponent>, @Inject(MAT_DIALOG_DATA) public data: any, @Inject(DOCUMENT) private document: any, private _renderer:Renderer2 ) 
	{ 
		this._logger.log('CROPPER  COMPONENT');
	}

	public ngOnInit () : void
	{
		this._subscriptions = [];
        this.dragEnabled = true;
		this._img.nativeElement.src = this.data.img.src;
		//this._context = (<HTMLCanvasElement>this._cropper.nativeElement).getContext('2d');

	}

	public ngOnDestroy () : void 
    { 
        this._subscriptions.forEach( sub => {
            sub.unsubscribe()
        });
        this._subscriptions.length = 0;
    }

    private crop () : void
    {
        let cropper: HTMLElement = this._cropper.nativeElement;
        let img: any = this._img.nativeElement;
        let left: number = cropper.offsetLeft - img.offsetLeft;
        let top: number =  cropper.offsetTop - img.offsetTop;
        let width: number = cropper.offsetWidth;
        let height: number = cropper.offsetHeight;

        let crop_canvas: any = this._renderer.createElement('canvas');

        let dataURL: string;

        crop_canvas.width = width;
        crop_canvas.height = height;

        crop_canvas.getContext('2d').drawImage(this._img.nativeElement, left, top, width, height, 0, 0, width, height);
        
        this.cropped = dataURL = img.src.indexOf('http://') !== 0 ? crop_canvas.toDataURL("image/png") : this.data.currentAvatar;

        this._img.nativeElement.src = dataURL;
        
        this._img.nativeElement.left = '0px';
        this._img.nativeElement.top = '0px';

        this.dragEnabled = false;

        this.dialogRef.close();
    }

    private imgLoaded () : void
    {
        this._img.nativeElement.left = 0;
        this._img.nativeElement.top = 0;
    }

    private reset () : void
    {
        this._img.nativeElement.src = this.data.currentAvatar;
        this._img.nativeElement.style.left = '0px';
        this._img.nativeElement.style.top = '0px';
    }
}