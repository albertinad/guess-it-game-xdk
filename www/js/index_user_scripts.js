(function () {
    "use strict";

    // hook up event handlers 
    function register_event_handlers() {

        $(document).on("click", "#btn-history", function (evt) {
            activate_subpage("#page-historysub");
        });

        $(document).on("click", "#btn-new-game", function (evt) {
            activate_subpage("#page-game-configsub");
        });
    }

    document.addEventListener("app.Ready", register_event_handlers, false);
})();