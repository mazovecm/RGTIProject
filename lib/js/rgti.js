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
                "instructions_txt": "Game instructions come here...",
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
                "instructions_txt": "Tukaj je mesto za navodila...",
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
  let fn, cache, specs;

  fn = rgti.fn;
  cache = rgti.cache;
  specs = rgti.env.specs;

  fn.init_ui();
  cache.geometry = new rgti.class.Geometry(specs.src);
};

$(document).ready(function() {
  rgti.START();
});

/******************************************************************************/
})(jQuery); // Confine scope
