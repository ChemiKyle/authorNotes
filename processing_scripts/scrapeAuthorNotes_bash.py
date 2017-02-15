import time, os, re

author_regex = re.compile(r'''(
	\( 					# Open paren
	([A-Z]\.?\s?)*?		# Allow for first name as all initials, e.g.: F. Scott Fitzgerald, J. K. Rowling, W.E.B. Du Bois
	([A-Z]				# First letter must be capitalized, apologies to ee cummings,
						# prevents sentences in parentheses being picked up
	(\w+\s?))*?			# Rest of the name
	([A-Z]\.?\s?)*?		# Allow for middle initials if present, e.g.: Philip K. Dick, George R. R. Martin
	([A-Z]				# Pick up names after middle initial, allowing addl spaces e.g.: Ursala K. Le Guin
	(\w+\s?))*?
	\)					# Close paren
	)''', re.VERBOSE)

list_of_authors = []

with open('kindleNotes.txt', 'r') as f:
	f = f.read()
	for i in author_regex.findall(f):
		i = i[0]
		clean_name = str(i).replace('(' , '').replace(')', '') # Get rid of the parentheses to store author name properly
		if clean_name not in list_of_authors:
			list_of_authors.append(clean_name)

kindleNotes = 'kindleNotes.txt'

for i in list_of_authors:
	splitName = i.split(' ') # Split each list element (i.e. each author) by spaces to isolate first and last name
	firstName = ''.join(splitName[:1]) # Take the first value in the list, strip off brackets
	lastName = ''.join(splitName[1:]) # Do the same for the second value
#TODO: rewrite this as a regex
	if lastName == "K.Dick":
		searchLastName = "K.\ Dick"
	elif lastName == "D.Thoreau":
		searchLastName = "D.\ Thoreau"
	else:
		searchLastName = lastName 
	bashCommand = str("less " + str(kindleNotes) + " | grep -A 4 {}\ {} > {}{}Notes.txt".format(firstName, searchLastName, str(firstName).lower(), lastName.title()))
	os.system(bashCommand)
	print('{} {}'.format(firstName, lastName))
	time.sleep(0.1)

print("All done!\n"
	"Read another book and feed me more data!")