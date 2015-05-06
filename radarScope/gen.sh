#!/usr/bin/env node
var fs = require('fs');
var sys = require('sys');
var util = require('util');

fs.readFile('201501.json', function(err, data) {
var months = [
"201212",
"201301",
"201302",
"201303",
"201304",
"201305",
"201306",
"201307",
"201308",
"201309",
"201310",
"201311",
"201312",
"201401",
"201402",
"201403",
"201404",
"201405",
"201406",
"201407",
"201408",
"201409",
"201410",
"201411",
"201412",
"201501",
"201502"];
	var json = JSON.parse(data);
	months.forEach(function(d) {
		json.forEach(function(obj) {
			obj.score = parseFloat((1 + Math.random() * 3.5).toFixed(1));
		});
		json.sort(function(a, b) {
			if (a.score < b.score) return 1;
			if (a.score == b.score) return 0;
			if (a.score > b.score) return -1;
		});
		fs.writeFile(d + '.json', JSON.stringify(json, null, "  "));
	});
});
