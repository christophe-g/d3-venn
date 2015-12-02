// function called from d3.layout.venn 
// used to pack child nodes insiside inner circle of a venn set.
function packCircles(set, valueFn) {
    var innerRadius = set.innerRadius,
        center = set.center,
        children = set.nodes,
        x = center.x - innerRadius ,
        y = center.y - innerRadius;

    d3.layout.pack()
        .value(valueFn)
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
}

export default packCircles