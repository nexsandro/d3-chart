(

	function() {


		var width = 600;
		var height = 500;
		var box = 50;
		var margin = 3;
		var bottomAxisMargin = 30;
		var leftAxisMargin = 30;
		var chartBorderX = 30;
		var chartBorderY = 30;
		var chartWidth = width - 2 * chartBorderX;
		var chartHeight = height - 2 * chartBorderY;

		var svgPolygon = d3.select('body')
			.append('svg')
				.attr('width', width)
				.attr('height', height);

		var defs = svgPolygon.append('defs');

		var linearGradient = 
			defs.append('linearGradient')
				.attr('id', 'linearGradient')
				.attr('x1', '0%')
				.attr('y1', '0%')
				.attr('x2', '0%')
				.attr('y2', '100%');
				
		linearGradient
			.append('stop')
				.attr('offset', '0%')
				.style('stop-color', 'rgb(20,20,255)')
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
			.attr('r', '60%')
			.attr('fx', '70%')
			.attr('fy', '70%');

		radialGradient
			.append('stop')
				.attr('offset', '15%')
				.style('stop-color', 'rgb(250,250,250)')
				.style('stop-opacity', 0.1);

		radialGradient
			.append('stop')
				.attr('offset', '100%')
				.style('stop-color', 'rgb(220,20,20)')
				.style('stop-opacity', 0.15);
	
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


		function BarGraph(series, testScaleX, testScaleY) {

			var instance = this;

			this.x = chartBorderX;

			this.y = chartBorderY;

			this.width = 600 - chartBorderX;

			this.height = 500 - chartBorderY;

			this.gap = 10;

			this.padding = [0, 5, 0, 5];

			this.series = series; // Array of array of values

			this.colorPalette;

			this.testScaleX = testScaleX;

			this.testScaleY = testScaleY;

			this.render = function(selection) {

				var background = new Background('url(#radialGradient)').render(selection);

				new XAxis(instance.testScaleX).render(background);
				new YAxis(instance.testScaleY).render(background);

				var chartArea = background.append('g')
					.attr('transform','translate(' + chartBorderX + ',' + chartBorderY + ')');

				var axisWidth = chartWidth / ( instance.series[0].length ); // number of sets of data, must be normalized
				var dx = Math.round((axisWidth - instance.gap) / instance.series.length);
				var colorPalette = instance.colorPalette || ['blue', 'red', 'yellow', 'green'];

				var minValue = d3.min(instance.series, serie => d3.min(serie));
				var maxValue = d3.max(instance.series, serie => d3.max(serie));

				instance.series.forEach( (serie, i) => {

					var linearFx = d3
						.scaleLinear()
							.domain( [minValue, maxValue] )
							.range( [0, chartHeight] );

					serie.forEach( (value, j) => {

						x1 = axisWidth*j + instance.gap/2 + dx*i;
						y1 = chartHeight - Math.round(linearFx(value));

						chartArea
							.append('rect')
								.attr('alt', '' + value)  
								.attr('x', x1)
								.attr('y', y1) 
								.attr('width', dx)
								.attr('height', Math.round(linearFx(value)))
								.style('fill', colorPalette[i%colorPalette.length])
								.style('stroke', 'none')
								.on("mouseover", function() {
									console.log(d3.select(this).attr('alt'));
								});
					})

				});

			}

		}

		/**
		* Background component.
		*/
		function Background(gradient) {

			this.render = function(selection) {
				background = selection
					.append('g');
				background
						.append('rect')
							.attr('x', 0)
							.attr('y', 0)
							.attr('width', '100%')
							.attr('height', '100%')
							.attr('fill', 'url(#radialGradient)');
				return background;
			}

		}

		function XAxis(scale) {
			
			this.scale = scale;

			axisY = height - bottomAxisMargin;

			this.render = function(selection) {
				var axis = d3.axisBottom(this.scale);
				selection.append('g')
					.attr('transform','translate(0,' + axisY + ')')
					.call(axis);
			}

		}
		
		function YAxis(scale) {
			
			this.scale = scale;

			this.render = function(selection) {
				var axis = d3.axisLeft(this.scale);
				selection.append('g')
					.attr('transform', 'translate(' + leftAxisMargin + ',0)')
					.call(axis);
			}

		}

		var serie1 = initRandomSerie(10, 200, 0);
		var serie2 = initRandomSerie(10, 200, 0);
		var serie3 = initRandomSerie(10, 200, 0);

		var testScaleX = d3.scaleLinear()
			.domain([
				0,
				d3.max([serie1, serie2, serie3], serie => serie.length)])
			.range([30,width-chartBorderX]);
		var testScaleY = d3.scaleLinear().domain([100,0]).range([30,height-chartBorderY]);

		var barGraph = new BarGraph([serie1, serie2, serie3], testScaleX, testScaleY);
		barGraph.render(svgPolygon);


	}
)();