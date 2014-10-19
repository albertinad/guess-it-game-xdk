(function () {
    'use strict';

    function activate_subpage(sel, have_state) {
        var $dn = $(sel);
        $dn.parents(".upage").find(".upage-content").addClass("hidden");
        $dn.removeClass("hidden");
        var parent_sel = "#" + $dn.parents(".upage.panel").attr("id");
        var parent_vis = $(parent_sel).is(":visible");
        if (parent_vis) {
            $(document).trigger("pageChange");
            if (!have_state) {
                window.history.pushState({
                    usubpage: sel
                }, sel, document.location.origin + document.location.pathname + "#" + sel);
            }
        } else {
            //now activate parent page
            af.ui.loadContent(parent_sel, false, false, 'none');
            window.history.replaceState({
                usubpage: sel
            }, sel, document.location.origin + document.location.pathname + "#" + sel);
        }
    }

    /* this function not used by jQueryMobile or Intel App Framework */
    function activate_page(sel, have_state) {
        var $dn = $(sel);
        var is_vis = $dn.is(":visible");
        if (!is_vis) {
            $dn.parents("body").find(".upage").addClass("hidden");
            $dn.removeClass("hidden");

            if (!have_state) {
                window.history.pushState({
                    upage: sel
                }, sel, document.location.origin + document.location.pathname + sel);
            }
        }
        $(document).trigger("pageChange");
    }

    // Warning!
    // Exports to window element to make this functions globally available through
    // the window object.
    // It is NOT a good practice to do this but it is needed to not break the UI Designer
    // functionallity and code auto-generation.
    window.activate_subpage = activate_subpage;
    window.activate_page = activate_page;
    
    window.onpopstate = function (event) {
        if (event.state) {
            if (event.state.usubpage) {
                activate_subpage(event.state.usubpage, true);
            } else if (event.state.upage) {
                activate_page(event.state.upage, true);
            }
        }
    };

    $(document).ready(function () {
        setTimeout(function () {
            var sel = "#mainsub";
            window.history.pushState({
                usubpage: sel
            }, sel, document.location.origin + document.location.pathname + "#" + sel);
        }, 300);
    });
})();