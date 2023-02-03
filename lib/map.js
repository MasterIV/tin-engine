import Entity from '../basic/entity.js';
import graphics from '../core/graphic.js';
import Elli from '../geo/ellipse.js';
import Poly from '../geo/poly.js';
import Rect from '../geo/rect.js';
import V2 from '../geo/v2.js';
import {Zero} from '../geo/v2.js';
import {checkBit,clearBit} from '../util.js';

export class TiledDataLoader {
	constructor() {
		this.data = [];
	}

	// Load exported .js map files

	loadJS() {
		if (typeof(window.TileMaps) == 'undefined') {
			window.onTileMapLoaded = this.onTileMapLoaded.bind(this);
		} else {
			for (const map in window.TileMaps)
				this.data[map] = window.TileMaps[map];
		}
	}

	onTileMapLoaded(map, data) {
		this.data[map] = data;
	}

	// Load exported .json map files

	preloadJSON(paths, callback) {
		if (!Array.isArray(paths)) paths = [paths];

		Promise.all(paths.map(url => {
			return fetch(url)
			.then(response => {
				return response.json();
			});
		}))
		.then(data => {
			for (let i = 0; i < data.length; i++) {
				this.data[paths[i]] = data[i];
			}
			callback();
		});
	}

	async loadJSON(paths) {
		if (!Array.isArray(paths)) paths = [paths];

		const promises = paths.map(url => fetch(url));
		const responses = await Promise.all(promises);

		const maps = [];
		for (const response of responses) {
			maps.push(await response.json());
		}

		for (let i = 0; i < maps.length; i++) {
			this.data[paths[i]] = maps[i];
		}
	}

	// Loading of Tilesets

	preloadTilesets(callback) {
		const tilesets = { paths: [], count: 0 };
		this.getTilesetPaths(tilesets);

		if (tilesets.count == 0) return callback();

		let loaded = 0;

		function complete() {
			if (++loaded >= tilesets.count) callback();
		}

		for (const map in tilesets.paths) {
			Promise.all(tilesets.paths[map].map(url => {
				return fetch(url)
				.then(response => {
					return response.json();
				});
			}))
			.then(data => {
				let offset = 0;
				for (let i = 0; i < data.length; i++) {
					while(!this.data[map].tilesets[i+offset].source)
						offset++;
					data[i].firstgid = this.data[map].tilesets[i+offset].firstgid;
					this.data[map].tilesets[i+offset] = data[i];

					complete();
				}
			});
		}
	}

	async loadTilesets() {
		const tilesets = { paths: [], count: 0 };
		this.getTilesetPaths(tilesets);

		for (const map in tilesets.paths) {
			const promises = tilesets.paths[map].map(url => fetch(url));
			const responses = await Promise.all(promises);

			let i = 0;
			for (const response of responses) {
				while(!this.data[map].tilesets[i].source)
					i++;
					const firstgid = this.data[map].tilesets[i].firstgid;
					this.data[map].tilesets[i] = await response.json();
					this.data[map].tilesets[i].firstgid = firstgid;
				i++;
			}
		}
	}

	getTilesetPaths(tilesets) {
		for (const map in this.data) {
			const path = map.substring(0, map.lastIndexOf('/'));
			const mapsets = [];
			for (let i = 0; i < this.data[map].tilesets.length; i++) {
				if (!this.data[map].tilesets[i].source) continue;

				let tileset = this.data[map].tilesets[i].source;
				if (path.length) tileset = path + '/' + tileset;
				mapsets.push(tileset);
				tilesets.count++;
			}

			tilesets.paths[map] = mapsets;
		}
	}

	// Loading of images associated with tilesets

	preloadImages(doload, callback) {
		const paths = this.getImagePaths();
		for (let i = 0; i < paths.length; i++) {
			graphics.add(paths[i]);
		}
		if (doload) {
			graphics.load(callback);
		}
	}

	getImagePaths() {
		const images = [];

		for (const map in this.data) {
			const mappath = map.substring(0, map.lastIndexOf('/'));
			this.getTilesetImagePaths(this.data[map].tilesets, mappath, images);
			this.getLayerImagePaths(this.data[map].layers, mappath, images);
		}

		return images;
	}

