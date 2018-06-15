import scenes from './config/scenes.es6';
import  config from './config/config.es6';
import  graphics from './core/graphic.es6';
import  mouse from './core/mouse.es6';
import  controls from './core/controls.es6';
import  sound from './core/sound.es6';
import  game from './core/game.es6';

export default graphics.load(() => {
			document.getElementById('loading').style.display = 'none';

			controls.init();
			mouse.init();
			sound.load();
			scenes.init();

			let scene = scenes.default;

			if(config.debug) {
				const hash = location.hash.substr(1);
				if( hash && scenes[hash] ) scene = scenes[hash];
			}

			game.init(scene);
		});