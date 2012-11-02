$(function() {
    $(".icon").hover(function() {
	$(this).stop().animate({
	    width: 320,
	    height: 320,
	    borderWidth: 0
	},100);
    },function() {
	$(this).stop().animate({
	    width: 300,
	    height: 300,
	    borderWidth: 10
	}, 250);
    });
});
