let g = ga(
	640, 480, setup,
	["gfx/player.png", "gfx/shadow.png"]
);

var player, playerSprite, shadowSprite, supL, supR, bar, bg, ground, day, line;
var guideL, guideR;
var currentStep;
var totalSteps;
var maxSteps;
var jumpSteps;
var fallSteps;
var stage;

const screenWidth = g.stage.width;
const screenHeight = g.stage.height;
const groundHeightPercent = 0.42;
const skyHeightPercent = 1 - groundHeightPercent;
const groundY = screenHeight * skyHeightPercent;
const barLength = 42;
const barThickness = 8;
const barDistance = 768;
const barDistanceStep = 4;
const supHeight = 100;
const supLX = barDistance;
const supRX = barDistance + 55;
const supLY = groundY - supHeight + 15;
const supRY = supLY + 36;
const barY = supLY;
const minBarOffset = -5;
const playerX = 64;
const playerY = groundY - 15;
const jumpStepY = 6;
const jumpStepX = 3;

const lines = [
	'',
	"Jump, jump",
	"I gonna jump",
	"Jump so high",
	"High above the bar",
	"High above the ground",
	"Another day, another chance",
	"Another day, another try",
	"Every single try",
	"Makes me stronger",
	"Keep trying",
	"Keep trying!",
	"I need to keep trying",
	"Stay determined!",
	"Stay determined",
	"Stay determine",
	"Stay determin",
	"Stay determi",
	"Stay determ",
	"Stay deter",
	"Stay dete",
	"Stay det",
	"Stay de",
	"Stay d",
	"Stay",
	"Sta",
	"St",
	"S",
	".",
	"I keep on running",
	"I keep on jumping",
	"I keep on trying",
	"I keep on falling",
	"Falling down",
	"Run",
	"Jump",
	"Fall",
	"Repeat",
	"Run",
	"Jump",
	"Fall",
	"Repeat",
	"Jump after jump",
	"Fall after fall",
	"The cloud starts to grow",
	"It tells me things",
	"Weakens my spirit",
	"It plants the thoughts",
	"Entwines my mind",
	"It paints the pictures",
	"Dims my sight",
	"Heavy clouds cloak my sky",
	"Keeps my eyes blindfold",
	"It's getting darker",
	"And darker",
	"And then",
	"I'm scared",
	"I'm not prepared",
	"I hyperventilate",
	"I'm sick of trying",
	"I've given up",
];
const linesCount = lines.length;

g.start();
g.fps = 30;

function random(lo, hi) {
	const dist = hi - lo;
	return Math.random() * dist + lo;
}

function randomi(lo, hi) {
	return Math.round(random(lo, hi));
}

function stepPlayer(dir) {
	bar.x -= 12;
	supL.x -= 12;
	supR.x -= 12;
	const playerStepRotation = Math.PI / 20;
	switch (dir) {
		case 'left':
			player.rotation = -playerStepRotation;
			break;
		case 'right':
			player.rotation = playerStepRotation;
			break;
	}
}

function leftStep() {
	const dir = 'left';
	if (currentStep != dir) {
		stepPlayer(dir);
		currentStep = dir;
	}
	totalSteps++;
}

function rightStep() {
	const dir = 'right';
	if (currentStep != dir) {
		stepPlayer(dir);
		currentStep = dir;
	}
	totalSteps++;
}

function tapStep() {
	const x = g.pointer.x;
	if (x < screenWidth / 2) {
		leftStep();
	} else {
		rightStep();
	}
}

function enablePlayerControls() {
	g.key.leftArrow.press = leftStep;
	g.key.rightArrow.press = rightStep;
	g.stage.interactive = true;
	g.stage.tap = () => {
		tapStep();
	};
}

function disablePlayerControls() {
	g.key.leftArrow.press = undefined;
	g.key.rightArrow.press = undefined;
	g.stage.interactive = false;
	g.stage.tap = undefined;
}

function setup() {
	g.backgroundColor = "white";
	g.state = next;
	sky = g.rectangle(screenWidth, groundY, "skyblue", "black", 1, 0, 0);
	ground = g.rectangle(screenWidth, screenHeight * groundHeightPercent, "green", "white", 1, 0, groundY);
	bar = g.rectangle(barLength, barThickness, "white", "grey", 1, barDistance, 0);
	supL = g.rectangle(barThickness, supHeight, "white", "grey", 1, supLX, supLY);
	supR = g.rectangle(barThickness, supHeight, "white", "grey", 1, supRX, supRY);
	playerSprite = g.sprite("gfx/player.png");
	shadowSprite = g.sprite("gfx/shadow.png");
	player = g.group(shadowSprite, playerSprite);
	day = g.text(".", "12pt Arial", "black", 12, screenHeight - 50);
	line = g.text(".", "14pt Arial", "black", 12, screenHeight - 30);
	guideL = g.text("Hit left to step", "16pt Arial", "black", screenWidth / 8, screenHeight / 4);
	guideR = g.text("Hit right to step", "16pt Arial", "black", 5 * screenWidth / 8, screenHeight / 4);
	totalSteps = 0;
	stage = 0;
}

