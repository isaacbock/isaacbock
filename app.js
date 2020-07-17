document.addEventListener("DOMContentLoaded", function(event) { 
    // autoscroll down after intro video completion   
    let introVideo = document.getElementById("intro_video");
    introVideo.onended = function() {
        setTimeout(function(){ document.getElementById("main").scrollIntoView({behavior: "smooth"}); }, 250);
    };
});