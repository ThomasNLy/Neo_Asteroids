class Bullet{
	constructor( x,  y, xdir,  ydir){
		this.x = x;
		this.y = y; 
		this.xdir = xdir.toFixed(2);
		this.ydir = ydir.toFixed(2);
		this.xspeed = 10;
		this.yspeed = 10;
		this.size = 20;
		this.alive = true;
		this.lifespan = 100;
		this.hitBox = new Hitbox(this.x, this.y, this.size/2, this.size/2);
		this.colour =  color(0, 140, 200);
	}
	
	display(){
		fill(this.colour);
		circle(this.x, this.y, this.size);
	}
	move(){
		this.x += this.xdir * this.xspeed;
		this.y += this.ydir *  this.yspeed;
		this.hitBox.update(this.x, this.y);
		if(this.x < 0 || this.x > width || this.y > height || this.y < 0)
		{
			this.alive = false;
		}
		else if(this.lifespan <= 0){
			this.alive = false;
		}
		this.lifespan -= 1;
	
	}
	
	reflect(other){
			let point = this.pointOfContact(other);
			this.calculateReflection(point);
		
	}
	
	calculateReflection(p){
		let normal = createVector(this.x - p.x, this.y - p.y);		
		
		let magnitude = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
		
		normal.x *= 1/magnitude;
		normal.y *= 1/magnitude;
	
		let dotProduct = this.xdir * normal.x + this.ydir * normal.y;

		this.xdir = this.xdir - 2 * (dotProduct) * normal.x;
		this.ydir = this.ydir - 2  * (dotProduct)  * normal.y;
		
	} 
	pointOfContact(other){
		const r = this.size/2;
		if(this.x  <= other.x){
			//console.log("left");
			return createVector(other.x, this.y);
		}
		else if(this.x >= other.x + other.w){
			//console.log("right");
			return createVector(other.x + other.w, this.y);
		}
	
			else if(this.y <= other.y){
				//console.log("top");
				
				return createVector(this.x, other.y);
			}
			else{
				//console.log("bottom");
				return createVector(this.x, other.y + other.h);
			}
			
			
		
		
	}
	collision(other){
		const r = this.size/2;
		if(this.x + r > other.x && this.x - r < other.x + other.w && this.y + r > other.y && this.y - r < other.y + other.h)
		{
			return true;
		}
		return false;
	}
}