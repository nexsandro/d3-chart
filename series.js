(

	function() {


		var width = 600;
		var height = 500;
		var box = 50;
		var margin = 3;

		var svgPolygon = d3.select('body')
			.append('svg')
				.attr('width', width)
				.attr('height', height);

		var defs = svgPolygon.append('defs');

		var linearGradient = 
			defs.append('linearGradient')
				.attr('id', 'linearGradient')
				.attr('x1', '0%')
				.attr('y1', '00%')
				.attr('x2', '0%')
				.attr('y2', '100%');
				
		linearGradient
			.append('stop')
				.attr('offset', '0%')
				.style('stop-color', 'rgb(255,255,255)')
				.style('stop-opacity', 0.2);

		linearGradient
			.append('stop')
				.attr('offset', '100%')
				.style('stop-color', 'rgb(0,0,250)')
				.style('stop-opacity', 0.2);


		var radialGradient = defs.append('radialGradient')
			.attr('id', 'radialGradient')
			.attr('cx', '50%')
			.attr('cy', '50%')
			.attr('r', '50%')
			.attr('fx', '50%')
			.attr('fy', '50%');

		radialGradient
			.append('stop')
				.attr('offset', '15%')
				.style('stop-color', 'rgb(100,100,100)')
				.style('stop-opacity', 0.2);

		radialGradient
			.append('stop')
				.attr('offset', '100%')
				.style('stop-color', 'rgb(0,0,0)')
				.style('stop-opacity', 0.25);
	
		/*
		 * Init a random serie of values.
		 */
		initRandomSerie = function(serieSize, maxValue, minValue) {
			
			var result = new Array();

			minValue = minValue || 0;

			for(i=0; i<serieSize; i++) {
				result.push(minValue + Math.round( Math.random() * (maxValue - minValue)));
			}

			return result;

		};

		maxSeriesValue = function(series) {
			return series.reduce(
				(acc, currentSerie) => {
					return currentSerie.reduce(
						(acc, currentValue)	=> {
							return acc < currentValue ? currentValue : acc;
					}, acc);
				}, series[0][0]);
		}; 

		minSeriesValue = function(series) {
			return series.reduce(
				(acc, currentSerie) => {
					return currentSerie.reduce(
						(acc, currentValue)	=> {
							return acc > currentValue ? currentValue : acc;
					}, acc);
				}, series[0][0]);
		}; 

		function BarGraph(series) {

			var instance = this;

			this.x = 30;

			this.y = 30;

			this.width = 600;

			this.height = 500;

			this.gap = 10;

			this.padding = [0, 5, 0, 5];

			this.series = series; // Array of array of values

			this.colorPalette;

			this.render = function(selection) {

				selection
					.append('rect')
						.attr('x', 0)
						.attr('y', 0)
						.attr('width', '100%')
						.attr('height', '100%')
						.attr('fill', 'url(#radialGradient)');

				var maxValue = maxSeriesValue(instance.series);
				//var minValue = minSeriesValue(instance.series);
				var scaleY = instance.height / maxValue;
				var seriesQtd = instance.series.length;
				var axisWidth = instance.width / ( instance.series[0].length )
				var dx = (axisWidth - instance.gap) / seriesQtd;
				var colorPalette = instance.colorPalette || ['blue', 'red', 'yellow', 'green'];

				instance.series.forEach( (serie, i) => {

					serie.forEach( (value, j) => {

						x1 = instance.x + axisWidth*j + instance.gap/2 + dx*i;
						y1 = instance.height;

						selection
							.append('rect')
								.attr('x', x1)
								.attr('y', instance.height - value*scaleY)
								.attr('width', dx)
								.attr('height', y1)
								.style('fill', colorPalette[i%colorPalette.length])
								.style('stroke', 'black');
					})
				});


			}

		}

		function XAxis(scale) {
			
			this.scale = scale;

			this.render = function(selection) {
				var axis = d3.axisBottom(this.scale);
				selection.append('g')
					.attr('transform','translate(0,480)')
					.call(axis);
			}

		}
		
		function YAxis(scale) {
			
			this.scale = scale;

			this.render = function(selection) {
				var axis = d3.axisLeft(this.scale);
				selection.append('g')
					.attr('transform', 'translate(30,0)')
					.call(axis);
			}

		}

		var testScaleX = d3.scaleLinear().domain([10,90]).range([30,580]);
		var testScaleY = d3.scaleLinear().domain([100,0]).range([30,480]);

		var serie1 = initRandomSerie(10, 200, 0);
		var serie2 = initRandomSerie(10, 200, 0);
		var serie3 = initRandomSerie(10, 200, 0);

		var barGraph = new BarGraph([serie1, serie2, serie3]);
		barGraph.render(svgPolygon);

		new XAxis(testScaleX).render(svgPolygon);
		new YAxis(testScaleY).render(svgPolygon);


	}
)();