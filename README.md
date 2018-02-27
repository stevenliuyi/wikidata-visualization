## Wikidata Visualization

[![Build Status](https://travis-ci.com/stevenliuyi/wikidata-visualization.svg?token=JATaX6og6wNxyWLFdMeq&branch=master)](https://travis-ci.com/stevenliuyi/wikidata-visualization)

This web app provides various easy-to-configure tools for visualizing Wikidata SPARQL query results. The app is created by React, and the visualization tools are mainly build on top of D3.js, but a few other JavaScript libraries (e.g. Leaflet) are also used.

The app is running at <https://stevenliuyi.github.io/wikidata-visualization>.

SPARQL is a SQL-like query language for the Semantic Web, which is used by the [Wikidata Query Service](https://query.wikidata.org/) (WDQS) to formulate queries for Wikidata. [Here](https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial) provides a SPARQL tutorial for WDQS if you are not familiar with it.

SPARQL query examples are provided for users to explore, and you can find more examples [here](https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples) on the Wikidata website.

## Charts
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
- Maps
  - Map
  - Simple Map
  - Choropleth
  - Cartogram
- More charts
  - Chord diagram
  - Sankey diagram
  - Heatmap
  - Timeline
  - Word Cloud
  - Gallery
