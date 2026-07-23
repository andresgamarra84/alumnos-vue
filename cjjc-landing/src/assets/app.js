var contentCJJC = new Vue({
    el: "#contenido",
    data:{
		showInicio:true,
        contenidoSeccion:'',
    },
});
var navCJJC = new Vue({
    el: '#navbarSupportedContent',
    data: {
        navBarContent:"",
    },
    methods:{
        async cargarContenido(seccion) {
            try {
				let elCont = document.getElementById("contenido");
				elCont.classList.remove("visible");
                const data = await this.getDataFromServer(seccion);
                contentCJJC.contenidoSeccion = data.html; // Asigna los datos al contenido de la instancia de Vue
				this.$nextTick(() => {
					// Ahora ejecuta los scripts y aplica el CSS
					this.executeScripts(data.js, data.css);
					setTimeout(function(){
						elCont.classList.add("visible");
					}, 700);
				});
				const navbarCollapse = document.querySelector("#navbarSupportedContent");
				var bsCollapse = new bootstrap.Collapse(navbarCollapse, {
					toggle: false
				});
				bsCollapse.hide(); // Colapsar
            } catch (error) {
                // Maneja el error si ocurre
                console.error('Error al cargar contenido:', error);
            }
        },
		async getDataFromServer(d) {
			let url = "https://cjjc.edu.ar/web/getContent.php";
			try {
				const response = await fetch(url + '?s=' + d);
				const data = await response.json();
				return data;
			} catch (error) {
				console.error('Error al cargar contenido:', error);
				throw error; // Propaga el error para que pueda ser manejado por el código que llama a esta función
			}
		},
		handleClick(event) {
            // Verifica si el clic ocurrió en un enlace dentro de #navbarSupportedContent
            if (event.target.tagName === "A" && event.target.closest("#navbarSupportedContent")) {
                // Obtenemos la sección de los atributos de datos personalizados (si lo tienes)
                const seccion = event.target.dataset.cjjcSeccion;
                if (seccion) this.cargarContenido(seccion);
            }
        },
		executeScripts(js,css) {
			if (document.getElementById("tempScript")) document.getElementById("tempScript").remove();
			if (document.getElementById("tempCSS")) document.getElementById("tempCSS").remove();
			let tempScript = document.createElement("script");
			tempScript.id = "tempScript";
			let tempCSS = document.createElement("style");
			tempCSS.id = "tempCSS";
			tempScript.textContent = js;
			tempCSS.textContent = css;
			document.body.appendChild(tempScript);
			document.head.appendChild(tempCSS);
		}
    },
    async mounted() {
        try {
            const navBarData = await this.getDataFromServer("navBar");
            this.navBarContent = navBarData.html; // Asigna los datos al contenido de la barra de navegación
			this.cargarContenido("inicio");
        } catch (error) {
            // Maneja el error si ocurre
            console.error('Error al cargar contenido:', error);
        }
    },
});
function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations, observer) => {
        if (document.querySelector(selector)) {
            callback();
            observer.disconnect(); // Deja de observar una vez encontrado el elemento
        }
    });

    // Configuración del observador para observar cambios en el DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Uso del waitForElement para esperar a que un elemento con el id "mi-elemento" exista
waitForElement('#carr_inner', () => {
	var carrusel = new Vue({
		el:'#carr_inner',
		data:{
			contentCarrousel:'',
		},
		methods:{
			async list(){
				let d = await navCJJC.getDataFromServer("carrusel");
				this.contentCarrousel = d["html"];
			},
		},
		async mounted(){
			this.list();
		},
	});
});
async function request(method = "GET", data = {}) {
	const baseURL = "https://cjjc.edu.ar/api/";
    if (!data) {
      console.warn("No data provided for the request. Aborting fetch.");
      return Promise.reject(new Error("No data provided"));
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const options = {method, headers};
    let url = "";
    if (method === "GET") {
      const queryString = new URLSearchParams({
        dirName: "public",
        resource: data.resource ?? "",
        id: data.id ?? 0,
        payload: JSON.stringify(data.payload ?? {}),
      }).toString();
      url = `${baseURL}?${queryString}`;
    }
    try {
      const response = await fetch(url, options);
      const ok = response.ok;
      const status = response.status;
      if (!ok) {
        const errorResponse = await response.text(); // Captura errores específicos del servidor
        const errMsg = errorResponse;
        if (errMsg != "") console.log(errMsg);
        throw new Error(`HTTP Error: ${response.status} - ${errorResponse}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API Error:", error.message);
      throw error; // Rethrow para manejarlo en el nivel superior
    }
}
function getAPI(d) {
return this.request("GET", d);
}