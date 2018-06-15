import Easing from './../definition/easing.es6';

export default class Morph {
	constructor(finalAttributes, duration, easingFunction, callback) {
		this.attributes = finalAttributes;
		this.duration = (duration == null) ? 300 : duration;
		this.easingFunction = easingFunction || Easing.LINEAR;

		this.callback = callback;
		this.animationTime = 0;
	}

	initMorphAttributes(finalAttributes, target) {
		for (const key in finalAttributes)
			if (finalAttributes.hasOwnProperty(key)) {
				const value = finalAttributes[key];
				if ("object" == typeof(value)) {
					this.initMorphAttributes(value, target[key]);
				} else if ("function" != typeof(value)) {
					finalAttributes[key] = new MorphData(target[key], value);
				}
			}
	}

	update(delta) {
		this.animationTime += delta;
		this.performMorph(this.attributes, this.parent);
		if (this.animationTime >= this.duration) {
			this.parent.remove(this);
			if (this.callback) this.callback(this.parent);
		}
	}

	performMorph(attributes, target) {
		const progress = this.getProgress();
		for (const key in attributes) {
			if (!(attributes[key] instanceof MorphData)) {
				this.performMorph(attributes[key], target[key]);
			} else {
				target[key] = attributes[key].valueForProgress(progress);
			}
		}
	}

	getProgress(delta) {
		let progress = this.animationTime / this.duration;
		progress = Math.min(Math.max(progress, 0), 1);
		return this.easingFunction(progress);
	}

	setParent(parent) {
		this.parent = parent;
		this.initMorphAttributes(this.attributes, this.parent);
	}
}

// Internal Helper
class MorphData {
	constructor(from, to) {
		this.from = from;
		this.to = to;
	}

	valueForProgress(progress) {
		return this.from + (this.to - this.from) * progress;
	}
}