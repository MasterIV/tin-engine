import Scene from './../lib/scene.es6';
import  BackButton from './../entity/back.es6';
import  TextEntity from './../basic/text.es6';
import  V2 from './../geo/v2.es6';

export default class CreditsScene extends Scene {
	constructor() {
		super();
		this.center(new TextEntity(new V2(0, 100), "Max Mustermann"));
		this.center(new TextEntity(new V2(0, 200), "Erica Mustemann"));
		this.center(new TextEntity(new V2(0, 300), "Gunda Gamedesigner"));
		this.center(new TextEntity(new V2(0, 400), "Peter Programmierer"));
		this.center(BackButton('menu'));
	}
}
