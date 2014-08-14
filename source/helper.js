function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function modulus(num) {
	var mod = num % 16;
	return (num - mod) / 16;
}