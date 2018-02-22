export const solarSystemSettings = {
  Earth: null,
  Moon: {
    filename: 'Moonmap_from_clementine_data.png',
    bounds: [[-90, -180], [90, 180]],
    attribution: 'image by the Clementine mission',
    attribution_url: 'http://solarviews.com/cap/moon/moonmap.htm'
  },
  Mercury: {
    filename: 'Mercury.png',
    lowres_filename: 'Mercury_lowres.png',
    bounds: [[-90, -180], [90, 180]],
    attribution: 'image by the MESSENGER mission',
    attribution_url:
      'http://messenger.jhuapl.edu/Explore/Images.html#global-mosaics'
  },
  Venus: {
    filename: 'Venus.jpg',
    lowres_filename: 'Venus_lowres.jpg',
    bounds: [[-90, -120], [90, 240]],
    attribution: 'image by the Magellan mission',
    attribution_url: 'http://solarviews.com/cap/venus/venmap.htm'
  },
  Mars: {
    filename: 'Mars.jpg',
    lowres_filename: 'Mars_lowres.jpg',
    bounds: [[-90, -180], [90, 180]],
    attribution: 'image by the Viking mission',
    attribution_url:
      'https://astrogeology.usgs.gov/search/details/Mars/Viking/MDIM21/Mars_Viking_MDIM21_ClrMosaic_global_232m/cub'
  },
  Pluto: {
    filename: 'Pluto.jpg',
    lowres_filename: 'Pluto_lowres.jpg',
    bounds: [[-90, 0], [90, 360]],
    attribution: 'image by the New Horizons mission',
    attribution_url: 'https://snowfall-the-cat.deviantart.com/'
  },
  Ceres: {
    filename: 'Ceres.jpg',
    lowres_filename: 'Ceres_lowres.jpg',
    bounds: [[-90, 0], [90, 360]],
    attribution: 'image by the Dawn mission',
    attribution_url: 'https://photojournal.jpl.nasa.gov/catalog/PIA20354'
  },
  Io: {
    filename: 'Io.jpg',
    bounds: [[-90, -180], [90, 180]],
    attribution: 'image by the Galileo/Voyager missions',
    attribution_url: 'http://solarviews.com/cap/jup/iocyl2.htm'
  },
  Enceladus: {
    filename: 'Enceladus.jpg',
    lowres_filename: 'Enceladus_lowres.jpg',
    bounds: [[-90, 0], [90, 360]],
    attribution: 'image by the Cassini mission',
    attribution_url: 'https://photojournal.jpl.nasa.gov/catalog/PIA18435'
  },
  Tethys: {
    filename: 'Tethys.jpg',
    lowres_filename: 'Tethys_lowres.jpg',
    bounds: [[-90, 0], [90, 360]],
    attribution: 'image by the Cassini mission',
    attribution_url: 'https://photojournal.jpl.nasa.gov/catalog/PIA18439'
  },
  Dione: {
    filename: 'Dione.jpg',
    lowres_filename: 'Tethys_lowres.jpg',
    bounds: [[-90, -180], [90, 180]],
    attribution: 'image by the Cassini mission',
    attribution_url: 'https://photojournal.jpl.nasa.gov/catalog/PIA08413'
  },
  Rhea: {
    filename: 'Rhea.jpg',
    lowres_filename: 'Rhea_lowres.jpg',
    bounds: [[-90, 0], [90, 360]],
    attribution: 'image by the Cassini mission',
    attribution_url: 'https://photojournal.jpl.nasa.gov/catalog/PIA18438'
  },
  Titan: {
    filename: 'Titan.png',
    lowres_filename: 'Titan_lowres.png',
    bounds: [[-90, 0], [90, 360]],
    attribution: 'image by the Cassini mission',
    attribution_url: 'https://photojournal.jpl.nasa.gov/catalog/PIA19658'
  },
  Triton: {
    filename: 'Triton.jpg',
    lowres_filename: 'Triton_lowres.jpg',
    bounds: [[-90, -180], [90, 180]],
    attribution: 'image by the Voyager mission',
    attribution_url: 'https://photojournal.jpl.nasa.gov/catalog/PIA18668'
  }
}

