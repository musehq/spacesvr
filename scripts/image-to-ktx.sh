#!/usr/bin/env bash

NAME=$1
STAGED_FOLDER="public/staging/images"
WIDTH=0
HEIGHT=0

nextPowerOf2() {
  node getNextPower $1 $2
}
#nextPowerOf2 23 $WIDTH

echo "Getting Image File(s)..."

imageToKTX () {
  for FILE in "$1"/*
    do
      if [ -d $FILE ]
      then
        imageToKTX $FILE
      else
        DATA=`file $FILE`
        echo $DATA
      fi
  done
}
imageToKTX $STAGED_FOLDER

echo "Done"
