var letter;
var sizer = 10;

function setup() {
	createCanvas(1920, 1080);
	background(0);
	fill(255);
	// textSize(26); 
	// text("WORD", 100, 500); 
	// textSize(14);
	// text("WORD", 100, 700);
}

function draw() {
	background(0);
	textSize(sizer); 
	text("WORD", 100, 500);
	sizer += 5;
	if (sizer > 140) {
		sizer = 0;
	}
}