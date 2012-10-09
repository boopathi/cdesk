#!/bin/sh

GDASH_LOCATION=/var/www/html/gdash
GRAPH_TEMPLATES=$GDASH_LOCATION/graph_templates

RAND=`cat /dev/urandom | head -c ${1:-32} | tr -cd "[:alnum:]"`

find $GRAPH_TEMPLATES -name "*.graph" | xargs cat $1 | grep ":data*\$HOST" | cut -d "," -f2 | cut -d ')' -f1 > /tmp/graph_data-$RAND

cat /tmp/graph_data-$RAND | while read line;
do
    echo ${line//\$HOST//\%s}
done


