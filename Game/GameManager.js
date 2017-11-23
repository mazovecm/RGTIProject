

class GameManager {

    constructor(canvas) {
        let self = this;

        this._renderer = new Renderer(canvas);

        // On canvas resize update the viewport and the camera aspect ratio.
        window.addEventListener("resize",function(){
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            self._renderer.updateViewport(canvas.clientWidth, canvas.clientHeight);
            self.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        });

        this.scene = new Scene();
        this.object = new MeshObject();
        this.scene.add(this.object);
        this.scene.add(new DirectionalLight("rgb(0, 150, 0)", 1, new GLMath.Vector3(0, 0, 1)));
        this.plightA = new PointLight("rgb(255, 0, 0)", 1, 0, 250);
        this.scene.add(this.plightA);
        this.plightB = new PointLight("rgb(0, 0, 255)", 1, 0, 250);
        this.scene.add(this.plightB);


        this.camera = new Camera();
        this.scene.add(new AmbientLight("rgb(50, 50, 50)"));
        this.camera.translateZ(20);

        this.elapsed_time = 0;
    }

    update(dt) {
        this.elapsed_time += dt / 1000;

        this.plightA.position.set(10 * Math.cos(this.elapsed_time), 0, 10 * Math.sin(this.elapsed_time));
        this.plightB.position.set(0, 10 * Math.sin(this.elapsed_time), 10 * Math.cos(this.elapsed_time));

        this.object.rotateX(0.01);
        this.object.rotateY(0.005);
        this.object.position.set(5 * Math.sin(this.elapsed_time), 5 * Math.cos(this.elapsed_time), 0);

        this._renderer.render(this.scene, this.camera);
    }

}