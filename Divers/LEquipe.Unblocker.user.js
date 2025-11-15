// ==UserScript==
// @name         L'Équipe Unblocker
// @namespace    Divers
// @version      0.1.0
// @description  Débloque le site internet de l'équipe, accès aux chaînes en live de l'équipe et d'eurosport.
// @author       Esperlu3tte
// @supportURL   https://www.yggtorrent.top/profile/958029-esperlu3tte
// @supportURL   https://github.com/esperlu3tte/UserScripts
// @updateURL    https://github.com/esperlu3tte/UserScripts/raw/master/Divers/LEquipe.Unblocker.user.js
// @downloadURL  https://github.com/esperlu3tte/UserScripts/raw/master/Divers/LEquipe.Unblocker.user.js
// @license      Unlicense
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lequipe.fr
// @match        https://www.lequipe.fr/*
// ==/UserScript==

(function() {
    'use strict';

    function getStubUser() {
        return {
            "access": {
                "__type": "user_access",
                "has_articles_france_football": true,
                "has_articles_lequipe": true,
                "has_articles_velo_magazine": true,
                "has_free_ligue_1": false,
                "has_kiosk_france_football": true,
                "has_kiosk_lequipe": true,
                "has_kiosk_velo_magazine": true,
                "has_newsletters": false,
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
                "remaining_children_accounts": 1,
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
            "isConnected": true,
            "hasSubscription": true,
            "subscriberStatus": "subscriber",
            "isPremium": true,
        };
    }

    function unblock() {
        unsafeWindow.$nuxt?.$store._mutations["user/SET_USER"][0](getStubUser());
        document.querySelector("#videoWallScript")?.remove();
        document.querySelector(".Modal[data-modal='amsBlock']")?.remove();
        document.querySelector(".CmpContainer")?.remove();
        document.querySelector("#OfferBanner")?.remove();
        const htmlElem = document.querySelector("html");
        if (htmlElem.className.includes("no-scroll")) {
            htmlElem.className = htmlElem.className.split(" ").filter((c) => c !== "no-scroll").join(" ");
        }
    }

    unsafeWindow.addEventListener("load", function() {
        unblock();
        unsafeWindow.$nuxt?._router.afterHooks.push(() => unblock());
    });
})();
