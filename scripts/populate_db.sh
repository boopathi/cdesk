#!/bin/sh

#requires bash4

SCRIPTNAME=$0
DBLOCATION=$1

TABLEPREFIX=dashboard_
SERVICETABLE="$TABLEPREFIX"service
SERVERTABLE="$TABLEPREFIX"server
GRAPHTABLE="$TABLEPREFIX"graph

declare -A SERVICES=( ["http"]=1 ["ftp"]=2 ["dns"]=3 ["mail"]=4 ["mysql"]=5 ["power"]=6 ["system"]=7 )

declare -A SERVERS=( ["md-"]=50 ["bh-"]=21 ["cp-"]=33 ["bh-cp-"]=17 )

function foo { echo $1; exit 1; }

for serve in "${!SERVICES[@]}";do
    QUERY="INSERT INTO $SERVICETABLE (id,name) VALUES (${SERVICES["$serve"]}, '$serve' );"
    if [ -f -n $DBLOCATION ]; then
	sqlite3 $DBLOCATION "$QUERY"
    else
	echo "$QUERY"
    fi
done

for server in "${!SERVERS[@]}";do
    for i in $(seq 1 ${SERVERS["$server"]});do
	QUERY="INSERT INTO $SERVERTABLE (name) VALUES ('$server$i');"
	if [ -f -n $DBLOCATION ]; then
	    sqlite3 $DBLOCATION "$QUERY"
	else
	    echo $QUERY
	fi
    done
done

[ -f -n $GRAPH_TEMPLATES ] || foo "FILE NOT FOUND: Graph Templates"

find $GRAPH_TEMPLATES -name "*.graph" | xargs cat $1 | grep ":data" | cut -d "," -f2 | cut -d ')' -f1 | grep "HOST" | while read line; do
    data=${line/\$HOST/\%s}
    service=`echo $data | cut -d '.' -f3`
    label=`echo ${data##*.}`
    sname="${SERVICES["$service"]}"
    Query="INSERT INTO $TABLENAME (sname_id,label,data) VALUES ($sname,'$label','$data');"
    if [ -f -n $DBLOCATION ]; then
	sqlite3 $DBLOCATION $Query
    else
	echo $Query
    fi
done
