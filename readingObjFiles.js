class All_data {
    constructor(file_name) {
        this.file_name = file_name;
        this.vertices = [];
        this.normals = [];
        this.textures = [];
        this.indices = [];
    }

    set set_vertices(array) {
        this.vertices = array;
    }
    set set_normals(array) {
        this.normals = array;
    }
    set set_textures(array) {
        this.textures = array;
    }
    set set_indices(array) {
        this.indices = array;
    }
}

function read_obj_files(file, callback) {
    var xhr = new XMLHttpRequest();
    // Odprem .obj datoteko
    xhr.open("GET", file, false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}




var all_data = new All_data("Grass01.obj");
read_obj_files("Grass01.obj", function (data) {
    var vertices = [];
    var textures = [];
    var normals = [];
    var indices = [];

    var lines = data.split("\n");

    var VERTEX_RE = /^v\s/;
    var NORMAL_RE = /^vn\s/;
    var TEXTURE_RE = /^vt\s/;
    var INDICE_RE = /^f\s/;
    var F_TYPE_1 = /^[0-9]+\/[0-9]+\.*/;
    var F_TYPE_2 = /^[0-9]+\/\/[0-9]+\.*/;
    var WHITESPACE_RE = /\s+/;

    for (var i = 0; i < lines.length; i++) {
        // console.log(lines[i]);
        var line = lines[i].trim();
        var elements = line.split(WHITESPACE_RE);
        elements.shift();

        if (VERTEX_RE.test(line))
            for (var j = 0; j < elements.length; j++)
                vertices.push(parseFloat(elements[j]));

        else if (NORMAL_RE.test(line))
            for (var j = 0; j < elements.length; j++)
                normals.push(parseFloat(elements[j]));

        else if (TEXTURE_RE.test(line))
            for (var j = 0; j < elements.length; j++)
                textures.push(parseFloat(elements[j]));

        else if (INDICE_RE.test(line)) {
            if (F_TYPE_1.test(elements)) {
                for (var j = 0; j < elements.length; j++) {
                    var els = elements[j].split("/");
                    for (var k = 0; k < els.length; k++)
                        indices.push(parseFloat(els[k]));
                }
                //console.log(elements);
            }
            else if (F_TYPE_2.test(elements)){
                for (var j = 0; j < elements.length; j++) {
                    var els = elements[j].split("//");
                    for (var k = 0; k < els.length; k++)
                        indices.push(parseFloat(els[k]));
                }
                //console.log(elements);
            }
        }
    }



    all_data.set_vertices = vertices;
    all_data.set_normals = normals;
    all_data.set_textures = textures;
    all_data.set_indices = indices;


});

//console.log(all_data.vertices);








