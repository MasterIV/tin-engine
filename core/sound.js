export default {
	sampels: [],
	urls: [],

	play(file) {
		const self = this;

		if (!this.sampels[file])
			this.sampels[file] = [];

		if (this.sampels[file].length) {
			var sample = this.sampels[file].pop();
			sample.play();
			return sample;
		} else {
			var sample = new Audio(file);
			sample.onended = function () {
				self.sampels[file].push(this);
			};
			sample.play();
			return sample;
		}
	},

	add(url) {
		this.urls.push(url);
	},

	load(callback) {
		let total = 0, loaded = 0;

		function complete() {
			if (++loaded >= total && callback) callback();
		}

		while (this.urls.length) {
			const url = this.urls.shift();
			if (typeof this[url] == 'undefined') {
				total++;

				const sample = new Audio(url);
				sample.oncanplaythrough = complete;
				this.sampels[url] = [sample];
			}
		}

		if (total == 0 && callback) callback();
	}
};