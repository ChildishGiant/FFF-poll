/* global chartXkcd, Chart */

const polls = [
	"1ds73wfg",
	"fc8ezaaf",
	"chfdze7y",
	"pghy3ayw",
	"f79acz3b",
	"sr9sd83r",
	"82p3fgah",
	"ys9f1rkr",
	"wkhgrab6",
	"y6zfs839",
	"d6spz7rb",
	"85sg6kd1",
	"831y2418"
];

const results = {};
let xkcded = false;
const template = "https://strawpoll.com/results?pid=";

const charts = {};
const requests = {}
// Used to make backup
// const allResponse = [];
const backup = [{"total_votes":1206,"title":"Inserters should not chase items","date_created":"2019-08-23 09:54:39","data":[{"name":"Against","votes":594,"id":24818939},{"votes":612,"name":"For","id":24818938}],"timestamp":1566925369,"id":"1ds73wfg"},{"timestamp":1566925369,"data":[{"votes":803,"name":"Against","id":24818943},{"name":"For","votes":418,"id":24818942}],"date_created":"2019-08-23 09:56:52","title":"Blueprint import/export should be a modded feature","total_votes":1221,"id":"fc8ezaaf"},{"title":"Biters should be more aggressive, and probe your defenses","total_votes":1226,"date_created":"2019-08-23 09:57:28","data":[{"id":24818947,"votes":180,"name":"Against"},{"votes":1046,"name":"For","id":24818946}],"timestamp":1566925369,"id":"pghy3ayw"},{"timestamp":1566925369,"data":[{"id":24818945,"votes":736,"name":"Against"},{"id":24818944,"votes":417,"name":"For"}],"date_created":"2019-08-23 09:57:11","title":"Weapons shouldn't lock on","total_votes":1153,"id":"chfdze7y"},{"timestamp":1566925369,"data":[{"id":24818951,"votes":1103,"name":"Against"},{"votes":149,"name":"For","id":24818950}],"date_created":"2019-08-23 09:58:13","total_votes":1252,"title":"Miners shouldn't output directly to belts","id":"sr9sd83r"},{"timestamp":1566925369,"data":[{"id":24818949,"votes":542,"name":"Against"},{"votes":520,"name":"For","id":24818948}],"date_created":"2019-08-23 09:57:54","title":"Clearing bases should not leave you safe","total_votes":1062,"id":"f79acz3b"},{"data":[{"name":"Against","votes":846,"id":24818953},{"id":24818952,"votes":209,"name":"For"}],"timestamp":1566925369,"total_votes":1055,"title":"Boilers shouldn't have a water output","date_created":"2019-08-23 09:58:28","id":"82p3fgah"},{"title":"Pipes should work like electricity","total_votes":1235,"date_created":"2019-08-23 09:58:41","data":[{"id":24818957,"name":"Against","votes":785},{"id":24818956,"votes":450,"name":"For"}],"timestamp":1566925369,"id":"ys9f1rkr"},{"timestamp":1566925369,"data":[{"id":24818959,"votes":246,"name":"Against"},{"id":24818958,"votes":701,"name":"For"}],"date_created":"2019-08-23 09:59:02","title":"Adventure mode","total_votes":947,"id":"wkhgrab6"},{"date_created":"2019-08-23 09:59:42","total_votes":1074,"title":"Items should have volume and mass","timestamp":1566925369,"data":[{"name":"Against","votes":652,"id":24818968},{"votes":422,"name":"For","id":24818967}],"id":"d6spz7rb"},{"data":[{"name":"Against","votes":532,"id":24818966},{"votes":564,"name":"For","id":24818965}],"timestamp":1566925369,"title":"Robots should take up space and time","total_votes":1096,"date_created":"2019-08-23 09:59:22","id":"y6zfs839"},{"total_votes":910,"title":"Power-user hotkeys","date_created":"2019-08-23 10:00:00","data":[{"id":24818970,"votes":76,"name":"Against"},{"name":"For","votes":834,"id":24818969}],"timestamp":1566925369,"id":"85sg6kd1"},{"total_votes":1140,"title":"Mining furnaces and assembling machines should return the ingredients for the in-progress recipe","date_created":"2019-08-23 10:00:16","data":[{"id":24818972,"votes":157,"name":"Against"},{"id":24818971,"name":"For","votes":983}],"timestamp":1566925369,"id":"831y2418"}]


