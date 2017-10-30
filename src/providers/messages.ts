import { Injectable } from '@angular/core';

import { LoadingController, AlertController, Loading } from 'ionic-angular';

import { AdMobPro } from '@ionic-native/admob-pro';
import { Platform } from 'ionic-angular';

@Injectable()
export class Messages {

    loading: Loading = null;
    error: string = null;

    constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private admob: AdMobPro, private platform: Platform ) {

    }

    showAlert(message: string): Promise<any> {
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['OK']
        });
        return alert.present();
    }

    showLoading(message: string): Promise<any> {
        if (!this.loading) {
            this.loading = this.loadingCtrl.create({
                content: message
            });
            return this.loading.present();
        } else {
            return Promise.resolve();
        }
    }

    hideLoading(): Promise<any> {
        if (!this.loading) {
            return Promise.resolve();
        } else {
            let l = this.loading;
            this.loading = null;
            return l.dismiss();
        }
    }

    showInterstitialAd() {
        let adId;
        if(this.platform.is('android')) {
          adId = 'ca-app-pub-2461827238480440/3881005772';
          this.admob.prepareInterstitial({adId: adId}).then(() => { this.admob.showInterstitial(); });     
        } else if (this.platform.is('ios')) {
          // do nothing for now
        }
          
    }
}
