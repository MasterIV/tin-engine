import Scene from '../lib/scene.js';
import TextEntity from '../basic/text.js';
import FontStyle from './../definition/font.js';
import V2 from '../geo/v2.js';
import RectEntity from './rect.js';
import {VerticalLayout} from './layout.js';

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
	}
}

class ChatBoxExampleScene extends Scene {
	constructor() {
		super();
		// Add a basic rectangle to serve as backdrop for the text box
		const rect = new RectEntity(new V2(200, 150), new V2(400, 300));
		this.add(rect);
		// Create a custom font style
		const font = new FontStyle(12, '#333', 'Courier New');
		font.align = 'left';
		font.base = 'top';
		// Create a vertical layout to stack the texts
		const layout = new VerticalLayout(new V2(0,0), 5, 5);
		rect.add(layout);

		// Modify the rectangle's onDraw function to clip the canvas
		// Usually this should be done by creating a new class of entity
		rect.onDraw = (ctx) => {
			// Call the original onDraw of the rectangle entity
			RectEntity.prototype.onDraw.call(rect, ctx);
			// Clip the canvas
			ctx.rect(0,0, rect.size.x, rect.size.y);
			ctx.clip();
		};

		// Use an arbitrary value of the rectangle to keep track of time
		rect.time = 0;
		// Modify the rectangle's onUpdate function to add random texts
		// Of course, this would normally happen through ingame events
		rect.onUpdate = (delta) => {
			// Add elapsed time
			rect.time += delta;
			// Do something every 2 seconds
			if (rect.time >= 2000) {
				// Generate a random text
				const d = new Date();
				const content = "[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "] Player: " + [
					"Hello",
					"afk",
					"brb",
					"This is a very interesting thing that I have to say.",
					"Looking to trade an Epic Thunderhammer Smasher for any random trash you have lying around",
					"Player Two is totally hacking.",
					"Have you heard of Tin Engine? I heard that it is pretty good",
					"Tutorials are very good. They make me learn something."
				][Math.floor(Math.random() * 8)];
				// Create a new text entity
				// Note that the text is not yet added to the layout but stored in the rectangle for 1 frame but outside the visible area
				const text = new TextEntity(new V2(0, 305), content, font);
				// Manually define the width of the text
				text.setSize(390, 0);
				// Turn on word wrap
				text.wordWrap();

				rect.newText = text;
				rect.add(text);
				// Wait another two seconds
				rect.time -= 2000;
			} else if (rect.newText) {
				// This happens 1 frame after a text was generated, meaning that one draw loop completed and the text did the word wrapping

				// Remove the text from the rectangle's entities list
				rect.remove(rect.newText);
				// Remove old texts from the layout if necessary
				if (layout.entities.length > 15)
					layout.remove(layout.entities[0]);
				// Add the new text to the layout
				layout.add(rect.newText);
				// The layout has now resized itself, adjust its position so the latest text is visible at the bottom
				layout.position.y = layout.size.y > rect.size.y ? rect.size.y - layout.size.y : 0;
				// New text is no longer new
				rect.newText = null;
			}
		}
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
	},
	{
		title: "Advanced Chat Box Example",
		description: `Advanced example for a simple chat box.
			This example utilizes a modified Rectangle and a Vertical Layout to showcase a simple chat box.
			Each message is added as a separate Text to the layout.
			Notice how the word wrap needs a 1 frame cycle to work.
			This is because the canvas context is required to calculate line length.
			By default, the context is not known by entities outside of the draw loop.
			It can however be accessed from the Game.`,
		scene: ChatBoxExampleScene
	}
];