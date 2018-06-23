# tin-engine
Simple game engine to create small canvas based games using es6

## Entities

### Adding and removing entities to your scene

In any of your scene just create your entity and add it to the scene:

```jsx
import V2, { Zero } from 'tin-engine/geo/v2';
import RectEntity from 'tin-engine/basic/rect';

...

// anywhere inside a class that extends Scene:
const re = new RectEntity(Zero(), new V2(200, 40));
this.add(re);
```

In order not to update/render an entity, just detach it:
```jsx
this.remove(re);
```

## Color Definitions

### General

The engine makes use of Color objects in order to render things. Color objects contain a set of 4 different colors for different states. These are:

* stroke color
* fill color
* hover stroke color
* hover fill color

The color objects should be defined in your project. If `default` is not defined, the engine will use some pre-defined value.

### How to use

Let's draw a rect entity with some custom colors. Define your new color definition either via UI or via code:

```jsx
import Colors from 'tin-engine/definition/colors';

export default {
	default: new Colors('#000', '#FFF', '#555', '#DDD'),
	dangerAlert: new Colors('#880044', '#AA1155', 'AA0044', 'DD1155'),
};
```

Next, when creating e.g. your RectEntity, just provide the color definition:

```jsx
import Scene from 'tin-engine/lib/scene';
import V2, { Zero } from 'tin-engine/geo/v2';
import RectEntity from 'tin-engine/basic/rect';
import Colors from '../config/colors';

export default class PlaygroundScene extends Scene {
	constructor() {
		super();

		this.add(new RectEntity(Zero(), new V2(200, 40), Colors.dangerAlert));
	}
}
```

## Animations

You can morph your class member variables using the Morph helper entity. This is a quick example:

```jsx
import Morph from 'tin-engine/basic/morph';
import EASING from 'tin-engine/definition/easing';

...
this.pos = Zero();
this.add(new RectEntity(this.pos, new V2(40, 40)));
this.add(new Morph({ pos: { x: 300 } }, 2000, EASING.INOUTCUBIC));
```

Morph takes 4 arguments:

* what attribute on your this object to change
* duration in ms
* EASE type, defaults to EASING.LINEAR
* onDone callback which is called after the morph operation is finished

After the morph is done it will be automatically detached from the scene.
