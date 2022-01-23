// ==UserScript==
// @name         DownloadTSList
// @namespace    https://avgle.com/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://avgle.com/video/*/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	document.addEventListener(
		"keydown",
		function (ev) {
			var keycode = ev.which || ev.keyCode;
			if (keycode === 80) {
				(function () {
					if (!window.videojs || typeof window.videojs === "undefined") {
						return;
					}

					var v = window.videojs("video-player");

					var RS = {};

					RS.getfile = function (filename, data) {
						var blob = new Blob([data], {
							type: "text/plain",
							endings: "native",
						});
						if (window.navigator.msSaveOrOpenBlob) {
							window.navigator.msSaveBlob(blob, filename);
						} else {
							var elem = window.document.createElement("a");
							elem.href = window.URL.createObjectURL(blob);
							elem.download = filename;
							document.body.appendChild(elem);
							elem.click();
							document.body.removeChild(elem);
						}
					};

					RS.download = function () {
						var arr = v.tech_.hls.playlists.media_.segments.map(function (x) {
							return {
								uri: x.resolvedUri,
							};
						});

						arr.forEach(function (x) {
							x.uri = videojs.Hls.xhr(x, function () {}).uri;
						});

						RS.getfile(
							"tslist",
							arr
								.map(function (a) {
									return a.uri;
								})
								.join("\r\n")
						);
					};

					RS.load = function () {
						v.on("loadedmetadata", function () {
							console.log("metadata loaded");
							RS.download();
						});
					};

					return RS;
				})().download();
			}
		},
		false
	);
})();
