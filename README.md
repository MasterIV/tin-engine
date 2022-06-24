# Tin-Engine

The Tin-Engine is a very simple and light weight Canvas 2D based game engine for small JavaScript based games. It was originally developed as a collection of files that we commonly would use in game-jam projects and later on extracted into a proper library. As the engine is meant for game-jams it is also meant to be hacked to a certain degree. So don't be afraid to bend the engine a bit to the needs of your actual game. If you come up with a cool new feature, feel free to send us a pull request.

## Setup

Simply install the engine in your project using npm:

```
npm install --save tin-engine
```

To bootstrap the project run:

```
npx tin-engine bootstrap
```

After bootstrapping the project you need to run `npm install` and can then use `npm run build` (for production) or `npm run debug` (for automatically rebuilding changes).

If you need to make changes to the engine you can fork it and check it out and then use `npm link` in the engine package and `npm link tin-engine` inside your game project. This allows you to test new engine features directly in the context of your game.

## The Scene Graph

At the top of our graph is the game object. It controls the flow of the game and only has one child entity that it invokes all the necessary lifecycle methods on. The games objects main function is to run the game loop and dispatch the relevant events to the scene it holds. The Scene is then the first actual entity and actually inherits from the entity class already. Although it is just a normal entity, it has a special role as the root of the entity part of the scene graph. Each entity (including the scene) can then have many children. These entities represent all objects in your game.

```
Game
 └─ Scene
     └─ Entity
     └─ Entity
          └─ Entity
          └─ Entity
     └─ Entity
          └─ Entity
```
The nesting of entities can help you to group elements. All elements are usually rendered relative to their parent. The parent is also responsible to dispatch draw & update calls to the children. This way you can also control which parts of the graph are updated or rendered. The entities in the scene graph represent all kinds of elements in your game. This could be for example:

- the player
- enemies
- the level or parts of the environment
- projectile
- items
- user interface

## Entity Lifecycle

As each element in the scene graph is an entity, we should have a close look at the lifecycle of such an entity. The two main methods that are called in every frame are `update(delta)` and `draw(ctx)`. Where delta is the amount of milliseconds that have elapsed since the last frame and ctx is a canvas context 2D. In their default implementation these methods will dispatch the calls to all children and should therefore not be overwritten. If you still decide to do so, keep in mind that children will not be updated or drawn any more (which could be the desired behavior in some cases). If you want to implement additional behavior during these cycles you can implement `onUpdate(delta)` and `onDraw(ctx)`. These methods will be called before the call is dispatched to child entities.

Here is a summary of how the lifecycle of an entity looks like:

 - entity is passed to its parents `add` method
 - `setParent` is called on the entity, informing it of it's parent element
 - in each iteration of the game loop `update` will be called
     - if implemented, `onUpdate` will be called
     - `update` on all children is called
 - in each iteration of the game loop `draw` will be called
     - if implemented, `onDraw` will be called
     - `draw` on all children is called
 - additionally mouse events (`click`, `mouseodwn`, `mouseup`) might be called as soon as they happen:
     - if an equivalent `on-` method (for example: `onClick`) is implemented it will be called
     - if it returned true, the click will not be dispatched any further
     - otherwise events are dispatched to the children, in reversed order
- at the end `remove` might be called on the parent with the element as an argument. (Or the entity calls `this.parent.remove(this)`)

For more details you can also view [the code of the entity class](https://github.com/MasterIV/tin-engine/blob/master/basic/entity.js).

## UI Design Toolkit

tbd...

## Component Examples

The Tin-Engine offers some basic components that are often needed in Game creation. To see the examples you can either run `npm run examples` in your local checkout or find them on the [Tin-Engine Examples Page](https://masteriv.github.io/tin-engine/index.html). Running the examples locally can be helpful when developing on the engine itself.

To add new examples, just create a file with the same name as the example is for but with the extension `.example.js`. Im this file you need to export an array with example objects. Each example consists of the following attributes:

- title
- description
- scene or code

A scene will automatically be rendered while code will just be displayed.
