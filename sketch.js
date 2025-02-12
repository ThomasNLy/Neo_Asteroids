/*
get enemy to move and have it shoot when player is in range
and deal damage
*/
let ship;
let upKey, downKey, rightKey, leftKey, missileKey;
let bullets;
let shield;
let asteroids;
let spawnPoints;
let lives;
let maxLives;
let respawnTimer;
let enemies;
let enemyBullets;

let missiles;
let numMissiles;
let missileFired;
let missileCooldown;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	ship = new Ship();
	bullets = []; // javasript array/ arraylist equivalent combined
	missiles = [];
	numMissiles = 3;
	missileFired = false;
	missileCooldown = 0;
	//------------spawn points----------
	spawnPoints = [new SpawnPoint(40, 40), new SpawnPoint(windowWidth - 30, 100), new SpawnPoint(windowWidth / 2 + 200, windowHeight - 50), new SpawnPoint(10, windowHeight - 30)];

	asteroids = [];
	for (let i = 0; i < 10; i++) {
		let randomSpawn = (int)(random(0, 4));

		asteroids.push(new Asteroid(spawnPoints[randomSpawn].x, spawnPoints[randomSpawn].y));
	}
	shield = new Shield();
	lives = 20;
	maxLives = lives;
	respawnTimer = 0;
	upKey = false;
	downKey = false;
	rightKey = false;
	leftKey = false;

	//------------ setting up enemies------------
	enemies = [];
	for (let i = 0; i < 3; i++) {
		let randomSpawn = (int)(random(0, 4));
		enemies.push(new Enemy(spawnPoints[randomSpawn].x, spawnPoints[randomSpawn].y));
	}
	enemyBullets = [];





}

function draw() {

	background(100);
	controls();
	updateEnemies();
	updateMissiles();
	missileCooldownTimer();
	if (ship.alive) {
		ship.move();
		ship.display();
	}


	if (!ship.alive) {
		respawn();
	}
	if (ship.invincible) {
		ship.invincibleTimer();
	}


	//-----------------for loop for moving and displaying bullets------------
	for (let i = 0; i < bullets.length; i++) {
		// if (bullets[i].collision(shield)) {
		// 	bullets[i].reflect(shield);
		// }

		bullets[i].move();
		bullets[i].display();

		if (!bullets[i].alive) {
			bullets.splice(i, 1);
		}

	}
	//-----------------for loop for moving and displaying asteroids------------
	for (let i = 0; i < asteroids.length; i++) {
		asteroids[i].move();
		asteroids[i].display();
		//--------------asteroid and ship collision----------
		try {
			if (collision(asteroids[i].hitbox, ship.hitbox) && ship.alive && !ship.invincible) {
				shipTakeDamage();

			}
		} catch (err) {}
	}

	//-----------------for loop for collison detection with asteroids and bullets and enemies------------


	for (let j = 0; j < bullets.length; j++) {

		//------------asteroid collision detection-------
		for (let i = 0; i < asteroids.length; i++) {
			try {
				if (asteroids[i].type === Asteroid.SHIELDTYPE && bullets[j].collision(asteroids[i].shield)) {

					bullets[j].reflect(asteroids[i].shield);
					asteroids[i].shield.health--;
				} 
        else if (bullets[j].collision(asteroids[i].hitbox)) {
					if (asteroids[i].type === Asteroid.EXPLOSIVETYPE) {
						let destroyedAsteroidXCoord = asteroids[i].x;
						let destroyedAsteroidYCoord = asteroids[i].y;
						for (let i = 0; i < 3; i++) {
							let childAsteroid = new Asteroid(destroyedAsteroidXCoord, destroyedAsteroidYCoord);
							childAsteroid.type = Asteroid.NOSHIELDTYPE;
							childAsteroid.size = childAsteroid.size / 2;
							asteroids.push(childAsteroid);
						}

					}
					asteroids.splice(i, 1);
					bullets.splice(j, 1);


				}
			} catch (e) {
				//console.log(e);
			}
		}

		//---------enemy bullet collision detection----------
		try {
			for (let k = 0; k < enemies.length; k++) {
				let e = enemies[k];
				if (bullets[j].collision(e.hitbox)) {
					e.life--;
					bullets.splice(j, 1);
				}
				if (e.life <= 0) {
					e.alive = false;
					enemies.splice(k, 1);
				}
			}

		} catch (err) {
			//enemy is dead
		}
	}

	//debug();
	//-------------------DISPLATYING THE UI--------------------
	UI();

}

