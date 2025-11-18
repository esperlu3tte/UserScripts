// ==UserScript==
// @name         L'Équipe Unblocker
// @namespace    Divers
// @version      0.2.0
// @description  Débloque le site internet de l'équipe, accès aux chaînes en live de l'équipe et d'eurosport.
// @author       Esperlu3tte
// @supportURL   https://www.yggtorrent.top/profile/958029-esperlu3tte
// @supportURL   https://github.com/esperlu3tte/UserScripts
// @updateURL    https://github.com/esperlu3tte/UserScripts/raw/master/Divers/LEquipe.Unblocker.user.js
// @downloadURL  https://github.com/esperlu3tte/UserScripts/raw/master/Divers/LEquipe.Unblocker.user.js
// @license      Unlicense
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lequipe.fr
// @match        https://www.lequipe.fr/*
// @require      https://unpkg.com/deepmerge@4.3.1/dist/umd.js
// ==/UserScript==

(function() {
    'use strict';

    const WAIT_DELAY = 100;

    function getStubUser() {
        const now = new Date();
        const birthYear = now.getFullYear() - 20;
        return {
            "access": {
                "__type": "user_access",
                "has_articles_france_football": false,
                "has_articles_lequipe": false,
                "has_articles_velo_magazine": false,
                "has_free_ligue_1": false,
                "has_kiosk_france_football": false,
                "has_kiosk_lequipe": false,
                "has_kiosk_velo_magazine": false,
                "has_newsletters": false,
                "has_ratings_archives": false,
                "has_special_formats": false,
                "is_child": false,
                "max_children_accounts": 0,
                "nb_concurrent_devices_allowed": 1,
                "remaining_children_accounts": 0,
                "subscription_level": 0
            },
            "avatar_url": "https://www.lequipe.fr/_medias/default-avatar/S/{width}/F2E97C",
            "created_at": `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0]}`,
            "created_since": "membre depuis aujourd'hui",
            "default_avatar": {
                "__type": "user_default_avatar",
                "sign": "S",
                "style": {
                    "__type": "style",
                    "background_color": "#F2E97C"
                }
            },
            "email": "stub@stub.stub",
            "fields_to_update": {
                "__type": "fields_to_update",
                "is_blocking": false,
                "properties": [
                    {
                        "__type": "field_to_update",
                        "name": "gender",
                        "should_request_new_value": false,
                        "value": "X"
                    },
                    {
                        "__type": "field_to_update",
                        "name": "year_of_birth",
                        "should_request_new_value": false,
                        "value": birthYear
                    },
                    {
                        "__type": "field_to_update",
                        "name": "nickname",
                        "should_request_new_value": false,
                        "value": "Stubby"
                    }
                ]
            },
            "id": "-1",
            "nickname": "Stubby",
            "personal_info": {
                "__type": "user_personal_info",
                "date_of_birth": `${birthYear}-01-01`,
                "gender": "X",
                "is_verified": true,
                "year_of_birth": birthYear
            },
            "public_identifiers": {
                "__type": "user_public_identifiers",
                "apple_in_app_purchase": "",
                "didomi": "",
                "feeling_sports": "",
                "free_ligue_1": "",
                "google_extended_access": "",
                "google_play_billing": "",
                "google_ppid": "",
                "google_purchase": "",
                "internal": "",
                "permutive": "",
                "purchasely": "",
                "reactions_author_id": "",
                "share_id": "",
                "twipe": ""
            },
            "subscription_status": "never_subscriber",
            "terms_of_service": {
                "__type": "user_terms_of_service",
                "current_version": {
                    "__type": "user_terms_of_service_consent_version",
                    "choice": "accepted",
                    "chosen_at": now.toISOString(),
                    "version": "2021.04.01"
                }
            },
            "subscriptions": {
                "__type": "user_subscription"
            },
            "authentication_providers": {
                "__type": "user_provider_link",
                "has_apple_link": false,
                "has_canal_link": false,
                "has_facebook_link": false,
                "has_google_link": false
            },
            "accountId": "-1",
            "isConnected": true,
            "hasSubscription": false,
            "subscriberStatus": "never_subscriber",
            "platform": null,
            "gender": "X",
            "isPremium": false,
            "name": "Stubby",
            "cryptedEmail": null,
            "getHiddenCardNumbers": null,
            "feed": [],
            "topic_subscriptions": []
        };
    }

    function subscribedUser(user) {
        // eslint-disable-next-line no-undef
        return deepmerge(
            user,
            {
                "access": {
                    "__type": "user_access",
                    "has_articles_france_football": true,
                    "has_articles_lequipe": true,
                    "has_articles_velo_magazine": true,
                    "has_kiosk_france_football": true,
                    "has_kiosk_lequipe": true,
                    "has_kiosk_velo_magazine": true,
                    "has_ratings_archives": true,
                    "has_special_formats": true,
                    "is_child": false,
                    "kiosk_title_ids": [
                        "LEQ_PDF",
                        "FF_PDF",
                        "VELO_PDF",
                        "MAG_PDF",
                        "LEQ_HS",
                        "ECO_PDF"
                    ],
                    "max_children_accounts": 1,
                    "nb_concurrent_devices_allowed": 1,
                    "remaining_children_accounts": 0,
                    "subscription_level": 40,
                    "video_provider_entitlements": [
                        "lequipe",
                        "eurosport",
                    ]
                },
                "subscription_status": "subscriber",
                "subscriptions": {
                    "__type": "user_subscription",
                    "active_services": [
                        {
                            "__type": "user_server_mpp_service",
                            "autoRenew": false,
                            "expiryDate": Math.floor((new Date()).setFullYear((new Date()).getFullYear() + 1) / 1000), // now + 1 year
                            "isCancellable": false,
                            "offerCode": "offer_20334",
                            "serviceGroupTag": "Gamme",
                            "serviceID": 20334,
                            "serviceLabel": "l'offre Classique + Eurosport",
                            "serviceName": "l'offre Classique + Eurosport",
                            "serviceTitle": "B4_Eurosport_14,99€"
                        }
                    ],
                    "inactive_services": [],
                    "service_label": "l'offre Classique + Eurosport"
                },
                "hasSubscription": true,
                "subscriberStatus": "subscriber",
                "isPremium": true,
            },
        );
    }

    function awaiter(fn, resolve, timeout) {
        let chainId;
        let timeoutId;
        const clear = () => {
            clearTimeout(chainId);
            clearTimeout(timeoutId);
        };
        if (timeout) {
            timeoutId = setTimeout(
                () => {
                    clear();
                    return resolve(null);
                },
                timeout,
            );
        }
        const chain = () => {
            const result = fn();
            if (result) {
                clear();
                return resolve(result);
            }
            chainId = setTimeout(chain, WAIT_DELAY);
        };
        chain();
    }

    function getNuxt(timeout = 5000) {
        return new Promise((resolve) => awaiter(
            () => unsafeWindow.$nuxt,
            resolve,
            timeout,
        ));
    }

    function getElement(selector, timeout = 30000) {
        return new Promise((resolve) => awaiter(
            () => document.querySelector(selector),
            resolve,
            timeout,
        ));
    }

    async function unblock() {
        const $nuxt = await getNuxt();
        $nuxt.$store._mutations["user/SET_USER"][0](subscribedUser($nuxt.user ?? getStubUser()));
        const contentElem = await getElement(".container__content:not(.page-leave)");

        document.querySelector(".Modal[data-modal='amsBlock']")?.remove();
        document.querySelector(".CmpContainer")?.remove();
        document.querySelector("#OfferBanner")?.remove();
        const htmlElem = document.querySelector("html");
        if (htmlElem.className.includes("no-scroll")) {
            htmlElem.className = htmlElem.className.split(" ").filter((c) => c !== "no-scroll").join(" ");
        }

        const pathname = document.location.pathname;
        if (
            ((pathname === "/tv/" || pathname.startsWith("/tv/videos/live/")) && !pathname.includes("ligue-1") && !pathname.includes("ligue1")) ||
            contentElem.className.includes("Live ") || contentElem.className.includes(" Live")
        ) {
            (await getElement("#videoWallScript", 5000))?.remove();
        }
    }

    unsafeWindow.addEventListener("load", async function() {
        unblock();
        (await getNuxt())._router.afterHooks.push(() => unblock());
    });
})();
