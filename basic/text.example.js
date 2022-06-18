import Scene from '../lib/scene.js';
import TextEntity from '../basic/text.js';
import FontStyle from './../definition/font.js';
import V2 from '../geo/v2.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        // Add a text using default font settings at x: 200, y: 100
        this.add(new TextEntity(new V2(400, 150), "Hello world"));
        // Create custom font style
        const font = new FontStyle(40, 'blue', 'serif');
        // Add text using custom font stile
        this.add(new TextEntity(new V2(400, 300), "More text here", font));
    }
}

export default [
    {
        title: "Basic Example",
        description: "This is how you can render some simple text.",
        scene: BasicExampleScene
    }
];