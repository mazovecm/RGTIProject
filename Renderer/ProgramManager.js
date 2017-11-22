Programs = {};

Programs.PHONG = {
    vertex: "phong_vertex",
    fragment: "phong_fragment"
};

class ProgramManager {

    constructor(gl) {
        this.compiledPrograms = {};

        for (let shader_prog in Programs) {
            if (Programs.hasOwnProperty(shader_prog)) {
                this._initShaderProgram(gl, Programs[shader_prog]);
            }
        }
    }

    getProgram(program_meta) {
        if (!this.compiledPrograms.hasOwnProperty(program_meta)) {
            throw "Could not find requested program."
        }

        return this.compiledPrograms[program_meta];
    }

    _initShaderProgram(gl, program_meta) {
        let vertex_shader = this._getShader(gl, program_meta.vertex);
        let fragment_shader = this._getShader(gl, program_meta.fragment);

        let shader_program = gl.createProgram();

        gl.attachShader(shader_program, vertex_shader);
        gl.attachShader(shader_program, fragment_shader);
        gl.linkProgram(shader_program);

        if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
            throw "Could not initialise shaders";
        }

        shader_program._uniforms = this._initUniformSetter(gl, shader_program);
        shader_program._attributes = this._initAttributeSetter(gl, shader_program);

        this.compiledPrograms[program_meta] = shader_program;
    }

    _getShader(gl, id) {
        let shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        let str = "";
        let k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType === 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        let shader;
        if (shaderScript.type === "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type === "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    _initAttributeSetter(gl, program) {
        let attributeSetter = {};

        let n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < n; i++) {
            // Retrieve attribute name
            const info = gl.getActiveAttrib(program, i);
            const location = gl.getAttribLocation(program, info.name);

            // Create attribute setter function
            attributeSetter[info.name] = {};
            attributeSetter[info.name]['set'] = function (buffer, item_size) {
                gl.enableVertexAttribArray(location);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.vertexAttribPointer(location, item_size, gl.FLOAT, false, 0, 0);
            };

            // Create attribute pointer freeing function
            attributeSetter[info.name]['free'] = function () {
                gl.disableVertexAttribArray(location);
            };
        }

        return attributeSetter;
    }

    _initUniformSetter(gl, program) {
        let uniformSetter = {};

        let n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (let i = 0; i < n; i++) {
            // Fetch uniform info and location
            const info = gl.getActiveUniform(program, i);
            const location = gl.getUniformLocation(program, info.name);

            uniformSetter[info.name] = {};

            switch (info.type) {
                case gl.FLOAT:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniform1f(location, value);
                    };
                    break;

                case gl.FLOAT_VEC2:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniform2f(location, value[0], value[1]);
                    };
                    break;

                case gl.FLOAT_VEC3:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniform3f(location, value[0], value[1], value[2]);
                    };
                    break;

                case gl.FLOAT_VEC4:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    };
                    break;

                case gl.FLOAT_MAT3:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniformMatrix3fv(location, false, value);
                    };
                    break;
                case gl.FLOAT_MAT4:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniformMatrix4fv(location, false, value);
                    };
                    break;

                case gl.INT:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniform1i(location, value);
                    };
                    break;

                case gl.INT_VEC2:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniform2i(location, value[0], value[1]);
                    };
                    break;
                case gl.INT_VEC3:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniform3i(location, value[0], value[1], value[2]);
                    };
                    break;
                case gl.INT_VEC4:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                    };
                    break;
                case gl.BOOL:
                    uniformSetter[info.name]['set'] = function (value) {
                        gl.uniform1f(location, value);
                    };
                    break;
                case gl.SAMPLER_2D:
                    uniformSetter[info.name]['set'] = function (texture, index) {
                        gl.activeTexture(gl.TEXTURE0 + index);
                        gl.bindTexture(gl.TEXTURE_2D, texture);
                        gl.uniform1i(location, index);
                    };
                    break;
            }
        }

        return uniformSetter;
    }
}