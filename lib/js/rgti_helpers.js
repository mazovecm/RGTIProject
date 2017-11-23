;(function($) { // Secure $jQuery alias
/******************************************************************************/

rgti = window.rgti || {};
rgti.fn = rgti.fn || {};

/* __( Common functions )___________________________________________________
   | Functions for direct manipulation of UI elts, used commonly           |
   | and usually repeatedly during a lifetime of UI instance.              |
   ========================================================================= */
rgti.fn = {
  rotateCompass: (alpha) => {
    $("#rgti-compass").css({
      "-ms-transform": "rotate(" + alpha + "deg)", /* IE 9 */
      "-webkit-transform": "rotate(" + alpha + "deg)", /* Chrome, Safari, Opera */
      "transform": "rotate(" + alpha + "deg)"
    });
  },
  toggleMusic: () => {
    var audio = $("audio");

    if ($(audio)[0].paused) {
      $(audio)[0].play();
    } else {
      $(audio)[0].pause();
    }
  },
  gameOver: (reason) => {
    var curr, specs, container, info, bttn, w, h;

    specs = rgti.env.specs;
    curr = rgti.env.curr;
    view = rgti.env.view;

    if (!curr.ended) {
      curr.ended = true;

      container = $(document.createElement("div")).attr({
        id: "rgti-game-over"
      });

      info = $(document.createElement("h1")).attr({
        name: reason,
        class: "i18n"
      })
        .text(specs.L10n[curr.lang][reason]);

      bttn = $(document.createElement("button")).attr({
        name: "restart_game",
        class: "i18n"
      })
        .text(specs.L10n[curr.lang]["restart_game"])
        .click(function() {
          $("#rgti-game-over")
            .empty()
            .remove();

          $("#rgti-info-bar")
            .empty()
            .remove();

          $("canvas")
            .empty()
            .remove();

          rgti.start_game();
        });

      $(container)
        .append(info)
        .append(bttn);

      view.w = $("canvas").width();
      view.h = $("canvas").height();

      w = $(container).width();
      h = $(container).height();

      $(container).css({
        "top": Math.round((view.h - h) / 2) + "px",
        "left": Math.round((view.w - w) / 2) + "px"
      });

      $("body")
        .append(container);
    }
  },
  init_ui: () => {
    var view, specs, curr, i18n, fn, lang, audio, menu, h1, bttn, br, span1, span2, div, ctrl;

    specs = rgti.env.specs;
    curr = rgti.env.curr;
    i18n = rgti.i18n;
    fn = rgti.fn;

    audio = $(document.createElement("audio")).attr({
      "src": "lib/snd/music.mp3",
      "type": "audio/mpeg",
      "autoplay": true,
      "loop": true
    })
      .text(specs.L10n[curr.lang][specs.langCodes["no_audio_support"]]);

    lang = $(document.createElement("a")).attr({
      class: "switch"
    })
      .text(specs.L10n[curr.lang][specs.langCodes["en"]])
      .click(function() {
        var alt, prev;

        alt = (curr.lang == "sl") ? "en" : "sl";
        prev = curr.lang;
        curr.lang = alt;

        $(this)
          .text(specs.L10n[curr.lang][specs.langCodes[prev]]);

        i18n.refreshTranslations(alt);
      });

    span1 = $(document.createElement("span")).attr({
      name: "switch_to",
      class: "i18n switch"
    })
      .text(specs.L10n[curr.lang]["switch_to"]);

    menu = $(document.createElement("div")).attr({
      id: "rgti-main-menu"
    });

    h1 = $(document.createElement("h1")).attr({
      name: "welcome",
      class: "i18n"
    })
      .text(specs.L10n[curr.lang]["welcome"]);

    span2 = $(document.createElement("span")).attr({
      name: "description",
      class: "i18n"
    })
      .text(specs.L10n[curr.lang]["description"]);

    br1 = $(document.createElement("br"));
    br2 = $(document.createElement("br"));

    $(menu)
      .append(h1)
      .append(span2)
      .append(br1)
      .append(br2);

    $.each(specs.menu.opts, function(idx, opt) {
      bttn = $(document.createElement("button")).attr({
        name: opt,
        class: "i18n"
      })
        .text(specs.L10n[curr.lang][opt])
        .click(function() {
          var name, compass, img;

          name = $(this).attr("name");

          if (name != "new_game") {
            $("div.wrapper:not(#" + name + ")").hide();
            $("#" + name).toggle();
          } else {
            // Hide menu
            $(menu).hide();

            // Initialize WebGL scene and start the game
            fn.start_game();

            // Create and append compass
            compass = $(document.createElement("div")).attr({
              id: "rgti-compass"
            });

            $("body")
              .append(compass);
          }
        });

      br = $(document.createElement("br"));

      if (opt != "new_game") {
        div = $(document.createElement("div")).attr({
          id: opt,
          class: "wrapper " + opt
        })
          .hide();

        if (opt != "settings") {
          span2 = $(document.createElement("span")).attr({
            name: opt + "_txt",
            class: "i18n block"
          })
            .html(specs.L10n[curr.lang][opt + "_txt"]);

          $(div)
            .append(span2);
        } else {
          ctrl = $(document.createElement("input")).attr({
            name: "mute_music",
            class: "i18n",
            type: "checkbox"
          })
            .click(function() {
              fn.toggleMusic();
            });

          span2 = $(document.createElement("span")).attr({
            name: "mute_music",
            class: "i18n block"
          })
            .html(specs.L10n[curr.lang]["mute_music"]);

          $(div)
            .append(ctrl)
            .append(span2);

        }

        $(menu)
          .append(bttn)
          .append(br)
          .append(div);
      } else {
        $(menu)
          .append(bttn)
          .append(br);
      }
    });

    div = $(document.createElement("div")).attr({
      class: "frame"
    });

    $(menu)
      .append(span1)
      .append(lang);

    $(div)
      .append(menu);

    $("body")
      .append(audio)
      .append(div);
  },
  start_game: () => {
    let cache, webgl, fn,
      // renderer, scene, camera,
      vars,
      object,
      dlight, plightA, plightB, alight,
      last_time, dt, elapsed;

    cache = rgti.cache;
    fn = rgti.fn;

    rgti.webgl = new rgti.class.WebGL(cache.geometry);

    webgl = rgti.webgl;

    $("body").append(rgti.webgl.canvas);

    // renderer = webgl.renderer;
    // scene = webgl.scene;
    // camera = webgl.camera;

    webgl.vars = {
      object: undefined,
      dlight: new DirectionalLight("rgb(0, 150, 0)", 1, new GLMath.Vector3(0, 0, 1)),
      plightA: new PointLight("rgb(255, 0, 0)", 1, 0, 250),
      plightB: new PointLight("rgb(0, 0, 255)", 1, 0, 250),
      alight: new AmbientLight("rgb(50, 50, 50)"),
      last_time: 0,
      dt: 0,
      elapsed: 0
    };

    vars = webgl.vars;

    dlight = vars.dlight;
    plightA = vars.plightA;
    plightB = vars.plightB;
    alight = vars.alight;
    object = vars.object;

    webgl.scene = new Scene();
    webgl.camera = new Camera();

    webgl.renderer = new Renderer(webgl);

    vars.object = new MeshObject();

    webgl.scene.add(object);
    webgl.scene.add(dlight);
    webgl.scene.add(plightA);
    webgl.scene.add(plightB);
    webgl.scene.add(alight);

    console.log(webgl);

    window.requestAnimationFrame(fn.tick);
  },
  tick: () => {
    let webgl, time_now,
      vars,
      object, plightA, plightB, last_time, dt, elapsed;

    webgl = rgti.webgl;
    vars = webgl.vars;

    object = vars.object;
    plightA = vars.plightA;
    plightB = vars.plightB;
    last_time = vars.last_time;
    dt = vars.last_time;
    elapsed = vars.elapsed;

    time_now = new Date().getTime();

    if (last_time !== 0) {
      dt = time_now - last_time;
    }

    last_time = time_now;
    elapsed += dt / 1000;

    plightA.position.set(10 * Math.cos(elapsed), 0, 10 * Math.sin(elapsed));
    plightB.position.set(0, 10 * Math.sin(elapsed), 10 * Math.cos(elapsed));

    object.rotateX(0.01);
    object.rotateY(0.005);

    object.position.set(5 * Math.sin(elapsed), 0, 5 * Math.cos(elapsed));

    renderer.render(webgl.scene, webgl.camera);
    //mat4.rotate(camera.model_matrix, camera.model_matrix, Math.PI / 20, [0, 1, 0]);

    window.requestAnimationFrame(tick);
  }
};

/******************************************************************************/
})(jQuery); // Confine scope
