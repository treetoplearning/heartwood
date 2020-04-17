#!/bin/bash

mkdir static/pyodide
curl -LJOs /static/pyodide https://github.com/iodide-project/pyodide/releases/download/0.14.3/pyodide-build-0.14.3.tar.bz2 | tar vxz -C static/pyodide
