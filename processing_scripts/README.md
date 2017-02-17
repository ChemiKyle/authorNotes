## Processing scripts

These are the original scripts I ran on my own computer, and where the motivation for the webapp came from. They're being left here in the raw.

They're centered around bash commands, and the masterBooksProcess.sh script is meant to run all the others in a sequence:  
Checking for differences between the notes on your kindle and the notes from the last time you synced (to avoid losing notes for any reason)  
Porting the notes over to your computer  
Parsing out into separate files for each author (via the Python script, which still has some issues with authors whose names aren't of the format first_name last_name)
