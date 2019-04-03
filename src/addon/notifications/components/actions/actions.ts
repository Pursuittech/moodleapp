// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CoreContentLinksDelegate, CoreContentLinksAction } from '@core/contentlinks/providers/delegate';
import { CoreSitesProvider } from '@providers/sites';

/**
 * Component that displays the actions for a notification.
 */
@Component({
    selector: 'addon-notifications-actions',
    templateUrl: 'addon-notifications-actions.html',
})
export class AddonNotificationsActionsComponent implements OnInit {
    @Input() contextUrl: string;
    @Input() courseId: number;

    actions: CoreContentLinksAction[] = [];

    constructor(private contentLinksDelegate: CoreContentLinksDelegate, private sitesProvider: CoreSitesProvider) {}

    /**
     * Component being initialized.
     */
    ngOnInit(): void {
        if (!this.contextUrl) {
            // No contexturl, nothing to do.
            return;
        }

        this.contentLinksDelegate.getActionsFor(this.contextUrl, this.courseId).then((actions) => {
            if (!actions.length) {
                // URL is not supported. Add an action to open it in browser.
                actions.push({
                    message: 'core.view',
                    icon: 'eye',
                    action: this.defaultAction.bind(this)
                });
            }

            this.actions = actions;
        });
    }

    /**
     * Default action. Open in browser.
     *
     * @param {string} siteId Site ID to use.
     * @param {NavController} [navCtrl] NavController.
     */
    protected defaultAction(siteId: string, navCtrl?: NavController): void {
        this.sitesProvider.getCurrentSite().openInBrowserWithAutoLogin(this.contextUrl);
    }
}
