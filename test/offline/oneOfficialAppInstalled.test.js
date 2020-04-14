/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import path from 'path';
import { startElectronApp, stopElectronApp, waitForWindowCount } from '../setup';

const appsRootDir = path.resolve(__dirname, './fixtures/one-official-app-installed/.nrfconnect-apps');
const electronArgs = [
    `--apps-root-dir=${appsRootDir}`,
    '--skip-update-apps',
];

let electronApp;

function loadFirstApp() {
    return electronApp.client.windowByIndex(0)
        .waitForVisible('button[title*="Open"]')
        .click('button[title*="Open"]')
        .then(() => waitForWindowCount(electronApp, 2))
        .then(() => electronApp.client.waitUntilWindowLoaded());
}

beforeEach(() => (
    startElectronApp(electronArgs)
        .then(startedApp => {
            electronApp = startedApp;
        })
));

afterEach(() => (
    stopElectronApp(electronApp)
));

describe('the launcher shows an installed official app', () => {
    it('should show Test App in the launcher app list', () => (
        electronApp.client.windowByIndex(0)
            .waitForVisible('.list-group-item')
            .getText('.list-group-item .h8')
            .then(text => expect(text).toEqual('Test App'))
    ));

    it('should load app window when clicking Launch', () => (
        loadFirstApp()
            .then(() => electronApp.client.windowByIndex(1).browserWindow.getTitle())
            .then(title => expect(title).toContain('Test App'))
    ));

    it('should show remove button for Test App in app management list', () => (
        electronApp.client.windowByIndex(0)
            .click('.list-group-item button[aria-haspopup="true"]')
            .waitForVisible('a[title="Remove Test App"]')
    ));

    it('should not show install button in app management list', () => (
        electronApp.client.windowByIndex(0)
            .waitForVisible('.list-group-item')
            .isVisible('button[title="Install Test App"]')
            .then(isVisible => expect(isVisible).toEqual(false))
    ));

    it('should not show upgrade button in app management list', () => (
        electronApp.client.windowByIndex(0)
            .waitForVisible('.list-group-item')
            .isVisible('button[title*="Update"]')
            .then(isVisible => expect(isVisible).toEqual(false))
            .getText('.list-group-item')
            .then(text => expect(text).not.toContain('available'))
    ));
});

describe('an installed official app app', () => {
    it('should show main menu in app window', () => (
        loadFirstApp()
            .then(() => electronApp.client.windowByIndex(1))
            .waitForVisible('#main-menu')
    ));
});