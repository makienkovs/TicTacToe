window.onresize = out;
let hash = document.location.hash;
let winString;
let loseString;
let drawString;

function toast(text) {
	try {
		Android.showToast(text);
	} catch (e) {
		console.log(e);
	}
}

function play(sound) {
	try {
		Android.play(sound);
	} catch (e) {
		console.log(e);
	}
}

function vibrate() {
	try {
		Android.vibrate();
	} catch (e) {
		console.log(e);
	}
}

if (hash[1] == "2") {
	winString = "Вы выиграли!";
	loseString = "Вы проиграли!";
	drawString = "Ничья!";
}
else {
	winString = "You Win!";
	loseString = "You Lose!";
	drawString = "Draw Game!";
}

let height;
let width;
let wrap = document.getElementById("wrap");
let main = document.getElementById("main");
let xDiv = document.getElementById("X");
let oDiv = document.getElementById("O");

function out() {
	height = document.documentElement.clientHeight;
	width = document.documentElement.clientWidth;
	wrap.style.height = `${height}px`;
	wrap.style.width = `${width}px`;
	main.style.width = `${width - 20}px`;
	xDiv.style.width = `${(width - 20) / 2}px`;
	oDiv.style.width = `${(width - 20) / 2}px`;
	xDiv.style.height = `${(height - 20) / 5}px`;
	oDiv.style.height = `${(height - 20) / 5}px`;
	xDiv.style.lineHeight = `${(height - 20) / 5}px`;
	oDiv.style.lineHeight = `${(height - 20) / 5}px`;
	xDiv.style.fontSize = `${(height - 20) / 8}px`;
	oDiv.style.fontSize = `${(height - 20) / 8}px`;
	for (let i = 0; i < 9; i++) {
		let div = document.getElementById(`div${i}`);
		div.style.width = `${(width - 20) / 3}px`;
		div.style.height = `${(width - 20) / 3}px`;
		div.style.lineHeight = `${(width - 20) / 3}px`;
		div.style.fontSize = `${(height - 20) / 8}px`;
	}
}

out();

let pos = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let man = "X";
let pc = "O";
let end = false;
let endOfMovie = false;
let firstXmove = true;
let colorWin;
document.getElementById("X").style.color = "Red";
document.getElementById("X").style.textDecoration = "underline";

for (let i = 0; i < 9; i++) {
	let id = "div" + i.toString();
	let div = document.getElementById(id);
	div.onclick = function () { setMan(this.id) };
}

function takeX() {
	man = "X";
	pc = "O";
	document.getElementById("X").style.color = "Red";
	document.getElementById("X").style.textDecoration = "underline";
	document.getElementById("O").style.color = "";
	document.getElementById("O").style.textDecoration = "none";
	for (let i = 0; i < 9; i++) {
		let id = "div" + i.toString();
		let div = document.getElementById(id);
		div.innerHTML = "";
		div.style.color = "";
	}
	pos = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	end = false;
	firstXmove = true;
}

function takeO() {
	play("moveSound");
	man = "O";
	pc = "X";
	document.getElementById("O").style.color = "Red";
	document.getElementById("O").style.textDecoration = "underline";
	document.getElementById("X").style.color = "";
	document.getElementById("X").style.textDecoration = "none";
	for (let i = 0; i < 9; i++) {
		let id = "div" + i.toString();
		let div = document.getElementById(id);
		div.innerHTML = "";
		div.style.color = "";
	}
	pos = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	end = false;
	firstXmove = false;
	let i = Math.floor(Math.random() * 9)
	pos[i] = "X";
	document.getElementById("div" + i.toString()).innerHTML = "X";
}

