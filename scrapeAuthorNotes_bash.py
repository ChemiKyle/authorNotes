import time, os

list_of_authors =[
"Douglas Adams",
"Isaac Asimov",
"Marshall Brain",
"Charles Bukowski",
"Noam Chomsky",
"Cory Doctorow",
"Greg Egan",
"Dave Eggers",
"William Gibson",
"Jack Kerouac",
"Kurt Vonnegut"
]

kindleNotes = "kindleNotes.txt"

for i in list_of_authors:
	splitName = i.split(' ') # Split each list element (i.e. each author) by spaces to isolate first and last name
	firstName = ''.join(splitName[:1]) # Take the first value in the list, strip off brackets
	lastName = ''.join(splitName[1:]) # Do the same for the second value
	bashCommand = str("less " + str(kindleNotes) + " | grep -A 4 {}\ {} > {}{}Notes.txt".format(firstName, lastName, str(firstName).lower(), lastName))
	os.system(bashCommand)
	print('Transfer complete for your notes on {} {}'.format(firstName, lastName))
	time.sleep(0.25)
