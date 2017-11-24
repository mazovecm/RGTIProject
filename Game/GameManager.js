
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

        this.input_manager = InputManager.instance;
        this.camera_locked = false;

        this.scene = new Scene();

        this.player = new Player(this);
        this.scene.add(this.player);

        //this.bird = new MeshObject();
        //this.player.add(this.bird);

        this.floor = new MeshObject();
        this.scene.add(this.floor);
        this.floor.scale = new GLMath.Vector3(100, 100, 100);
        this.floor.translateY(-4);

        this.scene.add(new DirectionalLight("rgb(255, 255, 255)", 0.5, new GLMath.Vector3(0, 0, 1)));

        this.plightA = new PointLight("rgb(255, 255, 255)", 0.6, 0, 250);
        this.scene.add(this.plightA);
        this.plightA.translateZ(40);

        this.plightB = new PointLight("rgb(255, 255, 255)", 0.6, 0, 250);
        this.scene.add(this.plightB);
        this.plightB.translateZ(40);

        this.scene.add(new AmbientLight("rgb(50, 50, 50)"));

        this.camera = new Camera();
        this.camera.translateZ(50);
        this.camera.translateY(40);
        this.camera.rotateX(-Math.PI/4.5);
        //this.player.add(this.camera);

        this.elapsed_time = 0;

        this.loadLevel(3);
    }

    loadLevel(onfinished) {
        let self = this;
        OBJ.downloadMeshes({
            'player': 'Models/LowPolyMan.obj', // located in the models folder on the server
            //'bird': 'Models/Bird.obj',
            'floor': 'Models/floorbig.obj'
        }, function(meshes) {
            self.player.initModelData(meshes.player);
            self.player.material.texture = new Image();
            self.player.material.texture.src = 'Textures/LowPolyMan5eyes.png';

            //self.bird.initModelData(meshes.bird);
            //self.bird.material.texture = new Image();
            //self.bird.material.texture.src = 'Textures/bird.png';

            self.floor.initModelData(meshes.floor);
            self.floor.material.texture = new Image();
            self.floor.material.texture.src = 'Textures/floor64x.png';
        });
    }

    update(dt) {
        this.elapsed_time += dt / 1000;

        //this.plightA.position.set(10 * Math.cos(this.elapsed_time), 0, 10 * Math.sin(this.elapsed_time));
        //this.plightB.position.set(0, 10 * Math.sin(this.elapsed_time), 10 * Math.cos(this.elapsed_time));

        this.player.update(dt);
        this.lockCamera();

        this._renderer.render(this.scene, this.camera);
    }

    lockCamera() {
        let input_set = this.input_manager.getPressedKeys();

        if (input_set.has(76)) {
            if (this.camera_locked === false) {
                this.player.add(this.camera);
                this.camera_locked = true;
                input_set.delete(76);
            }
            else {
                this.player.remove(this.camera);
                this.camera_locked = false;
                input_set.delete(76);
            }
        }

    }

}