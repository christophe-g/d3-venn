// function called from d3.layout.venn 
// used to randomly distribute child nodes insiside a venn set.
// d3.layout.venn.packCircles looks prettier.
import outOfCircles from "./outOfCircles.js"; 

function distributeCircles (set, valueFn, circles) {

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
};

export default distributeCircles;