import Scene from '../lib/scene.js';
import Button from './button.js';
import V2 from '../geo/v2.js';
import mouse from '../core/mouse.js';
import Colors from '../definition/colors.js';
import FontStyle from '../definition/font.js';
import graphic from '../core/graphic.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();

        // Simple rectangular button with text
        this.add(Button
            .create(new V2(250, 100), () => alert('clicked button 1'))
            .rect(300, 50)
            .text('Button 1'));

        // Image Button with text
        const img = 'examples/button.png';
        // Add image to graphics manager
        graphic.add(img);
        // Preload the image, usually done during game init
        graphic.load(() => {
            this.add(Button
                .create(new V2(250, 225), () => alert('clicked button 2'))
                .img(img, .5)
                .text('Button 3'));
        });

        // Customize color and font
        const color = new Colors('red', 'beige', 'blue', '#CCC');
        const font = new FontStyle(20, 'green', 'serif', 'purple');
        this.add(Button
            .create(new V2(250, 400), () => alert('clicked button 3'))
            .rect(300, 50, color)
            .text('Button 3', font));
    }

    setParent(game) {
        super.setParent(game);
        // Init mouse to enable hover effects
        // usually this would be done during game init
        mouse.init(game)
    }
}

export default [
    {
        title: "Basic Example",
        description: `Buttons can be composed of a simple box, an image and or a text. 
            The button can use only one of these or any. 
            The box and text also support hover effects if the mouse is enabled.`,
        scene: BasicExampleScene
    }
];