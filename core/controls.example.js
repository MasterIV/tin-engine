import Scene from '../lib/scene.js';
import V2 from '../geo/v2.js';
import graphic from '../core/graphic.js';
import controls from './controls.js';
import TextEntity from '../basic/text.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        // Add a text entity
        const display = new TextEntity(new V2(400, 300), 'Press any key');
        this.add(display);
        // Add key aware entity or behavior
        this.keyAware.push({
            up(key) {display.text = key + ' released'},
            down(key) {display.text = key + ' pressed'},
        })
    }

    setParent(game) {
        super.setParent(game);
        // Init controls usually this would be done during game init
        controls.init(game)
        // You can register additional keys in case you need more than the standard
        controls.register(17, 'control');
        controls.register(16, 'shift');
    }
}

export default [
    {
        title: "Basic Example",
        description: `This shows how you can initialize the controls and use them from objects within a scene.`,
        scene: BasicExampleScene
    },
    {
        title: "Getting key codes",
        description: `To find out what the key code for a specific button you could either look it up on the net
            or use this execute this simple line of code in the console on any page and then press the keys on the page.`,
        code: `
// This will put the key code into the console if the key is pressed on the page
window.onkeydown = ev => console.log(ev.keyCode); `
    }
];
