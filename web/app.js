var main = function () {
	"use strict";

	var dictionary = {};
	var file = '';

	var clearLeftPage = function() {
		$("div.left-page").empty();
	};

	$("input#file-submit").on("click", function() {
		clearLeftPage();
	});

	var getText = function() {
		document.getElementById("fileInput").addEventListener("change", function() {
			var r = new FileReader();

			r.onload = function() {
				file = this.result;
				console.log(file);
				return file;
			}
			r.readAsText(this.files[0]);
			});
		}

	var dataCreator = function(text) {
		text = file + ''; // Get rid of annoying console error saying split isn't a function
		var splitup = text.split('==========');
		for (var i = 0; i < splitup.length - 1; i++) {
			var current = splitup[i].split('\n');
			
			var authorLine = current[1].split('('); // First line of each block is Book Title (Author Name)
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
				}
				else if (err.message === 'dictionary[authorName][bookTitle] is undefined') {
					dictionary[authorName][bookTitle] = {};
					dictionary[authorName][bookTitle]['quote' + i] = quote;					
				};
			};
		};
	return dictionary;
	};


	getText();

	$('button#process').on('click', function() {
		dataCreator();
		console.log(dictionary);
	});

};

$(document).ready(main);

	if (FileReader) {
		console.log("Should work")
	}
	else {
		window.alert("Unfortunately the browser you are using won't allow me to read files!");
	};