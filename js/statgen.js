"use strict";
const RACE_JSON_URL = "data/races.json";

let amount, count;

let raceData;

function loadRaceJson() {
	loadJSON(RACE_JSON_URL, onJsonLoad)
}

window.onload = function load() {
	loadRaceJson();
};

function onJsonLoad(data) {
	raceData = data.race;

	$(".base").on("input", changeBase);
	$("input.choose").on("change", choose);

	const names = raceData.map(x => x.name).sort();
	const options = names.map(name => `<option>${name}</option>`).join();
	$("#race").append(options).change(changeRace).change();
}

window.onhashchange = function hashchange() {
	const hash = window.location.hash.slice(1);
	$(".statmethod").hide();
	$("#" + hash).show();
};

function getCost(n) {
	if (n < 14)
		return n - 8;
	if (n === 14)
		return 7;
	if (n === 15)
		return 9;
	if (n === 16)
		return 12;
	if (n === 17)
		return 15;
	return 19
}

function choose() {
	if ($("input.choose:checked").length > count)
		return this.checked = false;

	$(".racial", this.parentNode.parentNode)
		.val(this.checked ? amount : 0);
	changeTotal()
}

function changeRace() {
	const race = this.value;
	const stats = raceData
		.find(({name}) => name === race).ability;

	$(".racial").val(0);
	for (const key in stats)
		$(`#${key} .racial`).val(stats[key])

	changeTotal();
	$(".choose").hide().prop("checked", false);

	if (!stats.choose)
		return;

	const {from} = stats.choose[0];
	amount = stats.choose[0].amount || 1;
	count = stats.choose[0].count;

	$("td.choose").text(`Choose ${count}`).show();
	from.forEach(key => $(`#${key} .choose`).show())
}

function changeTotal() {
	$("#pointbuy tr[id]").each((i, el) => {
		const [base, racial, total, mod] = $("input", el).get();
		const raw = total.value = Number(base.value) + Number(racial.value);
		mod.value = Math.floor((raw - 10) / 2)
	})
}

function changeBase(e) {
	const budget = Number($("#budget").val());
	
	$(".base").each((i, el) =>
		el.value = el.value < 18 ? el.value : 18);

	let cost = 0;
		
	$(".base").each((i, el) =>
		cost += getCost(Number(el.value)));

	if (cost > budget)
		return this.value = this.dataset.prev;

	this.dataset.prev = this.value;
	$("#remaining").val(budget - cost);

	changeTotal()
}
