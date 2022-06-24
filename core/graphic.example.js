export default [
    {
        title: "Basic Example",
        description: `We usually recommend to preload all images when initializing the game.
            This way the player experience will be smooth and not interrupted by additional loading.
            For larger games however it might be necessary to load images to a later state.
            In this case the recommendation is to load them in the scene initialization.
            The graphic object will never unload any loaded images and will also prevent duplicate loads.
            See the <a href="?image">ImageEntity</a> for a detailed example where images are loaded in the scene.`,
        code: `
// You can add multiple images to the loading queue by using the add method
graphic.add('path/to/the/image.png');
graphic.add('path/to/the/another_image.png');
// When all images are added, call the load method to start the loading process
graphic.load(() => {
    // This callback will be invoked when loading is completed
    // All the images will then be part of the graphic object
    console.log(graphic['path/to/the/image.png']);
});`
    }
];
