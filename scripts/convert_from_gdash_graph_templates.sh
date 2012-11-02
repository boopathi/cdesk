#!/bin/sh

GDASH_LOCATION=/var/www/html/gdash
GRAPH_TEMPLATES=$GDASH_LOCATION/graph_templates

#app settings
TABLENAME=rhino_graph

SCRIPTNAME=$0
DBLOCATION=$1

#obtain these values from the sqlite3 database in $TABLENAME
http=1
ftp=2
dns=3
mail=4
mysql=5
power=6
system=7

RAND=`cat /dev/urandom | head -c 10 | tr -cd "[:alnum:]"`

function foo { echo $1; exit 1; }

[ -f $GRAPH_TEMPLATES ] || foo "Graph templates not found"

find $GRAPH_TEMPLATES -name "*.graph" | xargs cat $1 | grep ":data" | cut -d "," -f2 | cut -d ')' -f1 | grep "HOST" > /tmp/graph_data-$RAND

cat /tmp/graph_data-$RAND | while read line;
do
    data=${line/\$HOST/\%s}
    service=`echo $data | cut -d '.' -f3`
    label=`echo ${data##*.}`
    sname=`eval echo $\`echo $service\``
    Query="INSERT INTO $TABLENAME (sname_id,label,data) VALUES ($sname,'$label','$data');"
    if [ -f $DBLOCATION ]; then
	sqlite3 $DBLOCATION $Query
    else
	echo $Query
    fi
done
