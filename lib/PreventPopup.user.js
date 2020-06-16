// ==UserScript==
// @name         Prevent PopUp
// @namespace    https://avgle.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://avgle.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var $ = window.jQuery;

    var start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        if (progress < 2000) {

            $.each($('iframe'), function () {
                this.contentWindow.open = function (url, windowName, windowFeatures) {
                    return window;
                };
            });

            window.open = function (url, windowName, windowFeatures) {
                return window;
            };

            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);

})();