
class Object3D {

    constructor() {
        let self = this;

        this.position = new GLMath.Vector3();
        this.rotation  = new GLMath.Euler();
        this.quaternion = new GLMath.Quaternion();
        this.scale = new GLMath.Vector3(1, 1, 1);

        function onRotationChange() {
            self.quaternion.setFromEuler(self.rotation, false);
        }

        function onQuaternionChange() {
            self.rotation.setFromQuaternion(self.quaternion, undefined, false);
        }

        this.rotation.onChange(onRotationChange);
        this.quaternion.onChange(onQuaternionChange);

        this.matrix_world = new GLMath.Matrix4();

        this.parent = null;
        this.children = [];

        this.rotateOnAxis = rotateOnAxis;
        this.rotateX = rotateX;
        this.rotateY = rotateY;
        this.rotateZ = rotateZ;

        this.translateOnAxis = translateOnAxis;
        this.translateX = translateX;
        this.translateY = translateY;
        this.translateZ = translateZ;
    }


    updateMatrixWorld() {
        this.matrix_world.compose(this.position, this.quaternion, this.scale);

        if (this.parent !== null) {
            this.matrix_world.multiplyMatrices(this.parent.matrix_world, this.matrix_world);
        }

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].updateMatrixWorld();
        }
    }

    add(object) {
        if (object === this) {
            return;
        }
        if (object.parent !== null) {
            object.parent.remove(object);
        }

        object.parent = this;
        this.children.push(object);
    }

    remove(object) {
        let index = this.children.indexOf(object);
        if (index !== -1) {
            object.parent = null;
            this.children.splice(index, 1);
        }
    }

    clear() {
        this.children = [];
    }
}


var rotateOnAxis = (function() {
    let q1 = new GLMath.Quaternion();

    return function (axis, angle) {
        if (angle !== 0) {
            q1.setFromAxisAngle(axis, angle);
            this.quaternion.multiply(q1);

            return this;
        }
    };
})();


var rotateX = (function() {
    let v1 = new GLMath.Vector3(1, 0, 0);

    return function (angle) {
        return this.rotateOnAxis(v1, angle);
    };
})();

var rotateY = (function() {
    let v1 = new GLMath.Vector3(0, 1, 0);

    return function (angle) {
        return this.rotateOnAxis(v1, angle);
    };
})();

var rotateZ = (function () {
    let v1 = new GLMath.Vector3(0, 0, 1);

    return function (angle) {
        return this.rotateOnAxis(v1, angle);
    };
})();

var translateOnAxis = (function () {
    let v1 = new GLMath.Vector3();

    return function (axis, distance) {
        if (distance !== 0) {
            v1.copy(axis).applyQuaternion(this.quaternion);

            this.position.add(v1.multiplyScalar(distance));
        }

        return this;
    };
})();

var translateX = (function () {
    // Private axis vector
    let v1 = new GLMath.Vector3(1, 0, 0);

    return function (distance) {
        return this.translateOnAxis(v1, distance);
    };
})();


var translateY = (function () {
    // Private axis vector
    let v1 = new GLMath.Vector3(0, 1, 0);

    return function (distance) {
        return this.translateOnAxis(v1, distance);
    };
})();


var translateZ = (function () {
    // Private axis vector
    let v1 = new GLMath.Vector3(0, 0, 1);

    return function (distance) {
        return this.translateOnAxis(v1, distance);
    };
})();