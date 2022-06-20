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

update & draw

## UI Design Toolkit

tbd...

## Component Examples

The Tin-Engine offers some basic components that are often needed in Game creation. To see the examples you can either run `npm run examples` in your local checkout or find them on the [Tin-Engine Examples Page](https://masteriv.github.io/tin-engine/index.html). Running the examples locally can be helpful when developing on the engine itself.

To add new examples, just create a file with the same name as the example is for but with the extension `.example.js`. Im this file you need to export an array with example objects. Each example consists of the following attributes:

- title
- description
- scene or code

A scene will automatically be rendered while code will just be displayed.
