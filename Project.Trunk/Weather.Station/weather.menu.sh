#!/bin/bash
function nocase() {
  if [ "`echo $1 | tr [:lower:] [:upper:]`" = "`echo $2 | tr [:lower:] [:upper:]`" ]
  then
    return 0  # true
  else
    return 1 # false
  fi
}
#
exit=FALSE
while [ "$exit" = "FALSE" ]
do
  clear
  echo -e "+------------- Weather Station -----------------+"
  echo -e '| N: Start Node server                          |'
  echo -e '| W: Start Weather Station reader               |'
  echo -e '| D: Start Weather Station dump                 |'
  echo -e '| S: Show processes                             |'
  echo -e '| K: Kill them all                              |'
  echo -e '| Q: Quit                                       |'
  echo -e "+-----------------------------------------------+"
  echo -n 'You Choose > '
  read a
  if nocase "$a" "N"
  then
    cd node
    rm node.log
    nohup node weather.server.js > node.log &
    cd ..
    echo -n "Log is node/node.log. Hit [return] "
    read dummy
  elif nocase "$a" "W"
  then
    echo Make sure you have started the WebSocket server \(Option N\).
    rm weather.station.log
    # ./weather.station.reader > weather.station.log
    nohup ./weather.station.reader.sh > weather.station.log &
    echo .
		ADDR=`ifconfig wlan0 2> /dev/null  | awk '/inet addr:/ {print $2}' | sed 's/addr://'`
		echo then from your browser, reach http://$ADDR:9876/data/weather.station/analog.all.html
		echo IP is $(hostname -I)
    echo -n "Log is in weather.station.log. Hit [return] "
    read dummy
  elif nocase "$a" "D"
  then
    echo -e "Ctrl+C to stop"
    weather.station.datadump.sh
    echo -n "Log is in weather.station.log. Hit [return] "
    read dummy
  elif nocase "$a" "S"
  then
    PID=`ps -ef | grep -v grep | grep weatherstation.ws.HomeWeatherStation | awk '{ print $2 }'`
    if [ "$PID" != "" ]
    then
      echo -e "HomeWeatherStation $PID"
    else
      echo Found no HomeWeatherStation...
    fi
    PID=`ps -ef | grep -v grep | grep node-weather | awk '{ print $2 }'`
    if [ "$PID" != "" ]
    then
      echo -e "Node server $PID"
    else
      echo Found no node-weather...
    fi
    echo -n "Hit [return] "
    read dummy
  elif nocase "$a" "K"
  then
    PID=`ps -ef | grep -v grep | grep weatherstation.ws.HomeWeatherStation | awk '{ print $2 }'`
    if [ "$PID" != "" ]
    then
      echo -n 'Killing HomeWeatherStation process' $PID ', proceed [n]|y > '
      read a
      if nocase "$a" "Y"
      then
      # sudo kill -SIGTERM $PID
        sudo kill -9 $PID
      fi
    else
      echo Found no HomeWeatherStation...
    fi
#    echo -n "Hit [return] "
#    read dummy
    PID=`ps -ef | grep -v grep | grep node-weather | awk '{ print $2 }'`
    if [ "$PID" != "" ]
    then
      echo -n 'Killing node-weather process' $PID', proceed [n]|y > '
      read a
      if nocase "$a" "Y"
      then
      # sudo kill -SIGTERM $PID
        sudo kill -9 $PID
      fi
    else
      echo Found no node-weather...
    fi
    echo -n "Hit [return] "
    read dummy
  elif nocase "$a" "Q"
  then
    exit=TRUE
  else
    echo -e 'What?'
    echo -n "Hit [return] "
    read dummy
  fi
done
