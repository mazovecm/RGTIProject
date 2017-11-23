class MyTextures {
    constructor(urls, gl) {
        this.urls = urls;
        this.textures = [];
        this.gl = gl;
        for (var i = 0; i < this.urls.length; i++) {
            this.initTextures(this.urls[i]);
        }
    }
    initTextures(url) {
        var texture;
        texture = this.gl.createTexture();
        texture.image = new Image();
        texture.image.src = url;
        this.handleTextureLoaded(texture);
        this.textures.push(texture);
    }

    handleTextureLoaded(texture) {
        this.gl.bindTexture(gl.TEXTURE_2D, texture);
        this.gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(gl.TEXTURE_2D);
        this.gl.bindTexture(gl.TEXTURE_2D, null);
    }


}

