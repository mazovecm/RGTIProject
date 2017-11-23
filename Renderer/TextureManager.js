class TextureManager {

    constructor(gl) {
        this._gl = gl;
        this._textures = new Map();
    }

    updateTexture(img, texture) {
        this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
        this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, img);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR_MIPMAP_NEAREST);
        this._gl.generateMipmap(this._gl.TEXTURE_2D);
        this._gl.bindTexture(this._gl.TEXTURE_2D, null);
    }

    getTexture(img) {
        if (img === null || !img.complete) {
            return null;
        }

        let texture = this._textures.get(img);

        if (!texture) {
            texture = this._gl.createTexture();
            this.updateTexture(img, texture);
            this._textures.set(img, texture);
        }

        return texture;
    }
}