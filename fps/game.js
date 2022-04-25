'use strict'

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


class Board {
	constructor(objs) {
		this.objs = objs
		this.canvas = null;
		this.ctx = null;

		this.canvas2 = null;
		this.ctx2 = null;

		this.createCanvas();
	}

	createCanvas() {
		this.canvas = document.getElementById('game');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.style.position = 'absolute';
		this.canvas.style.left = 0;
		this.canvas.style.top = 0;
		this.canvas.style.zIndex = 150;

	
		this.canvas2 = document.createElement('canvas');
		document.body.appendChild(this.canvas2);
		this.ctx2 = this.canvas2.getContext('2d');
		this.canvas2.width = this.canvas.width;
		this.canvas2.height = this.canvas.height;
		this.canvas2.style = 'border: 1px solid green; z-Index: 0; position: absolute; left: 0; top:0';
		this.canvas2.style.zIndex = 100;
		this.canvas2.style.position = 'absolute';
		this.canvas2.style.left = 0;
		this.canvas2.style.top = 0;

		this.canvas3 = document.createElement('canvas');
		document.body.appendChild(this.canvas3);
		this.ctx3 = this.canvas3.getContext('2d');
		this.canvas3.width = this.canvas.width;
		this.canvas3.height = this.canvas.height;
		this.canvas3.style = 'border: 1px solid green; z-Index: 200; position: absolute; left: 0; top:0';
		
		this.canvas3.style.zIndex = 100;
		this.canvas3.style.position = 'absolute';
		this.canvas3.style.left = 0;
		this.canvas3.style.top = 0;
		
		this.ctx2.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx2.fillStyle = 'rgb(0, 200, 0, 0.1)';
		this.ctx2.fillRect(0,0, this.canvas2.width, this.canvas.height);

		this.ctx3.clearRect(0, 0, this.canvas.width, 50);
		this.ctx3.font = '18px sans-serif';
		this.ctx3.fillStyle = 'black'; 
		this.ctx3.strokeText('Começamos!', 10, 25);
	}

	_render(){
	}
	render() {
		this.ctx.fillStyle = 'rgb(200, 200, 200)';
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.ctx.save();
		this.ctx.fillStyle = 'rgb(50, 50, 50)';
		this.ctx.fillRect(this.objs[1].x, this.objs[1].y, 10, 10);

		const _obj2 = new Path2D();
		_obj2.arc(this.objs[2].x, this.objs[2].y, 10, 0, Math.PI*2);
		this.ctx.fill(_obj2);

		const _obj3 = new Path2D('M5 150 h 10 v 10 Z');
		this.ctx.fill(_obj3);

		this.ctx.restore();

	}
}

class Game {

	constructor() {
		// Ticks acumuled since last update and render call.
		this.lastLoop = 0;
		// Number of Frame per Second
		this.FPS = 60;	

		this.obj = {};
		this.obj[0] = {x: 5, y:190};
		this.obj[1] = {x: 5, y:220};
		this.obj[2] = {x: 5, y:150};

		this.board = new Board(this.obj);

	}

	update(dt) {
		this.obj[1].x += 100*dt;
		this.obj[2].x += 100*dt;
		this.obj[0].x += 100*dt;
	}


	render() {
		this.board.render();
	}


	main() {
		// The main game loop
		const tick = Time.tick();

		if (this.lastLoop >= 1000/this.FPS) {

			this.lastLoop = 0;
			this.update(tick/1000);
			this.render();
		}

		this.lastLoop += tick;

		// Cross-browser support for requestAnimationFrame
		const w = window;
		requestAnimationFrame = w.requestAnimationFrame || 
			w.webkitRequestAnimationFrame || 
			w.msRequestAnimationFrame || 
			w.mozRequestAnimationFrame;


		// Request to do this again ASAP
		requestAnimationFrame(this.main.bind(this));
	}


}

function doGame() {
	const game = new Game();
	game.main(0);
}
