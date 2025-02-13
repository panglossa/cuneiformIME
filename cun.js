strokes = [];
glyphdata = [];

csv = '';
fetch('./glyphdata.csv')
  .then(response => response.text())
  .then((data) => {
  	const rows = data.split('\n');
	rows.forEach(function (row) {
		parts = row.split(',');
		glyphdata.push(parts);
		} ); 
	//console.log(glyphdata);
  });

function insertglyph(s) {
	let maininput = document.getElementById("maininput"); 
	var curPos = maininput.selectionStart;
	let x = maininput.innerHTML;
	maininput.innerHTML = x.slice(0, curPos) + s + x.slice(curPos) + ' ';
	}

function updatecandidates(){
	buffer = document.getElementById('buffer');
	candidates = document.getElementById('candidates');
	candidates.innerHTML = '';
	glyphdata.forEach(function(row) {
		ismatch = false;
		parts = row[1].split(';');
		parts.forEach(function(part) {
			if (part.startsWith(strokes.join(''))) {
			//if (part.startsWith(buffer.innerHTML)) {
				ismatch = true;
				}
			});
    if (ismatch) {
    	candidates.innerHTML += ' ' + '<a href="#" onclick="javascript:insertglyph(' + "'" + row[0] + "'" + ');">' + row[0] + '</a>';
    	}
	});
	}

function addstroke(s) {
	buffer = document.getElementById('buffer');
	buffer.innerHTML += '<div class="' + s + '"><img /></div>';
	newstroke = '';
	switch(s) {
		case 'horizontalwedge':
			newstroke = '𒀸';
			break;
		case 'verticalwedge':
			newstroke = '𒁹';
			break;
		case 'verticalinvertwedge':
			newstroke = '𝆹𝅥';
			break;
		case 'diagwedgeNWSE':
			newstroke = '𒀹';
			break;
		case 'diagwedgeSENW':
			newstroke = '𒀺';
			break;
		case 'diagwedgeSWNE':
			newstroke = '𒍻';
			break;
		case 'diagwedgeNESW':
			newstroke = '🝯';
			break;
		case 'Uwedge':
			newstroke = '𒌋';
			break;
		}
	strokes.push(newstroke);
	updatecandidates();
	}
	
function backspace() {
	strokes.pop();
	buffer = document.getElementById('buffer');
	buffer.innerHTML = '';
	strokes.forEach(function (item) {
		let newstroke = '';
			switch(item) {
			case '𒀸':
				newstroke = 'horizontalwedge';
				break;
			case '𒁹':
				newstroke = 'verticalwedge';
				break;
			case '𝆹𝅥':
				newstroke = 'verticalinvertwedge';
				break;
			case '𒀹':
				newstroke = 'diagwedgeNWSE';
				break;
			case '𒀺':
				newstroke = 'diagwedgeSENW';
				break;
			case '𒍻':
				newstroke = 'diagwedgeSWNE';
				break;
			case '🝯':
				newstroke = 'diagwedgeNESW';
				break;
			case '𒌋':
				newstroke = 'Uwedge';
				break;
			}

		buffer.innerHTML += '<div class="' + newstroke + '"><img /></div>';
		});
	updatecandidates() 
	}

function clearall(){
	buffer = document.getElementById('buffer');
	buffer.innerHTML = '';
	strokes = [];
	candidates = document.getElementById('candidates');
	candidates.innerHTML = '';
	}
