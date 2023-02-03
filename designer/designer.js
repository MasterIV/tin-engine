import components from './components.js';

let root, current;
let empty = {
	name: 'NewScene',
	type: 'Scene',
}

function id() {
	return Math.random().toString(16).slice(2);
}

function renderElement(ele, d=0) {
	const classes = "list-group-item list-group-item-action" + (current == ele ? " active" : "")
	return `<button class="${classes}" id="tree-${ele.id}" onclick="designer.select('${ele.id}')">${ele.type}</button>`
		+ ele.children.map(c => renderElement(c, d+1)).join('');
}

function findElement(ele, id) {
	if(ele.id == id)
		return ele;
	return ele.children.map(c => findElement(c, id)).reduce((a,b) => a || b, null);
}

export default {
	// ----------------------------------------------------------------------
	// ------------------------- state management ---------------------------
	// ----------------------------------------------------------------------

	create() {
		this.load({ ...empty, id: id(), props: components.Scene.init(), children: [] });
	},

	load(data) {
		root = data;
		current = root;

		this.renderTree();
		this.renderProps();
		this.renderPreview();
	},

	save() {
		return root;
	},

	// ----------------------------------------------------------------------
	// ----------------------- manipulation segment -------------------------
	// ----------------------------------------------------------------------

	select(id) {
		const node = findElement(root, id);

		document.getElementById('tree-'+current.id).className = 'list-group-item list-group-item-action';
		document.getElementById('tree-'+node.id).className += ' active';

		current = node;
		this.renderProps();
	},

	update(input) {
		let path = input.id.split('-');
		let ele = current.props;
		let val = input.value;

		while (path.length > 1)
			ele = ele[path.shift()];
		ele[path[0]] = val;

		this.renderPreview();
	},

	add(type) {
		const ele = { type, id: id(), props: components[type].init(), children: [] };

		current.children.push(ele);
		current = ele;

		this.renderTree();
		this.renderPreview();
		this.renderProps();
	},

	delete() {
		const parent = findParent();

		parent.children = parent.children.filter(c => c.id !== current.id);
		current = parent;

		this.renderTree();
		this.renderPreview();
		this.renderProps();
	},

	// ----------------------------------------------------------------------
	// -------------------------- render segment ----------------------------
	// ----------------------------------------------------------------------

	renderTree() {
		document.getElementById('tree-content').innerHTML = `<div class="list-group" id="tree">${renderElement(root)}</div>`;
	},

	renderPreview() {
		const canvas = document.getElementById('preview');
		const ctx = canvas.getContext('2d');

		canvas.width = root.props.size.x;
		canvas.height = root.props.size.y;

		ctx.debug = true;
		components.Scene.getEntity(root).draw(ctx);
	},

	renderProps() {
		document.getElementById('props-content').innerHTML = components[current.type].getForm(current.props);
	}
};
