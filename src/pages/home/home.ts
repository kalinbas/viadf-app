import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Geolocation } from 'ionic-native';

import { ResultPage } from '../result/result';

import { Api } from '../../providers/api';
import { Messages } from '../../providers/messages';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('search') searchElement: ElementRef;
  @ViewChild('search2') search2Element: ElementRef;

  map: any;
  fromMarker: any;
  toMarker: any;
  timer: any;

  constructor(public navCtrl: NavController, private api: Api, private messages: Messages) {

  }

  ionViewDidLoad() {

    let latLng = new google.maps.LatLng(19.43255, -99.13337);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
      clickableIcons: false,
      maxZoom: 15
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    //this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchBoxes.nativeElement);

    //var searchBox = new google.maps.places.SearchBox(this.searchElement.nativeElement);
    var autocomplete1 = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
    autocomplete1.setBounds(new google.maps.LatLngBounds({ lat: 19.43255, lng: -99.13337 }, { lat: 19.63255, lng: -98.93337 }));

    var autocomplete2 = new google.maps.places.Autocomplete(this.search2Element.nativeElement);
    autocomplete2.setBounds(new google.maps.LatLngBounds({ lat: 19.43255, lng: -99.13337 }, { lat: 19.63255, lng: -98.93337 }));

    autocomplete1.addListener('place_changed', () => {
      this.handleAutocomplete(autocomplete1, true);
    });

    autocomplete2.addListener('place_changed', () => {
      this.handleAutocomplete(autocomplete2, false);
    });

    this.map.addListener('mousedown', (e) => {  
      if (!this.timer) {    
        this.timer = setTimeout(() => { 
          this.selectPosition(this.fromMarker == null, "posición en el mapa", e.latLng);          
        }, 1000); 
      }
    });
    
    this.map.addListener('mouseup', () => { this.clearPressTimeout(); });
    this.map.addListener('zoom_changed', () => { this.clearPressTimeout(); });
    this.map.addListener('drag', () => { this.clearPressTimeout(); });
  }

  clearPressTimeout() {
     if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
  }

  doSearch(from, to) {
    this.messages.showLoading("Buscando rutas...").then(() => {
      this.api.get("service", "search", { de: from.lat() + "," + from.lng(), a: to.lat() + "," + to.lng(), count: 3 }).then(res => {
        //this.api.getFakeSearch().then(res => {
        //this.messages.hideLoading().then(() => {
        this.navCtrl.push(ResultPage, { data: res, fromName: this.searchElement.nativeElement.value, toName: this.search2Element.nativeElement.value });
        //});
      }).catch(reason => {
        this.messages.hideLoading().then(() => {
          this.messages.showAlert("Ha ocurrido un error, por favor intente de nuevo. " + JSON.stringify(reason));
        });
      });
    });
  }

  locateFrom() {
    return this.messages.showLoading("Buscando posición...").then(() => {
      return Geolocation.getCurrentPosition({ timeout: 5000 }).then((position) => {
        return this.messages.hideLoading().then(() => {
          let pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          return this.selectPosition(true, "su posición actual", pos);
        });
      }, (err) => {
        return this.messages.hideLoading();
      });
    });
  }

  locateTo() {
    return this.messages.showLoading("Buscando posición...").then(() => {
      return Geolocation.getCurrentPosition({ timeout: 5000 }).then((position) => {
        return this.messages.hideLoading().then(() => {
          let pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          return this.selectPosition(false, "su posición actual", pos);
        });
      }, (err) => {
        return this.messages.hideLoading();
      });
    });
  }

  focusFrom() {
    this.searchElement.nativeElement.value = "";
    if (this.fromMarker) {
      this.fromMarker.setMap(null);
      this.fromMarker = null;
    }
  }

  focusTo() {
    this.search2Element.nativeElement.value = "";
    if (this.toMarker) {
      this.toMarker.setMap(null);
      this.toMarker = null;
    }
  }

  handleAutocomplete(autocomplete, isFrom) {
    var place = autocomplete.getPlace();
    //this.map.setCenter(place.geometry.location);
    this.selectPosition(isFrom, place.name, place.geometry.location);
  }

  selectPosition(isFrom, name, position) {
    if (isFrom) {
      this.searchElement.nativeElement.value = name;
      if (!this.fromMarker) {
        this.fromMarker = new google.maps.Marker({
          map: this.map,
          title: name,
          animation: google.maps.Animation.DROP,
          position: position
        });
        this.fromMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      } else {
        this.fromMarker.setPosition(position);
      }
    } else {
      this.search2Element.nativeElement.value = name;
      if (!this.toMarker) {
        this.toMarker = new google.maps.Marker({
          map: this.map,
          title: name,
          animation: google.maps.Animation.DROP,
          position: position
        });
        this.toMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
      } else {
        this.toMarker.setPosition(position);
      }
    }

    var bounds = new google.maps.LatLngBounds();
    if (this.fromMarker) bounds.extend(this.fromMarker.getPosition());
    if (this.toMarker) bounds.extend(this.toMarker.getPosition());
    this.map.fitBounds(bounds);

    // start search when both points set
    if (this.fromMarker && this.toMarker) {
      this.doSearch(this.fromMarker.getPosition(), this.toMarker.getPosition());
    }
  }

}
