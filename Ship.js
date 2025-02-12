class Ship{
	constructor(){
		this.x = width/2;
		this.y = height/2;
	
		this.angle = 0;
		this.xspeed = 0;
		this.yspeed = 0;
		this.hitbox = new Hitbox(this.x - 10, this.y  -10, 50, 50);
		this.alive = true;
		this.invincible = true;
		this.timer = 0;
	}
	
	display(){
		//this.hitbox.display();
		translate(this.x, this.y);
		this.calculateRotation();
		rotate(this.angle);
		
		if(this.invincible){
			fill(0, 140, 210);
		}
		else{
				fill(255);
		}
	
		triangle(-25, 25, 50, 0, -25, -25); 
		resetMatrix();
	}
	
	move(){
		this.x += this.xspeed;
		this.y += this.yspeed;
		this.hitbox.update(this.x - 25, this.y - 25);
		
	}
	
	calculateRotation(){
	this.angle = atan2(mouseY - this.y, mouseX - this.x);
		
	}
	
	invincibleTimer(){
		if(this.timer < 100){
			this.timer++;
		}
		else{
			this.invincible = false;
			this.timer = 0;
		}
	}
	get returnAngle(){
		return this.angle;
	}
}