function keyPressed() {
	if (key == 'w') {

		upKey = true;
	}
	if (key == 's') {

		downKey = true;
	}
	if (key == 'a') {

		leftKey = true;
	}
	if (key == 'd') {

		rightKey = true;
	}
	if (key == 'g') {

		missileKey = true;
	}
}

function keyReleased() {
	if (key == 'w') {

		upKey = false;
	}

	if (key == 'a') {
		leftKey = false;
	}
	if (key == 'd') {
		rightKey = false;
	}
	if (key == 's') {
		downKey = false;
	}
	if (key == 'g') {

		missileKey = false;
	}
}
//-----------------------------------MOUSE PRESSED-------------------------------
function mousePressed() {
	if (ship.alive) {
		let bulletXDir = cos(ship.returnAngle);
		let bulletYDir = sin(ship.returnAngle);
		bullets.push(new Bullet(ship.x + cos(ship.returnAngle) * 40, ship.y + sin(ship.returnAngle) * 40, bulletXDir, bulletYDir));
	}


}

let controls = () => {
	if (upKey) {
		ship.yspeed = -5;
	} else if (downKey) {
		ship.yspeed = 5;
	} else {
		ship.yspeed = 0;
	}
	if (leftKey) {
		ship.xspeed = -5;
	} else if (rightKey) {
		ship.xspeed = 5;
	} else {
		ship.xspeed = 0;
	}
	if (missileKey && missileFired === false && numMissiles > 0) {
		numMissiles--;
		missileFired = true;
		let allViableTargets = [];
		for (let i = 0; i < asteroids.length; i++) {
			allViableTargets.push(asteroids[i]);
		}
		for (let i = 0; i < enemies.length; i++) {
			allViableTargets.push(enemies[i]);
		}
		for (let i = 0; i < allViableTargets.length; i++) {
			let dist = calculateDistance(ship, allViableTargets[i]);
			if (dist < TrackingMissile.STATICRANGE) {
				missiles.push(new TrackingMissile(ship.x, ship.y, allViableTargets[i]));
				break;
			}
		}
	}
}

function collision(a, b) {
	if (a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h) {
		return true;
	}
	return false;
}

function calculateDistance(a, b) {
	return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
}

function shipTakeDamage() {

	ship.x = windowWidth / 2;
	ship.y = windowHeight / 2;
	ship.hitbox.x = ship.x;
	ship.hitbox.y = ship.y;
	ship.alive = false;
	lives--;
	if (lives <= 0) {
		lives = 0;
	}
}

function debug() {

	for (let i = 0; i < spawnPoints.length; i++) {
		spawnPoints[i].display();
	}
}

function respawn() {
	if (respawnTimer > 100) {
		respawnTimer = 0;
		ship.invincible = true;
		ship.alive = true;

	}
	respawnTimer++;
}

function updateEnemies() {
	for (let i = 0; i < enemies.length; i++) {
		let e = enemies[i];
		if (e.alive) {
			e.move();
			e.display();
			if (ship.alive) {
				e.faceTowards(ship);
				if (dist(e.x, e.y, ship.x, ship.y) < e.range) {
					e.shoot();

				}
			}
			//face the default angle if ship is dead
			else {
				e.angle = e.defaultAngle;
			}

			if (e.isShooting) {
				//e.isShooting = false;
				let b = new Bullet(e.x, e.y, cos(e.angle), sin(e.angle));
				b.colour = color(255, 0, 0);
				enemyBullets.push(b);
			}
		}
	}


	for (let i = 0; i < enemyBullets.length; i++) {
		enemyBullets[i].move();
		enemyBullets[i].display();
		if (!enemyBullets[i].alive) {
			enemyBullets.splice(i, 1);
		} else if (enemyBullets[i].collision(ship.hitbox) && !ship.invincible) {
			shipTakeDamage();
			enemyBullets.splice(i, 1);
		}
	}
}