	getTilesetImagePaths(tilesets, mappath, images) {
		for (let i = 0; i < tilesets.length; i++) {
			let imagepath = tilesets[i].image;
			if (mappath.length) imagepath = mappath + '/' + imagepath;
			images.push(imagepath);
			tilesets[i].image = imagepath;
		}
	}

	getLayerImagePaths(layers, mappath, images) {
		for (let i = 0; i < layers.length; i++) {
			if (layers[i].type == "imagelayer") {
				let imagepath = layers[i].image;
				if (mappath.length) imagepath = mappath + '/' + imagepath;
				images.push(imagepath);
				layers[i].image = imagepath;
			}
			if (layers[i].type == "group") {
				this.getLayerImagePaths(layers[i].layers, mappath, images);
			}
		}
	}

	// Combine everything

	preloadCompleteJSON(paths, callback) {
		this.preloadJSON(paths, () => {
			this.preloadTilesets(() => {
				this.preloadImages(true, callback);
			});
		});
	}

	async loadCompleteJSON(paths, doload) {
		await this.loadJSON(paths);
		await this.loadTilesets();
		this.preloadImages(doload, () => {});
	}

	preloadCompleteJS(callback) {
		this.loadJS();
		this.preloadTilesets(() => {
			this.preloadImages(true, callback);
		});
	}

	async loadCompleteJS(doload) {
		this.loadJS();
		await this.loadTilesets();
		this.preloadImages(doload, () => {});
	}
}

class TiledTileset {
	constructor(data, palette) {
		this.img = graphics[data.image];
		this.start = data.firstgid;
		this.end = this.start + data.tilecount;
		this.data = data;
		this.palette = palette;
	}

	draw(ctx, gid, x, y, transforms) {
		let width = this.data.imagewidth;
		let tilex = 0;
		let tiley = 0;
		if (this.data.margin) {
			width -= this.data.margin * 2;
			tilex = this.data.margin;
			tiley = this.data.margin;
		}
		const tilewidth = this.data.tilewidth;
		const tileheight = this.data.tileheight;
		let drawwidth = this.data.tilewidth;
		let drawheight = this.data.tileheight;
		const spacing = this.data.spacing || 0;
		const columns = Math.ceil(width / (tilewidth + spacing));
		tilex += ((gid - this.start) % columns) * (tilewidth + spacing);
		tiley += Math.floor((gid - this.start) / columns) * (tileheight + spacing);

		let scalex = transforms.hflip ? -1 : 1;
		let scaley = transforms.vflip ? -1 : 1;

		if (this.data.tilerendersize == "grid") {
			if (tilewidth != this.palette.map.tile.x ||
				tileheight != this.palette.map.tile.y) {
					if (this.data.fillmode == "preserve-aspect-fit") {
						const mylongest = tilewidth > tileheight ? tilewidth : tileheight;
						const theirlongest = this.palette.map.tile.x > this.palette.map.tile.y ? this.palette.map.tile.x : this.palette.map.tile.y;
						const ratio = theirlongest / mylongest;
						drawwidth *= ratio;
						drawheight *= ratio;
						x += this.palette.map.tile.x - drawwidth;
						y += this.palette.map.tile.y - drawheight;
					} else {
						// fill mode "stretch"
						drawwidth = this.palette.map.tile.x;
						drawheight = this.palette.map.tile.y;
					}
				}
		}

		if (this.data.tileoffset) {
			x += this.data.tileoffset.x;
			y += this.data.tileoffset.y;
		}

		ctx.save();
		if (transforms.diaflip || transforms.hexflip) {
			ctx.translate(x + drawwidth/2, y + drawheight/2);
			x = -drawwidth / 2;
			y = -drawheight / 2;
			let r = 90;
			if (transforms.hex) {
				if (transforms.hexflip) {
					r = 120;
				} else {
					r = 60;
				}
			} else {
				// The diagonal flip required by Tiled is equivalent to a 90° turn and a horizontal flip
				scalex *= -1;
				// hardcoded fix
				if (transforms.hflip == transforms.vflip) {
					scalex *= -1;
					scaley *= -1;
				}
			}
			ctx.rotate(r * Math.PI / 180);
		}
		ctx.scale(scalex, scaley);
		ctx.drawImage(this.img,
			tilex,
			tiley,
			tilewidth,
			tileheight,
			x * scalex,
			y * scaley,
			drawwidth * scalex,
			drawheight * scaley);
		ctx.restore();
	}

