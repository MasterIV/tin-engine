import Game from 'tin-engine/core/game';
import graphics from 'tin-engine/core/graphic';
import controls from 'tin-engine/core/controls';
import mouse from 'tin-engine/core/mouse';
import config from './config';
import TitleScene from './scene/TitleScene';

window.onload = () => {
    // Preload graphics here
	// graphics.add('img/some_asset.png');

	graphics.load(() => {
		document.getElementById('loading').style.display = 'none';

		const game = new Game(config, document.getElementById('gameframe'));

		controls.init(game);
		mouse.init(game);

		game.run(new TitleScene());
	});
};
