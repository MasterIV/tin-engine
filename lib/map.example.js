import Scene from './scene.js';
import V2 from '../geo/v2.js';
import {TiledDataLoader,TiledMap} from './map.js';
import RectEntity from '../basic/rect.js';
import Colors from '../definition/colors.js';
import ImageEntity from '../basic/image.js';
import TextEntity from '../basic/text.js';
import FontStyle from '../definition/font.js';

class BasicExampleScene extends Scene {
	constructor() {
		super();

		// Start by creating a loader that will get the necessary files from the server.
		this.loader = new TiledDataLoader();
		// preloadCompleteJSON will load JSON tiled maps and handle all the three loading stages:
		// First load the map files, then the tileset files, then the tileset image files.
		this.loader.preloadCompleteJSON('examples/map.json', () => {
			// Create a new map entity
			const map = new TiledMap(this.loader.data['examples/map.json'], new V2(50,50));
			// Render the map into a hidden canvas.
			// false means that the layers are using separate canvas elements and
			// can in theory be drawn at different moments.
			map.staticRender(false);
			// Add the map so it will simply be drawn.
			this.add(map);

			// Create a second map entity, displaying the same map.
			const map2 = new TiledMap(this.loader.data['examples/map.json'], new V2(430,50));
			// Render merged into a single canvas but only the Tile Layer 1 layer.
			map2.staticRender(true, ['Tile Layer 1']);
			// Add the map.
			this.add(map2);

			// Create reactangles overlapping the second map, to make a grid.
			// The missing layer 2 will be highlighted in red.
			const black = new Colors('#000000', '#00000000');
			const red = new Colors('#ff0000', '#00000000');
			for (let x = 0; x < 320; x += 32) {
				for (let y = 0; y < 320; y += 32) {
					if (y >= 64 && y < 128 && x >= 192 && x < 256) {
						const rect = new RectEntity(new V2(430 + x, 50 + y), new V2(32, 32), red);
						this.add(rect);
					} else {
						const rect = new RectEntity(new V2(430 + x, 50 + y), new V2(32, 32), black);
						this.add(rect);
					}
				}
			}

			// Display the tileset image for reference.
			const tileset = new ImageEntity(new V2(50, 400), 'examples/orthogonaltileset.png');
			this.add(tileset);

			// Annotations.
			const font = new FontStyle(12);
			font.align = 'left';
			this.add(new TextEntity(new V2(50, 25), "map.json:", font));
			this.add(new TextEntity(new V2(430, 25), "map.json, with filter and added rectangles:", font));
			this.add(new TextEntity(new V2(95, 425), "The tileset image for reference.", font));
		});
	}
}

class VariousExampleScene extends Scene {
	constructor() {
		super();

		// Create a loader.
		this.loader = new TiledDataLoader();
		// Preloading.
		this.loader.preloadCompleteJSON('examples/map2.json', () => {
			// New hexagonal map.
			const map = new TiledMap(this.loader.data['examples/map2.json'], new V2(50,50));
			// Add the map for live drawing.
			this.add(map);
		});
	}
}

export default [
	{
		title: "Basic Example",
		description: `In this basic example, a simple Tiled map will be displayed.
			The map is orthogonal with all standard parameters as described by Tiled and two layers.
			The tileset has three distinct tiles.
			On the left, you can the map drawn.
			On the right, a filter is applied so the second layer isn't drawn (highlighted in red).
			Because the map, tileset and tileset image files are usually separate files, you must ensure loading of these files.
			The TiledDataLoader offers multiple ways of loading files:<br><br>
			<b>loadJS()</b> - This method will load 'Javascript map files' as exported by Tiled.
			These can be loaded as regular javascripts through &lsaquo;script&rsaquo; tags in your base HTML file.<br><br>
			The other loading methods follow a pattern: you can use preload* to load the files and call a function afterwards, similar to how the graphic object loads image files.
			It is recommended to daisychain these calls into the game starting routine that preloads all other files.<br>
			Alternatively, you can use the load* methods to load the files asynchronously and use 'await'.<br>
			Apart from the javascript format, only the Tiled JSON format is supported (no XML).
			It is recommended to use the .json extension.
			However, if you choose to use the Tiled extensions (.tmj, .tsj), make sure your server sends these with content-type application/json.<br><br>
			<b>preloadJSON(paths, callback)</b> - Load exported JSON maps.
			'paths' can either be a single string or an array of strings to load multiple maps.
			'callback' can be a function that will be called once all files have been loaded.<br><br>
			<b>async loadJSON(paths)</b> - Same as preloadJSON but asynchronous.<br><br>
			<b>preloadTilesets(callback)</b> - Will load all tileset files that are referenced by a separate file from the map definition.
			This step can be omitted if you embed all tilesets into the map file by using the respective feature of Tiled.
			It is up to your personal preference what you choose but loading less is always better.
			'callback' can be a function that will be called once all files have been loaded.<br><br>
			<b>async loadTilesets()</b> - Same as preloadJSON but asynchronous.<br><br>
			<b>preloadImages(doload, callback)</b> - This method will supply all tileset images to core/graphic.
			Because of this, there is no special asynchronous loading of images.
			'doload' will instruct the graphic object to load the files immediately.
			This is not necessary if you call this before the graphic object preloads all images anyway.
			'callback' will be called once loading is finished but ignored if 'doload' isn't true.<br><br>
			<b>preloadCompleteJSON(paths, callback)</b> - This methods will do all the steps above in order.
			Parameters are the same than preloadJSON.<br><br>
			<b>async loadCompleteJSON(paths, doload)</b> - Same as preloadCompleteJSON but asynchronous.
			'doload' again instructs the graphic object to load all images.
			The method will however not wait for this to finish.<br><br>
			<b>preloadCompleteJS(callback)</b> - Same as preloadCompleteJSON but with 'Javascript map files'.<br><br>
			<b>loadCompleteJS(doload)</b> - Same as loadCompleteJSON but with 'Javascript map files'.<br><br>
			In this example, the map entity is instructed to draw the map once onto a hidden canvas element with 'staticRender'.
			This saves execution time during runtime because the individual tiles won't be drawn each frame.
			It is highly recommended to do this if you don't need any kind of sophisticated Z ordering.<br><br>
			<b>staticRender(merge, filter)</b> - Will draw the map on a separate, hidden canvas and only this will be drawn into the game canvas each frame.
			'merge' is a boolean; if true, all layers will draw on the same canvas and merged; if false, each layer will draw on its own canvas.
			With this, you can keep the layers separate if you so choose.
			The layers will be sub-entities of the map and also be saved as an array in the layers attribute.
			'filter' can be an array of layer names; if set, only the layers from this list will be drawn.`,
		scene: BasicExampleScene
	},
	{
		title: "Various map examples",
		description: `<b>Tiled support</b><br>
		The importer supports all Tiled maps formats, all the tile transformations and layer structures.<br>
		The importer <b>does not</b> support: tintcolor, regardless of where it is used; compression of layer data (gzip, zlib, ...) - base64 encoding is supported though.<br>
		<br>
		<b>A note on performance</b><br>
		If you don't use staticRender() on the map, the map will simply be drawn tile by tile in each frame.
		This is of course useful whenever you want any kind of z-ordering.
		However, do keep in mind that you are dealing with a browser's rendering engine - potentially on a mobile device.
		It is up to you to decide (and test) how complex you want the map to be.
		All kinds of transformations and huge maps may cause bad performance.
		Always consider whether you need live drawing of the map or if there are at least parts of it that you can render out once.
		This buffering will drastically increase performance.`,
		scene: VariousExampleScene
	}
];