	contains(gid) {
		return gid >= this.start && gid < this.end;
	}
}

class TiledPalette {
	constructor(data, map) {
		this.sets = [];
		this.map = map;

		for (const i in data)
			this.sets.push(new TiledTileset(data[i], this));
	}

	draw(ctx, gid, x, y) {
		if (gid == 0) return;

		const transforms = {
			hflip: false,
			vflip: false,
			diaflip: false,
			hexflip: false,
			hex: this.map.data.orientation == "hexagonal" ? true : false
		};

		gid = this.checkTransformations(gid, transforms);

		for (const tileset of this.sets) {
			if (tileset.contains(gid))
				tileset.draw(ctx, gid, x, y, transforms);
		}
	}

	checkTransformations(gid, transforms) {
		if (checkBit(gid, 31)) {
			gid = clearBit(gid, 31);
			transforms.hflip = true;
		}
		if (checkBit(gid, 30)) {
			gid = clearBit(gid, 30);
			transforms.vflip = true;
		}
		if (checkBit(gid, 29)) {
			gid = clearBit(gid, 29);
			transforms.diaflip = true;
		}
		if (transforms.hex && checkBit(gid, 28)) {
			transforms.hexflip = true;
		}
		// Always remove bit 29 as per the Tiled instructions
		gid = clearBit(gid, 28);
		return gid;
	}
}

class TiledLayer extends Entity {
	constructor(data, map) {
		super(new V2(data.offsetx || 0, data.offsety || 0), map.size.clone());

		this.data = data;

		this.visible = data.visible;
		this.scale = 1;

		if (data.encoding == "base64")
			this.decodeBase64();
	}

	decodeBase64() {
		const decoded = [];
		const binary = window.atob(this.data.data);
		let i = 0, b = [];
		while(!isNaN(binary.charCodeAt(i))) {
			b.push(binary.charCodeAt(i));
			if (b.length == 4) {
				const bytes = new Uint8Array(b);
				const dv = new DataView(bytes.buffer);
				const uint = dv.getUint32(0, true);
				decoded.push(uint);
				b = [];
			}
			i++;
		}
		this.data.data = decoded;
		this.data.encoding = "CSV";
	}

	staticRender(canvas) {
		let ctx;
		if (!canvas) {
			canvas = document.createElement("canvas");
			canvas.width = this.size.x;
			canvas.height = this.size.y;
			this.img = canvas;
			ctx = canvas.getContext("2d");
			ctx.save();
		} else {
			this.visible = false;
			ctx = canvas.getContext("2d");
			ctx.save();
			ctx.translate(this.position.x, this.position.y);
		}

		this.render(ctx);

		ctx.restore();
	}

	render(ctx) {
		ctx.globalAlpha = this.data.opacity;

		const palette = this.parent.palette;
		const brush = Zero();
		const step = new V2(this.parent.tile.x, this.parent.tile.y);

		switch (this.parent.data.orientation) {
			case "orthogonal":
				this.renderOrthogonal(ctx, palette, brush, step);
				break;
			case "hexagonal":
				this.renderHexagonal(ctx, palette, brush, step);
				break;
			case "isometric":
				this.renderIsometric(ctx, palette, brush, step);
				break;
			case "staggered":
				this.renderStaggered(ctx, palette, brush, step);
				break;
		}
	}

