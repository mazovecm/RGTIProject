
class Camera extends Object3D {
    constructor() {
        super(Object3D);

        this.projection_matrix = mat4.create();
        this.model_matrix_inverse = mat4.create();
        mat4.perspective(this.projection_matrix, 45, 1920 / 1080, 0.1, 100.0);
    }
}
