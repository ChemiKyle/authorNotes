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

notes_filename = 'My Clippings.txt'

list_of_authors = []

with open(notes_filename, 'r') as f:
	f = f.read()
	for i in author_regex.findall(f):
		i = i[0]
		clean_name = str(i).replace('(' , '').replace(')', '') # Get rid of the parentheses to store author name properly
		if clean_name not in list_of_authors:
			list_of_authors.append(clean_name)


big_dict = {}
auth_and_book_list = []

auth_num = 0
quote_num = 0

for author in list_of_authors:
	big_dict['little_dict' + str(auth_num)] = {}
	with open(notes_filename, 'r+') as f:
		for line in f:
			if str(author) in line:
				big_dict['little_dict' + str(auth_num)]['quote_num' + str(quote_num)] = {}
				book_name = line.split('(')[0].strip()
				if (author, book_name) not in auth_and_book_list: #Store author and book name as a tuple, in case I need this for the dict
					auth_and_book_list.append((author, book_name))
				big_dict['little_dict' + str(auth_num)]['quote_num' + str(quote_num)].update({
				'author_name': author,
				'book_name': book_name,
				'quote': 'coming soon'
				})
				quote_num += 1
	auth_num +=1

# print(auth_and_book_list[1:])
jayson = json.dumps(big_dict)
print(jayson)