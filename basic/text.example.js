import Scene from '../lib/scene.js';
import TextEntity from '../basic/text.js';
import FontStyle from './../definition/font.js';
import V2 from '../geo/v2.js';
import RectEntity from './rect.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        // Add a text using default font settings at x: 200, y: 100
        this.add(new TextEntity(new V2(400, 150), "Hello world"));
        // Create custom font style
        const font = new FontStyle(40, 'blue', 'serif');
        // Add text using custom font style
        this.add(new TextEntity(new V2(400, 300), "More text here", font));
    }
}

class WordWrapExampleScene extends Scene {
    constructor() {
        super();
        // Add a basic rectangle to serve as backdrop for the text
        const rect = new RectEntity(new V2(300, 100), new V2(200, 200));
        this.add(rect);
        // Create a custom font style
        const font = new FontStyle(12);
        // Make the font style align left instead of the default center
        font.align = 'left';
        // Also change the default baseline (middle) to top
        font.base = 'top';
        // Create a text entity
        const text = new TextEntity(new V2(0,0), "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", font);
        // First add it to the rectangle so the parent is set
        rect.add(text);
        // Then enable word wrap with a 5 pixel margin
        text.wordWrap(5);
        window.game = this;
    }
}

export default [
    {
        title: "Basic Example",
        description: "This is how you can render some simple text.",
        scene: BasicExampleScene
    },
    {
        title: "Word Wrap Example",
        description: `Example for a simple multiline text.
            Enabling word wrap will split the text to multiple lines if necessary to fit a target area.
            The entity must either be resized beforehand or it will clone its parent's dimensions. When cloning, the margin parameter to wordWrap() is used to set a fixed margin relative to the parent.
            Be aware that long words can generate overflow if a single word is longer than the target area - there is no hyphenation.
            Be also aware that the height of the entity is ignored which might lead to overflow.
            The line height is fixed at 1.2x font size.`,
        scene: WordWrapExampleScene
    }
];