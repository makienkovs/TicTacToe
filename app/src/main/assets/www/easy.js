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
	let emptyPosPC = emptyFilter(pos);
	for (let i = 0; i < emptyPosPC.length; i++) {
		let checkPosPC = changeSym(pos, emptyPosPC[i], pc);
		if (checkWin(checkPosPC, pc))
			index = emptyPosPC[i];
	}

	if (index == undefined) {
		let emptyPosMan = emptyFilter(pos);
		for (let j = 0; j < emptyPosMan.length; j++) {
			let checkPosMan = changeSym(pos, emptyPosMan[j], man);
			if (checkWin(checkPosMan, man))
				index = emptyPosMan[j];
		}
	}

	if (index == undefined)
		index = emptyPosPC[Math.floor(Math.random() * emptyPosPC.length)];

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

function changeSym(arr, n, player) {
	let newArr = [];
	for (let i = 0; i < arr.length; i++) {
		if (i == n)
			newArr.push(player)
		else
			newArr.push(arr[i])
	}
	return newArr;
}

function emptyFilter(arr) {
	arr = arr.filter(i => i != "X" && i != "O");
	return arr;
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