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
				return file;
			}
			r.readAsText(this.files[0]);
			});
	}

	var dataCreator = function(text) {
		text = file + ''; // Get rid of annoying console error saying split isn't a function
<<<<<<< HEAD

		// Define placeholder variables
		var authorName = '';
		var bookTitle = '';

		var splitup = text.split('==========');

		// First quote must be obtained separately as it does not conform to the same pattern
		var firstQuoteBlock = splitup[0].split('\n');
		var authorLine = firstQuoteBlock[0].split('(');
		var quote = firstQuoteBlock[3];

		var getAuthorAndBookTitle = function () {
			bookTitle = authorLine[0].trim();
			authorName = authorLine.slice(-1)[0].replace(')', '');
		};
		getAuthorAndBookTitle();
		
		dictionary[authorName] = {};

		var writeBookSpot = function() {
				dictionary[authorName][bookTitle] = {};
				dictionary[authorName][bookTitle]['quote' + i] = quote;
		};
		var i = 0;
		writeBookSpot();


		

		// Get the rest of the quotes
		for (var i = 1; i < splitup.length - 1; i++) {
			var current = splitup[i].split('\n');
			
			authorLine = current[1].split('('); // First line of each block is Book Title (Author Name)
			getAuthorAndBookTitle();
			quote = current[4].toString();
=======
		var splitup = text.split('==========');
		for (var i = 1; i < splitup.length - 1; i++) { // First value doesn't conform due to lack of leading equal signs
			var current = splitup[i].split('\n');
			
			var authorLine = current[1].split('('); // First line of each block is Book Title (Author Name)
			var bookTitle = authorLine[0].trim();
			var authorName = authorLine.slice(-1)[0].replace(')', '');
			var quote = current[4].toString();
			var writeBookSpot = function() {
					dictionary[authorName][bookTitle] = {};
					dictionary[authorName][bookTitle]['quote' + i] = quote;
			};

>>>>>>> 67f867e6ca4ce92017ce1d40693218dbd6313fd9

			try {
				dictionary[authorName][bookTitle]['quote' + i] = quote;
			}
			catch (err) { //Will need to create blank dictioary entries if first time seeing author/book
				// Firefox
					if (err.message === 'dictionary[authorName] is undefined') {
						dictionary[authorName] = {};
						writeBookSpot();	
					}
					else if (err.message === 'dictionary[authorName][bookTitle] is undefined') {
						writeBookSpot();					
					}
				// Chrome errors
					else if (err.message === "Cannot read property '"+bookTitle+"' of undefined") {
						dictionary[authorName] = {};
						writeBookSpot();
					}
					else if (err.message === "Cannot set property 'quote"+i+"' of undefined"){
						writeBookSpot();
					};
			};
			// finally {
			// 	dictionary[authorName] = {};
			// 	writeBookSpot();	
			// };
		};
	return dictionary;
	};


	getText();

	$('button#process').on('click', function() {
		dictionary = dataCreator();
		console.log(dictionary);
		var dictString = JSON.stringify(dictionary, null, 3);
		console.log(dictString);
<<<<<<< HEAD
=======
// TESTING HOW TO PRETTY FORMAT
>>>>>>> 67f867e6ca4ce92017ce1d40693218dbd6313fd9

		var $content = $('#author-content p');

		$content.fadeOut('fast', function () {
		$content.empty().append('<pre id="author-content">'+dictString+'</pre>').delay(500).fadeIn(500);
		});
	});

};

$(document).ready(main);

	if (FileReader) {
		console.log("Should work")
	}
	else {
		window.alert("Unfortunately the browser you are using won't allow me to read files!");
	};