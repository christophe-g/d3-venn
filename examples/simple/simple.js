var width = 600,
    height = 600,
    colors = d3.scale.category10();

var setChar = 'ABCDEFGHIJKLMN',
    charFn = i => setChar[i],
    setLength = 4,
    sets = d3.range(setLength).map(function(d, i) {
        return setChar[i]
    })


    


var dataLength = 180,
    ii = 0,
    data = d3.range(dataLength).map((d, i) => {
        var l = Math.floor((Math.random() * setLength / 3) + 1),
            set = [],
            c,
            i;
        for (i = -1; ++i < l;) {
            c = charFn(Math.floor((Math.random() * setLength)));
            if (set.indexOf(c) == -1) {
                set.push(c)
            }
        }
        return {
            set: set,
            name: 'set_' + ii++
        }
    });

var l = d3.layout.venn().size([width, height]).value(x=>1),

    ld = l.nodes(data);

var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

var nodes = svg.selectAll("g")
    .data(l.sets(), function(d) {
        return d.__key__;
    });


var venn = nodes.enter()
    .append('g')
    .attr("class", function(d) {
        return "venn-area venn-" +
            (d.sets.length == 1 ? "circle" : "intersection");
    })
    .attr('fill', function(d, i) {
        return colors(i)
    })


venn.append("path")
    .attr('d', function(d, i) {
        return d.d(1)
    })
    // .attr('fill', function(d,i) {return colors(i)} )
    .attr('opacity', 0.25)

venn.append("text")
    .attr("class", "label")
    .text(function(d) {
        return d.__key__;
    })
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("x", function(d) {
        return d.center.x
    })
    .attr("y", function(d) {
        return d.center.y
    });

var points = venn.selectAll("circle.node")
    .data(function(d) {
        return d.nodes
    })
    .enter()

points.append('circle')
	.attr('class', 'node')
    .attr("cx", function(d) {
        return d.x
    })
    .attr("cy", function(d) {
        return d.y
    })
    .attr('r', 3)


    

venn.append('circle')
	.attr('class', 'inner')
	.attr('fill', 'grey')
	.attr('opacity', 0.2)
    .attr("cx", function(d) {
        return d.center.x
    })
    .attr("cy", function(d) {
        return d.center.y
    })
    .attr('r', function(d){
    	return d.innerRadius
    })
