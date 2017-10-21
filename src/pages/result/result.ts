import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Messages } from '../../providers/messages';

import { ResultDetailPage } from '../resultdetail/resultdetail';

@Component({
  selector: 'page-result',
  templateUrl: 'result.html'
})
export class ResultPage {

  data: any;
  fromName: string;
  toName: string;

  constructor(public navCtrl: NavController, private navParams: NavParams, private messages: Messages) {
    this.data = navParams.get('data');
    this.fromName = navParams.get('fromName');
    this.toName = navParams.get('toName');

    
  }

  ionViewDidLoad() {
    this.messages.hideLoading();    
  }

  showDetailMap(item) {
    this.navCtrl.push(ResultDetailPage, { data: item });
  }

}
