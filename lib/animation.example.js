import Scene from './scene.js';
import V2 from '../geo/v2.js';
import graphic from '../core/graphic.js';
import ImageEntity from '../basic/image.js';
import Animation from './animation.js';

class BasicExampleScene extends Scene {
	constructor() {
		super();
		const img = 'examples/tincan.png';
		// Add image to graphics manager
		graphic.add(img);
		// Preload the image, usually done during game init
		graphic.load(() => {
			// Add image to showcase
			this.add(new ImageEntity(new V2(240, 150), img));
			// Add animation
			this.add(new Animation(img, new V2(384, 300), 10, 250, true));
		});
	}
}

export default [
	{
		title: "Basic Example",
		description: `The Animation displays basic spritesheet animations.
			The above seen image is a simple spritesheet with 10 animation frames in a single row.
			The Animation is given the number of frames, the duration of a single frame in milliseconds and a looping parameter.`,
		scene: BasicExampleScene
	}
];