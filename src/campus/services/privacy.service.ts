import { HttpClient }                                   from "@angular/common/http"
import { Observable }                                   from "rxjs/Observable"

export class PrivacyService {
    privacyUrl = '/privacidad/politica_'

    public constructor( private http : HttpClient ) 
    {

    }

    public getPrivacyTerms (str) : Observable<any> 
    {
        return this.http.get(this.privacyUrl + str + '.json');
    }
}