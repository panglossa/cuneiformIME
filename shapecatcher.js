// Cuneiform Stroke Direction Recognizer
var strokes = [];
var glyphdata = [];
var check = "";
var finished = false;

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
	console.log(glyphdata);
  });


const canvas = document.getElementById('draw-area');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentStroke = [];
let allStrokes = [];

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
document.getElementById('clear').onclick = clearCanvas;
document.getElementById('finished').onclick = setFinished;

function startDrawing(e) {
  drawing = true;
  currentStroke = [];
  ctx.beginPath();
  const { x, y } = getMousePos(e);
  ctx.moveTo(x, y);
  currentStroke.push({ x, y });
}

function draw(e) {
  if (!drawing) return;
  const { x, y } = getMousePos(e);
  ctx.lineTo(x, y);
  ctx.stroke();
  currentStroke.push({ x, y });
}

function stopDrawing() {
  if (currentStroke.length > 1) {
    allStrokes.push(currentStroke);
  }
  drawing = false;
  ctx.closePath();
  recognize();
}

function setFinished() {
	finished = true;
	updatecandidates()
	}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allStrokes = [];
  check = "";
  finished = false;
  document.getElementById('results').textContent = '';
  document.getElementById('candidates').textContent = '';
}

function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function recognize() {
  const sequence = allStrokes.map(classifyStroke);
	check = sequence.join("");
  const resultText = `Stroke sequence: ${sequence.join("")}`;
  document.getElementById('results').textContent = resultText;
  // TODO: Match sequence with database here
  
  updatecandidates()
  
}

function classifyStroke(points) {
  if (points.length < 3) return "?";

  const start = points[0];
  const mid = points[Math.floor(points.length / 2)];
  const end = points[points.length - 1];

  const angle1 = Math.atan2(mid.y - start.y, mid.x - start.x) * 180 / Math.PI;
  const angle2 = Math.atan2(end.y - mid.y, end.x - mid.x) * 180 / Math.PI;

  const delta = Math.abs(angle2 - angle1);
  const normalizedDelta = delta > 180 ? 360 - delta : delta;

  // Check for "<" shape (detectable in either direction)
  const isLeftAngle = (a1, a2) => {
    const upLeft = a1 >= -180 && a1 < -90 && a2 >= -90 && a2 < 0;
    const downLeft = a1 >= 90 && a1 <= 180 && a2 >= 0 && a2 <= 90;
    return upLeft || downLeft;
  };

  if (normalizedDelta >= 60 && normalizedDelta <= 150 && isLeftAngle(angle1, angle2)) {
    return "𒌋";
  }

  // Fallback to straight stroke classification
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  if (angle >= -22.5 && angle < 22.5) return "𒀸";       // →
  if (angle >= 22.5 && angle < 67.5) return "𒀹";       // ↘
  if (angle >= 67.5 && angle < 112.5) return "𒁹";       // ↓
  if (angle >= 112.5 && angle < 157.5) return "🝯";     // ↙
  if (angle >= 157.5 || angle < -157.5) return "𒀸";     // ←
  if (angle >= -157.5 && angle < -112.5) return "𒀺";   // ↖
  if (angle >= -112.5 && angle < -67.5) return "𒁹";     // ↑
  if (angle >= -67.5 && angle < -22.5) return "𒍻";     // ↗

  return "?";
}


function updatecandidates(){
	candidates = document.getElementById('candidates');
	candidates.innerHTML = '';
	console.log(glyphdata.length);
	if (glyphdata.length > 0) {
	glyphdata.forEach(function(row) {
		ismatch = false;
		if (row.length<2) {
			console.log(row);
			}
		parts = row[1].split(';');
		parts.forEach(function(part) {
			//console.log("[" + part + "] [" + check + "]");
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
