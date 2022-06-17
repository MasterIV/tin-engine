export default {
    urls: [],

    add(url) {
        this.urls.push( url );
    },

    load(callback) {
        let total = 0, loaded = 0;

        function complete() {
            if( ++loaded >= total ) callback();
        }

        while( this.urls.length ) {
            const url = this.urls.shift();
            if( typeof this[url] == 'undefined' ) {
                total++;
                this[url] = new Image();
                this[url].onload = complete;
                this[url].src = url;
            }
        }

        if( total == 0 ) callback();
    }
};