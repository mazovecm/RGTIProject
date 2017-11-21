
class Camera extends Object3D {
    constructor() {
        super(Object3D);

        this.projectionMatrix = mat4.create();
        this.modelMatrixInverse = mat4.create();
        mat4.perspective(45, 1920 / 1080, 0.1, 100.0, this.projectionMatrix);
    }
}
