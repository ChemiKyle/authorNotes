var main = function () {
	"use strict";

	var dictionary = {};
	var file;
	var $clientAuthorlist = $('select#list-of-authors');

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
		dataCreator();
		console.log(dictionary);
		var dictString = JSON.stringify(dictionary, null, 3);

		var $content = $('#author-content p');
		var authorCount = (Object.keys(dictionary).length);

		for (var i = 0; i < authorCount; i++) { // Update dropdown list with each author
			var thisName = Object.keys(dictionary)[i];
			$clientAuthorlist.append('<option value="'+thisName+'">'+thisName+'</option>');
			console.log('loop works');
		};

		$content.fadeOut('fast', function () {
		$content.empty().append('<pre id="author-content">'+dictString+'</pre>').delay(500).fadeIn(500);
		});
	});

};

$(document).ready(main);

	if (FileReader) {
		
	}
	else {
		window.alert("Unfortunately the browser you are using won't allow me to read files!");
	};