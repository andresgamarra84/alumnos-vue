(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('after')) {
            return;
        }
        Object.defineProperty(item, 'after', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function after() {
                var argArr = Array.prototype.slice.call(arguments),
                docFrag = document.createDocumentFragment();
                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });
                this.parentNode.insertBefore(docFrag, this.nextSibling);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

function globalMsg(msg = false, btn = false) {
    if (!msg) {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('contenedor_T').style.pointerEvents = 'auto';
        document.getElementById('contenedor_T').style.opacity = "1";
        document.getElementById("popup").innerHTML = "";
    } else {
        let boton = btn ? "<br><input type='button' value='Continuar' onclick='globalMsg(false)'>" : "";
        let content = "<div style='text-align:center;'>" + msg + boton + "</div>";
        document.getElementById("popup").innerHTML = content;
        document.getElementById('contenedor_T').style.opacity = "0.4";
        document.getElementById('contenedor_T').style.pointerEvents = 'none';
        document.getElementById('popup').style.display = 'flex';
    }
};

function globalHTML(html = false, btn = false, caption = "Continuar") {
    document.getElementById("popup").innerHTML = "";
    if (!html) {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('contenedor_T').style.pointerEvents = 'auto';
        document.getElementById('contenedor_T').style.opacity = "1";
    } else {
        //console.log(html);
        document.getElementById("popup").appendChild(html);
        if (btn) {
            let boton = document.createElement("input");
            boton.type = 'button'
            boton.value = caption;
            boton.addEventListener("click", globalHTML());
            document.getElementById("popup").appendChild(boton);
        }
        document.getElementById('contenedor_T').style.opacity = "0.4";
        document.getElementById('contenedor_T').style.pointerEvents = 'none';
        document.getElementById('popup').style.display = 'flex';
    }
}
function setDestinationFolder(){
	let dest = '';
	if (window.location.href.search("adm") != -1) dest = "adm";
	else if (window.location.href.search("profesores") != -1) dest = "profesores";
	else if (window.location.href.search("alumnos") != -1) dest = "alumnos";	
	else if (window.location.href.search("preinscripciones") != -1 || window.location.href.search("inscripcion") != -1 || window.location.href.search("pi-pye") != -1) dest = "preinscripciones";	
	return dest;
}
function getToken() {
	let item = (this.setDestinationFolder()=='adm'?'CJJC_adm':'CJJC_usr');
	return sessionStorage.getItem(item) || null;
}
function createParams(d){
	let params = new URLSearchParams(d);
	let paramsArray = {};
	params.forEach(function(v,c){paramsArray[c] = v});
	return paramsArray;
}
function req (data=null, rType="", method="GET", headers=[], dest='',fileSize=0, payload={}){
	this.data = data;
	this.payload = payload;
	this.rType=rType;
	this.method=method;
	this.headers=headers;
	this.dest=setDestinationFolder();
	this.fileSize=fileSize;
	this.get = function(d, isParam=false) {
		if (!isParam) {
			this.data = createParams(d);
		}
		this.data.dirName = this.dest;
		this.rType = "json";
		this.method = "GET";
	}
	this.post = function(d){
		this.data = {
			"payload":d,
			"dirName":this.dest,
		};
		this.rType = "text";
		this.method = "POST";
	}
	this.file = function(d){
		this.data = createParams(d[0]);
		this.data.dirName = this.dest;
		this.rType='blob';
		this.method = "GET";
		this.fileSize = d[1];
	}
}
var request = new req();
async function rAPI(request) {
	let rootUrl = "https://cjjc.edu.ar/api/";
	let token = getToken();
	let fileSize = 0;
	let body = "";
	let h = {};
	if (token) h["Authorization"] = "Bearer "+token;
	request.headers.forEach(( value) => h[value[0]] = value[1]);
	let response;
	if (request.method == "GET") {
		let ms = Date.now();
		let payload = btoa(JSON.stringify(request.data));
		url = rootUrl + "?token="+token+"&dummy="+ms+"&payload="+payload;
		response = await fetch(url, {method: request.method,headers: h});
	}
	else {
		body = JSON.stringify(request.data);
		h["Content-Type"] = "application/json";
		response = await fetch(rootUrl, {method: request.method,headers: h, body: body});
	}
	let r = {};
	r["status"] = response.status;
	if (response.status == 200 || response.status == 206) {
		if (request.rType == "text") r["response"] = await response.text();
		else if (request.rType == "json") r["response"] = await response.json();
		else if (request.rType == "blob") {
			let contentLength = response.headers.get("Content-Length");
			console.log(contentLength);
			let reader = response.body.getReader();
			let receivedLength = 0;
			let chunks = [];
			let progress = 0;
			while (true){
				const {done, value} = await reader.read();
				if (done) break;
				chunks.push(value);
				receivedLength += value.length;
				progress = receivedLength * 100 / request.fileSize;
				globalMsg("Descargando archivo..."+Math.round(progress)+"%");
			}
			globalMsg();
			r["response"] = new Blob(chunks);
		}
	}
	else {
		r["response"] = r["errMsg"] = await response.text();
		if (r["errMsg"].length>0) globalMsg(r["errMsg"], true);
	}
	request.headers = [];
	return r;
}
function newElem(elName = false, elAttr = []) {
    if (!elName) return false;
    else {
        let el = document.createElement(elName);
        elAttr.forEach(function(val, attr) {
            let atributo = val.split("?");
            el.setAttribute(atributo[0], atributo[1]);
        });
        return el;
    }
}

