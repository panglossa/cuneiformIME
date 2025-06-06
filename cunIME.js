var strokes = [];
var glyphdata = [];
var sumerakkaddata = [];
var favourites = [];
var cvcdata = [];
var cvc = ['Ø', 'a', 'Ø'];

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

csv = '';
fetch('./cunIMEglyphSumerAkkad.csv')
  .then(response => response.text())
  .then((data) => {
  	const rows = data.split('\n');
  	let i=1;
	rows.forEach(function (row) {
		parts = row.split(',');
		if (parts.length<2) {
			console.log('Wrong format in line ' + i + ': ' + row);
			} else {
			sumerakkaddata.push(parts);
			}
		i++;
		} ); 
	console.log(sumerakkaddata);
  });

csv = '';
fetch('./CVC.csv')
  .then(response => response.text())
  .then((data) => {
  	const rows = data.split('\n');
  	let i=1;
	rows.forEach(function (row) {
		parts = row.split(',');
		if (parts.length<2) {
			console.log('Wrong format in line ' + i + ': ' + row);
			} else {
			cvcdata.push([parts[0], parts[1].split(';')]);
			}
		i++;
		} ); 
	//console.log(cvcdata);
  });
  
favourites = localStorage.getItem('cunimefavourites');
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
	localStorage.setItem('cunimefavourites', JSON.stringify(favourites));
	}

function updatecandidates(){
	buffer = document.getElementById('buffer');
	candidates = document.getElementById('candidates');
	candidates.innerHTML = '';
	check = '';
	finished = false;
	for (i = 0; i <strokes.length; i++) {
		if (!finished) {
			if (strokes[i]=='finished') {
				finished = true;
				} else {
				check += strokes[i];
				}
			}
		}
	
	if (glyphdata.length > 0) {
	glyphdata.forEach(function(row) {
		ismatch = false;
		if (row.length<2) {
			console.log(row);
			}
		parts = row[1].split(';');
		parts.forEach(function(part) {
			if (finished) {
				if (part==check) {
					ismatch = true;
					}
				} else {
				if (part.startsWith(check)) {
					ismatch = true;
					}
				}
			
			});
    if (ismatch) {
    	candidates.innerHTML += ' ' + '<a title="Click to insert this character" href="#" onclick="javascript:insertglyph(' + "'" + row[0] + "'" + ');return false;">' + row[0] + '</a>';
    	}
	});
    	}
	}

function addstroke(s, q = 1) {
	if (!strokes.includes('finished')) {
		buffer = document.getElementById('buffer');
	if (s=='finished') {
		strokes.push(s);
		buffer.innerHTML += '<div class=""> ✅ </div>';
		} else {
		
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
		}
	updatecandidates();
	}
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
	semantic = document.getElementById('semantic');
	semantic.value = '';
	phonetic = document.getElementById('phonetic');
	phonetic.value = '';
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
	localStorage.setItem('cunimefavourites', JSON.stringify(favourites));
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
	document.querySelector('#candidates_semantic').style.fontFamily = fontname;
	document.querySelector('#candidates_phonetic').style.fontFamily = fontname;
	document.querySelector('#candidates_cvc').style.fontFamily = fontname;
	document.querySelector('#favouriteglyphs').style.fontFamily = fontname;
	}

function searchsemantic(){
	buffer = document.getElementById('buffer_semantic');
	candidates = document.getElementById('candidates_semantic');
	semantic = document.getElementById('semantic');
	candidates.innerHTML = '';
	if (sumerakkaddata.length > 0) {
	sumerakkaddata.forEach(function(row) {
		ismatch = false;
		if (row.length<2) {
			console.log(row);
			}
		if (row[2]!='') {
			parts = row[2].split('|');
			parts.forEach(function(part) {
				if (part.toLowerCase().includes(semantic.value.toLowerCase())) {
				//if (part.startsWith(buffer.innerHTML)) {
					ismatch = true;
					}
				});
    	}
		if (row[4]!='') {
			parts = row[4].split('|');
			parts.forEach(function(part) {
				if (part.toLowerCase().includes(semantic.value.toLowerCase())) {
				//if (part.startsWith(buffer.innerHTML)) {
					ismatch = true;
					}
				});
    	}
	    if (ismatch) {
	    	candidates.innerHTML += ' ' + '<a title="Click to insert this character" href="#" onclick="javascript:insertglyph(' + "'" + row[0] + "'" + ');return false;">' + row[0] + '</a>';
	    	}
	});
    	}
	}



