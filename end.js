(function(target, cname, name) {
  if (target) {
    target[name] = this[cname] && this[cname][name];

    for (var k in this[cname]) {
      if (k != name) {
        target[name][k] = this[cname][k];
      }
    }
    delete this[cname];
  }
}(this.d3 && this.d3.layout, 'd3_venn', 'venn'));
