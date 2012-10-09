#!/bin/sh

SCRIPTNAME=$0
DBLOCATION=$1
TABLENAME=dashboard_server

function foo { echo $1; exit 1; }

SERVER_RANGE=( {1..50} {1..21} {1..33} {1..17} )

#bash 4
declare -A SERVERS=( ["md-"]=50 ["bh-"]=21 ["cp-"]=33 ["bh-cp-"]=17 )
for server in "${!SERVERS[@]}"
do
    for i in $(seq 1 ${SERVERS["$server"]})
    do
	QUERY="INSERT INTO $TABLENAME (name) VALUES ('$server$i');"
	if [ -f $DBLOCATION ]; then
	    sqlite3 $DBLOCATION "$QUERY"
	else
	    echo $QUERY
	fi
    done
done

#end bash4

#bash3 users, comment the previous bash4 lines and uncomment the following lines
#NOT YET COMPLETE.
## SERVER_md={1..50}
## SERVER_bh={1..21}
## SERVER_cp={1..33}
## SERVER_bh_cp={1..17}
## SERVER_PREFIX=( "md-" "bh-" "cp-" "bh-cp-" )


## echo ${SERVER_RANGE[*]}
## for i in 0 1 2 3
## do
##     for j in ${SERVER_RANGE[*]}
##     do
## 	if [ ${SERVER_RANGE[$j+1]} -ne 1 ]; then
## 	    echo $j
## 	else
## 	    break
## 	fi
##     done
## done
