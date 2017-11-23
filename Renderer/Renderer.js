class Renderer {

    constructor(webgl) {
        let canvas, context;

        canvas = webgl.canvas;
        context = webgl.context;

        //this._gl = canvas.getContext("webgl2");

        function logGLCall(functionName, args) {
            console.log("gl." + functionName + "(" +
                WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
        }

        function validateNoneOfTheArgsAreUndefined(functionName, args) {
            for (var ii = 0; ii < args.length; ++ii) {
                if (args[ii] === undefined) {
                    console.error("undefined passed to gl." + functionName + "(" +
                        WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
                }
            }
        }

        function logAndValidate(functionName, args) {
            //logGLCall(functionName, args);
            //validateNoneOfTheArgsAreUndefined (functionName, args);
        }

        function throwOnGLError(err, funcName, args) {
            throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
        }

        this._gl = context;
        // this._gl = WebGLDebugUtils.makeDebugContext(this._gl, throwOnGLError, logAndValidate);

        this._gl.enable(this._gl.DEPTH_TEST);
        this._gl.depthFunc(this._gl.LEQUAL);
        this._gl.frontFace(this._gl.CCW);
        this._gl.viewport(0, 0, canvas.width, canvas.height);
        this._gl.clearColor(0, 0, 0, 1);
        this._gl.clearDepth(1);

        this._program_manager = new ProgramManager(this._gl);
        this._attribute_manager = new AttributeManager(this._gl);

        this._dirLights = [];
        this._pointLights = [];
        this._ambient = new GLMath.Color();
        this._mesh_objects = [];
    }

    render(scene, camera) {

        scene.updateMatrixWorld();
        camera.updateMatrixWorld();

        camera.world_matrix_inverse.getInverse(camera.matrix_world);

        // Clear render arrays.
        this._dirLights.length = 0;
        this._pointLights.length = 0;
        this._ambient.setRGB(0, 0, 0);
        this._mesh_objects.length = 0;

        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

        this._parseScene(scene);

        this._updateMeshObjects(camera);

        this._renderObjects(camera);
    }

    _renderObjects(camera) {
        for (let i = 0; i < this._mesh_objects.length; i++) {
            let program = this._program_manager.getProgram(this._mesh_objects[i].program);
            this._gl.useProgram(program);

            this._setUniforms(program, this._mesh_objects[i], camera);

            this._setAttributes(program, this._mesh_objects[i]);

            let indexBuffer = this._attribute_manager.getBuffer(this._mesh_objects[i].indices);
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            this._gl.drawElements(this._gl.TRIANGLES, this._mesh_objects[i].indices.data.length, this._gl.UNSIGNED_INT, 0);
        }

    }

    _setUniforms(program, object, camera) {
        let uniform_setter = program._uniforms;

        // Set matrices.
        if (uniform_setter.pmat !== undefined) {
            uniform_setter.pmat.set(camera.projection_matrix.elements);
        }

        if (uniform_setter.mvmat !== undefined) {
            uniform_setter.mvmat.set(object.model_view_matrix.elements);
        }

        if (uniform_setter.nmat !== undefined) {
            uniform_setter.nmat.set(object.normal_matrix.elements);
        }

        // Set lights
        this._setLights(uniform_setter, object);
        // Set material
        this._setMaterial(uniform_setter, object);
    }

    _setLights(uniform_setter, object) {
        if (uniform_setter["ambient"] !== undefined) {
            uniform_setter["ambient"].set([Math.max(1.0, this._ambient.r), Math.max(1.0, this._ambient.g), Math.max(1.0, this._ambient.b)]);
        }


        // DIRECTIONAL LIGHTS
        for (let i = 0; i < object.program.max_dir_lights; i++) {
            let prefix = "dir_lights[" + i + "]";

            if (this._dirLights.length > i) {
                if (uniform_setter[prefix + ".direction"]) {
                    uniform_setter[prefix + ".direction"].set(this._dirLights[i].direction.toArray());
                }
                if (uniform_setter[prefix + ".color"]) {
                    uniform_setter[prefix + ".color"].set(this._dirLights[i].color.toArray());
                }
                if (uniform_setter[prefix + ".intensity"]) {
                    uniform_setter[prefix + ".intensity"].set(this._dirLights[i].intensity);
                }
            }
            else {
                if (uniform_setter[prefix + ".direction"]) {
                    uniform_setter[prefix + ".direction"].set([0, 1, 0]);
                }
                if (uniform_setter[prefix + ".color"]) {
                    uniform_setter[prefix + ".color"].set([0, 0, 0]);
                }
                if (uniform_setter[prefix + ".intensity"]) {
                    uniform_setter[prefix + ".intensity"].set([0]);
                }
            }
        }

        // POINT LIGHTS
        for (let i = 0; i < object.program.max_point_lights; i++) {
            let prefix = "point_lights[" + i + "]";

            if (this._pointLights.length > i) {
                if (uniform_setter[prefix + ".position"]) {
                    uniform_setter[prefix + ".position"].set(this._pointLights[i].position.toArray());
                }
                if (uniform_setter[prefix + ".color"]) {
                    uniform_setter[prefix + ".color"].set(this._pointLights[i].color.toArray());
                }
                if (uniform_setter[prefix + ".max_distance"]) {
                    uniform_setter[prefix + ".max_distance"].set(this._pointLights[i].distance);
                }
                if (uniform_setter[prefix + ".decay"]) {
                    uniform_setter[prefix + ".decay"].set(this._pointLights[i].decay);
                }
                if (uniform_setter[prefix + ".intensity"]) {
                    uniform_setter[prefix + ".intensity"].set(this._pointLights[i].intensity);
                }
            }
            else {
                if (uniform_setter[prefix + ".position"]) {
                    uniform_setter[prefix + ".position"].set([0, 0, 0]);
                }
                if (uniform_setter[prefix + ".color"]) {
                    uniform_setter[prefix + ".color"].set([0, 0, 0]);
                }
                if (uniform_setter[prefix + ".max_distance"]) {
                    uniform_setter[prefix + ".max_distance"].set(0);
                }
                if (uniform_setter[prefix + ".decay"]) {
                    uniform_setter[prefix + ".decay"].set(1);
                }
                if (uniform_setter[prefix + ".intensity"]) {
                    uniform_setter[prefix + ".intensity"].set(0);
                }
            }
        }
    }

    _setMaterial(uniform_setter, object) {
        const prefix = "material";

        const diffuse = prefix + ".diffuse_color";
        if (uniform_setter[diffuse] !== undefined) {
            uniform_setter[diffuse].set(object.material.diffuse.toArray());
        }

        const specular = prefix + ".specular_color";
        if (uniform_setter[specular] !== undefined) {
            uniform_setter[specular].set(object.material.specular.toArray());
        }

        const shininess = prefix + ".shininess";
        if (uniform_setter[shininess] !== undefined) {
            uniform_setter[shininess].set(object.material.shininess);
        }
    }

    _setAttributes(program, object) {
        let attribute_setter = program._attributes;

        let attributes = Object.getOwnPropertyNames(attribute_setter);

        let buffer;
        // Set all of the properties
        for (let i = 0; i < attributes.length; i++) {
            switch (attributes[i]) {
                case "position":
                    buffer = this._attribute_manager.getBuffer(object.vertices);
                    attribute_setter.position.set(buffer, 3);
                    break;
                case "normal":
                    buffer = this._attribute_manager.getBuffer(object.normals);
                    attribute_setter.normal.set(buffer, 3);
                    break;
                case "color":
                    buffer = this._attribute_manager.getBuffer(object.colors);
                    attribute_setter.color.set(buffer, 4);
                    break;
                default:
                    throw "Unknown Attribute!";
                    break;
            }
        }
    }

    _parseScene(scene) {
        let object_stack = [scene];

        while (object_stack.length > 0) {
            let object = object_stack.pop();

            if (object instanceof MeshObject) {
                this._mesh_objects.push(object);
            }
            else if (object instanceof DirectionalLight) {
                this._dirLights.push(object);
            }
            else if (object instanceof PointLight) {
                this._pointLights.push(object);
            }
            else if (object instanceof AmbientLight) {
                this._ambient.add(object.color);
            }

            for (let i in object.children) {
                object_stack.push(object.children[i]);
            }
        }
    }

    _updateMeshObjects(camera) {
        for (let i = 0; i < this._mesh_objects.length; i++) {
            let object = this._mesh_objects[i];
            object.model_view_matrix.multiplyMatrices(camera.world_matrix_inverse, object.matrix_world);

            object.normal_matrix.getNormalMatrix(object.model_view_matrix);

            if (object.vertices) {
                this._attribute_manager.updateBuffer(object.vertices, this._gl.ARRAY_BUFFER);
            }

            if (object.colors) {
                this._attribute_manager.updateBuffer(object.colors, this._gl.ARRAY_BUFFER);
            }

            if (object.normals) {
                this._attribute_manager.updateBuffer(object.normals, this._gl.ARRAY_BUFFER);
            }

            if (object.indices) {
                this._attribute_manager.updateBuffer(object.indices, this._gl.ELEMENT_ARRAY_BUFFER);
            }
        }
    }
}