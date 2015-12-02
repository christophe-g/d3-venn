
# Venn Layout
A plugin for d3.js

## Motivation
This layout is based on the excellent work of [Ben Frederickson](http://www.benfrederickson.com/better-venn-diagrams/). It tries to be more in line with d3.layout approach and declaration (https://github.com/mbostock/d3/wiki/Layouts). 

One motivation is to display a set of labelled nodes on their respective set as in the figure below: 

<div>
<img src="https://www.e-smile.org/blog/resources/images/vennLayout.png" width="600">
</div>
## How does it work ?
Venn sets are calculated on the basis of nodes set properties. Like this: 
```js
var data = [{"set":["B"],"name":"set_0"},{"set":["C"],"name":"set_1"},{"set":["C"],"name":"set_2"},{"set":["B","A"],"name":"set_3"},{"set":["A"],"name":"set_4"},{"set":["B"],"name":"set_5"},{"set":["A"],"name":"set_6"}]
```
And to compute the layout  : 
```js
var layout = d3.layout.venn().nodes(data);
```
## Examples
- [simple example](http://bl.ocks.org/christophe-g/517461e67a2aae17dd10#index.html)
- [interactive example](http://bl.ocks.org/christophe-g/2a491630dcc716fcb270#index.html)

## Layout method and propeties 

<a name="venn" href="#venn">#</a> d3.layout.<b>venn</b>

Creates a new venn layout with the default settings: the default set accessor assumes each set data is an array of venn sets; the default size is 1×1; a default padding of 15 is applied; the default value accessor looks for value property; the layout is caculated on the basis of [venn.venn](https://github.com/benfred/venn.js/blob/master/src/layout.js) and nodes are packed inside their respective sets using [d3.layout.pack](https://github.com/mbostock/d3/wiki/Pack-Layout).


<a name="nodes" href="#nodes">#</a> venn.<b>nodes</b>([<i>nodes</i>])

Runs the venn layout, returning the array of nodes. 
Each node is populated with the following attributes:

- `value` - the node value, as returned by the value accessor.
- `x` - the computed x-coordinate of the node position.
- `y` - the computed y-coordinate of the node position.
- `r` - the computed node radius.



<a name="sets" href="#sets">#</a> venn.<b>sets</b>()

Returns and array of sets computed by the layout. 
Each set has the folling properties: 
- `center` - x,y key-value object represeneting the center of the set erea ([computed by venn.cmputeTextCenter](https://github.com/benfred/venn.js/blob/master/src/diagram.js#L369) ).
- `innerRadius` - the radius of the inner circle.
- `d` - attrTween function for the path of the set area.
- `nodes` - array of nodes contained by this set.

Once the layout created and runned We can draw the venn diagram like this: 
```js
		colors = d3.scale.category10();
        var vennArea = svg.selectAll("g.venn-area")
            .data(layout.sets(), function(d) {
                return d.__key__;
            });

        var vennEnter = vennArea.enter()
            .append('g')
            .attr("class", function(d) {
                return "venn-area venn-" +
                    (d.sets.length == 1 ? "circle" : "intersection");
            })
            .attr('fill', function(d, i) {
                return colors(i)
            })

        vennEnter.append('path')
            .attr('class', 'venn-area-path')
            .attr('d', function(d) {
                return d.d(1)
            });

        vennEnter.append('circle')
            .attr('class', 'inner')
            .attr('fill', 'grey');

        vennEnter.append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")

        vennArea.selectAll("text.label")
            .text(function(d) {
                return d.__key__;
            })
            .attr("x", function(d) {
                return d.center.x
            })
            .attr("y", function(d) {
                return d.center.y
            });
```

In case of a transition, we would use attrTween like this: 

```js
 vennArea.selectAll('path.venn-area-path').transition()
            .duration(isFirstLayout ? 0 : test.duration())
            .attrTween('d', function(d) {
                return d.d
            });

```

<a name="circles" href="#circles">#</a> venn.<b>circles</b>()

Returns key-value object of circles computed by they layout. Keys are are a concatenation of ordered set keys, joined with [,]. 


<a name="centres" href="#centres">#</a> venn.<b>centres</b>()

Returns key-value object with centers of all areas computed by they layout. 

<a name="setsAccessor" href="#setsAccessor">#</a> venn.<b>setsAccessor</b>([<i>setsAccessor</i>])

When <i>setAccessor</i> is specified, defines the way sets are accessed on nodes. By default, it is the `node.set` property. Otherwise, returns the current <i>setsAccessor</i>

<a name="packCircleFunction" href="#packCircleFunction">#</a> venn.<b>packCircleFunction</b>([<i>packCircleFunction</i>])

When <i>packCircleFunction</i> is specified, defines the algorithm by which nodes' position are calculated. By default, d3.layout.pack is used for pakcing each node on the set area inner circle. 

If <i>packCircleFunction</i>  is not specified, returns the current <i>packCircleFunction</i>.

<a name="value" href="#value">#</a> venn.<b>value</b>([<i>value</i>])

When <i>value</i> is specified, set the way node values is calculated. This function is passed to <i>packCircleFunction</i> when calulating node position and can be used to deal with different node size.

<a name="size" href="#size">#</a> venn.<b>size</b>([<i>size</i>])
If size is specified, sets the available layout size to the specified two-element array of numbers representing x and y. If size is not specified, returns the current size, which defaults to 1×1.

<a name="orientation" href="#orientation">#</a> venn.<b>orientation</b>([<i>orientation</i>])

Orientation of the venn layout. by default, `PI` / 2.

<a name="normalize" href="#normalize">#</a> venn.<b>normalize</b>([<i>normalize</i>])

Set normalize to `false` to prevent layout normalization. 

## More
[more information soon](https://www.e-smile.org/blog/e-smile-dev/vennLayout)