	renderOrthogonal(ctx, palette, brush, step) {
		// Fix starting point for renderorder
		if (this.parent.data.renderorder.indexOf("left") > -1) {
			step.x *= -1;
			brush.x = this.size.x + step.x;
		}
		if (this.parent.data.renderorder.indexOf("up") > -1) {
			step.y *= -1;
			brush.y = this.size.y + step.y;
		}

		for (let i = 0; i < this.data.data.length; i++) {
			palette.draw(ctx, this.data.data[i], brush.x, brush.y);
			brush.x += step.x;
			// renderorder "right"
			if (brush.x >= this.size.x) {
				brush.x = 0;
				brush.y += step.y;
			}
			// renderorder "left"
			if (brush.x < 0) {
				brush.x = this.size.x + step.x;
				brush.y += step.y;
			}
		}
	}

	renderHexagonal(ctx, palette, brush, step) {
		let mapwidth = this.parent.data.width * this.parent.data.tilewidth;
		const offset = Zero();
		let even = true;

		// On the staggeraxis, a draw step doesn't proceed a full tile size
		if (this.parent.data.staggeraxis == "y") {
			step.y -= (step.y - this.parent.data.hexsidelength) / 2;
			if (this.parent.data.staggerindex == "even")
				offset.x += step.x/2;
		} else {
			mapwidth = this.size.x - (this.parent.data.tilewidth - this.parent.data.hexsidelength)/2;
			step.x -= (step.x - this.parent.data.hexsidelength) / 2;
			if (this.parent.data.staggerindex == "even")
				offset.y += step.x/2;
		}

		for (let i = 0; i < this.data.data.length; i++) {
			palette.draw(ctx, this.data.data[i], brush.x + offset.x, brush.y + offset.y);
			brush.x += step.x;

			if (brush.x >= mapwidth) {
				brush.x = 0;
				brush.y += step.y;

				if (this.parent.data.staggeraxis == "y") {
					even = !even;
					offset.x = 0;
					if (this.parent.data.staggerindex == "even" && even)
						offset.x = step.x/2;
					if (this.parent.data.staggerindex == "odd" && !even)
						offset.x = step.x/2;
				} else {
					// staggeraxis "x"
					// Will be set to true down below
					even = false;
				}
			}
			if(this.parent.data.staggeraxis == "x") {
				even = !even;
				offset.y = 0;
				if (this.parent.data.staggerindex == "even" && even)
					offset.y = step.y/2;
				if (this.parent.data.staggerindex == "odd" && !even)
					offset.y = step.y/2;
			}
		}
	}

	renderIsometric(ctx, palette, brush, step) {
		step.mul(.5);
		brush.x = this.size.x/2 - this.parent.data.tilewidth/2;

		for (let i = 0; i < this.data.data.length; i++) {
			if (i > 0 && i % this.data.width == 0) {
				const row = i / this.data.width;
				brush.x = this.size.x/2 - this.parent.data.tilewidth/2 * (row+1);
				brush.y = this.parent.data.tileheight/2 * row;
			}

			palette.draw(ctx, this.data.data[i], brush.x, brush.y);
			brush.add(step);
		}
	}

	renderStaggered(ctx, palette, brush, step) {
		const offset = Zero();
		let even = true;

		// On the staggeraxis, a draw step doesn't proceed a full tile size
		if (this.parent.data.staggeraxis == "y") {
			step.y /= 2;
			if (this.parent.data.staggerindex == "even")
				offset.x += step.x/2;
		} else {
			step.x /= 2;
			if (this.parent.data.staggerindex == "even")
				offset.y += step.x/2;
		}

		for (let i = 0; i < this.data.data.length; i++) {
			palette.draw(ctx, this.data.data[i], brush.x + offset.x, brush.y + offset.y);
			brush.x += step.x;

			if (i > 0 && i % this.data.width == this.data.width-1) {
				brush.x = 0;
				brush.y += step.y;

				if (this.parent.data.staggeraxis == "y") {
					even = !even;
					offset.x = 0;
					if (this.parent.data.staggerindex == "even" && even)
						offset.x = step.x/2;
					if (this.parent.data.staggerindex == "odd" && !even)
						offset.x = step.x/2;
				} else {
					// staggeraxis "x"
					// Will be set to true down below
					even = false;
				}
			}
			if(this.parent.data.staggeraxis == "x") {
				even = !even;
				offset.y = 0;
				if (this.parent.data.staggerindex == "even" && even)
					offset.y = step.y/2;
				if (this.parent.data.staggerindex == "odd" && !even)
					offset.y = step.y/2;
			}
		}
	}

