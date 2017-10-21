import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-resultdetail',
  templateUrl: 'resultdetail.html'
})
export class ResultDetailPage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;

  constructor(public navCtrl: NavController, private navParams: NavParams) {

  }

  ionViewDidLoad() {

    let item = this.navParams.get("data");
    var routeCoords = item.Path.map(x => new google.maps.LatLng(x.Lat, x.Lng));

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

    var polyline = new google.maps.Polyline({
      path: routeCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.6,
      strokeWeight: 5
    });
    polyline.setMap(this.map);
    this.map.fitBounds(bounds);
    this.map.setZoom(this.map.getZoom() - 1);

    var markerStart = new google.maps.Marker({ position: routeCoords[0], map: this.map });
    var markerEnd = new google.maps.Marker({ position: routeCoords[routeCoords.length - 1], map: this.map });
    markerStart.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    markerEnd.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');

    var startString = "Origen de su viaje";
    var endString = "Destino de su viaje";

    if (item.Route) {
      startString = "Subir al <b>" + item.Type.Name + " " + item.Route.Name + "</b> hacía " + item.InDirection;
      endString = "Bajar en <b>" + (item.End.Name || item.EndName || " este lugar") + "</b>";
    } else {
      if (item.Start.Route == null) {
        endString = item.End.Route.Type.Name + " " + (item.End.Name || item.End.Route.Name);
      } else if (item.End.Route == null) {
        startString = "";
      } else {
        startString = "Cambiar de <b>" + item.Start.Route.Type.Name + " " + item.Start.Route.Name + "</b>";
        endString = "a <b>" + item.End.Route.Type.Name + " " + item.End.Route.Name + "</b>";
      }
    }

    if (startString) {
      var infowindowStart = new google.maps.InfoWindow({ content: startString });
      infowindowStart.open(this.map, markerStart);
    }
    if (endString) {
      var infowindowEnd = new google.maps.InfoWindow({ content: endString });
      infowindowEnd.open(this.map, markerEnd);
    }

  }
}
