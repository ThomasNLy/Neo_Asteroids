class Hitbox{
	constructor(x, y,w ,h){
		this.x = x;
		this.y = y;
		this.w = w ;
		this.h = h;
	}
	
	display(){
		fill(0, 255, 0, 200);
		rect(this.x, this.y, this.w, this.h);
	}
	
	update(x, y){
		this.x = x;
		this.y = y;
	}
		
}