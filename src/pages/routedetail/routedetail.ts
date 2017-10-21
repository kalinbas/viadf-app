import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Api } from '../../providers/api';
import { Messages } from '../../providers/messages';

declare var google;

@Component({
  selector: 'page-routedetail',
  templateUrl: 'routedetail.html'
})
export class RouteDetailPage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;
  route: any;
  position: any;

  constructor(public navCtrl: NavController, private navParams: NavParams, private api: Api, private messages: Messages) {
    this.route = this.navParams.get("route");
    this.position = this.navParams.get("position");
  }

  ionViewDidLoad() {

    this.api.get("service", "getroutepath", { id: this.route.ID }).then(routePath => {
      //this.api.getFakeRoutePath().then(routePath => {

      this.messages.hideLoading();

      var routeCoords = routePath.Path.map(x => new google.maps.LatLng(x.split(",")[0], x.split(",")[1]));
      var routeCoordsReturn = routePath.ReturnPath.map(x => new google.maps.LatLng(x.split(",")[0], x.split(",")[1]));

      let mapOptions = {
        center: routeCoords[0],
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      var bounds = new google.maps.LatLngBounds();
      routeCoords.forEach(r => bounds.extend(r));
      routeCoordsReturn.forEach(r => bounds.extend(r));

      var polyline = new google.maps.Polyline({
        path: routeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.6,
        strokeWeight: 5
      });
      polyline.setMap(this.map);

      if (routeCoordsReturn.length > 0) {
        var polyline2 = new google.maps.Polyline({
          path: routeCoordsReturn,
          strokeColor: "#0000FF",
          strokeOpacity: 0.6,
          strokeWeight: 5
        });
        polyline2.setMap(this.map);
      }

      this.map.fitBounds(bounds);
      this.map.setZoom(this.map.getZoom() - 1);

      var markerStart = new google.maps.Marker({ position: routeCoords[0], map: this.map });
      var markerEnd = new google.maps.Marker({ position: routeCoordsReturn.length > 0 ? routeCoordsReturn[0] : routeCoords[routeCoords.length - 1], map: this.map });
      var markerPosition = new google.maps.Marker({ position: this.position, map: this.map });
      markerStart.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      markerEnd.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
      markerPosition.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

      var infowindowStart = new google.maps.InfoWindow({ content: this.route.FromName });
      infowindowStart.open(this.map, markerStart);

      var infowindowEnd = new google.maps.InfoWindow({ content: this.route.ToName });
      infowindowEnd.open(this.map, markerEnd);

      var infowindowPosition = new google.maps.InfoWindow({ content: "Su posición" });
      infowindowPosition.open(this.map, markerPosition);

    }).catch(reason => {
      this.messages.hideLoading();
    });
  }
}
