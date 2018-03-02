#!/bin/bash

ssh -tt -i ~/.ssh/id_rsa stevenliuyi@login.tools.wmflabs.org << EOF
  become dataviz
  webservice stop
  rm -rf ./wikidata-visualization
  rm -rf ./public_html
  mkdir ./public_html
  git clone -b wmflabs https://$GITHUB_TOKEN@github.com/stevenliuyi/wikidata-visualization.git
  mv ./wikidata-visualization/* ./public_html
  rm -rf ./wikidata-visualization
  webservice start
  exit
  exit
EOF
