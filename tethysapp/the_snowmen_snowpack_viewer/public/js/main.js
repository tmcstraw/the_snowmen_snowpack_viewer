var map;
var utah_dem_layer;
var utah_flowAccumulation_layer;
var utah_counties_layer;
var snowtel_network_layer;
var add_wms;

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

  ], function showHide (Map, MapImageLayer,FeatureLayer, GraphicsLayer, Graphic, Point, Geoprocessor, LinearUnit, FeatureSet, MapView, add_wms) {
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

	  wms_layer = new MapImageLayer({
	        url: "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/Jan1_TestUpload/MapServer",
	        });
	  map.add(wms_layer);

	  $('#select_date').on('change', function () {
      add_wms();
      });


      add_wms = function(){
        // gs_layer_list.forEach(function(item){
        map.remove(wms_layer);
        var store_name = $("#select_date").find('option:selected').val();
        var layer_url = "http://geoserver2.byu.edu/arcgis/rest/services/The_SnowMen_FS/"+store_name+"_Raster/MapServer";


        wms_layer = new MapImageLayer({
            url: layer_url,
        });

        map.add(wms_layer);

      };



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
   }

);

function showHide (){

	snowtel_network_layer.visible = false;

	if(document.getElementById("Snotel_Stations").checked){
		 snowtel_network_layer.visible = true;
	}
}

function showanimationmodal() {
    $("#animationmod").modal('show')
}
function hideanimationmodal() {
    $("#animationmod").modal('hide')
}

