var strokes = [];
var glyphdata = [];
var favourites = [];

csv = '';
fetch('./cunIMEglyphdata.csv')
  .then(response => response.text())
  .then((data) => {
  	const rows = data.split('\n');
  	let i=1;
	rows.forEach(function (row) {
		parts = row.split(',');
		if (parts.length<2) {
			console.log('Wrong format in line ' + i + ': ' + row);
			} else {
			glyphdata.push(parts);
			}
		i++;
		} ); 
	//console.log(glyphdata);
  });
  
favourites = localStorage.getItem('favourites');
//console.log(favourites);
if ((favourites=='')||(favourites==null)) {
	favourites = [];
	} else {
	favourites = JSON.parse(favourites);
	}
  
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}


function insertglyph(s) {
	let maininput = document.getElementById("maininput"); 
	var curPos = maininput.selectionStart;
	let x = maininput.value;
	maininput.value = x.slice(0, curPos) + s + x.slice(curPos) + ' ';
	favpos = -1;
	for (i = 0; i < favourites.length; i++) {
		if (favourites[i]['glyph']==s) {
			favpos = i;
			}
		}
	if (favpos==-1) {
		favourites.push({'glyph' : s, 'count' : 1});
		} else {
		favourites[favpos]['count'] = favourites[favpos]['count'] + 1;
		}
	favourites.sort((a, b) => b.count - a.count);
	//console.log(favourites);
	favouriteglyphs = document.getElementById('favouriteglyphs');
	favouriteglyphs.innerHTML = '';
	for (i = 0; i < favourites.length; i++) {
		if (favourites[i]['count']>1) {
			favouriteglyphs.innerHTML += ' ' + '<a title="Click to insert this character" href="#" onclick="javascript:insertglyph(' + "'" + favourites[i]['glyph'] + "'" + ');return false;">' + favourites[i]['glyph'] + '</a>';
			}
		}
	localStorage.setItem('favourites', JSON.stringify(favourites));
	}

function updatecandidates(){
	buffer = document.getElementById('buffer');
	candidates = document.getElementById('candidates');
	candidates.innerHTML = '';
	if (glyphdata.length > 0) {
	glyphdata.forEach(function(row) {
		ismatch = false;
		if (row.length<2) {
			console.log(row);
			}
		parts = row[1].split(';');
		parts.forEach(function(part) {
			if (part.startsWith(strokes.join(''))) {
			//if (part.startsWith(buffer.innerHTML)) {
				ismatch = true;
				}
			});
    if (ismatch) {
    	candidates.innerHTML += ' ' + '<a title="Click to insert this character" href="#" onclick="javascript:insertglyph(' + "'" + row[0] + "'" + ');return false;">' + row[0] + '</a>';
    	}
	});
    	}
	}

function addstroke(s, q = 1) {
	buffer = document.getElementById('buffer');
	for (let i = 1; i<=q; i++) {
		if (s=='horizontalUwedge') {
			buffer.innerHTML += '<div class="horizontalwedge"><img /></div><div class="Uwedge"><img /></div>';
			} else {
			buffer.innerHTML += '<div class="' + s + '"><img /></div>';
			}
		}
	
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
		case 'horizontalUwedge':
			newstroke = '𒀸𒌋';
			break;
		}
		
	for (let i = 1; i<=q; i++) {
		if (newstroke=='𒀸𒌋') {
			strokes.push('𒀸');
			strokes.push('𒌋');
			} else {
			strokes.push(newstroke);
			}
		}
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

function cleartext(){
	maininput = document.getElementById('maininput');
	maininput.value = '';
	maininput.selectionStart = 0;
	}

function texttoclipboard() {
	maininput = document.getElementById('maininput');
	copyTextToClipboard(maininput.value);
	}

function clearfavourites() {
	favourites = [];
	localStorage.setItem('favourites', JSON.stringify(favourites));
	favouriteglyphs = document.getElementById('favouriteglyphs');
	favouriteglyphs.innerHTML = '';
	}

function selectfont(fontname) {
	localStorage.setItem('selectedfont', fontname);
	document.querySelectorAll('#fontselection a').forEach(function(elem) {
    	elem.classList.remove('selected');
		});
	document.querySelector('#' + fontname).classList.add('selected');
	if (fontname=='Noto') {
		fontname = 'Noto Sans Cuneiform';
		}
	document.querySelector('#maininput').style.fontFamily = fontname;
	document.querySelector('#candidates').style.fontFamily = fontname;
	document.querySelector('#favouriteglyphs').style.fontFamily = fontname;
	}
	
///////////////////////////////////////
window.onload = function () {
	selectedfont = localStorage.getItem('selectedfont');
	if ((selectedfont=='')||(selectedfont==null)) {
		selectedfont = 'Noto Sans Cuneiform';
		}
	//alert(selectedfont);
	selectfont(selectedfont);
	
	favouriteglyphs = document.getElementById('favouriteglyphs');
	favouriteglyphs.innerHTML = '';
	for (i = 0; i < favourites.length; i++) {
		if (favourites[i]['count']>1) {
			favouriteglyphs.innerHTML += ' ' + '<a href="#" title="Click to insert this character" onclick="javascript:insertglyph(' + "'" + favourites[i]['glyph'] + "'" + ');return false;">' + favourites[i]['glyph'] + '</a>';
			}
		}
	}	