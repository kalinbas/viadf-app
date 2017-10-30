import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Api } from '../../providers/api';
import { Messages } from '../../providers/messages';

import { Geolocation } from '@ionic-native/geolocation';

import { RouteDetailPage } from '../routedetail/routedetail';

@Component({
    selector: 'page-routes',
    templateUrl: 'routes.html'
})
export class RoutesPage {

    routes: any[];
    hasLocationProblem: boolean;
    position: any;

    constructor(public navCtrl: NavController, private api: Api, private messages: Messages, private geoLocation: Geolocation) {
        this.loadList();
    }

    loadList() {
        this.messages.showLoading("Buscando rutas cercanas...").then(() => {
            this.geoLocation.getCurrentPosition({ timeout: 5000 }).then(position => {
                this.position = { lat: position.coords.latitude, lng: position.coords.longitude};
                this.hasLocationProblem = false;
                //this.api.getFakeCloseRoutes().then(routes => {
                this.api.get('service', "getcloseroutes", { start: position.coords.latitude + "," + position.coords.longitude }).then(routes => {
                    this.routes = routes;
                    this.messages.hideLoading();
                }).catch(reason => {
                    this.messages.hideLoading();
                })
            }).catch(reason => {
                this.messages.hideLoading();
                this.hasLocationProblem = true;
            });
        });
    }

    showDetailMap(route) {
        this.messages.showLoading("Cargando ruta...").then(() => {
            this.navCtrl.push(RouteDetailPage, { route: route, position : this.position });
        });
    }

}