function cargar(pagina, divDestino = document.getElementById("cuerpo_T"), pdf = false) {
    let html2;
    let js = false;
    fetch(pagina).then(function(response) {
        return response.text();
    }).then(function(html) {
        let p = new DOMParser();
        if (pagina.split(".").pop() == "js") js = true;
        if (!js) {
            if (pdf) html2 = p.parseFromString(html, "blob");
            else html2 = p.parseFromString(html, "text/html");
            let divs = html2.documentElement.querySelectorAll("body")[0];
            if (divs) divDestino.innerHTML = divs.innerHTML;
            let styles = html2.documentElement.querySelectorAll("style");
            styles.forEach(function(el) {
                let sty = document.createElement("style");
                if (el.src) sty.setAttribute("src", el.src);
                else sty.textContent = el.textContent;
                divDestino.appendChild(sty);
            });
            let scripts = html2.documentElement.querySelectorAll("script");
            scripts.forEach(function(el) {
                let scr = document.createElement("script");
                if (el.src) scr.setAttribute("src", el.src);
                else scr.textContent = el.textContent;
                divDestino.appendChild(scr);
            });
        } else {
            let scr = document.createElement("script");
            scr.textContent = html;
            divDestino.appendChild(scr);
        }
    });
}

class APIcjjc {
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
    


  
    async makeRequest(method, resource, data, progressCallback) {
      const url = new URL(this.baseUrl);
      data.resource = resource;
      data.dirName = setDestinationFolder();
      data.token = getToken();


      const headers = {
        'Authorization': `Bearer ${getToken()}`,
      };
  
      const requestOptions = {
        method,
        headers,
      };
      if (data) {
        // Convierte el objeto en parámetros de búsqueda
        const params = new URLSearchParams(data);
  
        if (method === 'GET') {
          // Agrega los parámetros a la URL para solicitudes GET
          url.search += (url.search ? '&' : '') + params.toString();
        } else {
          headers['Content-Type'] = 'application/x-www-form-urlencoded'; // Ajusta el tipo de contenido según sea necesario
          requestOptions.body = params;
        }
      }
      if (method === 'POST' || method === 'file') {
        headers['Content-Type'] = 'application/json'; // Adjust content type as needed
  
        if (method === 'POST') {
          requestOptions.body = JSON.stringify(data);
        } else if (method === 'file') {
          requestOptions.body = data;
        }
      }
      
      const response = await fetch(url, requestOptions);
  /*
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  */
      if (method === 'file') {
        const contentLength = response.headers.get('Content-Length');
        const reader = response.body.getReader();
  
        const total = parseInt(contentLength, 10);
        let loaded = 0;
  
        return new Response(
          new ReadableStream({
            async start(controller) {
              while (true) {
                const { done, value } = await reader.read();
  
                if (done) {
                  controller.close();
                  break;
                }
  
                loaded += value.length;
                progressCallback((loaded / total) * 100);
  
                controller.enqueue(value);
              }
            },
          })
        );
      } else {
        return response.json();
      }
    }
  
