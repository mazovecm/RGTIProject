
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

        this.player = new Player(this);
        this.scene.add(this.player);

        //this.bird = new MeshObject();
        //this.player.add(this.bird);

        this.floor = new MeshObject();
        this.scene.add(this.floor);
        this.floor.scale = new GLMath.Vector3(100, 100, 100);
        this.floor.translateY(-4);

        this.scene.add(new DirectionalLight("rgb(255, 255, 255)", 0.6, new GLMath.Vector3(0, 0, 1)));
        this.plightA = new PointLight("rgb(255, 255, 255)", 0.6, 0, 250);
        this.scene.add(this.plightA);
        this.plightB = new PointLight("rgb(255, 255, 255)", 0.6, 0, 250);
        this.scene.add(this.plightB);
        this.scene.add(new AmbientLight("rgb(50, 50, 50)"));

        this.camera = new Camera();
        this.camera.translateZ(40);
        this.camera.translateY(30);
        this.camera.rotateX(-Math.PI/5);

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

        this.plightA.position.set(10 * Math.cos(this.elapsed_time), 0, 10 * Math.sin(this.elapsed_time));
        this.plightB.position.set(0, 10 * Math.sin(this.elapsed_time), 10 * Math.cos(this.elapsed_time));

        this.player.update(dt);

        this._renderer.render(this.scene, this.camera);
    }

}