var main = function() {
	"use strict";

	// Declare some variables at the outset
	var dictionary = {};
	var file = '';
	var pageNum;
	var authBookList;
	var userSelectedAuthor;
	var $clientListOfBooks = $('select#list-of-books');
	var authorName;
	var bookTitle;
	var quote;
	var current;
	var authorIDs = {};
	var bookIDs = {};
	var $content = $('#author-content p');
	var isNote = '';
	var pageNum = '';
	

	$clientListOfBooks.hide(); // This doesn't quite work yet
	$('div#author-list').hide();

	document.getElementById("file-input").addEventListener("change", function() {
		var r = new FileReader();

		r.onload = function() {
			file = this.result;
			return file;
		}
		r.readAsText(this.files[0]);
	});

	var dataCreator = function(text) {
		text = file + ''; // Get rid of annoying console error saying split isn't a function
		// Define placeholder variables

		var splitup = text.split('==========');

		// First quote must be obtained separately as it does not conform to the same pattern
		var firstQuoteBlock = splitup[0].split('\n');
		var authorLine = firstQuoteBlock[0].split('(');
		var contextLine = firstQuoteBlock[1].split('|');

		quote = firstQuoteBlock[3];

		var getQuoteInfo = function() {
			bookTitle = authorLine[0].trim();
			bookTitle = bookTitle.toString();
			authorName = authorLine.slice(-1)[0].replace(')', '');
			authorName = authorName.toString();
			pageNum = '<br> - ' + contextLine[0].slice(19);
			if (contextLine[0].includes("Note")) {
				isNote = 'With the next quote, you wrote: ';
				pageNum = '';
			}
			else if (contextLine[0].includes("Bookmark")) {
				isNote = 'You set a bookmark';
			}
			else {
				isNote = '';
			};
		};
		getQuoteInfo();

		dictionary[authorName] = {};

		var i = 0;
		var writeBookSpot = function() {
			dictionary[authorName][bookTitle] = {};
			dictionary[authorName][bookTitle]['quote' + i] = isNote + quote + pageNum;
		};
		writeBookSpot();

		// Get the rest of the quotes
		for (var i = 1; i < splitup.length - 1; i++) {
			current = splitup[i].split('\n');

			authorLine = current[1].split('('); // First line of each block is Book Title (Author Name)
			contextLine = current[2].split('|');
			getQuoteInfo();
			quote = current[4].toString();
			try {
				dictionary[authorName][bookTitle]['quote' + i] = isNote + quote + pageNum;
			} catch (err) { //Will need to create blank dictioary entries if first time seeing author/book
				// Firefox
				if (err.message === 'dictionary[authorName] is undefined') {
					dictionary[authorName] = {};
					writeBookSpot();

				} else if (err.message === 'dictionary[authorName][bookTitle] is undefined') {
					writeBookSpot();
				}
				// Chrome errors
				else if (err.message === "Cannot read property '" + bookTitle + "' of undefined") {
					dictionary[authorName] = {};
					writeBookSpot();
				} else if (err.message === "Cannot set property 'quote" + i + "' of undefined") {
					writeBookSpot();
				};
			};
		};
		return dictionary;
	};



	$('button#process').click(function() {

		$('#chap-title').empty('slow');
		$('#chap-title').append('<h3>Contents</h3>');

		$('div#author-list').show( function() {
			$('div#author-list').fadeIn();
		});
		
		$('div.intro-text').hide('slow', function() {
			$('div.into-text').remove();
		});

		if (file === '') { // If the user hasn't uploaded a file assume they're running a demo
			file = document.getElementById('default-quotes').innerText;

			$('div#default-quotes').show(function() {
				$('div#default-quotes').fadeIn('slow');
		});

		};
		dataCreator();

		$content.fadeOut().empty();

		var authorCount = (Object.keys(dictionary).length);

		for (var i = 0; i < authorCount; i++) {
			var thisName = Object.keys(dictionary)[i];
			$('table#author-table').append('<tr class="author-row" value="'+i+'"><td>'+thisName+'</td></tr>');

			authorIDs[i] = thisName; // Directly calling the author's name as a key returns undefined
			// If a user's file is parsed and a key is 'Cormac McCarthy', calling dictionary['Cormac McCarthy'] returns undefined
			// The key as generated from the parsing function is NOT the same as the string,
			// i.e. even if authorName = 'Cormac McCarthy', (authorName === 'Cormac McCarthy') evaluates as false!
		};
		var $clientAuthTableItem = $('table#author-table');

		var auth = 0;
		$.each(dictionary, function() { // List of books level
			$content.append('<p class="books-by">Books by ' + (authorIDs[auth]) + '</p>');
			auth++;
			var bookTitles = Object.keys(this);
			
			var alreadyQuoted = []; // Declare a list of marked quotes so no repeats are made
			for (var j = 0; j < Object.keys(this).length; j++) {
				var thisTitle = Object.keys(this)[j];

				$clientListOfBooks.append('<option value="' + j + '">' + thisTitle + '</option>');

				$content.append('<p>Quotes from ' + thisTitle + '</p>');
				
				// There's an error where if you have multiple books by an author, you get all their quotes from the first book as many times as you have books
				// Luckily, cutting off repeats the kindle includes from deleting and re-highlighting also kills this bug 
				$.each(this, function() { // list of quotes level
					$.each(this, function() { // add individual quotes
						if ($.inArray(this, alreadyQuoted) == -1) {
							$content.append('<p class="quote">' + this + '</p>');
						}
						else {
						};
					});
				});


			};
		});
	$content.fadeIn();

	$clientAuthTableItem.on('click', 'tr', function() { // Allow user to select an author by clicking their name

		$content.empty();

		userSelectedAuthor = $(this).attr("value");
		userSelectedAuthor = authorIDs[userSelectedAuthor];

		$clientListOfBooks.empty();
		$content.append('<p class="books-by">Books by ' + userSelectedAuthor + '</p>'); // Replace the list of books with books only by this author

		var bookNum = 0;

		$.each(dictionary[userSelectedAuthor], function() { // List of quotes level
			var currentBook = Object.keys(dictionary[userSelectedAuthor])[bookNum];
			$content.append('<p>Quotes from ' + currentBook + '</p>'); // Add the title of each book to the viewer
			$clientListOfBooks.append('<option value="' + bookNum + '">' + currentBook + '</option>');
			bookNum++;
			$.each(this, function() { // Individual quotes level
				$content.append('<p class="quote">' + this + '</p>');
			});
		});

		$content.fadeIn('slow');
	});

	});

};


$(document).ready(main);
$('div#default-quotes').hide(); // Don't show the defaults unless the user doesn't input a file

if (FileReader) {}
else {
	window.alert("Unfortunately the browser you are using won't allow me to read files!");
};