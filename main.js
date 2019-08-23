import {addToStore} from './idb.js';

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("q").focus();
});

document.getElementById("search").addEventListener("submit", async e => {
	const q = escapeString(document.getElementById("q").value);
	if (!q) return;
	//loading(true);
	e.preventDefault();
	// const requests = [getMalayalam(q), getEnglish(q)];
	// const results = await Promise.all(requests);
	// loading(false);
	// renderMalayalam(q, results[0]);
	// renderEnglish(q, results[1]);
	getMalayalam(q).then(d => renderMalayalam(q, d));
	getEnglish(q).then(d => renderEnglish(q, d));
});

const cleanUp = q => q.toLowerCase().replace("%20", "").trim();
const escapeString = q => escape(q.replace(/[^a-z0-9\+\-\s]/gi, "").replace(/\s+/g, " "));
const loading = show => {
	const element = document.getElementById("loading");
	show ? element.style.display = "" : element.style.display = "none";
};

const getEnglish = async q => {
	const request = await fetch(`https://googledictionaryapi.eu-gb.mybluemix.net/?define=${q}&lang=en`);
	return await request.json();
}

const getMalayalam = async q => {
	const request = await fetch(`https://olam.in/Dictionary/en_ml/${q}?json=1`);
	return await request.json();
}

const renderMalayalam = (q, data) => {
    if(isEmpty(data)) return;
	let html = "";
	data.forEach(element => {
		html += `<li><h2> ${element.word} </h2><ul class="definitions">`;
      	element.definitions.forEach(def => html += `<li>${def}</li>`);
      	html += "</ul></li>";
	});
	document.getElementById("results").innerHTML += html;
	addToStore(cleanUp(q), data);
}

const renderEnglish = (q, data) => {
	if(isEmpty(data)) return;
	let html = `<li><h2> ${q} </h2><ul class="definitions">`;;
	data.forEach(element => {
      	element.meaning.noun.forEach(x => html += `<li>${x.definition}</li>${x.example ? `<li>eg: ${x.example}</li>` : ''}`);
	});
	html += "</ul></li>";
	document.getElementById("results").innerHTML += html;
	//addToStore(cleanUp(q), data);
}

const noResults = data => {
	if (!data || data.length < 1) {
		document.getElementById("results").innerHTML = `No results found for ${q}`;
		return;
	}
}

const isEmpty = data => !data || data.length < 1;