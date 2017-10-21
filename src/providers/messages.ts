import { Injectable } from '@angular/core';

import { LoadingController, AlertController, Loading } from 'ionic-angular';

@Injectable()
export class Messages {

    loading: Loading = null;
    error: string = null;

    constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

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
}
