class Renderer {

    constructor(canvas) {
        this._gl = canvas.getContext("webgl");
        this._gl.enable(this._gl.DEPTH_TEST);
        this._gl.frontFace(this._gl.CCW);
        this._gl.viewport(0, 0, canvas.width, canvas.height);

        this._program_manager = new ProgramManager(this._gl);
    }

    render(scene, camera) {
        mat4.invert(camera.modelMatrixInverse, camera.modelMatrix);


    }

}