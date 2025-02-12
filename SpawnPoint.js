class SpawnPoint{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	display(){
		fill(0, 255, 0, 100);
		rect(this.x, this.y, 20, 20);
		
	}

}