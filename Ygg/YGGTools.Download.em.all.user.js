/* @include used here as @match doesn't support wildcarded TLDs */
// ==UserScript==
// @name         YGGTools - Download'em all!
// @namespace    YGGTools
// @version      0.1.0
// @description  Ajout du téléchargement de tous les torrents présents sur un résultat de recherche.
// @author       Esperlu3tte
// @supportURL   https://www3.yggtorrent.qa/profile/958029-esperlu3tte
// @supportURL   https://github.com/esperlu3tte/UserScripts
// @updateURL    https://github.com/esperlu3tte/UserScripts/raw/master/Ygg/YGGTools.Download.em.all.user.js
// @downloadURL  https://github.com/esperlu3tte/UserScripts/raw/master/Ygg/YGGTools.Download.em.all.user.js
// @icon         https://raw.githubusercontent.com/esperlu3tte/UserScripts/master/Ygg/icon.ico
// @license      Unlicense
// @include      https://*.yggtorrent.*/engine/search?*
// @include      https://*.yggtorrent.*/torrents/exclus
// @grant        GM.download
// @connect      self
// ==/UserScript==

"use strict";

(async function main() {
    /*
     * Whether to save the torrents to the browser's default download location
     * or to let the browser ask for a specific location.
     */
    const DOWNLOAD_SAVE_AS = false;

    /*
     * Whether to download the torrents one at a time (slower but the order is kept)
     * or all at once (faster but the order is not kept).
     */
    const DOWNLOAD_ALL_AT_ONCE = true;

    /*
     * Time interval between checks when waiting for the YGGTools' main script to be initialised.
     * Unit: ms
     */
    const YGGTOOLS_MAIN_WAIT_TIME_INTERVAL = 100;

    /*
     * Timeout duration when waiting for the YGGTools' main script to be initialised.
     * Unit: ms
     */
    const YGGTOOLS_MAIN_WAIT_TIMEOUT = 5000;

    if (document.readyState === "loading") {
        await new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve));
    }

    const YGG_BASE_URL = `${document.location.protocol}//${document.location.hostname}`;

    function hasTorrentsInTable() {
        const firstTds = document.querySelectorAll(".results table tbody tr td:first-child");
        if (firstTds && firstTds.length > 0 && !firstTds[0].classList.contains("dataTables_empty")) {
            return true;
        }
        return false;
    }

    function waitYGGToolsMainScriptTableFilterInputElement() {
        return new Promise((resolve, reject) => {
            let waitIntervalTimeout = null;
            let waitTimeout = null;
            const clearDelayed = () => {
                clearInterval(waitIntervalTimeout);
                clearTimeout(waitTimeout);
            };
            const tryToResolveTableFilterInputElement = () => {
                const input = document.querySelector(".results input[type=search]");
                if (input) {
                    clearDelayed();
                    return resolve(input);
                };
            };
            waitIntervalTimeout = setInterval(tryToResolveTableFilterInputElement, YGGTOOLS_MAIN_WAIT_TIME_INTERVAL);
            waitTimeout = setTimeout(() => {
                clearDelayed();
                return reject(new Error("Timeout when waiting for the YGGTools' main script to initialise the table filter input element"));
            }, YGGTOOLS_MAIN_WAIT_TIMEOUT);
        });
    }

    function createNewElementsAndUpdateDOM() {
        // Download status modal
        const modal = document.createElement("div");
        modal.id = "download_all_modal";
        modal.classList.add("modal");
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("role", "dialog");
        modal.setAttribute("data-backdrop", "static");
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Progression du téléchargement</h5>
                    </div>
                    <div class="modal-body">
                        <p>
                            Téléchargement des torrents en cours,<br>
                            <b>veuillez ne pas fermer la page</b>.
                        </p><br>
                        <div class="progress-text w-100 text-center font-weight-bold"></div>
                        <div class="progress">
                            <div
                                class="progress-bar progress-bar-striped progress-bar-animated text-center"
                                role="progressbar"
                                aria-valuenow="0"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style="width: 0%"
                            ></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary btn-close"
                            style="display: none;"
                            data-dismiss="modal"
                        >
                            Close
                        </button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Interrompre</button>
                    </div>
                </div>
            </div>
        `;
        document.querySelector("body").prepend(modal);

        // Download all button
        const nfoHeader = document.querySelector(".results table thead th:nth-child(3)");
        nfoHeader.classList.add("d-flex");
        nfoHeader.setAttribute("style", "padding: 0; cursor: default;");
        nfoHeader.innerHTML = `
            <span
                class="mr-auto"
                rel="fervextip"
                title="Télécharger tous les torrents de cette page"
                style="font-size: 13px; padding: 5px 0 5px 15px;"
            >
                <button
                    id="download_all_torrents"
                    class="ico_download text-primary"
                    style="cursor: pointer;" data-toggle="modal" data-target="#download_all_modal"
                ></button>
            </span>
            <span class="ml-auto" style="padding: 7px 15px 7px 0;">NFO</span>
        `;
        const buttonDownloadAll = nfoHeader.querySelector("#download_all_torrents");
        buttonDownloadAll.addEventListener("mouseenter", () => {
            buttonDownloadAll.classList.remove("text-primary");
            buttonDownloadAll.classList.add("text-danger");
        });
        buttonDownloadAll.addEventListener("mouseleave", () => {
            buttonDownloadAll.classList.remove("text-danger");
            buttonDownloadAll.classList.add("text-primary");
        });

        waitYGGToolsMainScriptTableFilterInputElement()
            .then((tableFilterInputElement) => {
                tableFilterInputElement.addEventListener("input", () => {
                    if (hasTorrentsInTable()) {
                        buttonDownloadAll.classList.remove("d-none");
                    } else {
                        buttonDownloadAll.classList.add("d-none");
                    }
                });
            })
            .catch(console.info);
    }

    function updateDownloadModalData(doneNbr, totalNbr) {
        const modal = document.querySelector("#download_all_modal");
        const progressText = modal.querySelector(".progress-text");
        progressText.innerText = `${doneNbr}/${totalNbr}`;
        const donePercent = totalNbr > 0 ? (doneNbr * 100) / totalNbr : 0;
        const progressBar = modal.querySelector(".progress .progress-bar");
        progressBar.setAttribute("aria-valuenow", donePercent);
        progressBar.setAttribute("style", `width: ${donePercent.toFixed(2)}%`);
    }

    async function downloadTorrent(torrentId, signal) {
        try {
            const torrentUrl = YGG_BASE_URL + "/engine/download_torrent?id=" + torrentId;
            const torrentOptionsResponse = await fetch(torrentUrl, { method: "OPTIONS", signal });
            const contentDispositionResults = torrentOptionsResponse.headers.get("Content-Disposition").match(/filename="(?<name>.+\.torrent)"/);
            const torrentName = contentDispositionResults.groups.name;
            // Fix ISO-8859-1 characters set wrongly encoded in UTF-8
            const fixedTorrentName = decodeURIComponent(escape(torrentName));

            const torrentDownloadPromise = GM.download({
                url: torrentUrl,
                name: fixedTorrentName,
                saveAs: DOWNLOAD_SAVE_AS,
                conflictAction: "prompt",
            });
            const abortFn = () => torrentDownloadPromise.abort();
            signal.addEventListener("abort", abortFn);
            const torrentDownload = await torrentDownloadPromise;
            signal.removeEventListener("abort", abortFn);
        } catch (err) {
            console.warn(err);
        }
    }

    const results = document.querySelector(".results");
    if (!results) {
        return;
    }

    createNewElementsAndUpdateDOM();

    const buttonDownloadAll = document.querySelector("#download_all_torrents");
    buttonDownloadAll.addEventListener("click", async () => {
        const nfoElems = document.querySelectorAll(".results table tbody tr #get_nfo");
        if (!hasTorrentsInTable()) {
            return;
        }

        const abortController = new AbortController();
        const abortButton = document.querySelector("#download_all_modal .modal-footer .btn-danger");
        abortButton.addEventListener("click", () => abortController.abort());

        try {
            updateDownloadModalData(0, nfoElems.length);
            const checkAbortSignal = () => {
                if (abortController.signal.aborted) {
                    throw new Error("Already aborted");
                }
            };
            if (DOWNLOAD_ALL_AT_ONCE) {
                const downloadPromises = [];
                let doneNbr = 0;
                const updateDownloadModalDataFn = () => updateDownloadModalData(doneNbr++, nfoElems.length);
                for (const nfoElem of nfoElems) {
                    checkAbortSignal();
                    const torrentId = nfoElem.getAttribute("target");
                    downloadPromises.push(
                        downloadTorrent(torrentId, abortController.signal).then(updateDownloadModalDataFn),
                    );
                }
                await Promise.all(downloadPromises);
            } else {
                for (let i = 0; i < nfoElems.length; i++) {
                    checkAbortSignal();
                    const torrentId = nfoElems[i].getAttribute("target");
                    await downloadTorrent(torrentId, abortController.signal);
                    updateDownloadModalData(i + 1, nfoElems.length);
                }
            }
            const closeModalButton = document.querySelector("#download_all_modal .modal-footer .btn-close");
            closeModalButton.click();
        } catch (err) {
            console.warn(err);
        }
    });
})();

/*
 * Polyfill of the deprecated escape() function
 * Adapted from the core-js project
 * @see https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.escape.js
 *
 * --
 *
 * Copyright (c) 2014-2024 Denis Pushkarev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function escape(string) {
    function hex(code, length) {
        var result = code.toString(16);
        while (result.length < length) result = '0' + result;
        return result;
    }
    var str = `${string}`;
    var result = '';
    var length = str.length;
    var index = 0;
    var chr, code;
    while (index < length) {
        chr = str.charAt(index++);
        if (/[\w*+\-./@]/.exec(chr)) {
            result += chr;
        } else {
            code = chr.charCodeAt(0);
            if (code < 256) {
                result += '%' + hex(code, 2);
            } else {
                result += '%u' + (hex(code, 4)).toUpperCase();
            }
        }
    }
    return result;
}