function searchphonetic(){
	buffer = document.getElementById('buffer_phonetic');
	candidates = document.getElementById('candidates_phonetic');
	phonetic = document.getElementById('phonetic');
	candidates.innerHTML = '';
	if (sumerakkaddata.length > 0) {
	sumerakkaddata.forEach(function(row) {
		ismatch = false;
		if (row.length<2) {
			console.log(row);
			}
		if (row[1]!='') {
			parts = row[1].split('|');
			parts.forEach(function(part) {
				//if (part.toLowerCase().includes(phonetic.value.toLowerCase())) {
				if (searchmatch(part.toLowerCase(), phonetic.value.toLowerCase())) {
				//if (part.startsWith(buffer.innerHTML)) {
					ismatch = true;
					}
				});
    	}
		if (row[3]!='') {
			parts = row[3].split('|');
			parts.forEach(function(part) {
				//if (part.toLowerCase().includes(phonetic.value.toLowerCase())) {
				if (searchmatch(part.toLowerCase(), phonetic.value.toLowerCase())) {
				//if (part.startsWith(buffer.innerHTML)) {
					ismatch = true;
					}
				});
    	}
	    if (ismatch) {
	    	candidates.innerHTML += ' ' + '<a title="Click to insert this character" href="#" onclick="javascript:insertglyph(' + "'" + row[0] + "'" + ');return false;">' + row[0] + '</a>';
	    	}
	});
    	}
	}

function switchtab(tabindex) {
	var strokeinput = document.getElementById('strokeinput');
	var syllableinput = document.getElementById('syllableinput');
	var pronunciationinput = document.getElementById('pronunciationinput');
	var meaninginput = document.getElementById('meaninginput');
	strokeinput.style.display = 'none';
	syllableinput.style.display = 'none';
	pronunciationinput.style.display = 'none';
	meaninginput.style.display = 'none';
	switch(tabindex) {
		case 0:
			strokeinput.style.display = 'block';
			break;
		case 1:
			syllableinput.style.display = 'block';
			break;
		case 2:
			pronunciationinput.style.display = 'block';
			break;
		case 3:
			meaninginput.style.display = 'block';
			break;
		}
	}
	
function composesyllable(index, letter) {
	cvc[index] = letter;
	cvc0 = document.getElementById('cvc0');
	cvc1 = document.getElementById('cvc1');
	cvc2 = document.getElementById('cvc2');
	if (cvc[0]=='x') {
		cvc[0] = "'";
		}
	cvc0.innerHTML = cvc[0];
	cvc1.innerHTML = cvc[1];
	cvc2.innerHTML = cvc[2];
	
	candidates = document.getElementById('candidates_cvc');
	candidates.innerHTML = '';
	
	cvcdata.forEach(function (row) {
		row[1].forEach(function(syll) {
			match = syllablematch(syll, cvc);
			if (match!='') {
				candidates.innerHTML += '<a href="#" title="Click to insert this character" onclick="javascript:insertglyph(' + "'" + row[0] + "'" + ');return false;">' + row[0] + ' ' + match + '</a>' + '<br/>';
				}
			});
		} ); 
	if (cvc[2]!='Ø') {
		getsecondarysyllables(cvc);
		}
	sylbuttons = document.querySelectorAll("#syllablebuilder a");
	for (let i = 0; i < sylbuttons.length; i++) {
		sylbuttons[i].classList.remove("selectedsyllablecomponent");
		}
	sylbuttons = document.querySelectorAll("#syllablebuilder tr td:first-child a");
	for (let i = 0; i < sylbuttons.length; i++) {
		if (sylbuttons[i].innerHTML == cvc[0]) {
			sylbuttons[i].classList.add("selectedsyllablecomponent");
			}
		}
	sylbuttons = document.querySelectorAll("#syllablebuilder tr td:nth-child(2) a");
	for (let i = 0; i < sylbuttons.length; i++) {
		if (sylbuttons[i].innerHTML == cvc[1]) {
			sylbuttons[i].classList.add("selectedsyllablecomponent");
			}
		}
	sylbuttons = document.querySelectorAll("#syllablebuilder tr td:nth-child(3) a");
	for (let i = 0; i < sylbuttons.length; i++) {
		if (sylbuttons[i].innerHTML == cvc[2]) {
			sylbuttons[i].classList.add("selectedsyllablecomponent");
			}
		}
	}
	
