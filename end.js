(function(target, export_name, name) {
  if (target) {
    target[name] = this[export_name] && this[export_name][name];

    for (var k in this[export_name]) {
      if (k != name) {
        target[name][k] = this[export_name][k];
      }
    }
    delete this[export_name];
  }
}(this.d3 && this.d3.layout, 'd3_venn', 'venn'));
