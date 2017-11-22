
class DirectionalLight extends Light {
    constructor() {
        super(Object3D);
        this.direction = vec3.create();
    }
}