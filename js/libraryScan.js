// Header nav bar shadow on scroll
$(function() {
    //caches a jQuery object containing the header element
    var header = $("#header");
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll >= 75) {
            header.addClass("shadow");
        } else {
            header.removeClass("shadow");
        }
    });
});