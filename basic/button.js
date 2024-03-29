import Entity from './../basic/entity.js';
import  V2 from './../geo/v2.js';
import  TextEntity from './../basic/text.js';
import  RectEntity from './../basic/rect.js';
import  ImageEntity from './../basic/image.js';
import {Zero} from './../geo/v2.js';

export default class Button extends Entity {
	constructor(pos, callback) {
		super(pos);
		this.onClick = p => {
			callback(p);
			return true;
		}
	}

	static create (pos, callback) {
		return new Button(pos, callback);
	}

	onMouseDown() {
		return true;
	}

	text(text, font, w, h) {
		this.size.x = Math.max(w || 0, this.size.x);
		this.size.y = Math.max(h || 0, this.size.y);

		const self = this;
		const txt = new TextEntity(new V2(this.size.x / 2, this.size.y / 2), text, font);

		txt.hover = () => self.hover();
		this.setText = s => {
			txt.text = s
		};

		this.add(txt);
		return this;
	}

	img(src, scale) {
		const img = new ImageEntity(Zero(), src, scale);
		this.size.x = Math.max(img.size.x*scale, this.size.x);
		this.size.y = Math.max(img.size.y*scale, this.size.y);
		this.add(img);
		return this;
	}

	rect(w, h, color) {
		const self = this;
		const rect = new RectEntity(Zero(), new V2(w, h), color);

		rect.hover = () => self.hover();

		this.size.x = Math.max(w, this.size.x);
		this.size.y = Math.max(h, this.size.y);
		this.add(rect);
		return this;
	}
}