    async get(resource, params={}) {
      return this.makeRequest('GET', resource, params);
    }
  
    async post(resource, data={}) {
      return this.makeRequest('POST', resource, data);
    }
  
    async file(resource, data, progressCallback) {
      return this.makeRequest('file', resource, data, progressCallback);
    }
  }
  
  // Ejemplo de uso
  const apiUrl = 'https://cjjc.edu.ar/api/';
  const apiCJJC = new APIcjjc(apiUrl);
  /*
  // Método GET
  api.get('subdirectorio', { key: 'value' })
    .then(data => console.log(data))
    .catch(error => console.error(error));
  
  // Método POST
  api.post('subdirectorio', { key: 'value' })
    .then(response => console.log(response))
    .catch(error => console.error(error));
  
  // Método FILE
  const fileInput = document.getElementById('fileInput'); // Supongamos que tienes un input de tipo file en tu HTML
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
  
    const progressCallback = (percentage) => {
      console.log(`Porcentaje descargado: ${percentage}%`);
    };
  
    try {
      const blob = await api.file('subdirectorio', file, progressCallback);
      // Aquí puedes usar el blob como desees (por ejemplo, crear un enlace de descarga)
    } catch (error) {
      console.error(error);
    }
  });
  */
  
sessionStorage.removeItem("CJJC_usr");
function login(str = false) {
	//let request = new req();
	if (!str) {
		let nrodoc = document.getElementById("denei").value;
		str = nrodoc.trim() + ":" + document.getElementById("passr").value;
		str = window.btoa(str);
		request.headers = [];
		request.headers.push(["Authorization", "Basic "+str]);
		request.get("?resource=login&usr=0&d="+str);
		request.rType = "text";
	}
	else {
		clave1 = document.getElementById("new").value;
		clave2 = document.getElementById("renew").value;
		if (clave1 == clave2) {
			if (clave2.length < 6) alert('Las contraseña debe contener al menos 6 caracteres');
			else if (clave2.length > 15) alert('Las contraseña debe contener menos de 15 caracteres') ;
			else {                        
				let newpwd = btoa(str + ":" + clave2);
				request.headers.push(["Authorization", "Basic " + newpwd]);
				request.get("?resource=login&usr=2"); 
			}
		}
		else alert('Las claves no coinciden');
	}
	rAPI(request).then(r=>{
		switch(r.status) {
			case 401:
				alert("Contraseña incorrecta");
			break;
			case 400:
				alert("El Nro. de DNI no corresponde con un alumno");
			break;
			case 200:
				sessionStorage.setItem("CJJC_usr", r.response);
				window.location.assign("https://cjjc.edu.ar/alumnos/userpanel.php");
			break;
			case 201:
				alert("La contraseña fue actualizada correctamente");
				window.location.assign("https://cjjc.edu.ar/alumnos");
			break;
			case 206:						
				let frm = document.getElementById("log");
				frm.innerHTML ="<div class='col-12'><label>Ingrese una nueva clave (entre 6 y 15 caracteres):</label>"+
				"<input type='password' id='new' required class='form-control'/></div>"+
				"<div class='col-12'><label>Re-ingrese la clave:</label><input class='form-control' type='password' id='renew'></div>"+
				"<div class='col-12'><input type='button' value='Aceptar' onClick='login("+r.response+")'></div>";
			break;
		}
	});
}