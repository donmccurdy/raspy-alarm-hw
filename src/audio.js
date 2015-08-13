var _ = require('lodash'),
	fs = require('fs'),
	Eventify = require('eventify'),
	lame = require('lame'),
	Speaker = require('speaker');

var OPTIONS = {channels: 2, bitDepth: 16, sampleRate: 44100};

var Audio = function () {
	this.stream = null;
	Eventify.enable(this);
	this.on('stop', this.onStop.bind(this));
};

Audio.prototype.play = function () {
	this.decoder = lame.Decoder();
	this.speaker = new Speaker(OPTIONS);
	this.stream = fs.createReadStream(process.env.ALARM_MP3)
		.pipe(this.decoder)
		.pipe(this.speaker);
	this.speaker.on('flush', _.bind(this.trigger, this, 'stop'));
};

Audio.prototype.stop = function () {
	if (this.stream) {
		this.speaker.close(false);
		this.trigger('stop');
	}
};

Audio.prototype.onStop = function () {
	this.stream = this.speaker = this.decoder = null;
};

Audio.prototype.isPlaying = function () {
	return !!this.stream;
};

module.exports = Audio;
