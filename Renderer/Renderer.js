class Renderer {

    constructor(canvas) {
        this._gl = canvas.getContext("webgl2");
        this._gl.enable(this._gl.DEPTH_TEST);
        this._gl.frontFace(this._gl.CCW);
        this._gl.viewport(0, 0, canvas.width, canvas.height);
        this._gl.clearColor(0, 0, 0, 1);
        this._gl.clearDepth(1);

        this._program_manager = new ProgramManager(this._gl);
        this._attribute_manager = new AttributeManager(this._gl);

        this._lights = [];
        this._mesh_objects = [];
    }

    render(scene, camera) {
        mat4.invert(camera.model_matrix_inverse, camera.model_matrix);

        // Clear render arrays.
        this._lights.length = 0;
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
            this._gl.drawElements(this._gl.TRIANGLES, this._mesh_objects[i].indices.length, this._gl.UNSIGNED_INT, 0);
        }

    }

    _setUniforms(program, object, camera) {
        let uniform_setter = program._uniforms;

        if (uniform_setter.pmat !== undefined) {
            uniform_setter.pmat.set(camera.projection_matrix);
        }

        if (uniform_setter.mvmat !== undefined) {
            uniform_setter.mvmat.set(object.model_view_matrix);
        }

        if (uniform_setter.nmat !== undefined) {
            uniform_setter.nmat.set(object.normal_matrix);
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
            else if (object instanceof Light) {
                this._lights.push(object);
            }

            for (let i in object.children) {
                object_stack.push(object.children[i]);
            }
        }
    }

    _updateMeshObjects(camera) {
        for (let i = 0; i < this._mesh_objects.length; i++) {
            let object = this._mesh_objects[i];
            mat4.multiply(object.model_view_matrix, camera.model_matrix_inverse, object.model_matrix);
            mat4.invert(object.normal_matrix, object.model_view_matrix);
            mat4.transpose(object.normal_matrix, object.normal_matrix);

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