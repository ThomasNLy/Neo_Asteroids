const SHIELD = 0;
const NOSHIELD = 1;
const EXPLOSIVE = 2;
class Asteroid {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 70;
		this.h = 60;
		this.xspeed = random(-2, 2) + 0.5;
		this.yspeed = random() * (4) - 1 + 0.5;
		
		this.hitbox = new Hitbox(this.x, this.y, this.w, this.h);
		this.type = (int)(random(0, 3));
		
		this.shield = new Shield(this.x, this.y, this.w + 20, this.h + 20);
		this.size = 10;
	}

	display() {
		fill(255, 0, 0);
		translate(this.x, this.y);
		beginShape();
		vertex(-3 * this.size, 0 * this.size);
		vertex(0 * this.size, -3 * this.size);
		vertex(3 * this.size, 0 * this.size);
		vertex(2 * this.size, 2 * this.size);
		vertex(-2 * this.size, 3 * this.size);
		endShape(CLOSE);
		resetMatrix();

		if (this.type === SHIELD) {

			this.shield.update(this.x - this.shield.w / 2 + 10, this.y - this.shield.h / 2 + 10);
			this.shield.display();
		}
		if(this.shield.health <= 0)
		{
			this.type = NOSHIELD;
		}





		// rect(this.x, this.y, this.w, this.h);
		//this.hitbox.display();
	}
	move() {
		this.screenWrap();
		this.x += this.xspeed;
		this.y += this.yspeed;
		this.hitbox.update(this.x - 30, this.y - 20);
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
	
	static get SHIELDTYPE(){
		return SHIELD;
	}
	static get EXPLOSIVETYPE(){
		return EXPLOSIVE;
	}
	static get NOSHIELDTYPE(){
		return NOSHIELD;
	}
}