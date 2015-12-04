/*
lib for node packing algorithm
*/
import {
  SMALL
}
from "../venn.js/src/circleintersection.js";
import {
  binder,
  applier
}
from "./getSet.js";

//return true when the point is out of all circles
function outOfCircles(point, circles) {
  for (var i = 0; i < circles.length; ++i) {
    if (venn.distance(point, circles[i]) < circles[i].radius + SMALL) {
      return false;
    }
  }
  return true;
}


// function called from d3.layout.venn 
// used to pack child nodes insiside inner circle of a venn set.
function pack(layout) {
  // var valueFn = layout.value();
  var packingConfig = layout.packingConfig();

  layout.sets().forEach(function(k,set) {
    // function pack(set, valueFn) {
    var innerRadius = set.innerRadius,
      center = set.center,
      children = set.nodes,
      x = center.x - innerRadius,
      y = center.y - innerRadius;

    applier(d3.layout.pack(), packingConfig)
      .size([innerRadius * 2, innerRadius * 2])
      .nodes({
        children: children
      });
    // translate the notes to the center    
    if (children) {
      children.forEach(function(n) {
        n.x += x;
        n.y += y;
      });
    }
  })
}

// function called from d3.layout.venn 
// used to randomly distribute child nodes insiside a venn set.
// d3.layout.venn.packCircles looks prettier.
function distribute(layout) {
  // var valueFn = layout.value(),
  var circles = layout.circles();

  layout.sets().forEach(function(k,set) {
    var queue = [],
      maxAttempt = 500,
      k,
      inCircles = [],
      outCircles = [];


    for (k in circles) {
      if (set.sets.indexOf(k) > -1) {
        inCircles.push(circles[k])
      } else {
        outCircles.push(circles[k])
      }
    }

    // distanceToCircles.set(set.__key, computeDistanceToCircles(set))
    set.nodes.map(function(n, i) {
      var attempt = 0,
        candidate = null;

      if (i == 0) { // first node centered
        n.x = textCentres[set.__key__].x;
        n.y = textCentres[set.__key__].y;
        queue.push(n)
      } else {
        while (!candidate && (attempt < maxAttempt)) {
          var i = Math.random() * queue.length | 0,
            s = queue[i],
            a = 2 * Math.PI * Math.random(),
            r = Math.sqrt(Math.random() * ((innerRadius * innerRadius) + (10 * 10))),
            p = {
              x: s.x + r * Math.cos(a),
              y: s.y + r * Math.sin(a)
            };
          attempt++;
          if (venn.containedInCircles(p, inCircles) && (outOfCircles(p, outCircles))) {
            candidate = p;
            queue.push(p)
          }

        }
        if (!candidate) {
          console.warn('NO CANDIDATE')
          candidate = {
            x: textCentres[set.__key__].x,
            y: textCentres[set.__key__].y
          }
        }
        n.x = candidate.x;
        n.y = candidate.y;

        nodes.push(n);
      }
    });
  })
}

// apply a d3.fore layout with foci on venn area center to set foci
// d3.layout.venn.packCircles looks prettier.
function force(layout, data) {

  var force = layout.packer()
  if (!force) {
    force = d3.layout.force();
    binder(force, {
    	padding : 3,
    	maxRadius : 8,
      collider : true,
      ticker: null

    });
  }

  var packingConfig = layout.packingConfig(),
    size = layout.size(),
    sets = layout.sets(),
   
    padding = force.padding(), // separation between nodes
    maxRadius = force.maxRadius(),
    collider = force.collider;
  // foci = d3.map({}, function(d) {
  //   return d.__key__
  // });

  // layout.sets().forEach(function(set) {
  //   foci.set(set.__key__, set.center);
  // })

  applier(force, packingConfig)
    .nodes(data)
    .links([])
    .gravity(0)
    .charge(0)
    .size(size)
    .on('start', init)
    .on('tick', tick)
    
  function init(e) {
    data.forEach(function(d) {
    	var center = sets.get(d.__setKey__).center;
      d.x = d.x ? d.x * 1 : center.x;
      d.y = d.y ? d.y * 1 : center.y;
    })
  }

  function tick(e) {
    var ticker;
    data
      .forEach(gravity(.2 * e.alpha))
    
     if(collider) {
     data
    	 	.forEach(collide(.5))
		}
    if (ticker = force.ticker()) {
      ticker(layout)
    }
  }
    // Move nodes toward cluster focus.
    function gravity(alpha) {
      return function(d) {
        var center = sets.get(d.__setKey__).center;
        d.y += (center.y - d.y) * alpha;
        d.x += (center.x - d.x) * alpha;
     };
    }
    // Resolve collisions between nodes.
    function collide(alpha) {
      var  quadtree = d3.geom.quadtree(data);
      return function(d) {
        var r = d.r + maxRadius + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.r + quad.point.r + (d.__setKey__ !== quad.point.__setKey__) * padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
    return force;

  }

  export {
    pack, distribute, force
  }
