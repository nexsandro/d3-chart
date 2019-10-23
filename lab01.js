
(function() {

	var width = 600;
	var height = 500;
	var box = 50;
	var margin = 3;

	var svgPolygon = d3.select('body')
		.append('svg')
			.attr('width', width)
			.attr('height', height);

	function rectangles() {

		for(i=0; i<width/box; i++) {


			for(j=0; j<width/box; j++) {

				svgPolygon.
					append('rect')
						.attr('x', i*box + margin)
						.attr('y', j*box + margin)
						.attr('rx', 10)
						.attr('ry', 10)
						.attr('width', box - margin*2)
						.attr('height', box - margin*2)
						.style('fill', 'blue')
						.style('opacity', i / (width/box));

			}

		}

	}

	function lines() {

		var maxAngle = 3.14159265 * 2;
		var inc = 0.03;

		centerx = width/2;
		centery = height/2;

		for(angle = 0; angle < maxAngle; angle += inc) {
			var cx = centerx + (width/2) * Math.cos(angle);
			var cy = centery - (height/2) * Math.sin(angle);

			svgPolygon
				.append('line')
					.attr('x1', centerx)
					.attr('y1', centery)
					.attr('x2', cx)
					.attr('y2', cy)
					.style('opacity', Math.abs(Math.sin(angle)));
		}

		d3
		.selectAll('line')
					.style('stroke', 'blue')
					.style('stroke-width', 1)
	}

	lines();


})();