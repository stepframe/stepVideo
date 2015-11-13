 /**
  * stepVideo (Version 1.0)
  *
  * Handles tracking of events in google analytics and fallback to flash player if needed.
  *
  *  The MIT License (MIT)
  *  Copyright (c) 2015, Stepframe Interactive Media
  *
  *  Permission is hereby granted, free of charge, to any person obtaining a
  *  copy of this software and associated documentation files (the "Software"),
  *  to deal in the Software without restriction, including without limitation
  *  the rights to use, copy, modify, merge, publish, distribute, sublicense,
  *  and/or sell copies of the Software, and to permit persons to whom the
  *  Software is furnished to do so, subject to the following conditions:
  *
  *  The above copyright notice and this permission notice shall be included in
  *  all copies or substantial portions of the Software.
  */

var stepVideo = (function() {

	'use strict';

	var hasHtmlVideo = !!document.createElement('video').canPlayType;
	var settings = {};

	return {
		init: init,
		hasHtmlVideo: hasHtmlVideo
	};

	////////////

	function init(data) {

		if (data) {
			settings.aspectRatio = data.aspectRatio || 9 / 16;
			settings.flashPlayerLocation = data.flashPlayerLocation || '/js/vendor/jwplayer/player.swf';
		}

		console.log(settings);


		if (hasHtmlVideo) {
			setupHtmlVideo();
		} else {
			setupFlashVideo();
		}
	}

	function setupHtmlVideo() {

		var i;
		var videoList = document.querySelectorAll('video');

		for (i = 0; i < videoList.length; i++) {

			if (videoList[i]) {
				videoList[i].addEventListener('play', playHandler);
				videoList[i].addEventListener('loadedmetadata', loadedMetaDataHandler, false);
				videoList[i].addEventListener('webkitendfullscreen', webkitEndFullscreenHandler);

				videoList[i].width = videoList[i].parentNode.offsetWidth;
				videoList[i].height = videoList[i].width * settings.aspectRatio;
			}
		}

		function playHandler(e) {

			console.log('play handler: ', e.target.id);
			trackThis.event('Video', e.target.id, 'VIDEO');
		}

		function loadedMetaDataHandler() {

			this.width = this.parentNode.offsetWidth;
			this.height = this.width * settings.aspectRatio;
		}

		function webkitEndFullscreenHandler() {

			var $closeButton;

			try {
				$closeButton = $(this).parents('.popup').find('.js-popup-close');
				$closeButton.click();
			} catch (e) {
				//
			}
		}
	}

	function setupFlashVideo() {

		var i;
		var minWidth = 570;
		var maxWidth = 1000;
		var source;
		var thumbnail;
		var playerWidth;
		var playerHeight;
		var parentWidth;
		var videoList = document.querySelectorAll('video');

		for (i = 0; i < videoList.length; i++) {


			parentWidth = videoList[i].parentNode.offsetWidth;
			source = videoList[i].getElementsByTagName('source')[0].getAttribute('src');
			thumbnail = videoList[i].getAttribute('poster');
			playerWidth = parentWidth > minWidth ? parentWidth : minWidth;
			if (playerWidth > maxWidth) {
				playerWidth = maxWidth;
			}
			playerHeight = settings.aspectRatio * playerWidth;

			if (source) {
				console.log('setting up ', videoList[i].getAttribute('id'));
				jwplayer(videoList[i].getAttribute('id')).setup({
					width: playerWidth,
					height: playerHeight,
					flashplayer: settings.flashPlayerLocation,
					file: source,
					image: thumbnail
				});
			}
		}

		for (i = 0; i < jwplayer.getPlayers().length; i++) {

			jwplayer.getPlayers()[i].onPlay(onPlayHandler);
		}

		function onPlayHandler() {

			trackThis.event('Video', this.id, 'VIDEO');
		}
	}

 }());

