#!/usr/bin/env bash

#######################################################################
## flat many "import" files into one single file.
## only support one level import!!!
## commmand : ./flat.sh ${contract_file}
#######################################################################
## read file
workDir=$(cd $(dirname $0); pwd)
contractDir=${workDir}"/contracts"
contractFile=$contractDir
outputDir=${workDir}"/build/flattened"
## mkdir if not exist
[ ! -d "$outputDir" ] && mkdir $outputDir

if [ $1 ];then
    contractFile=${workDir}"/"$1
    if [ ! -f "$contractFile" ] ;then
        echo "ERROR:file $contractFile not exist!"
        exit 1
    fi
else
    echo "ERROR:please input the contract file you want to flat!"
    exit 1
fi

name=`echo ${1##*/}|sed 's/\.sol//g'`
outputFile=$outputDir"/"$name"_flat.sol"
echo "///auto-generated single file for verifying contract on etherscan" > $outputFile


## loop each line and find import symbol to read imported files
## and then write into a single file

IFS_old=$IFS
IFS=$'\n'
for line in `cat $contractFile`
do
    if   [[ $line == *import* ]]
    then
        var=`echo $line |awk -F ' ' '{print $2}' |sed 's/\"//g'|sed 's/\;//g'|sed 's/\.//'`
        cat ${contractDir}$var |sed '/pragma*/d' >> $outputFile
       else
       echo $line >> $outputFile
    fi
done
IFS=$IFS_old

