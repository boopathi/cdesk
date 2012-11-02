$(function(){
    var total = $(".gimage img").length;
    var counter = 0;
    var space = " &nbsp; &nbsp; ";
    var log = function() {
	var percent = 100*++counter/total;
	$("#imgloader").width(percent + "%").html(space + Math.ceil(percent) + "%");
	if(percent==100){
	    $("#imgloader").html(space + " 100%. Loading Complete :) ");
	    setTimeout(function(){
		$("#imgloader").parent(".progress").fadeOut(500);
	    }, 1250);
	}
    }
    $(".gimage img").bind({
	"load": function(){ log(); }
    });
    var popimage = function(label, target) {
	var settings = {
	    "width": 960,
	    "height": 600,
	    "from": "-2days",
	    "target": target,
	    "title": label,
	    "until": "now"
	};
	sarray = [];
	for(i in settings) sarray.push(i + "=" + settings[i]);
	src = baseurl + "?" + sarray.join('&');
	$("#bigimage img").attr("src", src);
	$("#bigpreview").trigger('click');
    }
    $(".gimage").click(function(e){
	e.preventDefault();
	popimage($(this).attr("href"), $(this).data("target"));
    });
});
