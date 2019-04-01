function getData(d){
  var json_data;

  var req = $.ajax({
      url: "test.php",
      type: "post",
      data: {name: d.data.name},
      success: function(data){
          json_data = JSON.parse(data);
          //console.log(json_data);
      }
  })
  $.when(req).done(function(){
      console.log(json_data);
      var myData = [json_data[0].up, json_data[0].down, json_data[0].unused];

      var margin = {
          top:30,
          right: 30,
          bottom: 40,
          left: 50
      }
      var height = 500 - margin.top - margin.bottom;
      var width = 500 - margin.right - margin.left;
      var animateDuration = 1000;
      var animateDelay = 30;
      
      var tooltip = d3.select("body").append("div")
          .style("position", "absolute")
          .style("background", "#f4f4f4")
          .style("padding", "5 15px")
          .style("border", "1px #333 solid")
          .style("border-radius", "5px")
          .style("opacity", "0");

      var yScale = d3.scaleLinear()
          .domain([0, d3.max(myData)])
          .range([0, height]);

      var xScale = d3.scaleBand()
          .domain(d3.range(0, myData.length))
          .rangeRound([0, width]);

      var colors = d3.scaleLinear()
          .domain([0, myData.length])
          .range(["#90ee90", "#30c230"]);

      var myChart = d3.select("body").append("svg")
          .attr("id", "barchart")
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate("+margin.left+","+margin.top+")")
          .style("background", "#f4f4f4")
          .selectAll("rect")
          .data(myData)
          .enter().append("rect")
          .style("fill", function(d, i){
              return colors(i);
          })
          .attr("width", xScale.bandwidth())
          .attr("height", 0)
          .attr("x", function(d, i){
              return xScale(i);
          })
          .attr("y", height)
      .on("mouseover", function(d){
          d3.select(this).style("opacity", 0.5)
      })
      .on("mouseout", function(d){
          d3.select(this).style("opacity", 1);
      })

      myChart.transition()
          .attr("height", function(d){
              return yScale(d);
          })
          .attr("y",function(d){
              return height - yScale(d);
          })
          .duration(animateDuration)
          .delay(function(d,i){
              return i * animateDelay;
          })
          .ease(d3.easeElastic);
      
      var vScale = d3.scaleLinear()
          .domain([0, d3.max(myData)])
          .range([height, 0]);

      var hScale = d3.scaleBand()
          .domain(d3.range(0, myData.length))
          .rangeRound([0, width]);
      
      //Vertical axis
      var vAxis = d3.axisLeft(vScale)
          .ticks(5)
          .tickPadding(5);

      //Vertical Guide
      var vGuide = d3.select("svg#barchart")
          .append("g")
              vAxis(vGuide)
              vGuide.attr("transform", "translate("+margin.left+","+margin.top+")")
              vGuide.selectAll("path")
                  .style("fill", "none")
                  .style("stroke", "#000")
              vGuide.selectAll("line")
                  .style("stroke", "#000");

      //Vertical axis
      var hAxis = d3.axisBottom(hScale);


      //Vertical Guide
      var hGuide = d3.select("svg#barchart")
          .append("g")
          .attr("class", "x-axis")
              hAxis(hGuide)
              hGuide.attr("transform", "translate("+margin.left+","+ (height + margin.top) + ")")
              hGuide.selectAll("path")
                 .style("fill", "none")
                  .style("stroke", "#000")
              hGuide.selectAll("line")
                  .style("stroke", "#000");
          d3.select("g.x-axis")
            .selectAll("text")
            .filter(function(){
                return /^0/.test(d3.select(this).text())
            })
            .text("Up");
            d3.select("g.x-axis")
            .selectAll("text")
            .filter(function(){
                return /^1/.test(d3.select(this).text())
            })
            .text("Down");

            d3.select("g.x-axis")
            .selectAll("text")
            .filter(function(){
                return /^2/.test(d3.select(this).text())
            })
            .text("Unused");
        // d3.select("g.x-axis")
        //   .selectAll("text").remove();
        

  })
}