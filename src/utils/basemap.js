export const baseMapSettings = {
  'OpenStreetMap': {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  },
  'OpenTopoMap': {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a>, &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  },
  'Stamen Toner Lite': {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://stamen.com">Stamen Design</a>',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
  },
  'Stamen Terrain': {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://stamen.com">Stamen Design</a>',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png',
    overlay: {
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
      name: 'Annotations'
    }
  },
  'Stamen Watercolor': {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://stamen.com">Stamen Design</a>',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png'
  },
  'Esri World Street Map': {
    attribution: '&copy; Esri',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
  },
  'Esri World Topo Map': {
    attribution: '&copy; Esri',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  },
  'Esri World Imagery': {
    attribution: '&copy; Esri',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  },
  'Esri National Georaphic Map': {
    attribution: '&copy; Esri',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
  },
  'CartoDB Light': {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
    overlay: {
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      name: 'Annotations'
    }
  },
  'CartoDB Dark': {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png',
    overlay: {
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
      name: 'Annotations'
    }
  },
  'TianDiTu': {
    attribution: '&copy; <a href="http://www.tianditu.com">TianDiTu</a>',
    url: 'http://t0.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}',
    overlay: {
      url: 'http://t0.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}',
      name: 'Annotations'
    }
  },
  'TianDiTu Satellite':{
    attribution: '&copy; <a href="http://www.tianditu.com">TianDiTu</a>',
    url: 'http://t0.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}',
    overlay: {
      url: 'http://t0.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}',
      name: 'Annotations'
    }
  },
  'TianDiTu Terrain': {
    attribution: '&copy; <a href="http://www.tianditu.com">TianDiTu</a>',
    url: 'http://t0.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}',
    overlay: {
      url: 'http://t0.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}',
      name: 'Annotations'
    }
  }
}

