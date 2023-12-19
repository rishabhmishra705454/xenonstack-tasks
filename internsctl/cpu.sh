#!/bin/bash

case "$1" in
    getinfo)
        lscpu
        ;;
    *)
        echo "Usage: $0 getinfo"
        exit 1
        ;;
esac
