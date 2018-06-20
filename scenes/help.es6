import Scene from './../lib/scene.es6';
import  BackButton from './../entity/back.es6';

export default class HelpScene extends Scene {
	constructor() {
		super();
		this.center(BackButton('menu'));
	}
}
