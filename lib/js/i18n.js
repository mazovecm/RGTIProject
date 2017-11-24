;(function($) { // Secure $jQuery alias
  /******************************************************************************/

rgti = window.rgti || {};
rgti.i18n = rgti.i18n || {};

/* __( i18n )_______________________________________________________________
   | Internationalization and localization related functions.              |
   ========================================================================= */
rgti.i18n = {
  refreshTranslations: (lang) => {
    var specs, name;

    specs = rgti.env.specs;

    $(".i18n").each(function() {
      name = $(this).attr("name");
      $(this).html(specs.L10n[lang][name]);
    });
  }
};

/******************************************************************************/
})(jQuery); // Confine scope
