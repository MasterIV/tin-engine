import require from './../require.es6';
import  Button from './../basic/button.es6';
import  graphics from './../core/graphic.es6';
import  game from './../core/game.es6';
import  V2 from './../geo/v2.es6';
import  SlideInLeftTransition from './../transitions/slideinleft.es6';
import  Easing from './../definition/easing.es6';

export default graphics.add('img/back.png');

		function BackButton(scene) {
			return Button.create(new V2(0, 500), () => { game.scene = new SlideInLeftTransition(require('config/scenes')[scene], 1000, Easing.OUTQUAD); }).img('img/back.png');
		}

		return BackButton;