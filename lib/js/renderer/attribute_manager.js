class AttributeManager {

    constructor(gl) {
        this._gl = gl;
        this._buffers = new Map();
    }

    updateBuffer(attribute, type) {
        if (attribute.dirty) {
            let buffer = this.getBuffer(attribute);

            this._gl.bindBuffer(type, buffer);
            this._gl.bufferData(type, attribute.data, this._gl.STATIC_DRAW);
            attribute.dirty = false;
        }
    }

    getBuffer(attribute) {
        let buffer = this._buffers.get(attribute);

        if (!buffer) {
            buffer = this._gl.createBuffer();
            this._buffers.set(attribute, buffer);
        }

        return buffer;
    }

}