function updateMissiles() {

	for (let i = 0; i < missiles.length; i++) {
		try {
			missiles[i].move();
			missiles[i].display();


			for (let j = 0; j < enemies.length; j++) {
				if (collision(missiles[i].hitbox, enemies[j].hitbox) && enemies[j] !== missiles[i]._target) {
					enemies.splice(j, 1);
					missiles.splice(i, 1);

				}
			}
			for (let j = 0; j < asteroids.length; j++) {
				if (collision(missiles[i].hitbox, asteroids[j].hitbox) && asteroids[j] !== missiles[i]._target) {
					asteroids.splice(j, 1);
					missiles.splice(i, 1);

				}
			}

			if (collision(missiles[i].hitbox, missiles[i]._target.hitbox)) {
				if (missiles[i]._target instanceof Asteroid) {
					let index = asteroids.indexOf(missiles[i]._target);
					asteroids.splice(index, 1);
				} else {
					let index = enemies.indexOf(missiles[i]._target);
					enemies.splice(index, 1);
				}
				missiles.splice(i, 1);
			}

		} catch (err) {}

	}

}

function missileCooldownTimer() {
	if (missileFired) {
		missileCooldown++;
		if (missileCooldown > 100) {
			missileCooldown = 0;
			missileFired = false;
		}
	}

}

function UI() {
	fill(255);
	textSize(15);
	textAlign(LEFT);
	text("Asteroids Left: " + asteroids.length, 10, 30);

	text("Enemies Left: " + enemies.length, 10, 50);
	if (asteroids.length === 0 && enemies.length === 0) {
		textSize(50);
		textAlign(CENTER);
		text("YOU WIN", windowWidth / 2, windowHeight / 2);

	}  else if (lives <= 0) {
		//console.log("1");
		textSize(50);
		textAlign(CENTER);
	
		text("GAME OVER", windowWidth / 2, windowHeight / 2);
	}
	
	noFill();
	//-----------player health bar---------
	fill(255);
	textSize(12);
	text("HP: " + lives, 300, 30);
	noFill()
	rect(370, 15, 150, 20);
	fill(255, 0, 0);
	
	//lives / maxLives gets % of health left, maxLives*50 is the width of the health bar number of lives  * spacing of each "block" of health
	// 30% * 100 == width of 30 for hp bar
	rect(370, 15, (lives / maxLives) * 150, 19);
	//------------tracking missiles recticle---------
	for (let i = 0; i < missiles.length; i++) {
		translate(missiles[i]._target.x, missiles[i]._target.y);
		fill(200, 100, 0, 100);
		let scalar = calculateDistance(missiles[i], missiles[i]._target) / (TrackingMissile.STATICRANGE / 20);
		if (scalar <= 4) {
			scalar = 4;
			missiles[i].lockedOn = true;
		}
		if (missiles[i].lockedOn) {
			scalar = 4;
		}
		rect(-10 * ((scalar / 2) + 1), -10 * ((scalar / 2) + 1), 20 * ((scalar / 2) + 1), 20 * ((scalar / 2) + 1));
		rotate(PI / 4);
		rect(-10 * (scalar / 2), -10 * (scalar / 2), 20 * (scalar / 2), 20 * (scalar / 2));
		resetMatrix();

	}
	
	//------------------------missile counter UI-------------
	fill(255);
	textSize(12);
	text("Missiles: " + numMissiles, 575, 30);

	for (let i = 0; i < numMissiles; i++) {
		rect(660 + 30 * i, 12, 20, 20);
	}

}