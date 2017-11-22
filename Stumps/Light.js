
class Light extends Object3D {
    constructor() {
        super(Object3D);
        this.color = vec3.create();
        this.intensity = 1;
    }
}