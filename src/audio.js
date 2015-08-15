var fs = require('fs'),
	Eventify = require('eventify'),
	lame = require('lame'),
	Speaker = require('speaker');

var OPTIONS = {channels: 2, bitDepth: 16, sampleRate: 44100};

var isAnyAudioPlaying = false;

/**
 * Tiny audio controller that gives no f*cks what
 * MP3 you wanted to hear. Hope you like buzzers.
 *
 * Emits:
 * 	- start: When playback begins.
 * 	- stop: When playback ends.
 *
 * @constructor
 */
var Audio = function () {
	this.decoder = null;
	this.speaker = null;
	Eventify.enable(this);
};

/**
 * Begin playback.
 */
Audio.prototype.play = function () {
	if (isAnyAudioPlaying) return;

	this.decoder = lame.Decoder();
	this.speaker = new Speaker(OPTIONS);
	fs.createReadStream(process.env.ALARM_MP3)
		.pipe(this.decoder)
		.pipe(this.speaker);
	this.speaker.on('flush', this.onStop.bind(this));
	isAnyAudioPlaying = true;
	this.trigger('start');
};

/**
 * End playback, flush the stream.
 */
Audio.prototype.stop = function () {
	if (this.isPlaying()) {
		this.speaker.close(false);
		this.onStop();
	}
};

/**
 * Clean up after playback ends.
 *
 * @private
 */
Audio.prototype.onStop = function () {
	this.stream = this.speaker = this.decoder = null;
	isAnyAudioPlaying = false;
	this.trigger('stop');
};

/**
 * Returns true if the audio controller
 * is currently playing.
 *
 * @return {Boolean}
 */
Audio.prototype.isPlaying = function () {
	return !!this.stream;
};

module.exports = Audio;