function setMan(id) {
	if (!end && !endOfMovie) {
		let div = document.getElementById(id);
		let i = div.id[3];
		if (div.innerHTML == "") {
			play("moveSound");
			vibrate();
			div.innerHTML = man;
			pos[i] = man;
			let emptyArr = emptyFilter(pos);
			let win = checkWin(pos, man);
			if (win) {
				play("winSound");
				toast(winString);
				color(colorWin);
				end = true;
			}
			else if (emptyArr.length == 0) {
				play("messageSound");
				toast(drawString);
				end = true;
			}
			else {
				endOfMovie = true;
				setTimeout('setPC()', 500);
			}

		}
	}
	else if (end) {
		if (man == "X")
			takeX();
		else
			takeO();
	}
}

function setPC() {
	endOfMovie = false;
	play("moveSound");
	let index;
	if (firstXmove) {
		let arr;
		firstXmove = false;
		let xIndex = pos.indexOf(man);
		switch (xIndex) {
			case 0:
			case 2:
			case 6:
			case 8: index = 4; break;
			case 4: arr = [0, 2, 6, 8]; index = arr[Math.floor(Math.random() * arr.length)]; break;
			case 1: arr = [0, 2, 4]; index = arr[Math.floor(Math.random() * arr.length)]; break;
			case 3: arr = [0, 4, 6]; index = arr[Math.floor(Math.random() * arr.length)]; break;
			case 5: arr = [2, 4, 8]; index = arr[Math.floor(Math.random() * arr.length)]; break;
			case 7: arr = [4, 6, 8]; index = arr[Math.floor(Math.random() * arr.length)]; break;
		}
	}
	else index = (minmax(pos, pc)).index;
	let div = document.getElementById("div" + index.toString());
	div.innerHTML = pc;
	pos[index] = pc;
	let emptyArr = emptyFilter(pos);

	let win = checkWin(pos, pc);
	if (win) {
		play("loseSound");
		toast(loseString);
		color(colorWin);
		end = true;
	}
	else if (emptyArr.length == 0) {
		play("messageSound");
		toast(drawString);
		end = true;
	}
	else
		end = false;
}

function emptyFilter(arr) {
	arr = arr.filter(i => i != "X" && i != "O");
	return arr;
}

function minmax(newPos, player) {
	let emptyArr = emptyFilter(newPos);
	if (checkWin(newPos, man))
		return { score: -10 - Math.random() };
	else if (checkWin(newPos, pc))
		return { score: 10 + Math.random() };
	else if (emptyArr.length == 0)
		return { score: Math.random() };
	let moves = [];
	for (let i = 0; i < emptyArr.length; i++) {
		let move = {};
		move.index = newPos[emptyArr[i]];
		newPos[emptyArr[i]] = player;
		if (player == pc) {
			let result = minmax(newPos, man)
			move.score = result.score;
		}
		else {
			let result = minmax(newPos, pc)
			move.score = result.score;
		}
		newPos[emptyArr[i]] = move.index
		moves.push(move)
	}
	let bestMove;
	if (player == pc) {
		let bestScore = -100;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	else {
		let bestScore = 100;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}

function checkWin(arr, player) {
	if (arr[0] == player && arr[1] == player && arr[2] == player) {
		colorWin = "012";
		return true;
	}
	else if (arr[3] == player && arr[4] == player && arr[5] == player) {
		colorWin = "345";
		return true;
	}
	else if (arr[6] == player && arr[7] == player && arr[8] == player) {
		colorWin = "678";
		return true;
	}
	else if (arr[0] == player && arr[3] == player && arr[6] == player) {
		colorWin = "036";
		return true;
	}
	else if (arr[1] == player && arr[4] == player && arr[7] == player) {
		colorWin = "147";
		return true;
	}
	else if (arr[2] == player && arr[5] == player && arr[8] == player) {
		colorWin = "258";
		return true;
	}
	else if (arr[0] == player && arr[4] == player && arr[8] == player) {
		colorWin = "048";
		return true;
	}
	else if (arr[2] == player && arr[4] == player && arr[6] == player) {
		colorWin = "246";
		return true;
	}
	else
		return false;
}

function color(str) {
	for (let i = 0; i < 3; i++) {
		document.getElementById("div" + str[i]).style.color = "Red";
	}
}