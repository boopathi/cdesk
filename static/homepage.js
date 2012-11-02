$(function() {
    $(".icon").hover(function() {
	$(this).stop().animate({
	    width: 310,
	    height: 310,
	    borderWidth: 0
	},100);
    },function() {
	$(this).stop().animate({
	    width: 300,
	    height: 300,
	    borderWidth: 5
	}, 250);
    });
});