function getsecondarysyllables(pattern) {
	candidates = document.getElementById('candidates_cvc');
	
	first = pattern[0] + pattern[1];
	cvcdata.forEach(function (row) {
		row[1].forEach(function(syll1) {
			if (syll1==first) {
				//first part found, look for second
				cvcdata.forEach(function (row2) {
					pattern[2].split('/').forEach(function (c2) {
						second = pattern[1] + c2;
						row2[1].forEach(function(syll2) {
							if (syll2==second) {
								candidates.innerHTML += '<a href="#" title="Click to insert this character" onclick="javascript:insertglyph(' + "'" + row[0] + ' ' + row2[0] + "'" + ');return false;">' + row[0] + ' ' + row2[0] + ' ' + first + '.' + second + '</a>' + '<br/>';
								}
							});
						});
					});
				}
			});
		});
	// cvcdata.forEach(function (row) {
	// 	row[1].forEach(function(syll1) {
	// 		if (syll1==first) {
	// 			pattern[2].split('/').forEach(function (c2) {
	// 				second = pattern[1] + c2;
	// 				row[1].forEach(function(syll2) {
	// 					if (syll2==second) {
	// 						candidates.innerHTML += '<a href="#" title="Click to insert this character" onclick="javascript:insertglyph(' + "'" + syll1 + ' ' + syll2 + "'" + ');return false;">' + syll1 + ' ' + syll2 + ' ' + first + '.' + second + '</a>' + '<br/>';
	// 						}
	// 					});
	// 				});
	// 			}
	// 		});
	// 	});
	}
	
function syllablematch(subject, pattern) {
	res = '';
	pattern[2].split('/').forEach(function (c2) {
		c1 = pattern[0];
		if (c1=='Ø') {
			c1 = '';
			}
		
		test = c1+pattern[1];
		if (c2=='Ø') {
			if (subject.startsWith(test)) {
				res = subject;
				}
			} else {
			if (subject==test+c2) {
				res = subject;
				}
			}
		
		});
	return res;
	}

function wiktionary() {
	var txtarea = document.getElementById("maininput");
	var start = txtarea.selectionStart;
	var finish = txtarea.selectionEnd;
	var sel = txtarea.value.substring(start, finish);
	//alert(sel);
	if (sel.trim()!='') {
		window.open('https://en.wiktionary.org/wiki/' + sel, 'wiktionary');
		}
	}

function searchmatch(datastring, searchstring) {
	res = false;
	let resulta = datastring.replace(/â|ā|á|à|ä|ǎ|ă/gi, function (x) {
		return 'a';
		});
let resulte = resulta.replace(/ê|é|è|ë|ẽ|ē|ě/gi, function (x) {
  return 'e';
});
let resulti = resulte.replace(/î|ĩ|í|ì|ï|ī|ǐ/gi, function (x) {
  return 'i';
});
let resultu = resulti.replace(/ũ|û|ú|ù|ü|ū|ǔ/gi, function (x) {
  return 'u';
});
let results = resultu.replace(/ṣ|š/gi, function (x) {
  return 's';
});
let resulth = results.replace(/ḫ/gi, function (x) {
  return 'h';
});
let resultt = results.replace(/ṭ/gi, function (x) {
  return 't';
});
let resultng = resultt.replace(/g̃/gi, function (x) {
  return 'ng';
});

	if (resultng.includes(searchstring)) {
		res = true;
		}
	return res;
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
	switchtab(1);
	}	
	