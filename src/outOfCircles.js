import {
    SMALL
}
from "../venn.js/src/circleintersection.js";

//return true when the point is out of all circles
function outOfCircles(point, circles) {
    for (var i = 0; i < circles.length; ++i) {
        if (venn.distance(point, circles[i]) < circles[i].radius + SMALL) {
            return false;
        }
    }
    return true;
};

export default outOfCircles;