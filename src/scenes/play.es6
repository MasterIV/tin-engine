import Scene from './../lib/scene.es6';
import  Player from './../entity/player.es6';
import  TiledMap from './../lib/map.es6';
import  ViewPort from './../lib/viewport.es6';
import  RectEntity from './../basic/rect.es6';
import  colors from './../config/colors.es6';
import  V2 from './../geo/v2.es6';

export default class PlayScene extends Scene {
	constructor() {
		super();

		const player = new Player(new V2(500, 500));
		const map = new TiledMap('map');
		const viewport = new ViewPort(true);
		viewport.add(map.render(['bg', 'Below']));
		viewport.add(player);
		viewport.add(map.render(['More']));
		viewport.add(new RectEntity(new V2(1000, 900), new V2(100, 100), colors.default));

		//viewport.follow(player);
		//viewport.dragable(true);
		viewport.scrollTo(new V2(-200, -200), 3000, () => {
			viewport.dragable(true);
		});

		this.add(viewport);
		this.keyAware.push(player);
	}
}

return PlayScene;