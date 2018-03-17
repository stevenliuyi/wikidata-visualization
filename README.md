## Wikidata Visualization

[![Build Status](https://travis-ci.org/stevenliuyi/wikidata-visualization.svg?branch=master)](https://travis-ci.org/stevenliuyi/wikidata-visualization)

This web app provides various easy-to-configure tools for visualizing Wikidata SPARQL query results. The app is created with React, and the visualization tools are mainly build on top of D3.js, but a few other JavaScript libraries (e.g. Leaflet) are also used.

The app is running at <https://tools.wmflabs.org/dataviz> (hosted on Wikimedia Toolforge) and <https://stevenliuyi.github.io/wikidata-visualization>  (hosted on Github).

SPARQL is a SQL-like query language for the Semantic Web, which is used by the [Wikidata Query Service](https://query.wikidata.org/) (WDQS) to formulate queries for Wikidata. [Here](https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial) provides a SPARQL tutorial for WDQS if you are not familiar with it.

WDQS alreadys provides some great tools to [display query results](https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/Wikidata_Query_Help/Result_Views). However, the result views are not that easy to configure. This app aims to make the visualization tools easier to configure, as well as to develop some additional tools.

Besides, SPARQL query examples are provided for users to explore, and you can find more examples [here](https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples) on the Wikidata website.

### Charts
The following chart types are available:
- Basic charts
  - Scatter Chart
  - Bubble Chart
  - Bar Chart
  - Pie Chart
  - Radar Chart
  - Force-directed Graph
- Trees
  - Tree
  - Cluster
  - Radial Tree
  - Radial Cluster
  - Circle Packing
- Maps
  - Map
  - Simple Map
  - Choropleth
  - Cartogram
  - Pie Chart Map
- More charts
  - Chord diagram
  - Sankey diagram
  - Heatmap
  - Timeline
  - Word Cloud
  - Gallery
