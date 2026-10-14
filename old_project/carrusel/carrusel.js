var carrusel = new Vue({
    el: '#app',
    data: {
        formData: {
			imagen: null,
			link: '',
			descripcion: '',
			fechaInicio: '',
			fechaFin: '',
			indefinido: false,
			oculto: false,
			duracion: null,
		},
		upl: null,
		arrListaCarrusel:[],
    },
    methods: {
		list(){
			this.arrListaCarrusel = [];
			apiData.setData("edithtml",2);
			api.get().then(r=>r.payload.forEach(v=>this.arrListaCarrusel.push(v)));
		},
		initResumable() {
            this.upl = new Resumable({
                target: 'https://cjjc.edu.ar/api/',
                query: {
                    type: "carrusel",
                    setFname: '',
                }
            });
        },
		uplData(k, p){
			let v = event.target;
			console.log(v);
			v = (p == "oculto" || p == "indefinido"?(v.checked?1:0):v.value);
			this.arrListaCarrusel[k][p] = v;
			apiData.setData("edithtml", 6, this.arrListaCarrusel[k]);
			api.post().then(r=>{
				if (!api.r.ok) globalMsg("No se pudieron actualizar los datos", true);
			});
		},
		borrarItem(k){
			let q = confirm("¿Confirma que desea borrar este ítem? Esta acción no se puede deshacer");
			if (q) {
				let d = {
					"codigo":this.arrListaCarrusel[k].codigo,
				};
				apiData.setData("edithtml", 7, d);
				api.post().then(r=>{
					if (api.r.ok) this.arrListaCarrusel.splice(k,1);
				});
			}
		},
        limpiar() {
            this.formData.link = '';
            this.formData.descripcion = '';
            this.formData.fechaInicio = '';
            this.formData.fechaFin = '';
            this.formData.indefinido = false;
            this.formData.oculto = false;
            this.formData.duracion = 3;
            this.formData.imgPath = null;
            // Resetea el input de archivo
            document.getElementById('imgPath').value = '';
        },
		enviar:function(){
			this.formData.indefinido = this.formData.indefinido ? 1 : 0;
			this.formData.oculto = this.formData.oculto ? 1 : 0;
			let data = this.formData;
			this.upl.opts.query = {
				"resource":"f",
				"payload": JSON.stringify({
					"type":"carrusel",
					"customFileName":data.imgPath,
				}),
			};
			this.upl.on('fileSuccess', (file)=>{
				//globalMsg("Subiendo...");
				apiData.setData("edithtml", 5, data);
				api.post().then(r=>{
					if (api.r.ok) globalMsg("Datos ingresados", true);
					else globalMsg("No pudieron ingresarse los datos solicitados", true);
					this.list();
					carrusel.upl = new Resumable({
						target: 'https://cjjc.edu.ar/api/',
					});
				});
			});
			this.upl.upload();
		},
		prepareUpload:function(){
			let f = document.createElement("input");
			f.setAttribute("type","file");
			this.upl.assignBrowse(f);
			this.upl.on('fileAdded', (file, event)=>{
				carrusel.formData.imgPath = Date.now()+"-"+file.fileName;
				if(getFileType(file.file)=="video") alert("No pueden subirse videos a la página.");
			});
			this.upl.on('fileProgress', (file)=>{
				let n = parseInt(this.upl.progress()*100);
				globalMsg("Aguarde mientras se carga el archivo..."+n+"%");
			});
			
			f.click();
		},
		waitForResumable() {
            return new Promise((resolve) => {
                const checkResumable = () => {
                    if (typeof Resumable !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkResumable, 100); // Revisar cada 100ms
                    }
                };
                checkResumable();
            });
        },
    },
	async mounted() {
        // Esperar a que Resumable esté disponible
        await this.waitForResumable();
        this.initResumable();
        this.list();
    },
});