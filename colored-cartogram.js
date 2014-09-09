function coloredCartogram() {
/* assumes https://github.com/shawnbot/d3-cartogram/ is loaded 
requires topojson, d3
*/

var margin = {top: 10, right: 20, bottom: 20, left: 20},
    width = 300,
    height = 450,
    colorScale = d3.scale.linear(),
    topology = null,
    objects = null,
    dataKey = function (d) { return d[0] },
    color = function (d) { return d[1] },
    size = function (d) { return d[2] },
    geomKey = function (geom) { return geom.id; };

    projection = d3.geo.albers() //standard projection centered in germany
        .center([0, 51.2])
        .rotate([-10.8, 0])
        .parallels([47, 55])
        .scale(3000)
        .translate([width / 2, height / 2]);


function cartogram(selection) {
    
    selection.each(function (data) {
        
//        var layer = topojson.feature(topology, topology.objects[objects]);
        
        //select svg if existing
        var svg = d3.select(this).selectAll("svg").data([data]);

        //otherwise create:
        var gEnter = svg.enter().append("svg").append("g");
        //console.log(topology);
        svg.attr("width", width)
            .attr("height", height);
        
        var g = svg.select("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var sizeMap = d3.map();
        data.forEach(function (d) {
            sizeMap.set(dataKey(d), size(d));
        });
        
        /* Here begins the part that wraps the API of
         * d3-cartogram, which is why the names are
         * redundant
         */
        var cartoGenerator = d3.cartogram()
            .projection(projection)
            .value(function (geom) { 
                return sizeMap.get(geom.id);
        });
       
       var objectGeoms = topology.objects[objects].geometries;
       objectGeoms.forEach(function (geom) { geom.id = geomKey(geom); });
       var cartoElems = cartoGenerator(topology, objectGeoms);
       console.log(cartoElems);
      
        g.selectAll("path")
         .data(cartoElems.features)
         .enter().append("path")
         .attr("d", cartoGenerator.path);
    });
}

//takes in a topojson
cartogram.topology = function (value) {
    if (!arguments.length) return topology;
    topology = value;
    return cartogram;
}

//takes the name of one of the objects in the topojson
cartogram.objects = function (value) {
    if (!arguments.length) return objects;
    objects = value;
    return cartogram;
}

cartogram.projection = function (value) {
    if (!arguments.length) return projection;
    projection = value;
    return cartogram;
}

cartogram.dataKey = function (value) {
    if (!arguments.length) return dataKey;
    dataKey = value;
    return cartogram;
}
cartogram.color = function (value) {
    if (!arguments.length) return color;
    color = value;
    return cartogram;
}
cartogram.size = function (value) {
    if (!arguments.length) return size;
    size = value;
    return cartogram;
}
cartogram.geomKey = function (value) {
    if (!arguments.length) return geomKey;
    geomKey = value;
    return cartogram;
}


return cartogram;
}