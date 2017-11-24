
class Camera extends Object3D {
    constructor(fov, aspect, near, far) {
        super(Object3D);

        this._fov = fov || 50.0;
        this._aspect = aspect || (1920/1080);
        this._near = near || 0.1;
        this._far = far || 1000.0;

        this.projection_matrix = new GLMath.Matrix4();
        this.world_matrix_inverse = new GLMath.Matrix4();

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        let top = this._near * Math.tan((Math.PI / 180) * 0.5 * this._fov),
            height = 2 * top,
            width = this._aspect * height,
            left = - 0.5 * width;

        this.projection_matrix.makePerspective(left, left + width, top, top - height, this._near, this._far);
    }

    get fov() { return this._fov; }
    get aspect() { return this._aspect; }
    get near() { return this._near; }
    get far() { return this._far; }

    set fov(val) {
        if (val !== this._fov) {
            this._fov = val;
            this.updateProjectionMatrix();
        }
    }

    set aspect(val) {
        if (val !== this._aspect) {
            this._aspect = val;
            this.updateProjectionMatrix();
        }
    }

    set near(val) {
        if (val !== this._near) {
            this._near = val;
            this.updateProjectionMatrix();
        }
    }

    set far(val) {
        if (val !== this._far) {
            this._far = val;
            this.updateProjectionMatrix();
        }
    }
}
