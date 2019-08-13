import {BrowserAnimationsModule}                                  from '@angular/platform-browser/animations';
import { BrowserModule }                                          from '@angular/platform-browser';
import { NgModule, Injector }                                               from '@angular/core';

import { AppComponent }                                           from './app.component';

import { RouterModule, Routes, Router }                           from '@angular/router';

import { Logger, Loader, CoreModule, CommonModule, FormModule }   from 'mk';


import { MatDialogModule, MatIconModule }                                        from '@angular/material';


import { HttpModule, Http, XHRBackend, RequestOptions }                                                                                    from '@angular/http';
import { httpFactoryCustom }                                                                    from '../shared/services/intercepted-http-custom';
import { InterceptedHttp }                                                                        from 'mk';

// -- App imports ---------------------------------------------------------------------------
import { appRoutes } from './app.routes';

import { PublicModule }	from '../public/public.module';
import { CampusModule } from '../campus/campus.module';
import { SharedModule } from '../shared/shared.module';

import { AuthService }    from '../shared/services/auth.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot( appRoutes, { enableTracing: true } ),



        CoreModule.forRoot(),
        CommonModule,
        FormModule,

        MatDialogModule,
        MatIconModule,

        SharedModule,
        PublicModule,
        CampusModule
    ],
    providers: [
        Loader,
        Logger,
        {
            provide: Window,
            useValue: window
        },
        {
            provide: Http,
            useFactory: httpFactoryCustom,
            deps: [ XHRBackend, RequestOptions, Injector ]
        },
    ],
    bootstrap: [AppComponent],
    exports: [ ]
})
export class AppModule { }
