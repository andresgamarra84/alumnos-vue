var menuFOBA = new Vue({
	el:'#menuProfesorado',
	methods:{
		show:function(i){
			console.log(i);
			document.getElementById("profinstrumento").style.display= i==0?"block":"none";
			document.getElementById("profcanto").style.display= i==1?"block":"none";
			document.getElementById("profdireccioncoral").style.display= i==2?"block":"none";
			document.getElementById("profcomposicion").style.display= i==3?"block":"none";
			document.getElementById("profeducacionmusical").style.display= i==4?"block":"none";
		},
	},
	mounted:function(){
		document.getElementById("profinstrumento").style.display= "none";
		document.getElementById("profcanto").style.display= "none";
		document.getElementById("profdireccioncoral").style.display= "none";
		document.getElementById("profcomposicion").style.display= "none";
		document.getElementById("profeducacionmusical").style.display= "none";
	},
});