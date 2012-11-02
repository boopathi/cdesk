$(function() {
    $(".icon").hover(function() {
	$(this).stop().animate({
	    width: 360,
	    height: 360,
	    border: 0
	},100);
    },function() {
	$(this).stop().animate({
	    width: 300,
	    height: 300,
	    border: 30
	}, 250);
    });
});