	onDraw(ctx) {
		if (this.img) {
			ctx.drawImage(this.img, 0, 0, this.size.x | 0, this.size.y | 0, 0, 0, (this.size.x * this.scale) | 0, (this.size.y * this.scale) | 0);
		} else {
			this.render(ctx);
		}
	}
}

class TiledImageLayer extends Entity {
	constructor(data, map) {
		super();

		this.data = data;

		this.position.x = data.offsetx || 0;
		this.position.y = data.offsety || 0;

		this.img = graphics[data.image];

		this.size.x = this.img.width;
		this.size.y = this.img.height;

		this.visible = data.visible;
	}

	staticRender(canvas) {
		if (canvas) {
			this.visible = false;
			ctx = canvas.getContext("2d");
			ctx.save();
			ctx.translate(this.position.x, this.position.y);
			this.onDraw(ctx);
			ctx.restore();
		}
	}

	onDraw(ctx) {
		ctx.globalAlpha = this.data.opacity;
		ctx.drawImage(this.img, 0, 0, this.size.x | 0, this.size.y | 0, 0, 0, this.size.x | 0, this.size.y | 0);
	}
}

class TiledObjectLayer extends Entity {
	constructor(data, map) {
		super();

		this.data = data;

		this.position.x = data.offsetx || 0;
		this.position.y = data.offsety || 0;

		this.size = map.size.clone();

		this.objects = [];
		this.tiles = [];
		this.createObjects();

		this.visible = data.visible;
		this.scale = 1;
	}

	createObjects() {
		for (const object of this.data.objects) {
			const position = new V2(object.x || 0, object.y || 0);
			if (object.point) {
				this.objects.push({
					type: "point",
					data: position });
			} else if (object.ellipse) {
				const radii = new V2(this.objects.width / 2, this.objects.height / 2);
				const center = new V2(this.objects.x, this.objects.y);
				center.add(radii);
				this.objects.push({
					type: "ellipse",
					data: new Elli(center, radii) });
			} else if (object.polygon) {
				const points = [];
				for (let i = 0; i < object.polygon.length; i++) {
					points.push(new V2(object.polygon[i].x, object.polygon[i].y));
				}
				this.objects.push({
					type: "polygon",
					data: new Poly(points) });
			} else if (object.text) {
				this.objects.push({
					type: "text",
					data: { text: object.text.text,
						position: position }
				});
			} else if (object.gid) {
				const tile = {
					type: "tile",
					data: { gid: object.gid,
						x: object.x,
						y: object.y,
						visible: object.visible }
					};
				this.objects.push(tile);
				this.tiles.push(tile);
			} else {
				this.objects.push({
					type: "rectangle",
					data: new Rect(
						position,
						new V2(object.width || 0, object.height || 0)
						)
				});
			}
			
		}
	}

	staticRender(canvas) {
		if (!this.tiles.length) return;

		let ctx;
		if (!canvas) {
			canvas = document.createElement("canvas");
			canvas.width = this.size.x;
			canvas.height = this.size.y;
			this.img = canvas;
			ctx = canvas.getContext("2d");
			ctx.save();
		} else {
			this.visible = false;
			ctx = canvas.getContext("2d");
			ctx.save();
			ctx.translate(this.position.x, this.position.y);
		}

		this.render(ctx);

		ctx.restore();
	}

	render(ctx) {
		ctx.globalAlpha = this.data.opacity;

		for (const tile of this.tiles) {
			if (tile.data.visible) {
				this.parent.palette.draw(ctx, tile.data.gid, tile.data.x, tile.data.y);
			}
		}
	}

	onDraw(ctx) {
		if (this.img) {
			ctx.drawImage(this.img, 0, 0, this.size.x | 0, this.size.y | 0, 0, 0, (this.size.x * this.scale) | 0, (this.size.y * this.scale) | 0);
		} else {
			this.render(ctx);
		}
	}
}

