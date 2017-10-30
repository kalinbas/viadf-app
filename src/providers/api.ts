import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, URLSearchParams, Headers } from '@angular/http';

import { Config } from 'ionic-angular';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout'

import { Messages } from './messages';

@Injectable()
export class Api {

    constructor(private http: Http, private config: Config, private messages: Messages) {

    }

    get(resource: string, method: string, params?: any) {

        let url = this.config.get("apiServerUrl") + "/" + resource + "/" + method;

        let opt: RequestOptionsArgs = {
            search: this.createSearchParams(params),
            headers: this.createHeaders()
        }

        return this.http.get(url, opt).timeout(10000).map(response => {
            return response.json()
        }).toPromise();
    }

    post(resource: string, method: string, body: any, params?: any) {

        let url = this.config.get("apiServerUrl") + "/" + resource + "/" + method;

        let opt: RequestOptionsArgs = {
            search: this.createSearchParams(params),
            headers: this.createHeaders()
        }

        opt.headers.set("Content-Type", "application/json");

        return this.http.post(url, JSON.stringify(body), opt).timeout(10000).map(response => {
            // if no content returned
            if (response.status === 204) {
                return;
            } else {
                return response.json();
            }
        }).toPromise();
    }
   
    private createSearchParams(params: any): URLSearchParams {
        let sp = new URLSearchParams();

        if (params) {
            for (var key in params) {
                sp.set(key, params[key]);
            }
        }
        //set api key
        sp.set("key", this.config.get("apiKey"));

        return sp;
    }

    private createHeaders() {
        let h = new Headers();

        //if (this.data.sessionId) {
        //    h.set("Facter-Session", this.data.sessionId);
        //}

        return h;
    }
}

