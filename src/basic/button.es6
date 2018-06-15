import Entity from './../basic/entity.es6';
import  V2 from './../geo/v2.es6';
import  TextEntity from './../basic/text.es6';
import  RectEntity from './../basic/rect.es6';
import  ImageEntity from './../basic/image.es6';

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
		this.size.x = Math.max(img.size.x, this.size.x);
		this.size.y = Math.max(img.size.y, this.size.y);
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

