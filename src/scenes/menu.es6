import Scene from "./../lib/scene.es6";
import Button from "./../basic/button.es6";
import game from "./../core/game.es6";
import V2 from "./../geo/v2.es6";
import SlideInRightTransition from "./../transitions/slideinright.es6";
import Easing from "./../definition/easing.es6";
import {VerticalLayout} from "./../basic/layout.es6";

export default class MenuScene extends Scene {
	constructor() {
		super();

		const playButton = Button.create(new V2(0, 680), () => {
			game.scene = require('config/scenes').play;
		}).rect(280, 80).text("Play");
		const creditsButton = Button.create(new V2(0, 680), () => {
			game.scene = new SlideInRightTransition(require('config/scenes').credits, 1000, Easing.OUTQUAD);
		}).rect(360, 80).text("Credits");
		const helpButton = Button.create(new V2(0, 680), () => {
			game.scene = require('config/scenes').help;
		}).rect(300, 80).text("Help");
		const particlesButton = Button.create(new V2(0, 680), () => {
			game.scene = require('config/scenes').particles;
		}).rect(300, 80).text("Particles");

		const vLayout = new VerticalLayout(new V2(0, 20), 20, 50);
		vLayout.add(playButton);
		vLayout.add(creditsButton);
		vLayout.add(helpButton);
		vLayout.add(particlesButton);
		vLayout.align("center");
		this.center(vLayout);

		//var easing = Easing.OUTELASTIC;
		//var self = this;

		//playButton.add(new Morph({ position: { y: 100 } }, 1500, easing));
		//creditsButton.add(new Morph({ position: { y: 250 } }, 1500, easing));
		//helpButton.add(new Morph({ position: { y: 400 } }, 1500, easing));
	}
}
