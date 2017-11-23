const singleton = Symbol();
const singleton_enforcer = Symbol();

class InputManager {
    constructor(enforcer) {

        if(enforcer !== singleton_enforcer) { throw "Cannot construct singleton" };

        this.keys = new Set();
        let self = this;

        document.addEventListener("keydown", function (event) {

            self.keys.add(event.keyCode);

            // Disable arrow key default behavior
            if([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
                event.preventDefault();
            }
        });

        document.addEventListener("keyup", function (event) {
            self.keys.delete(event.keyCode)
        });

    }

    getPressedKeys() {
        return this.keys;
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new InputManager(singleton_enforcer);
        }

        return this[singleton];
    }
}