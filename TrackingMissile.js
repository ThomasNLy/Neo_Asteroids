const RANGE = 700;
class TrackingMissile {

	constructor(x, y, target) {
		this.x = x;
		this.y = y;
		let v = createVector(target.x - this.x, target.y - this.y);
		v.normalize();
		this.xdir = v.x;
		this.ydir = v.y;
		this.xspeed = 5;
		this.yspeed = 5;
		this.size = 20;
		this.alive = true;
		this.lifespan = 100;
		this.hitbox = new Hitbox(this.x, this.y, this.size / 2, this.size / 2);
		this.colour = color(0, 140, 200);
		this._target = target;
		this.angle = Math.atan2(this.ydir, this.xdir);
		this.lockedOn = false;
		

	}

	static get STATICRANGE(){
		return 700;
	}
	track(target) {
		let v = createVector(target.x - this.x, target.y - this.y);
		v.normalize();
		this.xdir = v.x;
		this.ydir = v.y;
		this.angle = Math.atan2(this.ydir, this.xdir);

	}

	move() {
		this.track(this._target);
		this.x += this.xdir * this.xspeed;
		this.y += this.ydir * this.yspeed;
		this.hitbox.update(this.x, this.y);
		if (this.lifespan <= 0) {
			this.alive = false;
		}
		this.lifespan -= 1;

	}
	
	display() {
		fill(0, 140, 200);
		//circle(this.x, this.y, this.size);
		translate(this.x, this.y);
		rotate(this.angle);
		triangle(-12, 12, 25, 0, -12, -12); 
		resetMatrix();
	}

}