$(function(){
    var total = $("img").length;
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
    $("img").bind({
	"load": function(){ log(); }
    });
});
