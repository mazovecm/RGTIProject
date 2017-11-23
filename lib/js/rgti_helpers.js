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
  start_game: () => {
    //let canvas = $(document.createElement("canvas")).attr({
    //    id: "canvas"
    //})[0];
    //$("body").append($("canvas")[0]);

    rgti.game = new GameManager($("canvas")[0]);
    let last_time = 0;

    let animate = function () {
        // Calculate delta time.
        let dt = 0;
        let time_now = new Date().getTime();
        if (last_time !== 0) {
            dt = time_now - last_time;
        }
        last_time = time_now;

        rgti.game.update(dt);

        requestAnimationFrame(animate);
    };

    animate();
  }
};

/******************************************************************************/
})(jQuery); // Confine scope