export const baseMapSettings = {
  OpenStreetMap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: 'data by <b>OpenStreetMap</b>',
    attribution_url: 'http://www.openstreetmap.org/copyright'
  },
  'Google Maps': {
    maptype: 'roadmap',
    attribution: 'data by <b>Google Maps</b>',
    attribution_url: 'https://www.google.com/intl/en_us/help/terms_maps.html'
  },
  OpenTopoMap: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'data by <b>OpenStreetMap</b>, <b>SRTM</b><br />style by <b>OpenTopoMap</b>',
    attribution_url: 'https://opentopomap.org'
  },
  'Stamen Toner Lite': {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
    attribution:
      'data by <b>OpenStreetMap</b><br/>style by <b>Stamen Design</b>',
    attribution_url: 'http://stamen.com'
  },
  'Stamen Terrain': {
    url:
      'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png',
    attribution:
      'data by <b>OpenStreetMap</b><br/>style by <b>Stamen Design</b>',
    attribution_url: 'http://stamen.com',
    overlay: {
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
      name: 'Annotations',
      checked: true
    }
  },
  'Stamen Watercolor': {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png',
    attribution:
      'data by <b>OpenStreetMap</b><br/>style by <b>Stamen Design</b>',
    attribution_url: 'http://stamen.com'
  },
  'Esri World Street Map': {
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'data by <b>Esri</b>',
    attribution_url: 'https://www.esri.com'
  },
  'Esri World Topo Map': {
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'data by <b>Esri</b>',
    attribution_url: 'https://www.esri.com'
  },
  'Esri World Imagery': {
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'data by <b>Esri</b>',
    attribution_url: 'https://www.esri.com'
  },
  'Esri National Georaphic Map': {
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'data by <b>Esri</b>',
    attribution_url: 'https://www.esri.com'
  },
  'CartoDB Light': {
    url:
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
    attribution: 'data by <b>OpenStreetMap</b><br/>style by <b>CartoDB</b>',
    attribution_url: 'http://cartodb.com/attributions',
    overlay: {
      url:
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      name: 'Annotations',
      checked: true
    }
  },
  'CartoDB Dark': {
    url:
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png',
    attribution: 'data by <b>OpenStreetMap</b><br/>style by <b>CartoDB</b>',
    attribution_url: 'http://cartodb.com/attributions',
    overlay: {
      url:
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
      name: 'Annotations',
      checked: true
    }
  },
  TianDiTu: {
    url: 'http://t0.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}',
    attribution: 'data by <b>TianDiTu</b> (天地图)',
    attribution_url: 'http://www.tianditu.com',
    overlay: {
      url: 'http://t0.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}',
      name: 'Annotations',
      checked: true
    }
  },
  'TianDiTu Satellite': {
    url: 'http://t0.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}',
    attribution: 'data by <b>TianDiTu</b> (天地图)',
    attribution_url: 'http://www.tianditu.com',
    overlay: {
      url: 'http://t0.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}',
      name: 'Annotations',
      checked: true
    }
  },
  'TianDiTu Terrain': {
    url: 'http://t0.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}',
    attribution: 'data by <b>TianDiTu</b> (天地图)',
    attribution_url: 'http://www.tianditu.com',
    overlay: {
      url: 'http://t0.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}',
      name: 'Annotations',
      checked: true
    }
  },
  'Kokudo Chiriin': {
    url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    attribution: 'data by <b>Kokudo Chiriin</b> (国土地理院)',
    attribution_url:
      'http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html',
    overlay: {
      url: 'https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png',
      name: 'English',
      checked: false
    }
  },
  'Kokudo Chiriin Pale': {
    url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
    attribution: 'data by <b>Kokudo Chiriin</b> (国土地理院)',
    attribution_url:
      'http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html'
  },
  'Kokudo Chiriin Satellite': {
    url: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
    attribution: 'data by <b>Kokudo Chiriin</b> (国土地理院)',
    attribution_url:
      'http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html'
  }
}
