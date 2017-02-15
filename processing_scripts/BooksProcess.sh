#!/bin/bash
path="/home/$USER/Documents/bookNotes/scripts/"

sh ${path}checkDiff.sh

#difference="$(sh ${path}checkDiff.sh)"
#echo "$difference"
#if [ $difference == "" ]; then
#	echo "No new notes!"

read -p "Port notes over (y/n)? " notePort

if [ $notePort == "y" ]; then
	sh ${path}fetchBookNotes.sh
else
	echo "Port cancelled."
fi

read -p "Parse out into authors (y/n)? " authorNotes

if [ $authorNotes == "y" ]; then
	python ${path}authorNotes.py
else
	echo "Parse cancelled."
fi
