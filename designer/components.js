import V2 from '../geo/v2.js';
import Scene from '../lib/scene.js';
import Button from '../basic/button.js';
import Entity from '../basic/entity.js';
import ImageEntity from '../basic/image.js';

import {Resolution, Size, Position} from './partials.js';
import TextEntity from '../basic/text.js';

const types = {
	Scene: {
		init() {
			return {
				size: new V2(800, 600)
			};
		},

		getForm(data) {
			return Resolution.getForm(data.size);
		},

		getEntity(ele) {
			const scene = new Scene();
			scene.setSize(ele.props.size);
			ele.children.forEach(c => scene.add(types[c.type].getEntity(c, scene)));
			return scene;
		},

		getCode(data) {

		}
	},
	Entity: {
		init() {
			return {
				size: new V2(100, 100),
				position: new V2(0, 0),
			};
		},

		getForm(data) {
			return Size.getForm(data.size)
				+ Position.getForm(data.position);
		},

		getEntity(ele, parent) {
			const obj = new Entity(
				Position.getValue(ele.props.position, parent.props),
				Size.getValue(ele.size.position, parent.props),
			);

			ele.children.forEach(c => obj.add(types[c.type].getEntity(c, ele)));

			return obj;
		},

		getCode(data) {

		}
	},
	Image: {
		init() {
			return {
				position: new V2(0, 0),
			};
		},

		getForm(data) {
			return Position.getForm(data.position);
		},

		getEntity(ele, parent) {
			const obj = new ImageEntity(
				Position.getValue(ele.props.position, parent.props),
			);

			ele.children.forEach(c => obj.add(types[c.type].getEntity(c, ele)));

			return obj;
		},

		getCode(data) {

		}
	},
	Button: {
		init() {
			return {
				position: new V2(0, 0),
				size: new V2(0, 0),
			};
		},

		getForm(data) {
			return Size.getForm(data.size)
				 + Position.getForm(data.position);
		},

		getEntity(ele, parent) {
			const obj = new Button(
				Position.getValue(ele.props.position, parent.props),
				() => null,
			);

			ele.children.forEach(c => obj.add(types[c.type].getEntity(c, ele)));

			return obj;
		},

		getCode(data) {

		}
	},
	Text: {
		init() {
			return {
				position: new V2(0, 0),
			};
		},

		getForm(data) {
			return Position.getForm(data.position);
		},

		getEntity(ele, parent) {
			const obj = new TextEntity(
				Position.getValue(ele.props.position, parent.props),
			);

			ele.children.forEach(c => obj.add(types[c.type].getEntity(c, ele)));

			return obj;
		},

		getCode(data) {

		}
	}
};

export default types;
