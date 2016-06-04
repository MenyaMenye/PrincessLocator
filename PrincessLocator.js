
document.getElementById("clueInput").onchange = function () {calculate();};

function calculate() {
	var startTime = performance.now();
	var clues = document.getElementById("clueInput").value.split("\n");
	var clueX = [];
	var clueY = [];
	var clueR = [];
	var possibleTile = [];
	var finalResult = [];
	var textResult = "";
	for(var i=clues.length-1;i>=0;i--) {
		if(clues[i].indexOf("The princess is within") == -1) clues.splice(i, 1);
	}
	for(var i=clues.length-1;i>=0;i--) {
		if(Number(clues[i].slice(clues[i].indexOf("is within ")+10, clues[i].indexOf(" Tiles"))) > 100) clues.splice(i, 1);
		else if(Number(clues[i].slice(clues[i].indexOf("is within ")+10, clues[i].indexOf(" Tiles"))) < 1) clues.splice(i, 1);
	}
	for(var i=0;i<clues.length;i++) {
		clueX.push(Number(clues[i].slice(1, clues[i].indexOf(","))));
		clueY.push(Number(clues[i].slice(clues[i].indexOf(",")+1, clues[i].indexOf(")"))));
		clueR.push(Number(clues[i].slice(clues[i].indexOf("is within ")+10, clues[i].indexOf(" Tiles"))));
		possibleTile.push(getPossibleLocation(clueX[i], clueY[i], clueR[i]));
	}
	if(clues.length < 1) finalResult = [["No data found"]];
	else if(clues.length == 1) finalResult = possibleTile;
	else if(clues.length > 1) {
		for(var i=0;i<possibleTile.length-1;i++) {
			if(i==0)     finalResult.push(getIntersection(possibleTile[i], possibleTile[i+1]));
			else if(i>0) finalResult.push(getIntersection(finalResult[i-1], possibleTile[i+1]));
		}
	}
	textResult = "Number of data : "+clues.length+"<br>";
	textResult += clues.length < 1 ? "Number of possible location : 0<br><br>" : "Number of possible location : "+finalResult[finalResult.length-1].length+"<br><br>";
	textResult += "Possible location(s):<br>";
	for(var i=0;i<finalResult[finalResult.length-1].length;i++) {
		textResult += "["+finalResult[finalResult.length-1][i] + "]";
	}
	document.getElementById("results").innerHTML = textResult;
	document.getElementById("results").innerHTML += "<br><br>Calculation completed in "+((performance.now()-startTime)/1000).toFixed(3)+" second(s)";
}

function getPossibleLocation(x, y, r) {
	var result = [];
	for(var i=0;i<r*2+1;i++) {
		if(i<r+1) {
			for(var j=y-i;j<=y+r;j++) {
				if((i+x-r) == x && j == y) continue;
				else result.push((i+x-r)+","+j);
			}
		}
		else if(i>=r+1) {
			for(var j=y-r;j<=y+r+r-i;j++) {
				result.push((i+x-r)+","+j);
			} //fuck logic
		}
	}
	return result;
}

function getIntersection() {
	var n = 0;
	var nOthers = arguments.length-1;
	var nShortest = arguments[0].length;
	var shortest = 0;
	var len = 0;
	var result = [];
	var fuckingObject = {};
	for(var i=0; i<=nOthers; i++) {
		n = arguments[i].length;
		if(n < nShortest) {
			shortest = i;
			nShortest = n;
		}
	}
	for(var i=0; i<=nOthers; i++) {
		n = (i==shortest) ? 0 : (i||shortest);
		len = arguments[n].length;
		for(var j=0;j<len;j++) {
			var elem = arguments[n][j];
			if(fuckingObject[elem] == i-1) { //fuck thsi shit
				if(i == nOthers) {
					result.push(elem);
					fuckingObject[elem] = 0;
				} 
				else fuckingObject[elem]=i;
			}
			else if(i==0) fuckingObject[elem] = 0;
		}
	}
	return result;
}