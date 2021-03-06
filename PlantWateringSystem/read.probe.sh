#!/usr/bin/env bash
CP=build/libs/PlantWateringSystem-1.0-all.jar
#
echo "Usage is $0 [debug|remote-debug|verbose]"
echo "   Use 'remote-debug' to remote-debug from another machine."
echo "   Use 'verbose' for a regular look on what's going on."
echo "   Use 'debug' for a close look on what's going on."
#
VERBOSE=false
DEBUG=false
REMOTE_DEBUG=false
if [ "$1" == "verbose" ]
then
  VERBOSE=true
fi
if [ "$1" == "debug" ]
then
  DEBUG=true
fi
if [ "$1" == "remote-debug" ]
then
  REMOTE_DEBUG=true
fi
JAVA_OPTIONS="-Dsth.debug=$DEBUG"
#
if [ "$REMOTE_DEBUG" == "true" ]
then
  # For remote debugging:
  JAVA_OPTIONS="$JAVA_OPTIONS -client -agentlib:jdwp=transport=dt_socket,server=y,address=4000"
fi
# For remote JVM Monitoring
# JAVA_OPTIONS="$JAVA_OPTIONS -Dcom.sun.management.jmxremote.port=1234 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false -Djava.rmi.server.hostname=raspberrypi-boat"
#
# Use program argument --help for help.
#
if [ "$VERBOSE" == "true" ]
then
  java $JAVA_OPTIONS -cp $CP main.STH10 --help
  #
  echo -n "Hit return... "
  read a
fi
#
# verbose: ANSI, STDOUT, NONE
if [ "$VERBOSE" == "true" ]
then
  USER_PRM="--verbose:ANSI"
else
  USER_PRM="--verbose:NONE"
fi
USER_PRM="$USER_PRM --water-below:50 --water-during:10 --resume-after:120"
USER_PRM="$USER_PRM --with-rest-server:true --http-port:8088"
#
# No space in the logger list!
USER_PRM="$USER_PRM --loggers:loggers.iot.AdafruitIOClient,loggers.text.FileLogger"
JAVA_OPTIONS="$JAVA_OPTIONS -Daio.key=54c2767878ca793f2e3cae1c45d62aa7ae9f8056"
JAVA_OPTIONS="$JAVA_OPTIONS -Daio.verbose=false"
#
# USER_PRM="$USER_PRM --simulate-sensor-values:true" # Values can be entered from a REST service, POST /pws/sth10-data
#
# JAVA_OPTIONS="$JAVA_OPTIONS -Drandom.simulator=true"
# USER_PRM="$USER_PRM --water-below:50 --water-during:10 --resume-after:120"
#
JAVA_OPTIONS="$JAVA_OPTIONS -Dgpio.verbose=true -Dansi.boxes=true"
#
if [ "$DEBUG" == "true" ]
then
	 echo "COMMAND is: java $JAVA_OPTIONS -cp $CP main.STH10 $USER_PRM"
	 echo -n "Hit return... "
	 read a
fi
JAVA_OPTIONS="$JAVA_OPTIONS -Dvalve.test=true"
#
java $JAVA_OPTIONS -cp $CP main.STH10 $USER_PRM
#
