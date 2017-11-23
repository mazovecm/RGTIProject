
class MeshObject extends Object3D {
    constructor() {
        super(Object3D);

        this.model_view_matrix = new GLMath.Matrix4();
        this.normal_matrix = new GLMath.Matrix3();

        this.material = new PhongMaterial();

        this.program = Programs.PHONG_TEX;


        this.vertices = {
            dirty: true,
            data: new Float32Array([])
        };

        this.colors = {
            dirty: true,
            data: new Float32Array([])
        };

        this.normals = {
            dirty: true,
            data: new Float32Array([])
        };

        this.indices = {
            dirty: true,
            data: new Uint32Array([])
        };

        this.uv = {
            dirty: true,
            data: new Float32Array([])
        }
    }

    initModelData(mesh) {
        this.vertices.data = new Float32Array(mesh.vertices);
        this.normals.data = new Float32Array(mesh.vertexNormals);
        this.uv.data = new Float32Array(mesh.textures);
        this.indices.data = new Uint32Array(mesh.indices);

        this.vertices.dirty = true;
        this.normals.dirty = true;
        this.uv.dirty = true;
        this.indices.dirty = true;

    }
}