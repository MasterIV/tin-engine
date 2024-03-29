/* ========================================================================================= */
/* ================================== Small helper function ================================ */
/* ========================================================================================= */

export function limit( v, m ) {
	return Math.min( m, Math.max( -m, v ));
}

export function rad_to_deg( rad ) {
	return rad * ( 180 / Math.PI );
}

export function arrayRemove( arr, element ) {
	arr.splice( arr.indexOf( element ), 1 );
}

/** Execute (if function) or return (if value) */
export function eor( v ) {
	return typeof v == 'function' ? v() : v;
}

export function checkBit( number, bit ) {
	return ((number >> bit) % 2 != 0);
}

export function clearBit( number, bit ) {
	return number & ~(1 << bit);
}

/* ========================================================================================= */
/* ===================================== Polygon stuff ===================================== */
// Given three vectors (V2) makes a right headed ray cast from a to line b/c
// Returns -1 if ray intersects b/c
// Returns  0 if a is on line b/c
// Returns +1 if no intersection
/* ========================================================================================= */

export function intersect( a, b, c ) {
	if ( a.y == b.y && a.y == c.y ) { // a is on same y than b and c
		if ( (b.x < a.x && a.x < c.x) || (c.x < a.x && a.x < b.x) )
			return 0;
		else
			return 1;
	}

	if (b.y > c.y) { // switch b and c
		const d = c;
		c = b;
		b = d;
	}

	if ( a.x == b.x && a.y == b.y ) // a == b
		return 0;
	if ( a.y < b.y || a.y > c.y ) // a on different y
		return 1;

	const delta = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
	if (delta > 0)
		return -1;
	else if(delta < 0)
		return 1;
	return 0;
}


