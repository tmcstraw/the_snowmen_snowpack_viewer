var map;
var snowtel_network_layer;
//var inputGraphic;
var view;
var gpUrl;
var gp;


require([
  "esri/Map",
  "esri/widgets/Legend",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/views/2d/draw/Draw",
  "esri/views/2d/draw/PolygonDrawAction",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/geometry/Point",
  "esri/tasks/Geoprocessor",
  "esri/tasks/support/LinearUnit",
  "esri/tasks/support/FeatureSet",
  "esri/views/MapView",
  "dojo/domReady!"

  ], function showHide (Map, Legend, MapImageLayer,FeatureLayer, Draw, PolygonDrawAction, GraphicsLayer, Graphic, Point, Geoprocessor, LinearUnit, FeatureSet, MapView) {
	  map = new Map ({
		  basemap: "topo"
	  });

	  snowtel_network_layer = new FeatureLayer ({
		  url: "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/Snotel_Network/FeatureServer/0",
		  outFields: ["*"],
		  popupTemplate: {
			  title: "{Name}",
			  actions:[{
				  id:"snotel",
				  title:"Snotel Station"
			  }],
			  content: [{
				  type: "fields",
				  fieldInfos: [
				    {fieldName: "Name"},
					{fieldName: "Latitude"},
					{fieldName: "Longitude"},
					{fieldName: "Elevation_", label: "Elevation"},
					{fieldName: "ID"},
					{fieldName: "State"},
					{fieldName: "County"},
					{fieldName: "Network"}
				  ]
			  }]
		  }
	  });

	  utah_flowAccumulation_layer = new MapImageLayer ({
		  url: "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen/Flow_Accumulation/MapServer"
	  });

	  map.layers.add(utah_flowAccumulation_layer);
	  map.add(snowtel_network_layer);

	  //a graphics layer to show input point and output polygon
	  var graphicsLayer = new GraphicsLayer();
	  map.add(graphicsLayer);

	  var view = new MapView ({
		  container: "showMap",
		  map: map,
		  center: [-111.1, 39.1],
		  zoom: 6
	  });

	  view.when(function() {
        view.popup.watch("selectedFeature", function(graphic) {
          if (graphic) {
            // Set the action's visible property to true if the 'website' field value is not null, otherwise set it to false
            graphic.popupTemplate.actions.items[0].visible =
              graphic.attributes.website ? true : false;
            stationcode = graphic['attributes']['id']
            data = {"stationcode": stationcode}
               $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    url: '/apps/the-snowmen-snowpack-viewer/get-time-series/',
                    timeout: 3600000,
                    success: function (response) {
                        var snowDepth = response['time_series'];
                        console.log(snowDepth)

                        Highcharts.chart('timeSeriesPlot', {
                            chart: {
                                zoomType: 'x'
                            },
                            title: {
                                text: 'Snow Depth in Utah, USA'
                            },
                            subtitle: {
                                text: document.ontouchstart === undefined ?
                                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                            },
                            xAxis: {
                                type: 'datetime',
                                title: {
                                    text: 'Time'
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Snow Depth (in)'
                                },
                                min: 0
                            },

                            plotOptions: {
                                area: {
                                    fillColor: {
                                        linearGradient: {
                                            x1: 0,
                                            y1: 0,
                                            x2: 0,
                                            y2: 1
                                        },
                                        stops: [
                                            [0, Highcharts.getOptions().colors[0]],
                                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                        ]
                                    },
                                    marker: {
                                        radius: 2
                                    },
                                    lineWidth: 1,
                                    states: {
                                        hover: {
                                            lineWidth: 1
                                        }
                                    },
                                    threshold: null
                                }
                            },

                            series: [{
                                type: 'area',
                                name: 'Snow Depth',
                                data: snowDepth
                            }],

                        });

                    },
                    error:function(XMLHttpRequest, textStatus, errorThrown){

                    }
               })
          }
        });
      });

    getCookie = function(name) {
        /**
         * Gets CSRF Token.
         *
         * @parameter name
         * @returns cookieValue
         */

        // Gets cookie value.
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }

        return cookieValue;
    };

      function ajaxCreateResource(data) {

           $.ajax({
                type: 'POST',
                headers: {'X-CSRFToken': getCookie('csrftoken')},
                dataType: 'json',
                data: data,
                url: '/apps/the-snowmen-snowpack-viewer/get-time-series/',
                timeout: 3600000,
                success: function (response) {
                console.log(response['time_series'])
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){

                }
           })
      };


      // symbol for input point
      var markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [255, 0, 0],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
      };

      // symbol for buffered polygon
      var fillSymbol = {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [226, 119, 40, 0.75],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1
          }
      };

      // Geoprocessing service url
      var gpUrl2 = "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/CreateWatershedPolygon/GPServer/Create%20Watershed%20Polygon";

      // Geoprocessing service url
      gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/Jan1_2017/GPServer/polyclip";

      $('#select_date').on('change', function () {
                geourl();
                console.log("ran function");
      });


      geourl = function(){
            // gs_layer_list.forEach(function(item){
            var store_name = $("#select_date").find('option:selected').val();
            gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/"+store_name+"/GPServer/polyclip";
            console.log(gpUrl);
            gp = new Geoprocessor(gpUrl);
      };

      console.log(gpUrl);

      // create a new Geoprocessor
      var gp = new Geoprocessor(gpUrl);
      var gp2 = new Geoprocessor(gpUrl2);

      // define output spatial reference
      gp.outSpatialReference = { // autocasts as new SpatialReference()
        wkid: 102100 //EPSG3857
      };

      gp2.outSpatialReference = { // autocasts as new SpatialReference()
        wkid: 102100 //EPSG3857
      };

      //add map click function
      view.on("click", geoServices);


      // input parameters
      var params;
      var params2;

      //main function
      function geoServices(event) {

          graphicsLayer.removeAll();
          var point = new Point({
            longitude: event.mapPoint.longitude,
            latitude: event.mapPoint.latitude
          });

          var inputGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol
          });

          graphicsLayer.add(inputGraphic);
          var inputGraphicContainer = [];
          inputGraphicContainer.push(inputGraphic);
          var featureSet = new FeatureSet();
          featureSet.features = inputGraphicContainer;
          var bfDistance = new LinearUnit();
          bfDistance.distance = 50;
          bfDistance.units = "kilometers";

		  // input parameters for bufferpoint
          params2 = {
            "Pour_Point": featureSet
          };
      }

      document.getElementsByName("delineateWatershed-button")[0].addEventListener("click", function(event){
      	    waiting_output()
      	    gp2.submitJob(params2).then(completeCallback2, errBack, statusCallback);
      	});

      	document.getElementsByName("refresh-button")[0].addEventListener("click", function(event){
      	    location.reload();
      	    console.log("layerremove");
      	});

      function completeCallback2(result){
            hide_buttons()
            gp2.getResultData(result.jobId, "Output_Watershed").then(drawResult, drawResultErrBack);

	    }

      	document.getElementsByName("submit-region-button")[0].addEventListener("click", function(event){
      	    waiting_output()
      	    gp.submitJob(params).then(completeCallback, errBack, statusCallback);
      	});

      	function completeCallback(result){
            console.log(result);


            // get the task result as a MapImageLayer
            hide_buttons()
            var resultLayer = gp.getResultMapImageLayer(result.jobId);
            resultLayer.opacity = 0.7;
            resultLayer.title = "Reclass_MOD_11_Clip";

            // add the result layer to the map
            graphicsLayer.removeAll();

            map.layers.add(resultLayer);

            var legend = new Legend({
                view: view,
                layerInfos: [{
                layer: resultLayer,
                title: "Legend"
                }]
            });

            view.ui.add(legend, "top-right");

	    }

	  function drawResult(data){
	    var polygon_feature = data.value.features[0];
		polygon_feature.symbol = fillSymbol;
		graphicsLayer.add(polygon_feature);

		var featureSet = new FeatureSet();
                featureSet.features = data.value.features;



		params = {
            "Polygon": featureSet
          };
	  }

	  function drawResultErrBack(err) {
        console.log("draw result error: ", err);
      }

      function statusCallback(data) {
        console.log(data.jobStatus);
      }

      function errBack(err) {
        console.log("gp error: ", err);
      }

      function enableCreatePolygon(draw, view, graphicsLayer) {


                var action = draw.create("polygon");

                // PolygonDrawAction.vertex-add
                // Fires when user clicks, or presses the "F" key.
                // Can also be triggered when the "R" key is pressed to redo.
                action.on("vertex-add", function (evt) {
                    createPolygonGraphic(graphicsLayer, view, evt.vertices);
                });

                // PolygonDrawAction.vertex-remove
                // Fires when the "Z" key is pressed to undo the last added vertex
                action.on("vertex-remove", function (evt) {
                    createPolygonGraphic(graphicsLayer, view, evt.vertices);
                });

                // Fires when the pointer moves over the view
                action.on("cursor-update", function (evt) {
                    createPolygonGraphic(graphicsLayer, view, evt.vertices);
                });

                // Add a graphic representing the completed polygon
                // when user double-clicks on the view or presses the "C" key
                action.on("draw-complete", function (evt) {
                    createPolygonGraphic(graphicsLayer, view, evt.vertices);
                });
        }

      function createPolygonGraphic(graphicsLayer, view, vertices,){
                graphicsLayer.removeAll();
                var polygon = {
                    type: "polygon", // autocasts as Polygon
                    rings: vertices,
                    spatialReference: view.spatialReference
                };

                // symbol for buffered polygon
                var fillSymbol = {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [226, 119, 40, 0.75],
                    outline: { // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 255],
                        width: 1
                        }
                };

                var inputGraphic = new Graphic({
                    geometry: polygon,
                    symbol: fillSymbol,
                });

                graphicsLayer.add(inputGraphic);
                var inputGraphicContainer = [];
                inputGraphicContainer.push(inputGraphic);
                var featureSet = new FeatureSet();
                featureSet.features = inputGraphicContainer;

                // input parameters
                params = {
                    "Polygon": featureSet,

                };
      }

  	 }
);

function showHide (){
	snowtel_network_layer.visible = false;
	utah_flowAccumulation_layer.visible = false;

	if(document.getElementById("Utah_Accumulation").checked){
		utah_flowAccumulation_layer.visible = true;
	}

	if(document.getElementById("Snotel_Stations").checked){
		 snowtel_network_layer.visible = true;
	}
}



//Spinning Progress Globe

function hide_buttons() {
    document.getElementById("waiting_output").innerHTML = '';
}

function waiting_output() {
    var wait_text = "<strong>Loading...</strong><br>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='/static/the_snowmen_snowpack_viewer/images/fastglobe.gif'>";
    document.getElementById('waiting_output').innerHTML = wait_text;
}
