// ==UserScript==
// @name         Prevent PopUp
// @namespace    https://avgle.com/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var $ = window.jQuery;

    var start = null;
    var myWindowOpen = window.open;

    /**
     * 주기적으로 팝업 방지 코드를 실행하는 코드입니다.
     * 비동기 콜백 함수 호출 없이 닫기를 수행할 경우, 캡챠 통과가 되지 않습니다.
     * 
     * @param {Number} timestamp 
     */
    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        if (progress < 2000) {

            $.each($('iframe'), function () {
                this.contentWindow.open = function (url, target, features) {
                    var sub = myWindowOpen.call(this, url, target, features);
                    if(target == "_blank") {
                        setTimeout(function() { sub.close() }, 0);
                    }
                    return sub;
                };
            });

            window.open = function (url, target, features) {
                var sub = myWindowOpen.call(this, url, target, features);
                if(target == "_blank") {
                    setTimeout(function() { sub.close() }, 0);
                }
                return sub;
            };

            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);

})();