
csv = '';
fetch('./cunIMEglyphdata.csv')
  .then(response => response.text())
  .then((data) => {
  	const rows = data.split('\n');
	rows.forEach(function (row) {
		parts = row.split(',');
		glyphdata.push(parts);
		} ); 
	//console.log(glyphdata);
  });
