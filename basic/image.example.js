import Scene from '../lib/scene.js';
import V2 from '../geo/v2.js';
import graphic from '../core/graphic.js';
import ImageEntity from './image.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        const img = 'examples/gold.png';
        // Add image to graphics manager
        graphic.add(img);
        // Preload the image, usually done during game init
        graphic.load(() => {
            // Add image unscaled
            this.add(new ImageEntity(new V2(380, 150), img));
            // Add image with scale
            this.add(new ImageEntity(new V2(360, 300), img, 2));
        });
    }
}

export default [
    {
        title: "Basic Example",
        description: "Preload and display images",
        scene: BasicExampleScene
    }
];