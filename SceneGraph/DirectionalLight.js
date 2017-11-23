
class DirectionalLight extends Light {
    constructor(color, intensity, direction) {
        super(color, intensity);
        this.direction = (direction) ? direction.clone() : new GLMath.Vector3(0, 1, 0);
    }
}