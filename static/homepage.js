$(function() {
    $(".icon").hover(function() {
	$(this).stop().animate({
	    width: 360,
	    height: 360,
	    borderWidth: 0
	},100);
    },function() {
	$(this).stop().animate({
	    width: 300,
	    height: 300,
	    borderWidth: 30
	}, 250);
    });
});
