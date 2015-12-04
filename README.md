
# Venn Layout
A plugin for d3.js. 
It follows the D3’s new 4.0 module pattern [see Let’s Make a (D3) Plugin](http://bost.ocks.org/mike/d3-plugin/).

## Motivation
This layout is based on the excellent work of [Ben Frederickson](http://www.benfrederickson.com/better-venn-diagrams/). 
It tries to be in line with [d3.layout approach and declaration](https://github.com/mbostock/d3/wiki/Layouts). Layouts take a set of input data, apply an algorithm or heuristic, and output the resulting positions/shapes for a cohesive display of the data. 


One possible use case of this layout is to display a set of labelled nodes on their respective set as in the figure below: 
 
<div>
<img src="https://www.e-smile.org/blog/resources/images/vennLayout.png" width="600">
</div>

## How does it work ?
Venn sets are calculated on the basis of nodes `set` properties . 

Basically, it takes nodes data of this form : 
```js
    var data = [
        {"set":["A"],"name":"node_0"},
        {"set":["B"],"name":"node_1"},
        {"set":["B","A"],"name":"node_2"}
        {"set":["B","A"],"name":"node_3"}
        ]
```

and calculates Venn sets like : 
```js
 sets = [ 
        {sets: ['A'], size: 1, nodes : ['node_0']}, 
        {sets: ['B'], size: 1, nodes : ['node_1']},
        {sets: ['A','B'], size: 2, nodes ['node_2', 'node_3']}
        ];
```    

For calling and computing the layout : 
```js
var layout = d3.layout.venn().nodes(data);
```

By default, set area size are a count of nodes in the set.


## Examples
- [simple example](http://bl.ocks.org/christophe-g/517461e67a2aae17dd10)
- [interactive example](http://bl.ocks.org/christophe-g/2a491630dcc716fcb270)
- [with d3.layout force and foci ](http://bl.ocks.org/christophe-g/b6c3135cc492e9352797)
- [interactive, with area size as log of number of nodes](http://bl.ocks.org/christophe-g/c41f09c1c2bc71f10a20)

## Layout method and propeties 

<a name="venn" href="#venn">#</a> d3.layout.<b>venn</b>

Creates a new venn layout with the default settings: the default set accessor assumes each set data is an array of venn sets; the default size is 1×1; a default padding of 0 is applied; the default value accessor looks for `value` property; the layout is caculated on the basis of [venn.venn](https://github.com/benfred/venn.js/blob/master/src/layout.js) and nodes are packed inside their respective sets using [d3.layout.pack](https://github.com/mbostock/d3/wiki/Pack-Layout). Also by default, the size of each sets are a count of the number of nodes. 


<a name="nodes" href="#nodes">#</a> venn.<b>nodes</b>([<i>nodes</i>])

Runs the venn layout, returning the array of nodes. 
Each node is populated with the following attributes:

- `value` - the node value, as returned by the value accessor.
- `x` - the computed x-coordinate of the node position.
- `y` - the computed y-coordinate of the node position.
- `r` - the computed node radius.



<a name="sets" href="#sets">#</a> venn.<b>sets</b>()

Returns a [`d3.map`](https://github.com/mbostock/d3/wiki/Arrays#maps) of sets computed by the layout.
Each set has the folling properties: 
- `center` - x,y key-value object representing the center of the set erea ([computed by venn.computeTextCenter](https://github.com/benfred/venn.js/blob/master/src/diagram.js#L369) ).
- `innerRadius` - the radius of the inner circle.
- `d` - attrTween function for the path of the set area.
- `nodes` - array of nodes contained by this set.

Once the layout created and runned We can draw the venn diagram like this: 
```js
		colors = d3.scale.category10();
        var vennArea = svg.selectAll("g.venn-area")
            .data(layout.sets().values(), function(d) {
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

Returns key-value object of circles computed by they layout. Keys are are a concatenation of ordered set keys, joined with `[,]`. 


<a name="centres" href="#centres">#</a> venn.<b>centres</b>()

Returns key-value object with centers of all areas computed by the layout. 

<a name="setsAccessor" href="#setsAccessor">#</a> venn.<b>setsAccessor</b>([<i>setsAccessor</i>])

When <i>setAccessor</i> is specified, defines the way sets are accessed for nodes. By default, it is the `node.set` property. Otherwise, returns the current <i>setsAccessor</i>

<a name="setsSize" href="#setsSize">#</a> venn.<b>setsSize</b>([<i>setsSize</i>])

When <i>setSize</i> is specified, defines the way area size are modulated. By default, area set size are a count of the number of nodes they contain [exmple of layout using log of set area size](http://bl.ocks.org/christophe-g/c41f09c1c2bc71f10a20). 
If not specified, this method return the currnet `venn.setsSize` function.

<a name="packingStragegy" href="#packingStragegy">#</a> venn.<b>packingStragegy</b>([<i>packingStragegy</i>])

When <i>packingStragegy</i> is specified, defines the algorithm by which nodes' position are calculated. By default, d3.layout.pack is used for packing each node on the set area inner circle. 

If <i>packingStragegy</i>  is not specified, returns the current <i>packingStragegy</i>. [Other startegies are available](https://github.com/christophe-g/d3-venn#the-layout-also-exports-two-functions-for-packing-the-nodes-within-their-respective-venn-sets-)

<a name="packer" href="#packer">#</a> venn.<b>packer</b>()

Returns the current layout strategy ().

<a name="packingConfig" href="#packingConfig">#</a> venn.<b>packingConfig</b>([<i>packingConfig</i>])

Specify configs to be passed to the `venn.packingStrategy`. 

For example when the packing strategy is set to `venn.force' we can apply config to the force layout like : 
```js
    venn.packingConfig({
        charge: 0,
        ticker: function() {
          points.attr("cx", function(d) { 
              return d.x
            })
            .attr("cy", function(d) {
              return d.y
            })

        }
      })
    
    //start the force layout
    venn.packer().start()

```


<a name="value" href="#value">#</a> venn.<b>value</b>([<i>value</i>])

When <i>value</i> is specified, set the way node values is calculated. This function is passed to <i>packCircleFunction</i> when calulating node position and can be used to deal with different node size.

<a name="size" href="#size">#</a> venn.<b>size</b>([<i>size</i>])

If size is specified, sets the available layout size to the specified two-element array of numbers representing x and y. If size is not specified, returns the current size, which defaults to 1×1.

<a name="orientation" href="#orientation">#</a> venn.<b>orientation</b>([<i>orientation</i>])

Orientation of the venn layout. by default, `PI` / 2.

<a name="normalize" href="#normalize">#</a> venn.<b>normalize</b>([<i>normalize</i>])

Set normalize to `false` to prevent layout normalization. 


### The layout also exports two functions for packing the nodes within their respective venn sets : 

<a name="pack" href="#pack">#</a> venn.<b>pack</b>(<i>venn</i></i>)

This is the default algorithm for packing nodes.

<a name="force" href="#force">#</a> venn.<b>force</b>(<i>venn</i></i>)

Use a `d3.layout.force`, with foci at centers of each set eara.[an example is available here](http://bl.ocks.org/christophe-g/b6c3135cc492e9352797).

In addition to the usual properties of the `d3.layout.force`, this stategy can be further configures with : 

 - `collider` - a boolean value to resolve collision between nodes (default to `true`).
 - `maxRadius` - maximum radius for nodes used by the collider (default to `8`).
 - `padding` - padding between nodes (default to `3`).
 - `ticker` - a function called on every force layout tick. 


<a name="distribute" href="#distribute">#</a> venn.<b>distribute</b>(<i>venn</i>)

Using random distribution to put nodes inside their area [see an example here](http://bl.ocks.org/christophe-g/7985cf90d79a23ca2996#index). 
```js
    var layout = d3.layout.venn().
                    .packCircleFunction(d3.layout.venn.distribute);

```




## More
[more information soon](https://www.e-smile.org/blog/e-smile-dev/vennLayout)
