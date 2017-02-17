var main = function () {
	"use strict";
	
	var clearLeftPage = function() {
		$("div.left-page").empty();
	};

	$("input#file-submit").on("click", function() {
		clearLeftPage();
	});

	var fileParser = function(users-file) {

	};

	var dataCreator = function(text) {
		var splitup = text.split('==========');
		for (var i = 0; i < splitup.length - 1; i++) {
			var current = splitup[i].split('\n');
			
			var authorLine = current[1].split('(');
			var bookTitle = authorLine[0].trim();
			var authorName = authorLine.slice(-1)[0].replace(')', '');
			var quote = current[4].toString();
			try {
				dictionary[authorName][bookTitle]['quote' + i] = quote;
			}
			catch (err) {
				if (err.message === 'dictionary[authorName] is undefined') {
					dictionary[authorName] = {};
					dictionary[authorName][bookTitle] = {};
					dictionary[authorName][bookTitle]['quote' + i] = quote;
				};
			};
		};
	};

	if (FileReader) {

		var dict = [];

		var fileInput = document.getElementById('file');

		function getText(readFile) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var text = reader.result;
			}
			fileDisplayArea.innerText = reader.result;
			reader.readAsText(readFile);
		};
	}
	else {
		window.alert("Unfortunately the browser you are using won't allow me to read files!");
	};
};

$(document).ready(main);