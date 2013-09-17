DataDB = new Meteor.Collection(null);

if(Meteor.isClient) {

  function getFields() {
    var unique_data_sets = unique(data.session.map(function(d) {
      return d.name;
    }));
    Session.set("data_set", unique_data_sets[0])
    for(var i = 0; i < unique_data_sets.length; i++) {
      var unique_data_sets2 = unique(data.session.filter(function(d) { 
        return d.name == unique_data_sets[i]
      }).map(function(d) { 
        return d.type;
      }))
      for (var j = 0; j < unique_data_sets2.length; j++) {
        var unique_data_sets3 = unique(data.session.filter(function(d) {
          return d.name == unique_data_sets[i] && d.type == unique_data_sets2[j]
        }).map(function(d) {
          return d.num;
        }))
        DataDB.insert({
        data_set: unique_data_sets[i],
        data_set2: unique_data_sets2[j],
        data_set3: unique_data_sets3,
      })
      }
    };
  }

  // data set menu ("animal")
  Template.data_set_menu.data_sets = function() {
    return DataDB.find({}, {
      sort: {
        data_set: 1
      }
    });
  }
  Template.data_set_menu.selected = function() {
    return Session.equals("data_set", this.data_set) ? "active" : '';
  }
  Template.data_set_menu.events({
    'click .data_set_menu_item': function() {
      Session.set("data_set", this.data_set)
    }
  })
  Template.loaddata.data_set = function() {
    return Session.get("data_set")
  }

  // data set menu2 ("data set type")
  Template.data_set_menu2.data_sets2 = function() {
    var returnArray = new Array();
    var foo = DataDB.find({
      data_set: Session.get("data_set")
    }).map(function(d) {
      return d.data_set2
    })
    if(foo.length > 0) {
      //if(foo.length>1) {
      //  foo = foo[0];
      //}
      for(var i = 0; i < foo.length; i++)
        returnArray[i] = {
          "data_set2": foo[i]
        };
      }
      return returnArray
  }
  Template.data_set_menu2.selected = function() {
    return Session.equals("data_set2", this.data_set2) ? "active" : '';
  }
  Template.data_set_menu2.events({
    'click .data_set_menu_item2': function() {
      Session.set("data_set2", this.data_set2)
      Session.set("feature", 0)
    }
  })
  Template.loaddata.data_set2 = function() {
    return Session.get("data_set2")
  }

  // data set menu3 ("date / vol num")
  Template.data_set_menu3.data_sets3 = function() {
    var returnArray = new Array();
    var foo = DataDB.find({
      data_set: Session.get("data_set"),
      data_set2: Session.get("data_set2")
    }).map(function(d) {
      return d.data_set3
    })
    if(foo.length > 0) {
      foo = foo[0];
      for(var i = 0; i < foo.length; i++)
        returnArray[i] = {
          "data_set3": foo[i]
        };
      }
      return returnArray
  }
  Template.data_set_menu3.selected = function() {
    return Session.equals("data_set3", this.data_set3) ? "active" : '';
  }
  Template.data_set_menu3.events({
    'click .data_set_menu_item3': function() {
      Session.set("data_set3", this.data_set3)
    }
  })
  Template.loaddata.data_set3 = function() {
    return Session.get("data_set3")
  }

  Session.set("data_set3",0)


	// what to do on each render of the main plot 
  Template.loaddata.rendered = function() {

    // set up the main plot space
    var wRoi = 600
    var hRoi = 600

    var wFilt = 400
    var hFilt = 150

    var wNl = 200
    var hNl = 200

    var wMag = 200
    var hMag = 200

    var roiContainer = d3.select("#roiContainer")
    .append("svg:svg")
    .attr("width", wRoi)
    .attr("height", hRoi)
    .attr("pointer-events", "all")

    roiContainer
    .append('svg:rect')
    .attr('width', wRoi)
    .attr('height', hRoi)
    .attr('fill', d3.rgb(180, 180, 180))

    var filtContainer = d3.select("#filtContainer")
    .append("svg:svg")
    .attr("width",wFilt)
    .attr("height",hFilt)
    .append("svg:g")

    filtContainer
    .append('svg:rect')
    .attr('width', wFilt)
    .attr('height', hFilt)
    .attr('fill', d3.rgb(180, 180, 180))

    var nlContainer1 = d3.select("#nlContainer1")
    .append("svg:svg")
    .attr("width",wNl)
    .attr("height",hNl)
    .append("svg:g")

    nlContainer1
    .append('svg:rect')
    .attr('width', wNl)
    .attr('height', hNl)
    .attr('fill', d3.rgb(180, 180, 180))

    var nlContainer2 = d3.select("#nlContainer2")
    .append("svg:svg")
    .attr("width",wNl)
    .attr("height",hNl)
    .append("svg:g")

    nlContainer2
    .append('svg:rect')
    .attr('width', wNl)
    .attr('height', hNl)
    .attr('fill', d3.rgb(180, 180, 180))

    var magContainer = d3.select("#magContainer")
    .append("svg:svg")
    .attr("width",wMag)
    .attr("height",hMag)
    .append("svg:g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")

    var roiSz = 6;

    var xRoi = d3.scale.linear().domain([-25, 575]).range([0, wRoi]);
    var yRoi = d3.scale.linear().domain([-50, 550]).range([0, hRoi]);
    var xFilt = d3.scale.linear().domain([2, 0]).range([10, wFilt-10]);
    var yFilt = d3.scale.linear().domain([-0.05, 0.1]).range([hFilt, 0]);
    var xNl1 = d3.scale.linear().domain([-0.003, 0.003]).range([10, wNl-10]);
    var yNl1 = d3.scale.linear().domain([0, 1]).range([hNl-15,0]);
    var xNl2 = d3.scale.linear().domain([-10, 50]).range([10, wNl-10]);
    var yNl2 = d3.scale.linear().domain([0, 1]).range([hNl-15,0]);
    var clrsFilt = d3.scale.category10()
    var r2Color = d3.scale.linear().domain([0, 1]).range([clrsFilt(0),clrsFilt(1)])

    function update() {

      data_set = Session.get("data_set");
      data_set2 = Session.get("data_set2");
      data_set3 = Session.get("data_set3");

      foo = data.session.filter(function(d) {
        return d.name == data_set && d.type == data_set2 && d.num == data_set3
      });

      v = foo[0];

      var rois = roiContainer.selectAll("circle.rois")
      .data(v.rois)
      rois.enter().append("circle")
      .attr("class","rois")
      .attr("cx", (function(d) {return xRoi(d.x);}))
      .attr("cy", (function(d) {return yRoi(d.y);}))
      .attr("r", function(d) { return Math.max(d.rtest,0.01)*30 + 2; })
      //.attr("r", 5)
      .on("mouseover",mover)
      .on("mouseout",mout)
      //.style("fill-opacity", function(d) { return d.r2train + 0.2; })
      //.style("fill",function(d) { return r2Color(d.norm[1]); })
      .style("fill",function(d) { return r2Color(d.norm[1]/d3.sum(d.norm)); });
      
      var stack = d3.layout.stack().order("reverse")
      .out(function(d, y0, y) { d.tmp = y0; })

      var pie = d3.layout.pie()
      .value(function(d) { return d.value; });

      var filtLine = d3.svg.line()
      .x(function(d) { return xFilt(d.x); })
      .y(function(d) { return yFilt(d.y); });

      var filtArea = d3.svg.area()
      .x(function(d) { return xFilt(d.x); })
      .y0(function(d) { return yFilt(0); })
      .y1(function(d) { return yFilt(0 + d.y); });

      var nlLine1 = d3.svg.line()
      .x(function(d) { return xNl1(d.x); })
      .y(function(d) { return yNl1(d.y); });

      var nlLine2 = d3.svg.line()
      .x(function(d) { return xNl2(d.x); })
      .y(function(d) { return yNl2(d.y); });

      var magArc = d3.svg.arc()
      .outerRadius(50)

      var ticksFormat = d3.format(".1r")

      var xAxisFilt = d3.svg.axis()
      .scale(xFilt)
      .tickFormat(ticksFormat)
      .orient("bottom")
      .ticks(4);

      filtContainer.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + 125 + ")")
      .call(xAxisFilt)
      .append("text")
      .attr("y", -6)
      .text("Time");

      var xAxisNl1 = d3.svg.axis()
      .scale(xNl1)
      .tickFormat(ticksFormat)
      .orient("bottom")
      .ticks(4);

      nlContainer1.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + 180 + ")")
      .call(xAxisNl1)
      .append("text")
      .attr("y", -6)
      .text("delta curvature");

      var xAxisNl2 = d3.svg.axis()
      .scale(xNl2)
      .tickFormat(ticksFormat)
      .orient("bottom")
      .ticks(4);

      nlContainer2.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + 180 + ")")
      .call(xAxisNl2)
      .append("text")
      .attr("y", -6)
      .text("whisker angle");

      function mover(d) {

        var filt = new Array();
        for (var i = 0; i < 2; i++)
        {
          var filtSub = new Array();
          for (var j = 0; j < v.rois[0].time.length; j++)
          {
            if (v.rois[0].feature[j] == i+1)
            {
              filtSub.push({x: v.rois[d.num-1].time[j], y: v.rois[d.num-1].weight[j]})
            }
          }
          filt.push(filtSub);
        }

        var nl1 = new Array()
        for (var i = 0; i < v.rois[0].f[0].x.length; i++)
        {
          nl1.push({x: v.rois[d.num-1].f[0].x[i], y: v.rois[d.num-1].f[0].y[i]})
        }

        var nl2 = new Array()
        for (var i = 0; i < v.rois[0].f[1].x.length; i++)
        {
          nl2.push({x: v.rois[d.num-1].f[1].x[i], y: v.rois[d.num-1].f[1].y[i]})
        }

        var mags = new Array()
        for (var i = 0; i < v.rois[0].frac.length; i++)
        {
          mags.push({value: v.rois[d.num-1].frac[i]})
        }

        console.log(pie(mags))

        var weights = filtContainer.selectAll("path.filtArea")
        .data(stack(filt))
        weights.enter().append("path")
        weights.transition().duration(500)
        .attr("d", filtArea)
        .attr("class","filtArea")
        .style("fill",function(d, i) { return clrsFilt(i); })
        .style("fill-opacity", .5);
        weights.exit().remove()

        var weightsLine = filtContainer.selectAll("path.filtLine")
        .data(stack(filt))
        weightsLine.enter().append("path")
        weightsLine.transition().duration(500)
        .attr("d",filtLine)
        .attr("class","filtLine")
        .style("stroke",function(d, i) { return clrsFilt(i); })
        weightsLine.exit().remove()

        var nlLinePlot1 = nlContainer1.selectAll("path.nlLine1")
        .data([nl1])
        nlLinePlot1.enter().append("path")
        nlLinePlot1.transition().duration(500)
        .attr("d",nlLine1)
        .attr("class","nlLine1")
        .style("stroke", function(d,i) {return clrsFilt(0); })
        .style("opacity", v.rois[d.num-1].norm[0]*10 + 0.1)
        nlLinePlot1.exit().remove()

        var nlLinePlot2 = nlContainer2.selectAll("path.nlLine2")
        .data([nl2])
        nlLinePlot2.enter().append("path")
        nlLinePlot2.transition().duration(500)
        .attr("d",nlLine2)
        .attr("class","nlLine2")
        .style("stroke", function(d,i) {return clrsFilt(1); })
        .style("opacity", v.rois[d.num-1].norm[1]*10 + 0.1)
        nlLinePlot2.exit().remove()

        var magPlot = magContainer.selectAll("path.magSlice")    
        .data(pie(mags))                         
        magPlot.enter().append("path")
        .attr("d", magArc)
        .attr("class","magSlice")
        .attr("fill", function(d, i) { return clrsFilt(i); } ) 
        magPlot.exit().remove()      

        var short = d3.format(".2g");

        $("#pop-up").fadeOut(100,function () {
                  // Popup content
                  $("#pop-desc").html("ROI# "+d.id+"<br>R2 train: "+short(d.rtrain)+"<br> R2 test: "+short(d.rtest) +"<br> p kappa: " + short(d.krpval) + "<br> r kappa: " + short(d.krcv) + "<br> p theta: " + short(d.trpval) + "<br> r theta: " + short(d.trcv));
                  // Popup position
                  $("#pop-up").fadeIn(100);
                });

      }

      function mout(d) {

        //filtContainer.selectAll(".filtArea").remove()
        //filtContainer.selectAll(".filtLine").remove()
        //filtContainer.selectAll(".axis").remove()
        var magPlot = magContainer.selectAll("path.magSlice") 
        .remove()

        $("#pop-up").fadeOut(50);
      }

    }

    d3.json("8-8-2013-all-volumetric.json", function(d) {
      data = d;
      if (DataDB.find().count() < 1)
        {getFields()};
      update();
    })

  }

}



if (Meteor.isServer) {
  Meteor.startup(function () {

  });

}



function unique(d) {
  var o = {},
    i, l = d.length,
    r = [];
  for(i = 0; i < l; i += 1) o[d[i]] = d[i];
  for(i in o) r.push(o[i]);
  return r;
};