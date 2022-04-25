'use strict'

class KeyboardControls {
	constructor() {
		// Handle keyboard controls
		this.keysDown = {};

		addEventListener("keydown", function (e) {
			this.keysDown[e.key] = true;
		}.bind(this), false);

		addEventListener("keyup", function (e) {
			delete this.keysDown[e.key];
		}.bind(this), false);
	}

	pressUp() {
		return ("ArrowUp" in this.keysDown);
	}

	pressDown() {
		return ("ArrowDown" in this.keysDown)
	}

	pressLeft() {
		return ("ArrowLeft" in this.keysDown)
	}

	pressRight() {
		return ("ArrowRight" in this.keysDown)
	}
}


class Time {
	static then = 0;
	
	static tick() {
		let now = Date.now();
		let delta = 0

		if (Time.then != 0) {
			delta = now - Time.then
		}
		Time.then = now;
		return delta;
	}
}

class GameCanvas {

	hero = null;
	monster = null;

	constructor() {
		// Create the canvas
		this.canvas = document.createElement("canvas");
		this._ctx = this.canvas.getContext("2d");
		this.canvas.width = 512;
		this.canvas.height = 480;
		document.body.appendChild(this.canvas);
	}

	width() {
		return this.canvas.width;
	}

	height() {
		return this.canvas.height;
	}

	ctx() {
		return this._ctx;
	}

	drawImage(img, x, y) {
	}

	createBackground() {
		// Background image
		this.bgReady = false;
		this.bgImage = new Image();
		this.bgImage.onload = function () {
			this.bgReady = true;
		}.bind(this);
		this.bgImage.src = "images/background.png";
	}

	createMonster(monster) {
		this.monster = monster;
		// Monster image
		this.monsterReady = false;
		this.monsterImage = new Image();
		this.monsterImage.onload = function () {
			this.monsterReady = true;
		}.bind(this);
		this.monsterImage.src = "images/monster.png";
	//	this.monster = {};
		this.monstersCaught = 0;
	}

	createHero(hero) {
		this.hero = hero;
		// Hero image
		this.heroReady = false;
		this.heroImage = new Image();
		this.heroImage.onload = function () {
			this.heroReady = true;
			this.hero.width = this.heroImage.width;
			this.hero.height = this.heroImage.height;
		}.bind(this);
		this.heroImage.src = "images/hero.png";
	}

	
	renderScore() {
		this._ctx.fillStyle = "rgb(250, 250, 250)";
		this._ctx.font = "24px Helvetica";
		this._ctx.textAlign = "left";
		this._ctx.textBaseline = "top";
		this._ctx.fillText("Goblins caught: " + this.monstersCaught, 32, 32);
	}

	render() {
		// Draw everything
		if (this.bgReady) {
			this._ctx.drawImage(this.bgImage, 0, 0);
		}

		if (this.heroReady) {
			this._ctx.drawImage(this.heroImage, this.hero.x, this.hero.y);
		}
		
		console.log(this.monsterReady);
		if (this.monsterReady) {
			this._ctx.drawImage(this.monsterImage, this.monster.x, this.monster.y);
		}

		// Score
		this.renderScore();
	}


}


class Game {

	hero = {
		x: 0,
		y: 0,
		speed: 256
	}

	monster = {
		x: 0,
		y: 0
	}
	constructor() {
		this.canvas = new GameCanvas();
		//this.ctx = this.canvas.ctx();

		this.canvas.createBackground();
		this.canvas.createHero(this.hero);
		this.canvas.createMonster(this.monster);

		this.controls = new KeyboardControls();
	}

	reset() {
		// Reset the game when the player catches a monster
		this.hero.x = this.canvas.width() / 2;
		this.hero.y = this.canvas.height() / 2;

		// Throw the monster somewhere on the screen randomly
		this.monster.x = 32 + (Math.random() * (this.canvas.width() - 64));
		this.monster.y = 32 + (Math.random() * (this.canvas.height() - 64));
	}

	isInCollision(obj1, obj2) {
		return (
			obj1.x <= (obj2.x + 32)
			&& obj2.x <= (obj1.x + 32)
			&& obj1.y <= (obj2.y + 32)
			&& obj2.y <= (obj1.y + 32)
		) 
	
	}

	updateMoviment(modifier) {
		if (this.controls.pressUp()) {
			const ny = this.hero.y - this.hero.speed * modifier;
			if (ny > this.hero.height) this.hero.y = ny;
		}
		if (this.controls.pressDown()) {
			const ny = this.hero.y + this.hero.speed * modifier;
			if (ny < (this.canvas.height() - 2*this.hero.height)) this.hero.y = ny;

		}
		if (this.controls.pressLeft()) {
			const nx = this.hero.x - this.hero.speed * modifier;
			if (nx > this.hero.width) this.hero.x = nx;
		}
		if (this.controls.pressRight()) {
			const nx = this.hero.x + this.hero.speed * modifier;
			if (nx < this.canvas.width() - 2*this.hero.width) this.hero.x = nx;
		}
	}

	testCollisions() {
		// Are they touching?
		if (this.isInCollision(this.hero, this.monster)) {
			++this.monstersCaught;
			this.reset();
		}
	}

	update(modifier) {
		this.updateMoviment(modifier);
		this.testCollisions();
	}


	render() {
		this.canvas.render();
	}


	main() {
		// The main game loop
		this.update(Time.tick() / 1000);
		this.render();

		// Cross-browser support for requestAnimationFrame
		const w = window;
		requestAnimationFrame = w.requestAnimationFrame || 
			w.webkitRequestAnimationFrame || 
			w.msRequestAnimationFrame || 
			w.mozRequestAnimationFrame;


		// Request to do this again bind  
		requestAnimationFrame(this.main.bind(this));
	}


}

function doGame() {
	const game = new Game();
	game.reset();
	game.main();
}
