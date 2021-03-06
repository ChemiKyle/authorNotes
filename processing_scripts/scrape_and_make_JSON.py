import time, os, re, json

author_regex = re.compile(r'''(
	\( 					# Open paren
	([A-Z]\.?\s?)*?		# Allow for first name as all initials, e.g.: F. Scott Fitzgerald, J. K. Rowling, W.E.B. Du Bois
	([A-Z]				# First letter must be capitalized, apologies to e e cummings,
						# prevents sentences in parentheses being picked up
	(\w+\s?))*?			# Rest of the name
	([A-Z]\.?\s?)*?		# Allow for middle initials if present, e.g.: Philip K. Dick, George R. R. Martin
	([A-Z]				# Pick up names after middle initial, allowing addl spaces e.g.: Ursala K. Le Guin
	(\w+\s?))*?
	\)					# Close paren
	)''', re.VERBOSE)

notes_filename = 'My_Clippings.txt'
list_of_authors = []

with open(notes_filename, 'r') as f:
	f = f.read()
	for i in author_regex.findall(f):
		i = i[0]
		clean_name = str(i).replace('(' , '').replace(')', '') # Get rid of the parentheses to store author name properly
		if clean_name not in list_of_authors:
			list_of_authors.append(clean_name)

splitup = []

with open(notes_filename, 'r') as f:
	f = f.read()
	big_info_list = f.split('==========') # Splits into tuples of all quote info
	for i in big_info_list:
		i = i.split('\n')
		splitup.append(i)

big_dict = {}
auth_and_book_list = []

for author in list_of_authors:
	quote_num = 0
	big_dict[str(author)] = {}
	for note_block in splitup[1:-1]: # Have to skip the first quote block until I can figure out a workaround in an issue where unicode is appended prior to the first character, last block is empty 
		book_and_author = str(note_block[1]) # Index one is formatted thusly: Book Title (Author Name)
		if str(author) in book_and_author:
			book_name = book_and_author.split('(')[0].strip()
			quote = str(note_block[4])
			try:
				print(big_dict[str(author)][book_name])
			except:
				big_dict[str(author)][book_name] = {}
			big_dict[str(author)][book_name].update({
			'quote' + str(quote_num): quote
			})
			quote_num += 1

# print(auth_and_book_list[1:])
jayson = json.dumps(big_dict)
print(jayson)
print(big_dict[str(author)][book_name])
with open('JSON_DATA.json', 'w') as f:
	for i in jayson:
		f.write(i)