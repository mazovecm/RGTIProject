
class PointLight extends Light {
    constructor() {
        super(Object3D);
        this.decay = 0.5;
        this.distance = 200;
    }
}