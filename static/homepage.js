$(function() {
    $(".icon").hover(function() {
	$(this).stop().animate({
	    width: 350,
	    height: 350,
	    border: 5
	},100);
    },function() {
	$(this).stop().animate({
	    width: 300,
	    height: 300
	}, 250);
    });
});
