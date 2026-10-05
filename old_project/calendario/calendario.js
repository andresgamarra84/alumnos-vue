var calendario = new Vue({
	el:"#calendario",
	data:{
		showAddMenu:false,
		arrAusentes:[],
		arrNotificaciones:[],
		arrDocentes:[],
	},
	methods:{
		listDocentes:function(){
			this.arrDocentes=[];
			apiData.setData("calendario",1);
			api.get().then(r=>{
				r.payload.forEach(v=>this.arrDocentes.push(v));
			});
		},
		list:function(){
			this.arrAusentes=[];
			this.arrNotificaciones=[];
			apiData.setData("calendario");
			api.get().then(r=>{
				r.payload["p"].forEach(v=>this.arrAusentes.push(v));
				r.payload["n"].forEach(v=>this.arrNotificaciones.push(v));
			});
		},
		add:function(isNotif=false){
			let codprofesor = document.getElementById("docentes").selectedIndex==0 ? false : document.getElementById("docentes").value;
			let desde = isNotif ? document.getElementById("desdeN").value : document.getElementById("desde").value;
			let hasta = isNotif ? document.getElementById("hastaN").value : document.getElementById("hasta").value;
			let comentarios = isNotif ? document.getElementById("comentariosN").value : "";
			let chk = document.getElementById("chkNotif").checked;
			if (!desde || (!isNotif && !codprofesor) || (isNotif && comentarios=="")) {
				globalMsg("Ingrese los datos requeridos", true);
				return;
			}
			let arr = {
				codProfesor:codprofesor,
				fechaDesde:desde, 
				fechaHasta:hasta, 
				comentarios:comentarios, 
				isNotif:isNotif, 
				chkNotif:chk
			};
			apiData.setData("calendario", 0, arr);
			api.post().then(r=>{
				if (api.r.ok) {
					this.list();
					globalMsg("Datos ingresados", true);
				}
				else globalMsg("No se pudo ingresar la información", true);
			});		
		},
		del:function(k,j,isNotif=false){
			let arr = isNotif ? this.arrNotificaciones[k].notificaciones :  this.arrAusentes[k].ausentes;
			let d = {codigo:arr[j].codigo};
			apiData.setData("calendario", 2, d);
			api.post().then(r=>{
				if (api.r.ok) this.list();
				else globalMsg("No pudo completarse la operación", true);
			});
		},
	},
	mounted:function(){
		this.listDocentes();
		this.list();
		apiData.setData("calendario",2);
		api.get().then(r=>{
			this.showAddMenu = api.r.ok;
		});
	},
});