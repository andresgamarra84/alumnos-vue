var menuFOBA = new Vue({
	el:'#menuFOBA',
	methods:{
		show:function(i){
			console.log(i);
			document.getElementById("fobaninios").style.display= i==0?"block":"none";
			document.getElementById("fobaadultos").style.display= i==1?"block":"none";
			document.getElementById("fobacanto").style.display= i==2?"block":"none";
		},
	},
	mounted:function(){
		document.getElementById("fobaninios").style.display= "none";
		document.getElementById("fobaadultos").style.display= "none";
		document.getElementById("fobacanto").style.display= "none";
	},
});
