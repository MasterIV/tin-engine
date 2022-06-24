import Scene from '../lib/scene.js';
import V2, {Zero} from '../geo/v2.js';

import RectEntity from './rect.js';
import {HorizontalLayout, VerticalLayout} from './layout.js';

class HorizontalExampleScene extends Scene {
    constructor() {
        super();
        // Initialize layout with position, margin and spacing
        this.layout = new HorizontalLayout(new V2(50, 200), 0, 20);

        // Add items to layout
        this.layout.add(new RectEntity(Zero(), new V2(50, 250)));
        this.layout.add(new RectEntity(Zero(), new V2(400, 100)));
        this.layout.add(new RectEntity(Zero(), new V2(200, 200)));

        // Set initial alignment
        this.layout.align('center');
        this.alignment = 1;

        // Add layout to scene
        this.add(this.layout);

        // Rotate alignment to demonstrate the alignment options
        window.setInterval(() => {
            this.layout.align(['center', 'top', 'bottom'][this.alignment++%3]);
        }, 3000);
    }
}

class VerticalExampleScene extends Scene {
    constructor() {
        super();
        // Initialize layout with position, margin and spacing
        this.layout = new VerticalLayout(new V2(200, 50), 0, 20);

        // Add items to layout
        this.layout.add(new RectEntity(Zero(), new V2(50, 150)));
        this.layout.add(new RectEntity(Zero(), new V2(400, 100)));
        this.layout.add(new RectEntity(Zero(), new V2(200, 200)));

        // Set initial alignment
        this.layout.align('center');
        this.alignment = 1;

        // Add layout to scene
        this.add(this.layout);

        // Rotate alignment to demonstrate the alignment options
        window.setInterval(() => {
            this.layout.align(['center', 'left', 'right'][this.alignment++%3]);
        }, 3000);
    }
}

export default [
    {
        title: "Horizontal Layout Example",
        description: `Example for a horizontal layout.
            Layouts can be used to automatically arrange components.
            Click the canvas to see the different alignments.`,
        scene: HorizontalExampleScene
    },
    {
        title: "Vertical Layout Example",
        description: `Example for a vertical layout.
            Layouts can be used to automatically arrange components.
            Click the canvas to see the different alignments.`,
        scene: VerticalExampleScene
    }
];
