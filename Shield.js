class Shield{
	constructor(x, y, w, h)
	{
		this.x = x
		this.y = y
		this.w = w;
		this.h = h;
		this.health = 5;
	}
	display(){
		fill(255, 50);
		rect(this.x, this.y, this.w, this.h);
	}
	
	update(x, y){
		this.x = x;
		this.y = y;
	}
}