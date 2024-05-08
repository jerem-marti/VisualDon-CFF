import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer} from '@deck.gl/layers';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Make a program to read "./data/bahnubergang.json" and tranform it in a GeoJson file named "./data/bahnubergang.geojson"
// The program should be able to read the JSON file and transform it in a GeoJson file
// The elements of the JSON file should be clickable to see all information about de railway crossing
// The program should be able to display the data of this JSON in GeoJsonLayer
// When a feature is clicked, show a popup with information about the railway crossing
// The program should be able to display the data of this JSON in ArcLayer

const MAPBOX_TOKEN = "pk.eyJ1IjoiamVyZW0tbWFydGkiLCJhIjoiY2x2cGZoODMwMDFsMDJpcXpsaDRhcGZobSJ9.Wv6_cP0weO8hFVk0kfOftA";
const centerOfSwitzerland = [8.3, 46.8];
const mapStyle = 'mapbox://styles/mapbox/light-v11';
const initialZoom = 7;
const bounds = [
  [5.5, 45.5], // Southwest coordinates
  [10.8, 47.9] // Northeast coordinates
];

const map = new mapboxgl.Map({
  container: 'map',
  style: mapStyle,
  accessToken: MAPBOX_TOKEN,
  center: centerOfSwitzerland,
  zoom: initialZoom,
  minZoom: initialZoom,
  bearing: 0,
  pitch: 30,
  maxBounds: bounds,
  boxZoom: false
});

map.boxZoom.disable();


// make a function to zoom the map on the corinth canal
/*function zoomToCorinthCanal() {
  map.flyTo({
    center: [22.9586, 37.9404],
    zoom: 12,
    essential: true
  });
}*/

// use zoomToCorinthCanal when i scoll the page
//document.addEventListener('click', zoomToCorinthCanal);

const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.zIndex = 1001;
tooltip.style.pointerEvents = 'none';
tooltip.style.backgroundColor = 'white';
tooltip.style.padding = `10px`; 
tooltip.style.borderRadius = `4px`;
tooltip.style.boxShadow = `rgba(0, 0, 0, 0.1) 0px 0px 10px`; 
document.body.append(tooltip);

function updateTooltip({object, x, y}) {
  console.log(object);
  if (object) {
    tooltip.style.display = 'block';
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    const {name, fid} = object.properties;
    tooltip.innerHTML = `<h1>${name}</h1><p>${fid || ''}</p>`;
  } else {
    tooltip.style.display = 'none';
  }
}

async function fetchSVG(url) {
  const response = await fetch(url);
  const text = await response.text();
  console.log(text);
  return text;
}

const railwayCrossingIcon = await fetchSVG('/src/assets/img/signpost.svg');
console.log(railwayCrossingIcon);

function svgToDataURL(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const deckOverlay = new DeckOverlay({
  // interleaved: true,
  layers: [
    new GeoJsonLayer({
      id: "bahnubergang",
      data: "/src/data/bahnubergang.geojson",
      pointType: 'icon',
      getIcon: (d) => ({
        url: svgToDataURL(railwayCrossingIcon),
        width: 512,
        height: 512
      }),
      iconSizeScale: 1,
      iconSizeMinPixels: 24,
      pickable: true,
      // Update tooltip position and content
      onHover: updateTooltip
    }),
    new GeoJsonLayer({
      id: "linie",
      data: "/src/data/linie-mit-polygon.geojson",
      pickable: true,
      stroked: true,
      lineWidthMinPixels: 3,
      opacity: 0.1,
      getLineColor: [0, 0, 255],
      // Update tooltip position and content
      onHover: updateTooltip
    })
  ]
});

// select the element mapboxgl-ctrl-top-right and delete it
document.querySelector('.mapboxgl-ctrl-top-right').remove();

map.addControl(deckOverlay);
map.addControl(new mapboxgl.NavigationControl());
