/*
get enemy to move and have it shoot when player is in range
*/
class Enemy {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 70;
		this.h = 60;
		this.xspeed = random(-2, 2) + 0.5;
		this.yspeed = random() * (4) - 1 + 0.5;
		this.life = 3;
		this.hitbox = new Hitbox(this.x- 40, this.y - 27, this.w, this.h);
		this.angle = 90;
		this.fireRate = 80;
		this.isShooting = false;
		this.alive = true;
		this.range = 500;
		this.defaultAngle = Math.acos(this.xspeed); // default angle for the direction it is facing using acos with xspeed being adjacent and assume hyptonesuse is 1
		
	}

	display() {
		translate(this.x, this.y);
		fill(0, 255, 0);
		rotate(this.angle);
		//this.angle += 0.01;
		triangle(-25, 25, 25, 0, -25, -25);
		resetMatrix();
		
		
	}
	move() {
		this.screenWrap();
		
		this.x += this.xspeed;
		this.y += this.yspeed;
		this.hitbox.update(this.x - 40, this.y - 27);
	}
	
	
	screenWrap() {
		
		
		if (this.x > windowWidth + 100) {
			this.x = -100
		} else if (this.x < -100) {
			this.x = windowWidth + 100;
		}
		if (this.y > windowHeight + 100) {
			this.y = -100;
		} else if (this.y < -100) {
			this.y = windowHeight + 100;
		}
	}

	shoot(){
		if(this.fireRate > 0){
			this.fireRate--;
			this.isShooting = false;
		}
		else{
			this.fireRate = 50;
			this.isShooting = true;
		}
	}
	faceTowards(item) {
		//let defaultAngle = Math.acos(this.xspeed); // default angle for the direction it is facing using acos with xspeed being adjacent and assume hyptonesuse is 1
		let dist = Math.sqrt((item.x - this.x) * (item.x - this.x) + (item.y - this.y) * (item.y - this.y));
		if (dist < this.range) {
			let a = item.x - this.x;
			let b = item.y - this.y;
			this.angle = atan2(b, a);
		}
		else{
			this.angle = this.defaultAngle;
		}

	}
}