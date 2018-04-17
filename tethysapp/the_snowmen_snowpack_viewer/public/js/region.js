var map;
var snowtel_network_layer;
var inputGraphic;
var view;
var stationcode;

require([
  "esri/Map",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/tasks/support/FeatureSet",
  "esri/views/MapView",
  "dojo/domReady!"

  ],
    function showHide (Map, MapImageLayer,FeatureLayer, GraphicsLayer, Graphic, FeatureSet, MapView) {

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

  	 }
);

function showHide (){
	snowtel_network_layer.visible = false;

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
