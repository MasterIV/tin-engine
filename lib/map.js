import Entity from '../basic/entity.js';
import graphics from '../core/graphic.js';
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
	constructor(data) {
		this.img = graphics[data.image];
		this.start = data.firstgid;
		this.end = this.start + data.tilecount;
		this.data = data;
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
		const spacing = this.data.spacing || 0;
		const columns = Math.ceil(width / (tilewidth + spacing));
		tilex += ((gid - this.start) % columns) * (tilewidth + spacing);
		tiley += Math.floor((gid - this.start) / columns * (tileheight + spacing));

		let scalex = transforms.hflip ? -1 : 1;
		let scaley = transforms.vflip ? -1 : 1;

		ctx.save();
		if (transforms.diaflip) {
			ctx.translate(x, y);
			x = 0;
			y = -tileheight;
			ctx.rotate(90 * Math.PI / 180);
			scalex *= -1;
			if (transforms.hflip == transforms.vflip) {
				scalex *= -1;
				scaley *= -1;
			}
		}
		ctx.scale(scalex, scaley);
		ctx.drawImage(this.img,
			tilex,
			tiley,
			tilewidth,
			tileheight,
			x * scalex,
			y * scaley,
			tilewidth * scalex,
			tileheight * scaley);
		ctx.restore();
	}

	contains(gid) {
		return gid >= this.start && gid < this.end;
	}
}

class TiledPalette {
	constructor(data) {
		this.sets = [];

		for (const i in data)
			this.sets.push(new TiledTileset(data[i]));
	}

	draw(ctx, gid, x, y) {
		if (gid == 0) return;

		const transforms = {
			hflip: false,
			vflip: false,
			diaflip: false,
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
		// Always remove bit 29 as per the Tiled instructions
		gid = clearBit(gid, 28);
		return gid;
	}
}

class TiledLayer extends Entity {
	constructor(data, map) {
		super();

		this.data = data;

		this.position.x = (data.offsetx || 0) * map.tile.x;
		this.position.y = (data.offsety || 0) * map.tile.y;

		this.size.x = (data.width || 0) * map.tile.x;
		this.size.y = (data.height || 0) * map.tile.y;

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
		let xstep = this.parent.tile.x;
		let ystep = this.parent.tile.y;

		if (this.parent.data.orientation == "orthogonal") {
			if (this.parent.data.renderorder.indexOf("left") > 0) {
				xstep *= -1;
				brush.x = this.size.x + xstep;
			}
			if (this.parent.data.renderorder.indexOf("up") > 0) {
				ystep *= -1;
				brush.y = this.size.y + ystep;
			}
		}

		for (let i = 0; i < this.data.data.length; i++) {
			palette.draw(ctx, this.data.data[i], brush.x, brush.y);
			brush.x += xstep;
			if (brush.x >= this.size.x) {
				brush.x = 0;
				brush.y += ystep;
			}
			if (brush.x < 0) {
				brush.x = this.size.x + xstep;
				brush.y += ystep;
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

export class TiledMap extends Entity {
	constructor(data, pos) {
		const w = data.width * data.tilewidth;
		const h = data.height * data.tileheight;

		super(pos, new V2(w, h));

		this.data = data;
		this.tile = new V2(data.tilewidth, data.tileheight);

		this.height = data.height;
		this.width = data.width;

		this.palette = new TiledPalette(data.tilesets);
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
			if (l.name == name) return l;
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

	// is this needed? i don't know
	tileAt(pos) {
		return null;
	}
}