function moveBarX(x) {
	bar.x = x;
	supL.x = x;
	supR.x = x + (supRX - supLX);

	const dx = Math.abs(supRX - supLX);
	const dy = Math.abs(supLY - supRY);
	bar.rotation = Math.atan(dy / dx);
	const dl = dy / Math.sin(bar.rotation);
	bar.width = dl;
	bar.y = barY + dy / 2 + 4;
	bar.x -= barLength * (1 - Math.cos(bar.rotation)) / 2 - 1;
}

function reset() {
	currentStep = '';
	sky.fillStyle = 'skyblue';
	player.x = playerX;
	player.y = playerY;
	player.rotation = 0;
	supL.x = supLX;
	supR.x = supRX;
	day.content = "Day " + stage;
	line.content = lines[stage];
	moveBarX(barDistance);
	playerSprite.alpha = 1;
	guideL.visible = false;
	guideR.visible = false;
}

function playing() {
	enablePlayerControls();
	if (stage == 1) {
		g.state = guidedPlay;
	} else {
		g.state = play;
	}
}

function guidedPlay() {
	if (totalSteps == 0 || totalSteps == 2) {
		guideL.visible = true;
		guideR.visible = false;
	} else if (totalSteps == 1 || totalSteps == 3) {
		guideL.visible = false;
		guideR.visible = true;
	} else {
		guideL.visible = false;
		guideR.visible = false;
		g.state = play;
	}
}

function play() {
	if (bar.x <= playerX + player.width + minBarOffset) {
		g.state = jump;
	}
	if (totalSteps == 0 || totalSteps == 2) {
		guideL.visible = true;
		guideR.visible = false;
	} else if (totalSteps == 1 || totalSteps == 3) {
		guideL.visible = false;
		guideR.visible = true;
	} else {
		guideL.visible = false;
		guideR.visible = false;
	}
}

function dimSky(n) {
	const r1 = 135;
	const g1 = 206;
	const b1 = 235;
	const r2 = 23;
	const g2 = 44;
	const b2 = 133;
	const a = Math.min(n, linesCount) / linesCount;
	const r = r1 + (r2 - r1) * a;
	const g = g1 + (g2 - g1) * a;
	const b = b1 + (b2 - b1) * a;
	return `rgb(${r}, ${g}, ${b})`;
}

function next() {
	const s = stage;
	g.state = playing;
	stage++;
	if (stage >= linesCount - 1) {
		g.state = givingup();
	}
	reset();
	sky.fillStyle = dimSky(s);
	moveBarX(barDistance + barDistanceStep * s);
	if (stage > 44) {
		const begin = 1;
		const end = 0.45;
		const a = (stage - 45) / (linesCount - 45 - 1);
		const b = 1 - a;
		playerSprite.alpha = begin * b + end * a;
	}
}

function jumpHeight() {
	const min = 15;
	const max = 18;
	if (stage < 45) {
		return randomi(min, max);
	}
	const lo = 12;
	const a = (stage - 45) / (linesCount - 45 - 1);
	const b = 1 - a;
	const lmin = lo * a + min * b;
	const lmax = lo * a + max * b;
	return randomi(lmin, lmax);
}

function jump() {
	disablePlayerControls();
	maxSteps = jumpHeight();
	jumpSteps = maxSteps;
	g.state = jumping;
}

function jumping() {
	disablePlayerControls();
	player.x += jumpStepX;
	player.y -= jumpStepY;
	player.rotation += Math.PI / 2 / maxSteps;
	jumpSteps--;
	if (jumpSteps <= 0) {
		g.state = fall;
	}
}

function fall() {
	disablePlayerControls();
	fallSteps = maxSteps;
	g.state = falling;
}

function falling() {
	disablePlayerControls();
	player.x += jumpStepX;
	player.y += jumpStepY;
	const k = fallSteps / maxSteps * Math.PI / 2;
	bar.x += Math.sin(k) * 10;
	bar.y += Math.cos(k) * 8;
	fallSteps--;
	if (fallSteps <= 0) {
		g.state = wait;
	}
}

function givingup() {
	disablePlayerControls();
	player.visible = false;
	g.state = waiting;
}

function wait() {
	setTimeout(() => {g.state = next}, 2000);
	g.state = waiting;
}

function waiting() {
	// do nothing
}
