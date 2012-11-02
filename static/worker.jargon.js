function resize(data) {
    if(data.length <= 1000) return data;
    var list=[],sum=0;
    var ng=data.length/1000;
    for(var i=0;i<1000;i++){
	sum=0;
	for(var j=0;j<ng;j++)
	    sum=sum+data[i+j];
	list.push(sum/ng);
    }
}
