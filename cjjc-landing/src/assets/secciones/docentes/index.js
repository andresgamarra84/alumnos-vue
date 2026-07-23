new Vue({
	el: '#app',
	data: {
		entries: [] // Aquí se almacenarán las entradas de blog
	},
	created() {
		this.fetchEntries();
	},
	methods: {
		fetchEntries() {
			const d = {
				resource:"agenda",
			};
			getAPI(d).then(r=>r.payload.forEach(v=>this.entries.push(v)));
		}
	}
});