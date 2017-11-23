class Player extends MeshObject {

    constructor (gm) {
        super(MeshObject);
        this.gm = gm;
        this.input_manager = InputManager.instance;
    }

    update(dt) {
        let input_set = this.input_manager.getPressedKeys();

        if (input_set.has(83)) {
            this.translateX(dt * -0.005);
        }
        if (input_set.has(87)) {
            this.translateX(dt * 0.005);
        }
        if (input_set.has(65)) {
            this.rotateY(dt * 0.005);
        }
        if (input_set.has(68)) {
            this.rotateY(dt * -0.005);
        }
    }
}