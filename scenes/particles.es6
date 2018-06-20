import Scene from './../lib/scene.es6';
import  BackButton from './../entity/back.es6';
import  Particles from './../basic/particles.es6';
import  V2 from './../geo/v2.es6';
import  Random from './../definition/random.es6';
import  {HorizontalLayout} from './../basic/layout.es6';
import  Button from './../basic/button.es6';
import  graphic from './../core/graphic.es6';

export default graphic.add('img/particles/ParticleFlare.png');
graphic.add('img/particles/ParticleCloudBlack.png');
graphic.add('img/particles/ParticleCloudWhite.png');
graphic.add('img/particles/BloodStainsSmall.png');

class ParticleScene extends Scene {
	constructor() {
		super();

		const p1 = new Particles(new V2(200, 200), {
			burst: [
				{time: 500, amount: 20},
				{time: 2000, amount: 30},
				{time: 4500, amount: 40}],
			interval: 5000,
			rate: 25,
			scale: 6,
			speed: Random.between(60, 80),
			autoplay: false,
			loop: false
		});

		const p2 = new Particles(new V2(200, 400), {
			angle: 0,
			interval: 5000,
			rate: 50,
			speed: 400,
			lifetime: Random.between(1000, 2000),
			offset: Random.vector(Random.between(-100, 100), 0),
			autoplay: false,
			loop: false,
			sprite: graphic['img/particles/ParticleCloudBlack.png']
		});

		this.center(p1);
		this.center(p2);

		const layout = new HorizontalLayout(new V2(0, 500), 0, 40);
		layout.add(BackButton('menu'));
		layout.add(Button.create(new V2(0, 0), () => {
			p1.play()
		}).rect(80, 80).text("P1"));
		layout.add(Button.create(new V2(0, 0), () => {
			p2.play()
		}).rect(80, 80).text("P2"));
		this.center(layout);
	}
}

return ParticleScene;