;(function($) { // Secure $jQuery alias
/******************************************************************************/

rgti = window.rgti || {};  // Note: Declared within the global scope!

rgti.cache = {};

rgti.webgl = {};

/* __( Environment settings/state )_________________________________________
   | Important environmental specification, definitions and settings       |
   ========================================================================= */
rgti.env = {
    view: {
        w: undefined,
        h: undefined
    },
    curr: {
        lang: "sl", // Default language
        ended: false
    },
    specs: {
        L10n: {
            "en": {
                "instructions": "Instructions",
                "instructions_txt": "W - move forward, S - move back, A - turn left, D - turn right<br />L - lock/unlock camera",
                "new_game": "New game",
                "settings": "Settings",
                "about": "About",
                "about_txt": "From Ljubljana with Love is a game made<br />by Leja Pelc, Maša Florjanič, Žiga Böhm, Lana Beševič, in Miha Mazovec",
                "welcome": "Welcome to the game From Ljubljana with Love!",
                "description": "Bothered by hordes of unruly tourists pouring into Ljubljana, not caring about its beauties and peace of its citizens?<br />How good is your sense of direction and awareness of surrounding evironment? Embark on an epic quest of driving tourists of the Ljubljana!",
                "english": "English",
                "slovenian": "slovenščino",
                "switch_to": "Preklopi na",
                "no_audio_support": "Your browser doesn't support the audio tag.",
                "mute_music": "Mute music",
                "you_won": "You won!",
                "you_lost": "You lost!",
                "restart_game": "New game"
            },
            "sl": {
                "instructions": "Navodila",
                "instructions_txt": "W - premik naprej, S - premik nazaj, A - obrat v levo, D - obrat v desno<br />L - zaklepanje/odklepanje kamere",
                "new_game": "Nova igra",
                "settings": "Nastavitve",
                "about": "Vizitka",
                "about_txt": "Z ljubeznijo iz Ljubljane je WebGL igra, ki so jo izdelali<br />Leja Pelc, Maša Florjanič, Žiga Böhm, Lana Beševič, in Miha Mazovec",
                "welcome": "Dobrodošli v igri Z ljubeznijo iz Ljubljane!",
                "description": "Vas motijo horde podivjanih turistov, ki derejo v Ljubljano, brez občutka za lepote mesta in mir njenih prebivalcev?<br />Kako dobra sta vaša občutek za smer in splošno zavedanje okolice? Podajte se na epsko dogodivščino preganjanja turistov iz Ljubljane!",
                "english": "English",
                "slovenian": "slovenščino",
                "switch_to": "Switch to",
                "no_audio_support": "Vaš brskalnik nima ustrezne podpore za predvajanje zvočnih značk.",
                "mute_music": "Utišaj glasbo",
                "game_over": "Konec igre!",
                "you_won": "Zmagal(a) si!",
                "you_lost": "Izgubil(a) si!",
                "restart_game": "Nova igra"
            }
        },
        langCodes: {
            "en": "english",
            "sl": "slovenian"
        },
        menu: {
            opts: [
                "new_game",
                "settings",
                "instructions",
                "about"
            ]
        },
        src: "env/geometry.obj"
    }
};

/* __( UI initialization )__________________________________________________
   | Functions responsible for preparing browser mangle-proof UI DOM,      |
   | setting default/initial var values, i18n and initialization of        |
   | interactive UI elts.                                                  |
   ========================================================================= */
rgti.reset = function() {

};

rgti.START = function() {
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

  rgti.cache.geometry = new rgti.class.Geometry(specs.src);
};

$(document).ready(function() {
  rgti.START();
});

/******************************************************************************/
})(jQuery); // Confine scope
