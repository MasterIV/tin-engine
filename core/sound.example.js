import Scene from '../lib/scene.js';
import V2 from '../geo/v2.js';
import mouse from '../core/mouse.js';
import Button from '../basic/button.js';
import sound from './sound.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        this.add(Button
            .create(new V2(250, 250), () => sound.play('examples/drums.ogg'))
            .rect(300, 50)
            .text('Click Me!'));
    }

    setParent(game) {
        super.setParent(game);
        // Init mouse to enable button
        // usually this would be done during game init
        mouse.init(game)
    }
}

export default [
    {
        title: "Basic Example",
        description: `In contrast to images, sounds do not need to be preloaded.
            Sounds can be loaded on demand and the first playback of a sound can therefore have a slight delay.
            If you still like to preload sounds then it works identical to the graphic object.
            The same sound can be played multiple times and overlap that way,
            as you can see when quickly clicking the button in this example.`,
        scene: BasicExampleScene
    }
];
