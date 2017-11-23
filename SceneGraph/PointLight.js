
class PointLight extends Light {
    constructor(color, intensity, decay, distance) {
        super(color, intensity);
        this.distance = (distance !== undefined) ? distance : 200;
        this.decay = (decay !== undefined) ? decay : 1;
    }
}