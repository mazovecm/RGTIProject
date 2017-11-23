rgti = window.rgti || {};
rgti.class = rgti.class || {};

rgti.class.Geometry = class Geometry {
  constructor (arg) {
    this.vertices = undefined;
    this.textures = undefined;
    this.normals = undefined;
    this.faces = undefined;
    this.objects = undefined;

    if (arg) {
      // Note: Non-empty constructor argument of type string
      // is taken as a geometry specification URL
      if (typeof(arg) === "string") {
        this.fetch_specs(arg)
          .then((res) => {
            this.process(res);
          })
          .catch((err) => {
            throw new Error(err);
          });
      }
      else {
        this.process(arg);
      }
    }
  }

  process (specs) {
    if (specs) {
      let cmd, idx;

      if (typeof(specs) === "string") {
        specs = specs.split("\n");
      }

      idx = 0;

      // Read and process every line of given specification
      specs.map((line) => {
        // Note: When splitting each specification line,
        // redundant white spaces are ignored
        line = line.trim()
          .split(/(\s+)/)
          .filter((str) => {
            return str.trim().length > 0;
          });

        if (line.length) {
          // console.log("Processing specification line " + idx + ": " + JSON.stringify(line));

          cmd = line[0];

          if (this[cmd]) {
            this[cmd](line.slice(1));
          }
          else {
            console.log("Unknown specification at line " + idx + ": " + JSON.stringify(line));
          }
        }
        else {
          console.log("Skipping empty specification line: " + idx);
        }

        idx += 1;
      });
    }
  }

  fetch_specs (arg) {
    return new Promise((resolve, reject) => {
      let req, field;

      if (typeof(arg) === "string") {
        arg = {
          http_req_method: "GET",
          url: arg
        };
      }

      req = new XMLHttpRequest();
      req.open(arg.http_req_method, arg.url);

      if (arg.http_header_fields) {
        Object.keys(arg.http_header_fields).forEach((name) => {
          field = {
            name: name,
            value: arg.http_header_fields[name]
          };

          req.setRequestHeader(field.name, field.value);
        });
      }

      req.onload = () => {
        if (req.status === 200) {
          resolve(req.response);
        }
        else {
          reject(new Error("Failed to fetch file: " + req.status));
        }
      };

      req.send();
    });
  }

  // Geometric vertices, with (x,y,z[,w]) coordinates; w is optional and defaults to 1.0
  // v 0.123 0.234 0.345 1.0
  v (specs) {
    if (specs.length !== 3) {
      throw new Error("Given vertex geometry specification is malformed");
    }

    // Optimization: vertex indices are aligned
    // with the "start with 1" index face specification
    this.vertices = this.vertices || [[]];

    specs = "[" + specs + "]";
    this.vertices.push(JSON.parse(specs));
  }

  // Vertex normals in (x,y,z) form; normals might not be unit vectors
  // vn 0.707 0.000 0.707
  vn (specs) {
    if (specs.length !== 3) {
      throw new Error("Given normal geometry specification is malformed");
    }

    // Optimization: normal indices are aligned
    // with the "start with 1" index face specification
    this.normals = this.normals || [[]];

    specs = "[" + specs + "]";
    this.normals.push(JSON.parse(specs));
  }

  // Parameter space vertices in ( u [,v] [,w] ) form; free form geometry statement
  // vp 0.310000 3.210000 2.100000
  // vp (specs) {};

  // Texture coordinates, in (u, v [,w]) coordinates; these will vary between 0 and 1, w is optional and defaults to 0
  // vt 0.500 1 [0]
  vt (specs) {
    if (specs.length !== 3) {
      throw new Error("Given texture geometry specification is malformed");
    }

    // Optimization: texture indices are aligned
    // with the "start with 1" index face specification
    this.textures = this.textures || [[]];

    specs = "[" + specs + "]";
    this.textures.push(JSON.parse(specs));
  }

  // Polygonal face element
  // f 1 2 3
  // f 3/1 4/2 5/3
  // f 6/4/1 3/5/3 7/6/5
  // f 7//1 8//2 9//3
  f (specs) {
    this.faces = this.faces || [];

    let f, elt, v, t, n, fv, ft, fn, v_ok, t_ok, n_ok;

    f = {
      vertices: [],
      textures: undefined,
      normals: undefined
    };

    fv = [];
    ft = [];
    fn = [];

    specs.map((field) => {
      elt = field.split("/");

      // Make sure face element specification is of appropriate length
      // (vertex, texture, normal)
      while (elt.length < 3) {
        elt.push("");
      }

      v = (elt[0] || undefined) && parseInt(elt[0]);
      t = (elt[1] || undefined) && parseInt(elt[1]);
      n = (elt[2] || undefined) && parseInt(elt[2]);

      // Check that all the required geometry information is available
      v_ok = (v === undefined) || (this.vertices !== undefined && v <= this.vertices.length);
      t_ok = (t === undefined) || (this.textures !== undefined && t <= this.textures.length);
      n_ok = (n === undefined) || (this.normals !== undefined && n <= this.normals.length);

      if (v_ok && t_ok && n_ok) {
        // Note: Not yet storing into face geometry definiton
        v && fv.push(this.vertices[v]);
        t && ft.push(this.textures[t]);
        n && fn.push(this.normals[n]);
      }
      else {
        throw new Error("Missing geometry information - vertices_ok: " + v_ok + ", textures_ok: " + t_ok + ", normals_ok: " + n_ok);
      }
    });

    if (fv.length === 3) {
      f.vertices = fv;
    }
    else if (fv.length !== 0) {
      throw new Error("Malformed face geometry vertex definition");
    }

    if (ft.length === 3) {
      f.textures = ft;
    }
    else if (ft.length !== 0) {
      throw new Error("Malformed face geometry textures definition");
    }

    if (fn.length === 3) {
      f.normals = fn;
    }
    else if (fn.length !== 0) {
      throw new Error("Malformed face geometry normals definition");
    }

    this.faces.push(f);
  }
};