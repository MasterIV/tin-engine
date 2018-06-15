import V2 from './../geo/v2.es6';

export default {
    between(min, max) {
        return () => Math.random() * (max-min) + min;
    },

    vector(x, y) {
        return () => new V2(
                typeof x == 'function' ? x() : x,
                typeof y == 'function' ? y() : y
        );
    }
};