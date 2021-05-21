const squares = document.querySelectorAll('.grid div');
const resultDisplay = document.getElementById('result');
let width = 15,
	currentShooterIndex = 202,
	currentInvaderIndex = 0,
	alienInvadersTakenDown = [],
	result = 0,
	direction = 1,
	invaderId;

const alienInvaders = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
	15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
	30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
	45, 46, 47, 48, 49, 50, 51, 52, 53, 54
];

alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'));

squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
	squares[currentShooterIndex].classList.remove('shooter');
	switch (e.which) {
		case 37: if (currentShooterIndex % width !== 0) currentShooterIndex -= 1; break;

		case 39: if (currentShooterIndex % width < width - 1) currentShooterIndex += 1; break;
	}
	squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);

function moveInvaders() {
	const leftEdge = alienInvaders[0] % width === 0;
	const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

	if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
		direction = width;
	} else if (direction === width) {
		if (leftEdge) direction = 1;
		else direction = -1;
	}

	for (let i = 0; i < alienInvaders.length; i++) {
		squares[alienInvaders[i]].classList.remove('invader');
	}
	for (let i = 0; i < alienInvaders.length; i++) {
		alienInvaders[i] += direction;
	}
	for (let i = 0; i < alienInvaders.length; i++) {
		if(!alienInvadersTakenDown.includes(i)) {
			squares[alienInvaders[i]].classList.add('invader');
		}
	}

	if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
		resultDisplay.textContent = 'Game over!';
		squares[currentShooterIndex].classList.add('boom');
		clearInterval(invaderId);
	}

	for (let i = 0; i < alienInvaders.length; i++) {
		if (alienInvaders[i] > (squares.length - (width - 1))) {
			resultDisplay.textContent = 'Game over!';
			clearInterval(invaderId);
		}
	}

	if(alienInvadersTakenDown.length === alienInvaders.length) {
		resultDisplay.textContent = 'You win';
		clearInterval(invaderId);
	}
}

invaderId = setInterval(moveInvaders, 300);

function shoot(e) {
	let laserId,
		currentLaserIndex = currentShooterIndex;

	function moveLaser() {
		squares[currentLaserIndex].classList.remove('laser');
		currentLaserIndex -= width;
		squares[currentLaserIndex].classList.add('laser');
		if (squares[currentLaserIndex].classList.contains('invader')) {
			squares[currentLaserIndex].classList.remove('laser');
			squares[currentLaserIndex].classList.remove('invader');
			squares[currentLaserIndex].classList.add('boom');

			setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
			clearInterval(laserId);

			const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
			alienInvadersTakenDown.push(alienTakenDown);
			result++; 
			resultDisplay.textContent = result;
		}

		if(currentLaserIndex < 15) {
			clearInterval(laserId);
			setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
		}
	}
	switch(e.key) {
		case ' ': laserId = setInterval(moveLaser, 50);
	}
}


document.addEventListener('keyup', shoot);