import MenuScene from './../scenes/menu.es6';
import CreditsScene from './../scenes/credits.es6';
import PlayScene from  './../scenes/play.es6';
import HelpScene from './../scenes/help.es6';
import ParticleScene from './../scenes/particles.es6';

export default {
	init() {
		this.menu = new MenuScene();
		this.credits = new CreditsScene();
		this.play = new PlayScene();
		this.help = new HelpScene();
		this.particles = new ParticleScene();
		this.default = this.menu;
	}
}