function styleToggle() {
	xkcded = !xkcded;

	switch (xkcded) {

	case true:
		document.body.classList.add("xkcd");
		break
	default:
		document.body.classList.remove("xkcd");

	}




	let elements = document.getElementsByClassName("pie-chart");
	for (let i = 0; i < elements.length; i++) {

		switch (xkcded) {
		case true:
			elements[i].style.display = "none"
			break
		default:
			elements[i].style.display = "block"
		}

	}

	elements = document.getElementsByClassName("pie-chart-XKCD");
	for (let i = 0; i < elements.length; i++) {

		switch (xkcded) {
		case true:
			elements[i].style.display = "block"
			break
		default:
			elements[i].style.display = "none"
		}

	}
}

function get(poll) {


	requests[polls[poll]] = new XMLHttpRequest();
	requests[polls[poll]].open("GET", "https://cors-anywhere.herokuapp.com/" + template + polls[poll], true);

	requests[polls[poll]].onload = function () {


		if (requests[polls[poll]].status >= 200 && requests[polls[poll]].status < 400) {
		// if (false){
			// Success!
			results[poll] = JSON.parse(requests[polls[poll]].responseText);
			// Used to make backup
			// results.id = polls[poll];
			// allResponse.push(results);

		} else {
			// We reached our target server, but it returned an error
			// Use fallback data
			console.log(`There was an issue getting live data, using backup data for poll #${poll} (${polls[poll]})`);
			results[poll] = backup[poll]

		}

		// Backup or not, process it
		process(results[poll], poll)
		// process(results[poll], poll)

	}

	requests[polls[poll]].onerror = function () {
		// There was a connection error of some sort
	};

	requests[polls[poll]].send();
}

for (const poll in polls) {

	get(poll);

}

/**
 * Takes the data and makes the graphs etc
 * @param  {json} results - Results for one poll
 * @param  {int} poll
 * @param  {boolean} xkify - If true, use chart.xkcd
 */
function process (results, poll, xkify) {
	const names = [];
	const votes = [];

	results.data.sort(function(a, b) {
		// return (a.id > b.id) ? 1 : ((a.id < b.id) ? -1 : 0);
		return (b.id > a.id) ? 1 : ((b.id < a.id) ? -1 : 0);
	});

	for (const point in results.data) {

		names.push(results.data[point].name);
		votes.push(results.data[point].votes);
	}

	charts[polls[poll]] = new chartXkcd.Pie(document.getElementById(`${polls[poll]}-XKCD`), {
		// title: results.title, // optional
		data: {
			labels: names,
			datasets: [{
				data: votes,
			}],
		},
		options: { // optional
			innerRadius: 0.5,
			legendPosition: chartXkcd.config.positionType.upRight,
		},
	});

	// Add title for section
	var h2 = document.createElement("h2");
	var title = document.createTextNode(results.title);
	h2.appendChild(title);
	document.getElementById(polls[poll]).parentNode.prepend(h2)

	// Add link to poll
	var link = document.createElement("a");
	var text = document.createTextNode("Link to the poll");
	link.appendChild(text);
	// a.title = "my title text";
	link.classList.add("pollLink");
	link.href = "https://strawpoll.com/" + polls[poll];
	document.getElementById(polls[poll]).parentNode.appendChild(link)

	charts[polls[poll]] = new Chart(document.getElementById(polls[poll]), {
		type: "pie",
		data: {
			labels: names,
			datasets: [{
				data: votes,
				backgroundColor: [
					"#ff6384",
					"#36a2eb"
				]
			}],
		},
		options: {
			// layout: {
			// 	padding: {
			// 		left: 100,
			// 		right: 100
			// 	}
			// },

			// title: {
			// 	display: true,
			// 	text: results.title,
			// 	fontColor: "#c8c8c8",
			// 	fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
			// 	fontStyle: "normal"
			// },
			responsive: true,
			aspectRatio: 3,
			legend: {
				reverse: true,
				labels: {
					boxWidth: 12
				}
			},
			// https://stackoverflow.com/a/49717859/8456445
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						var dataset = data.datasets[tooltipItem.datasetIndex];
						var meta = dataset._meta[Object.keys(dataset._meta)[0]];
						var total = meta.total;
						var currentValue = dataset.data[tooltipItem.index];
						var percentage = parseFloat((currentValue/total*100).toFixed(1));
						return `${percentage}% (${currentValue})`;
						// return " (" + percentage + "%)"currentValue + ;
					},
					title: function(tooltipItem, data) {
						return data.labels[tooltipItem[0].index];
					}
				}
			},
		}
	});
}