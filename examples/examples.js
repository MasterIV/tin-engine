
import Game from '../core/game.js';
import Scene from '../lib/scene.js';

const config = { 
	screen: {w: 800, h: 600},
	scale: false
};

Scene.prototype.onDraw = ctx => {
	ctx.fillStyle = '#EEE';
	ctx.fillRect(0, 0, config.screen.w, config.screen.h);
};

export default function renderExamples(examples) {
	let url = window.location.href;
	let current = url.substring(url.indexOf('?')+1);
	if(!examples[current]) current = Object.keys(examples)[0];

	document.body.innerHTML = `<div class="container" style="margin-top: 20px">
		<div class="row">
			<div class="col">
				<div class="list-group">
					${Object.keys(examples).map(k => {
						const path = examples[k].path;
						const classes = "list-group-item list-group-item-action " + (current == k && 'active');
						return `<a href="?${k}" class="${classes}">${path.substr(0, path.length-11)}</a>`;
					}).join('')}
				</div>
			</div>
			<div class="col">
				${examples[current].examples.map((e, i) => {
					return `<div class="card" style="width: ${config.screen.w+2}px">
							<canvas id="example${i}" moz-opaque opaque style="width: ${config.screen.w}px"></canvas>
							<div class="card-body">
								<h5 class="card-title">${e.title}</h5>
								<p class="card-text">${e.description}</p>
								<code class="language-js">${hljs.highlight(e.scene.toString(), {language: 'js'}).value}</code>
							</div>
						</div>`;
				}).join('')}
			</div>
		</div>
	</div>`;

	examples[current].examples.forEach((e, i) => {
		const game = new Game(config, document.getElementById('example'+i));
		game.run(new e.scene());
	});
}