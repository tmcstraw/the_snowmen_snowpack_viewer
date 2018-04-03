var map;
var utah_dem_layer;
var utah_flowAccumulation_layer;
var utah_counties_layer;
var snowtel_network_layer;

require([
  "esri/Map",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/geometry/Point",
  "esri/tasks/Geoprocessor",
  "esri/tasks/support/LinearUnit",
  "esri/tasks/support/FeatureSet",
  "esri/views/MapView",
  "dojo/domReady!"

  ], function showHide (Map, MapImageLayer,FeatureLayer, GraphicsLayer, Graphic, Point, Geoprocessor, LinearUnit, FeatureSet, MapView) {
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

	  utah_counties_layer = new FeatureLayer ({
		  url: "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/Utah_Counties/FeatureServer/0",
		  outFields: ["*"],
		  popupTemplate: {
			  title: "{NAME}",
			  actions:[{
				  id:"county",
				  title:"Utah Counties"
			  }],
			  content: [{
				  type: "fields",
				  fieldInfos: [
				    {fieldName: "NAME", label: "Name"},
					{fieldName: "STATEFP", label: "State Code"},
					{fieldName: "COUNTYFP", label: "County Code"},
					{fieldName: "COUNTYNS", label: "ANSI Code"}
				  ]
			  }]
		  }
	  });

	  utah_dem_layer = new MapImageLayer ({
		  url: "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen/Utah_DEM/MapServer"
	  });

	  utah_flowAccumulation_layer = new MapImageLayer ({
		  url: "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen/Flow_Accumulation/MapServer"
	  });

	  map.layers.add(utah_flowAccumulation_layer);
	  map.layers.add(utah_dem_layer);
	  map.add(utah_counties_layer);
	  map.add(snowtel_network_layer);

	  //a graphics layer to show input point and output polygon
	  var graphicsLayer = new GraphicsLayer();
	  map.add(graphicsLayer);

	  var view = new MapView ({
		  container: "showMapView",
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
          }
        });
      });

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


      var tempGraphicsLayer = new GraphicsLayer();

      // Geoprocessing service url
      var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/BufferPoints/GPServer/BufferPoints";
      var gpUrl2 = "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/CreateWatershedPolygon/GPServer/Create%20Watershed%20Polygon";
      var gpUrl3 = "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/MODIS/GPServer/Model%201";
      var gpUrl4 = "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/TheRealInterpolation/GPServer/Model";

      // create a new Geoprocessor
      var gp = new Geoprocessor(gpUrl);
      var gp2 = new Geoprocessor(gpUrl2);
      var gp3 = new Geoprocessor(gpUrl3);
      var gp4 = new Geoprocessor(gpUrl4);

      // define output spatial reference
      gp.outSpatialReference = { // autocasts as new SpatialReference()
        wkid: 102100 //EPSG3857
      };

      gp2.outSpatialReference = { // autocasts as new SpatialReference()
        wkid: 102100 //EPSG3857
      };

      gp3.outSpatialReference = { // autocasts as new SpatialReference()
        wkid: 102100 //EPSG3857
      };

      gp4.outSpatialReference = { // autocasts as new SpatialReference()
        wkid: 102100 //EPSG3857
      };

      //add map click function
      view.on("click", geoServices);

      // input parameters
      var params;
      var params2;
      var params3;
      var params4;

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



		  // input parameters
          params = {
            "Point": featureSet,
            "Distance": bfDistance
          };

          params2 = {
            "Pour_Point": featureSet
          };

          params3 = {
          };

          params4 = {
            "Z_value_field": "Elevation_"
          };
      }





      	document.getElementsByName("bufferPoint-button")[0].addEventListener("click", function(event){
      	    waiting_output()
      	    gp.submitJob(params).then(completeCallback, errBack, statusCallback);
      	});

      	function completeCallback(result){
            hide_buttons()
            gp.getResultData(result.jobId, "BufferedPoints_shp").then(drawResult, drawResultErrBack);

	    }

      	document.getElementsByName("delineateWatershed-button")[0].addEventListener("click", function(event){
      	    waiting_output()
      	    gp2.submitJob(params2).then(completeCallback2, errBack, statusCallback);
      	});

      	function completeCallback2(result){
            hide_buttons()
            gp2.getResultData(result.jobId, "Output_Watershed").then(drawResult, drawResultErrBack);

	    }

	    document.getElementsByName("modisData-button")[0].addEventListener("click", function(event){
      	    waiting_output()
      	    gp3.submitJob().then(completeCallback3, errBack, statusCallback);
      	});



      	function completeCallback3(result){
      	  console.log(result);

          // get the task result as a MapImageLayer
          hide_buttons()
          var resultLayer = gp3.getResultMapImageLayer(result.jobId);
          resultLayer.opacity = 0.7;
          resultLayer.title = "Reclass_MOD11";

          // add the result layer to the map
          map.layers.add(resultLayer);
	    }

	    document.getElementsByName("interpolateSnowPack-button")[0].addEventListener("click", function(event){
      	    waiting_output()
      	    gp4.submitJob(params4).then(completeCallback4, errBack, statusCallback);
      	});

      	function completeCallback4(result){
            console.log(result);

            // get the task result as a MapImageLayer
            hide_buttons()
            var resultLayer = gp4.getResultMapImageLayer(result.jobId);
            resultLayer.opacity = 0.7;
            resultLayer.title = "surface";

            // add the result layer to the map
            map.layers.add(resultLayer);
	    }

	  function drawResult(data){
	    var polygon_feature = data.value.features[0];
		polygon_feature.symbol = fillSymbol;
		graphicsLayer.add(polygon_feature);
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

  	 }
);

function showHide (){
	utah_dem_layer.visible = false;
	utah_flowAccumulation_layer.visible = false;
	utah_counties_layer.visible = false;
	snowtel_network_layer.visible = false;

	if(document.getElementById("Utah_DEM").checked){
		utah_dem_layer.visible = true;
	}
	if(document.getElementById("Utah_Accumulation").checked){
		utah_flowAccumulation_layer.visible = true;
	}
	if(document.getElementById("Utah_Counties").checked){
		 utah_counties_layer.visible = true;
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
