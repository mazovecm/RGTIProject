
class Light extends Object3D {
    constructor(color, intensity) {
        super(Object3D);
        this.color = new GLMath.Color(color);
        this.intensity = intensity !== undefined ? intensity : 1;
    }
}