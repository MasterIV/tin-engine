export default [
    {
        title: "Basic Example",
        description: `This example shows how the game is initialized.
            This usually goes in the main file and is the entry point to the game.
            Calling the run method on the game will start the game loop.
            The only methods called on the game should be run(scene) to start the game loop and goto(scene) to switch the scene.`,
        code: `
// It is recommended to have the config in it's on file and import it from there
const config = {
    screen: {w: 640, h: 480},
    scale: false
};

// Usually you want to initialize the game when the page finished loading
window.onload = () => {
    // Then you would normally preload your assets
    graphics.add('img/title.png');
    graphics.load(() => {
        // Hide the loading indicator when loading has completed
        document.getElementById('loading').style.display = 'none';
        // Initialize the game with the config and render target canvas object
        const game = new Game(config, document.getElementById('myCanvas'));
        // Initialize mouse and or controls if needed
        controls.init(game);
        mouse.init(game);
        // Start the game with the initial scene
        game.run(new TitleScene());
    });
};`.trim()
    }
];
