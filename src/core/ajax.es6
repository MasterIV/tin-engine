export default {
	load(url, callback) {
		let xmlHttp = null;

		try {
			xmlHttp = new XMLHttpRequest();
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				try {
					xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					xmlHttp = null;
				}
			}
		}

		if (xmlHttp) {
			xmlHttp.open('GET', url, true);

			xmlHttp.onreadystatechange = () => {
				if (xmlHttp.readyState == 4) {
					callback(xmlHttp.responseText);
				}
			};

			xmlHttp.send(null);
		}
	},

	json(url, callback) {
		this.load(url, data => {
			callback(eval(`(${data})`));
		});
	}
};


