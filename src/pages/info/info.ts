import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Messages } from '../../providers/messages';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  constructor(public navCtrl: NavController, public messages: Messages) {

  }

  openFacebook() {
    window.open('https://www.facebook.com/ViaDF', '_system');
  }

  openTwitter() {
    window.open('https://www.twitter.com/viadf', '_system');
  }

  openWeb() {
    window.open('http://viadf.com.mx', '_system');
  }

}
