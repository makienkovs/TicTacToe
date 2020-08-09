window.onresize = out;
let hash = document.location.hash;
let xWinString;
let oWinString;
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
	xWinString = "Выиграли X!";
	oWinString = "Выиграли O!";
	drawString = "Ничья!";
}
else {
	xWinString = "X Win!";
	oWinString = "O Win!";
	drawString = "Draw Game!";
}

let height;
let width;
let wrap = document.getElementById("wrap");
let gameField = document.getElementById("gameField");

function out() {
	height = document.documentElement.clientHeight;
	width = document.documentElement.clientWidth;
	wrap.style.height = `${height}px`;
	wrap.style.width = `${width}px`;
	gameField.style.width = `${width - 20}px`;
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
let end = false;
let colorWin;

for (let i = 0; i < 9; i++) {
	let id = "div" + i.toString();
	let div = document.getElementById(id);
	div.onclick = function () { setMan(this.id) };
}

function setMan(id) {
	if (!end) {
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
                if (man == "X")
                    toast(xWinString);
                else
                    toast(oWinString);
				play("winSound");
				color(colorWin);
				end = true;
			}
			else if (emptyArr.length == 0) {
				play("messageSound");
				toast(drawString);
				end = true;
			}
			else {
				changeMove();
            }
		}
	}
	else if (end) {
		newGame();
	}
}

function changeMove() {
    if (man == "X")
        man = "O";
    else
        man = "X";
}

function newGame() {
    man = "X";
	for (let i = 0; i < 9; i++) {
		let id = "div" + i.toString();
		let div = document.getElementById(id);
		div.innerHTML = "";
		div.style.color = "";
	}
	pos = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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