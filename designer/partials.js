import V2 from '../geo/v2.js';

export const Resolution = {
	init(x = 0, y = 0) {
		return { x, y };
	},

	getForm(data) {
		return `<div class="card">
					<div class="card-body">
						<h5 class="card-title">Size</h5>
						<div class="row">
							<div class="col">
								<div class="mb-3">
									<label for="size-x" class="form-label">Width</label>
									<input type="number" class="form-control" id="size-x" value="${data.x}" onchange="designer.update(this)">
								</div>
							</div>
							<div class="col">
								<div class="mb-3">
									<label for="size-y" class="form-label">Height</label>
									<input type="number" class="form-control" id="size-y" value="${data.y}" onchange="designer.update(this)">
								</div>
							</div>
					  </div>
					</div>
				</div>`;
	},

	getCode(data) {
		return `new V2(${data.x}, ${data.y})`;
	},

	getValue(data) {
		return new V2(data.x, data.y);
	}
}

export const Size = {
	init() {
		return { x: 0, y: 0, match: { x: false, y: false } };
	},

	getForm(data) {
		return `<div class="card">
					<div class="card-body">
						<h5 class="card-title">Size</h5>
						<div class="row">
							<div class="col">
								<div class="mb-3">
									<label for="size-x" class="form-label">Width</label>
									<input type="number" class="form-control" id="size-x" value="${data.x}" onchange="designer.update(this)">
								</div>
								<div class="mb-3 form-check">
									<input type="checkbox" class="form-check-input" id="size-match-x" onchange="designer.update(this)" checked="${data.match.x ? 'true' : 'false'}">
									<label class="form-check-label" for="size-match-x">Match parent</label>
								</div>
							</div>
							<div class="col">
								<div class="mb-3">
									<label for="size-y" class="form-label">Height</label>
									<input type="number" class="form-control" id="size-y" value="${data.y}" onchange="designer.update(this)">
								</div>
								<div class="mb-3 form-check">
									<input type="checkbox" class="form-check-input" id="size-match-y" onchange="designer.update(this)" checked="${data.match.y ? 'true' : 'false'}">
									<label class="form-check-label" for="size-match-y">Match parent</label>
								</div>
							</div>
					  </div>
					</div>
				</div>`;
	},

	getCode(data, parent = 'this') {
		const x = data.match.x ? parent + '.size.x' : data.x;
		const y = data.match.y ? parent + '.size.y' : data.y;
		return x === 0 && y === 0 ? 'Zero()' : `new V2(${x}, ${y})`;
	},

	getValue(data, parent) {
		const x = data.match.x ? parent.size.x : data.x;
		const y = data.match.y ? parent.size.y : data.y;
		return new V2(x, y);
	}
}

export const Position = {
	init() {
		return { x: 0, y: 0, anchor: 'top-left' };
	},

	getForm(data) {
		const anchors = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

		return `<div class="card">
					<div class="card-body">
						<h5 class="card-title">Position</h5>

						<div class="mb-3">
							<label for="position-anchor" class="form-label">Anchor</label>
							<select class="form-control" id="position-anchor" onchange="designer.update(this)">
								${anchors.map(a => `<option ${a === data.anchor && 'selected'}>${a}</option>`).join('')}
							</select>
						</div>

						<div class="row">
							<div class="col">
								<div class="mb-3">
									<label for="position-x" class="form-label">X</label>
									<input type="number" class="form-control" id="position-x" value="${data.x}" onchange="designer.update(this)">
								</div>
							</div>
							<div class="col">
								<div class="mb-3">
									<label for="position-y" class="form-label">Y</label>
									<input type="number" class="form-control" id="position-y" value="${data.y}" onchange="designer.update(this)">
								</div>
							</div>
					  </div>
					</div>
				</div>`;
	},

	getCode(data, parent = 'this') {
		const a = data.anchor.split('-');
		const x = a[1] === 'right' ? parent + '.size.x - ' + data.x : data.x;
		const y = a[0] === 'bottom' ? parent + '.size.y - ' + data.y : data.y;
		return x === 0 && y === 0 ? 'Zero()' : `new V2(${x}, ${y})`;
	},

	getValue(data, parent) {
		const a = data.anchor.split('-');
		const x = a[1] === 'right' ? parent.size.x - data.x : data.x;
		const y = a[0] === 'bottom' ? parent.size.y - data.y : data.y;
		return new V2(x, y);
	}
}
