import Entity from '../basic/entity.js';
import graphics from '../core/graphic.js';
import V2 from '../geo/v2.js';
import {Zero} from '../geo/v2.js';

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
		const paths = this.getTilesetImagePaths();
		for (let i = 0; i < paths.length; i++) {
			graphics.add(paths[i]);
		}
		if (doload) {
			graphics.load(callback);
		}
	}

	getTilesetImagePaths() {
		const images = [];

		for (const map in this.data) {
			const mappath = map.substring(0, map.lastIndexOf('/'));
			for (let i = 0; i < this.data[map].tilesets.length; i++) {
				let imagepath = this.data[map].tilesets[i].image;
				if (mappath.length) imagepath = mappath + '/' + imagepath;
				images.push(imagepath);
				this.data[map].tilesets[i].image = imagepath;
			}
		}

		return images;
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

	draw(ctx, gid, x, y) {
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

		ctx.drawImage(this.img,
			tilex,
			tiley,
			tilewidth,
			tileheight,
			x,
			y,
			tilewidth,
			tileheight);
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
		for (const tileset of this.sets) {
			if (tileset.contains(gid))
				tileset.draw(ctx, gid, x, y);
		}
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
		ctx.globalAlpha = this.opacity;

		const palette = this.parent.palette;
		const brush = Zero();

		for (let i = 0; i < this.data.data.length; i++) {
			palette.draw(ctx, this.data.data[i], brush.x, brush.y);
			brush.x += this.parent.tile.x;
			if (brush.x >= this.size.x) {
				brush.x = 0;
				brush.y += this.parent.tile.y;
			}
		}

		ctx.restore();
	}

	onDraw(ctx) {
		if (this.img)
			ctx.drawImage(this.img, 0, 0, this.size.x | 0, this.size.y | 0, 0, 0, (this.size.x * this.scale) | 0, (this.size.y * this.scale) | 0);
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
		for (let i = 0; i < this.data.layers.length; i++) {
			const layer = new TiledLayer(this.data.layers[i], this);
			this.add(layer);
			this.layers.push(layer);
		}

		this.scale = 1;
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
			if (layer.visible && (!filter || filter.indexOf(layer.data.name) >= 0))
				layer.staticRender(canvas);
		}
	}

	onDraw(ctx) {
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
