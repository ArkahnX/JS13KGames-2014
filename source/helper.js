function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function modulus(num, size) {
	var mod = num % (size || 16);
	return (num - mod) / (size || 16);
}

function coordinate(x, y, size) {
	return (y * size + x);
}