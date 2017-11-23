rgti = window.rgti || {};
rgti.class = rgti.class || {};

rgti.class.WebGL = class WebGL {
  constructor (geometry) {
    try {
      let elt;

      elt = $(document.createElement("canvas")).attr({
        id: "canvas"
      });

      this.canvas = elt[0];
      this.context = elt[0].getContext("webgl") || elt[0].getContext("experimental-webgl");
      this.geometry = geometry;

      this.reset();
    }
    catch(err) {
      throw new Error(err);
    }
  }

  reset () {
    let gl;

    gl = this.context;

    gl.clearColor(0,0,0,1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
};