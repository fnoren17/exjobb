function main(value){
    d3.selectAll("svg").remove();

    var width = 900,
    height = 600,
    radius = (Math.min(width, height) / 2) - 10;

    var formatNumber = d3.format(",d");

    var x = d3.scaleLinear()
        .range([0, 2 * Math.PI]);

    var y = d3.scaleSqrt()
        .range([0, radius]);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var partition = d3.partition();

    var arc = d3.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y1)); });


    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    d3.json("json/"+value, function(error, root) {
        if (error) throw error;

        root = d3.hierarchy(root);
        root.sum(function(d) { return d.size; });
        svg.selectAll("path")
        .data(partition(root).descendants())
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) { 
            if(d.children){
                return color((d.children ? d : d.parent).data.name);
            } else {
                if(d.data.rank == "u"){
                    return "green";
                } else {
                    return "red";
                }
            }
         })
        .on("click", click)
        .on("mouseover", mouseover)
        //.on("mousemove", mousemove)
        .on("mouseout", mouseout)
        .append("title")
        .text(function(d) { return d.data.name + "\n" + formatNumber(d.value); });
    });

    function click(d) {
        svg.transition()
            .duration(750)
            .tween("scale", function() {
                var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                yd = d3.interpolate(y.domain(), [d.y0, 1]),
                yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
            })
            .selectAll("path")
            .attrTween("d", function(d) { return function() { return arc(d); }; });

        if(!d.children){
            getData(d);
        } else {
            removeBar();
        }
    }

    function mouseover(d){
        //Fade the segments
            d3.select(this)
                .style("opacity", 0.5)
        }

        
        function mouseout(d){
            d3.select(this)
                .style("opacity", 1);
        }

    d3.select(self.frameElement).style("height", height + "px");

    function removeBar(){
        d3.select("svg#barchart").remove();
    }
}