export class TiledMap extends Entity {
	constructor(data, pos) {
		let w, h;
		switch (data.orientation) {
			case "orthogonal":
			case "isometric":
				w = data.width * data.tilewidth;
				h = data.height * data.tileheight;
				break;
			case "hexagonal":
				if (data.staggeraxis == "y") {
					w = data.width * data.tilewidth + data.tilewidth / 2;
					h = data.height * (data.tileheight - data.hexsidelength/2) + (data.tileheight - data.hexsidelength)/2;
				} else {
					w = data.width * (data.tilewidth - data.hexsidelength/2) + (data.tilewidth - data.hexsidelength)/2;
					h = data.height * data.tileheight + data.tileheight / 2;
				}
				break;
			case "staggered":
				if (data.staggeraxis == "y") {
					w = data.width * data.tilewidth + data.tilewidth / 2;
					h = data.height * data.tileheight / 2 + data.tileheight / 2;
				} else {
					w = data.width * data.tilewidth / 2 + data.tilewidth / 2;
					h = data.height * data.tileheight + data.tileheight / 2;
				}
				break;
		}

		super(pos, new V2(w, h));

		this.data = data;
		this.tile = new V2(data.tilewidth, data.tileheight);

		this.height = data.height;
		this.width = data.width;

		this.palette = new TiledPalette(data.tilesets, this);
		this.layers = [];

		this.fillLayers(this.data.layers, {
			offsetx: 0,
			offsety: 0,
			opacity: 1,
			visible: true,
		});

		this.scale = 1;
	}

	fillLayers(layers, groupstats) {
		for (let i = 0; i < layers.length; i++) {
			let layer;
			switch (layers[i].type) {
				case  "tilelayer":
					layer = new TiledLayer(layers[i], this);
					break;
				case "imagelayer":
					layer = new TiledImageLayer(layers[i], this);
					break;
				case "objectgroup":
					layer = new TiledObjectLayer(layers[i], this);
					break;
				case "group":
					const combined = {
						offsetx: groupstats.offsetx + layers[i].offsetx,
						offsety: groupstats.offsety + layers[i].offsety,
						opacity: groupstats.opacity * layers[i].opacity,
						visible: groupstats.visible && layers[i].visible,
					};
					this.fillLayers(layers[i].layers, combined);
					break;
			}
			if (layer) {
				this.add(layer);
				this.layers.push(layer);
			}
		}
	}

	staticRender(merge, filter) {
		let canvas;
		if (merge) {
			canvas = document.createElement("canvas");
			canvas.width = this.size.x;
			canvas.height = this.size.y;
			this.img = canvas;
		}

		for (const layer of this.layers) {
			if (layer.visible && (!filter || filter.indexOf(layer.data.name) >= 0)) {
				layer.staticRender(canvas);
			} else {
				layer.visible = false;
			}
		}
	}

	onDraw(ctx) {
		if (this.data.backgroundcolor) {
			ctx.fillStyle = this.data.backgroundcolor;
			ctx.fillRect(0,0, this.size.x, this.size.y);
		}
		if (this.img)
			ctx.drawImage(this.img, 0, 0, this.size.x | 0, this.size.y | 0, 0, 0, (this.size.x * this.scale) | 0, (this.size.y * this.scale) | 0);
	}

	toTile(pos) {
		const result = pos.clone();
		result.grid(this.tile.x, this.tile.y);
		return result;
	}

	getLayer(name) {
		for (const i in this.layers) {
			const l = this.layers[i];
			if (l.data.name == name) return l;
		}
	}

	blocked(pos) {
		return this.has(pos, 'collision', true);
	}

	has(pos, property, def) {
		if (pos.x < 0 || pos.y < 0 || pos.x >= this.width || pos.y >= this.height)
			return def;

		const flags = this.flags(pos);
		return flags[property];
	}

	flags(pos) {
		if (pos.x < 0 || pos.y < 0 || pos.x >= this.width || pos.y >= this.height)
			return {};

		const result = {};
		for (const i in this.layers) {
			const l = this.layers[i];
			if (l.data && l.data[pos.x + (pos.y * l.width)])
				for (const p in l.properties)
					if (!result[p]) result[p] = l.properties[p];
		}

		return result;
	}
}
