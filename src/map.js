import 'mapbox-gl/dist/mapbox-gl.css';
import scrollama from "scrollama";
import mapboxgl from 'mapbox-gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer, ColumnLayer} from '@deck.gl/layers';
import updateTooltip from './tooltip.js';
import config from './config.js';

mapboxgl.accessToken = config.accessToken;

const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery ? "&pluginName=scrollytellingV2" : "?pluginName=scrollytellingV2";
    return {
      url: url + suffix
    }
}

var map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.chapters[0].location.center,
    zoom: config.chapters[0].location.zoom,
    minZoom: config.chapters[0].location.minZoom,
    bearing: config.chapters[0].location.bearing,
    pitch: config.chapters[0].location.pitch,
    maxBounds: config.chapters[0].location.maxBounds,
    interactive: true,
    transformRequest: transformRequest
});

// async function fetchSVG(url) {
//   const response = await fetch(url);
//   const text = await response.text();
//   //console.log(text);
//   return text;
// }

const layersVisibility = {
    'linie': true,
    'bahnubergang': true,
    'bahnhof': true,
    'bahnhofbenutzer': true,
    'historische_bahnhofbilder': true
};
const railwayCrossingIcon = `<svg id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m286 331h105v30h-105z" fill="#474f54"/><path d="m121 331h105v30h-105z" fill="#575f64"/><path d="m121 451c-33.091 0-60-26.909-60-60s26.909-60 60-60 60 26.909 60 60-26.909 60-60 60z" fill="#474f54"/><circle cx="121" cy="391" fill="#e64545" r="30"/><path d="m391 451c-33.091 0-60-26.909-60-60s26.909-60 60-60 60 26.909 60 60-26.909 60-60 60z" fill="#32393f"/><circle cx="391" cy="391" fill="#cc2929" r="30"/><path d="m256 0h-45v512h45 45v-512z" fill="#474f54"/><path d="m256 0h45v512h-45z" fill="#32393f"/><path d="m346 151 80.771-46.626 16.465-61.479-61.465-16.48-125.771 72.627-125.771-72.627-61.465 16.48 16.465 61.479 80.771 46.626-80.771 46.626-16.465 61.479 61.465 16.48 125.771-72.627 125.771 72.627 61.465-16.48-16.465-61.479z" fill="#e64545"/><path d="m443.236 259.105-16.465-61.479-80.771-46.626 80.771-46.626 16.465-61.479-61.465-16.48-125.771 72.627v103.916l125.771 72.627z" fill="#cc2929"/><path d="m286 151 115.02-66.401 5.478-20.494-20.478-5.493-130.02 75.059-130.02-75.059-20.478 5.493 5.478 20.494 115.02 66.401-115.02 66.401-5.478 20.494 20.478 5.493 130.02-75.059 130.02 75.059 20.478-5.493-5.478-20.494z" fill="#f2f2fc"/><path d="m406.498 237.895-5.478-20.494-115.02-66.401 115.02-66.401 5.478-20.494-20.478-5.493-130.02 75.059v34.658l130.02 75.059z" fill="#e2d9fb"/></g></svg>`;
const bahnhofIcon = `<?xml version="1.0" encoding="UTF-8"?><svg id="b" xmlns="http://www.w3.org/2000/svg" width="49.77" height="32.31" viewBox="0 0 49.77 32.31"><g id="c"><g id="d"><rect x="13.85" y="3.81" width="22.06" height="2.71" style="fill:#92a2ab; stroke-width:0px;"/><path d="M14.64,7.6h20.48c.12-.17.26-.34.38-.51.14-.19.27-.36.41-.57H13.85c.14.21.27.38.41.57.12.17.26.34.38.51h0Z" style="fill:#6b777e; fill-rule:evenodd; stroke-width:0px;"/><rect x="14.64" y="7.6" width="20.41" height="13.32" style="fill:#92a2ab; stroke-width:0px;"/><rect x="4.09" y="15.43" width="41.6" height="1.37" style="fill:#40484c; stroke-width:0px;"/><rect y="23.18" width="49.77" height="1.37" style="fill:#40484c; stroke-width:0px;"/><path d="M4.67,17.87h40.43c.03-.09.09-.17.14-.26s.1-.17.14-.27c.05-.09.1-.17.15-.26.05-.1.1-.19.15-.27H4.09c.05.09.09.17.14.27.05.09.1.17.15.26.05.1.1.19.14.27.05.09.1.17.15.26h0Z" style="fill:#6b777e; fill-rule:evenodd; stroke-width:0px;"/><path d="M.69,25.61h48.39c.05-.09.1-.17.17-.26.05-.09.1-.17.15-.27.07-.09.12-.17.19-.26.05-.1.12-.19.17-.27H0c.05.09.1.17.15.27.07.09.12.17.19.26.05.1.1.19.15.27.05.09.12.17.19.26h0Z" style="fill:#6b777e; fill-rule:evenodd; stroke-width:0px;"/><rect x="4.63" y="17.87" width="40.5" height="5.3" style="fill:#92a2ab; stroke-width:0px;"/><rect x=".65" y="25.61" width="48.46" height="6.69" style="fill:#92a2ab; stroke-width:0px;"/><polygon points="24.12 0 25.6 0 28.27 2.7 28.27 21.41 21.44 21.41 21.44 2.7 24.12 0" style="fill:#40484c; fill-rule:evenodd; stroke-width:0px;"/><path d="M24.86,1.3c1.13,0,2.06.93,2.06,2.06s-.93,2.06-2.06,2.06-2.06-.93-2.06-2.06.91-2.06,2.06-2.06h0Z" style="fill:#63afb7; fill-rule:evenodd; stroke-width:0px;"/><path d="M24.86,1.73c.89,0,1.63.74,1.63,1.63s-.74,1.65-1.63,1.65-1.65-.74-1.65-1.65.74-1.63,1.65-1.63h0Z" style="fill:#fefefe; fill-rule:evenodd; stroke-width:0px;"/><path d="M8.79,18.45h1.73v4.22h-1.73v-4.22h0ZM11.95,18.45h1.73v4.22h-1.73s0-4.22,0-4.22ZM5.61,18.45h1.75v4.22h-1.75v-4.22Z" style="fill:#aedbf0; fill-rule:evenodd; stroke-width:0px;"/><path d="M39.14,18.45h1.75v4.22h-1.75v-4.22h0ZM42.3,18.45h1.75v4.22h-1.75v-4.22ZM35.98,18.45h1.73v4.22h-1.73v-4.22Z" style="fill:#aedbf0; fill-rule:evenodd; stroke-width:0px;"/><path d="M4.14,26.08h1.75v2.56h-1.75v-2.56h0ZM6.99,26.08h1.73v2.56h-1.73v-2.56h0ZM9.82,26.08h1.73v2.56h-1.73v-2.56h0ZM12.65,26.08h1.75v2.56h-1.75v-2.56h0ZM15.48,26.08h1.75v2.56h-1.75v-2.56h0ZM18.32,26.08h1.75v2.56h-1.75v-2.56h0ZM29.66,26.08h1.75v2.56h-1.75v-2.56h0ZM32.5,26.08h1.75v2.56h-1.75v-2.56h0ZM35.35,26.08h1.73v2.56h-1.73v-2.56h0ZM38.18,26.08h1.73v2.56h-1.73v-2.56h0ZM41.01,26.08h1.75v2.56h-1.75v-2.56h0ZM43.84,26.08h1.75v2.56h-1.75v-2.56h0ZM46.68,26.08h1.75v2.56h-1.75v-2.56ZM1.3,26.08h1.75v2.56h-1.75v-2.56Z" style="fill:#aedbf0; fill-rule:evenodd; stroke-width:0px;"/><rect x="21.2" y="26.13" width="7.38" height="6.18" style="fill:#40484c; stroke-width:0px;"/><path d="M21.97,26.9h2.57v4.64h-2.57v-4.64ZM25.22,26.9h2.57v4.64h-2.57v-4.64Z" style="fill:#aedbf0; fill-rule:evenodd; stroke-width:0px;"/><path d="M24.86,2.11c.07,0,.12.05.12.14,0,.07-.05.12-.12.12s-.14-.05-.14-.12c0-.09.07-.14.14-.14h0ZM24.86,4.36c.07,0,.12.07.12.14s-.05.12-.12.12-.14-.05-.14-.12.07-.14.14-.14h0ZM24.22,2.28c.07-.03.14-.02.17.05.03.05.02.14-.03.17-.07.03-.14.02-.17-.05-.05-.05-.02-.14.03-.17h0ZM25.36,4.24s.14-.02.17.03c.03.07.02.14-.05.17-.05.03-.14.02-.17-.03-.03-.07-.02-.14.05-.17h0ZM23.76,2.75c.05-.07.12-.09.19-.05.05.03.07.12.03.17-.03.07-.1.09-.17.05-.05-.03-.09-.12-.05-.17h0ZM25.72,3.86s.12-.07.17-.03c.07.03.09.1.05.17-.03.05-.12.07-.17.03-.07-.03-.09-.1-.05-.17h0ZM23.6,3.36c0-.07.05-.12.12-.12s.12.05.12.12-.05.14-.12.14-.12-.07-.12-.14h0ZM25.85,3.36c0-.07.05-.12.12-.12s.14.05.14.12-.07.14-.14.14-.12-.07-.12-.14h0ZM23.76,4c-.03-.07,0-.14.05-.17.07-.03.14-.02.17.03.03.07.02.14-.03.17-.07.03-.14.02-.19-.03h0ZM25.72,2.87s-.02-.14.05-.17c.05-.03.14-.02.17.05.03.05.02.14-.05.17-.05.03-.14.02-.17-.05h0ZM24.22,4.45s-.09-.1-.03-.17c.03-.05.1-.07.17-.03.05.03.07.1.03.17-.03.05-.1.07-.17.03h0ZM25.36,2.51c-.07-.03-.09-.12-.05-.17.03-.07.12-.09.17-.05.07.03.09.12.05.17-.03.07-.12.09-.17.05h0Z" style="fill:#63afb7; fill-rule:evenodd; stroke-width:0px;"/><polygon points="24.86 2.47 24.86 2.47 24.89 2.52 24.89 3.33 24.86 3.36 24.86 3.36 24.81 3.33 24.81 2.52 24.86 2.47" style="fill:#131414; fill-rule:evenodd; stroke-width:0px;"/><polygon points="24.24 3.71 24.24 3.71 24.27 3.6 24.77 3.33 24.86 3.35 24.86 3.35 24.84 3.45 24.34 3.73 24.24 3.71" style="fill:#131414; fill-rule:evenodd; stroke-width:0px;"/><path d="M24.86,3.23c.07,0,.12.05.12.14,0,.07-.05.12-.12.12-.09,0-.14-.05-.14-.12,0-.09.05-.14.14-.14h0Z" style="fill:#40484c; fill-rule:evenodd; stroke-width:0px;"/><path d="M24.86,3.28s.07.03.07.09c0,.03-.03.07-.07.07-.05,0-.09-.03-.09-.07,0-.05.03-.09.09-.09h0Z" style="fill:#6b777e; fill-rule:evenodd; stroke-width:0px;"/><path d="M28.72,8.27h5.54v12.43h-5.54s0-12.43,0-12.43ZM15.45,8.27h5.54v12.43h-5.54v-12.43ZM22.08,8.27h5.54v12.43h-5.54v-12.43h0Z" style="fill:#6b777e; fill-rule:evenodd; stroke-width:0px;"/><path d="M29.13,8.7v11.59h4.7v-11.59s-4.7,0-4.7,0ZM15.86,8.7v11.59h4.7v-11.59s-4.7,0-4.7,0ZM22.51,8.7v11.59h4.7v-11.59s-4.7,0-4.7,0Z" style="fill:#aedbf0; fill-rule:evenodd; stroke-width:0px;"/></g></g></svg>`;
const cameraIcon = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="224.3" height="201.79" viewBox="0 0 224.3 201.79"><g style="isolation:isolate;"><g id="b"><g id="c"><path d="M165.83,181.57s21.82-.26,23.69.86c.06,4.23-.73,6.27-2.29,6.5-1.56.23-21.41,1.48-21.41,1.48v-8.83Z" style="fill:#333; stroke-width:0px;"/><path d="M162.85,187.42s12.95,0,20.64,0c6.36,0,6.03-4.99,6.03-4.99,0,0,.1,6.68.15,10.5.06,3.81-26.82,2.12-26.82,2.13,0,.02,0-7.64,0-7.64Z" style="fill:#000; stroke-width:0px;"/><path d="M177.15,108.2c-1.63,0-2.96-1.33-2.96-2.96s1.33-2.96,2.96-2.96,2.96,1.33,2.96,2.96-1.33,2.96-2.96,2.96ZM177.15,103.1c-1.17,0-2.13.96-2.13,2.13s.96,2.13,2.13,2.13,2.13-.96,2.13-2.13-.96-2.13-2.13-2.13Z" style="fill:#4c4c4c; stroke-width:0px;"/><path d="M186.01,137.21c-1.23-18.2-6.98-30.61-7.23-31.13l-2.26,1.06c.06.12,5.8,12.51,6.99,30.24.72,10.64-2.32,25.69-7.91,39.27-4.03,9.79-8.8,17.39-13.7,22.07h.91v2.51c14.14-12.75,24.43-45.59,23.19-64.03Z" style="fill:#000; stroke-width:0px;"/><rect x="104.71" y="114.86" width="59.77" height="8.3" rx=".75" ry=".75" style="fill:#1c1c1c; stroke-width:0px;"/><path d="M106.8,118.47c0-.41.33-.75.75-.75h56.93v-2.12c0-.41-.33-.75-.75-.75h-58.28c-.41,0-.75.33-.75.75v6.81c0,.41.33.75.75.75h1.34v-4.69Z" style="fill:#2d2d2d; stroke-width:0px;"/><rect x="158.52" y="116.14" width="4.88" height="2.09" style="fill:#686868; stroke-width:0px;"/><rect x="158.52" y="119.27" width="4.88" height="1.01" style="fill:#686868; stroke-width:0px;"/><path d="M120.76,145.84h58.27c.41,0,.75.33.75.75v6.81c0,.41-.33.75-.75.75h-58.28c-.41,0-.75-.33-.75-.75v-6.81c0-.41.33-.75.75-.75Z" style="fill:#1c1c1c; stroke-width:0px;"/><path d="M122.1,149.45c0-.41.33-.75.75-.75h56.93v-2.12c0-.41-.33-.75-.75-.75h-58.28c-.41,0-.75.33-.75.75v6.81c0,.41.33.75.75.75h1.34v-4.69Z" style="fill:#2d2d2d; stroke-width:0px;"/><path d="M178.7,155.58c0,1.91-1.09,3.46-2.44,3.46h0c-1.35,0-2.44-1.55-2.44-3.46v-12.07c0-1.91,1.09-3.46,2.44-3.46h0c1.35,0,2.44,1.55,2.44,3.46v12.07Z" style="fill:#3a3a3a; stroke-width:0px;"/><rect x="173.82" y="147.11" width="4.88" height="2.09" style="fill:#686868; stroke-width:0px;"/><rect x="173.82" y="150.25" width="4.88" height="1.01" style="fill:#686868; stroke-width:0px;"/><rect x="104.71" y="176.82" width="59.77" height="8.3" rx=".75" ry=".75" style="fill:#1c1c1c; stroke-width:0px;"/><path d="M106.8,180.42c0-.41.33-.75.75-.75h56.93v-2.12c0-.41-.33-.75-.75-.75h-58.28c-.41,0-.75.33-.75.75v6.81c0,.41.33.75.75.75h1.34v-4.69Z" style="fill:#2d2d2d; stroke-width:0px;"/><rect x="158.52" y="178.09" width="4.88" height="2.09" style="fill:#686868; stroke-width:0px;"/><rect x="158.52" y="181.22" width="4.88" height="1.01" style="fill:#686868; stroke-width:0px;"/><path d="M7.95,106.79c-1.63,0-2.96-1.33-2.96-2.96s1.33-2.96,2.96-2.96,2.96,1.33,2.96,2.96-1.33,2.96-2.96,2.96ZM7.95,101.7c-1.17,0-2.13.96-2.13,2.13s.96,2.13,2.13,2.13,2.13-.96,2.13-2.13-.96-2.13-2.13-2.13Z" style="fill:#4c4c4c; stroke-width:0px;"/><path d="M11.17,186.08c-21.68-47.03-5.14-81.03-4.97-81.36l2.23,1.12c-.16.33-16.15,33.32,5.01,79.2l-2.27,1.04Z" style="fill:#000; stroke-width:0px;"/><path d="M105.9,67.42c-.92,6.13-1.49,9.99-2.52,16.85h19.11c-1.03-6.87-1.6-10.72-2.52-16.85h-14.08Z" style="fill:#1c1c1c; stroke-width:0px;"/><rect x="111.92" y="67.42" width="2.01" height="16.85" style="fill:#4c4c4c; stroke-width:0px;"/><polygon points="117.01 67.42 115.26 67.42 115.77 84.27 117.78 84.27 117.01 67.42" style="fill:#4c4c4c; stroke-width:0px;"/><polygon points="119.69 67.42 118.45 67.42 119.95 84.27 121.58 84.27 119.69 67.42" style="fill:#4c4c4c; stroke-width:0px;"/><polygon points="108.87 67.42 110.54 67.42 110.11 84.27 108.11 84.27 108.87 67.42" style="fill:#4c4c4c; stroke-width:0px;"/><polygon points="106.2 67.42 107.4 67.42 105.94 84.27 104.31 84.27 106.2 67.42" style="fill:#4c4c4c; stroke-width:0px;"/><rect x="27.26" y="75.02" width="9.84" height="13.46" style="fill:#161616; stroke-width:0px;"/><rect x="27.26" y="75.02" width="9.84" height="4.71" style="fill:#4c4c4c; stroke-width:0px;"/><path d="M17.47,83.68h110.48c3.67,0,6.65,2.98,6.65,6.65v104.81c0,3.67-2.98,6.65-6.65,6.65H17.47c-3.67,0-6.65-2.98-6.65-6.65v-104.81c0-3.67,2.98-6.65,6.65-6.65Z" style="fill:#442c23; stroke-width:0px;"/><path d="M127.95,83.68h-4.13c3.67,0,6.65,2.98,6.65,6.65v104.81c0,3.67-2.98,6.65-6.65,6.65h4.13c3.67,0,6.65-2.98,6.65-6.65v-104.81c0-3.67-2.98-6.65-6.65-6.65Z" style="fill:#bcbcbc; mix-blend-mode:multiply; stroke-width:0px;"/><path d="M23.17,200.45c-10.53,0-10.53-7.73-10.53-10.63v-91.98c0-7.91,4.13-12.26,11.64-12.26l20.99,1.25-20.99,1.25c-6.15,0-9.14,3.2-9.14,9.77v91.98c0,3.94.62,8.14,8.04,8.14l98.93,1.16-98.93,1.33Z" style="fill:#664138; stroke-width:0px;"/><path d="M97.1,91.95c.42,3.67-2.52,6.65-6.56,6.65-11.89,0-23.78,0-35.66,0-4.04,0-6.98-2.98-6.56-6.65,1.02-9.05,2.05-14.86,3.07-23.92.41-3.67,3.43-6.65,6.74-6.65,9.73,0,19.45,0,29.18,0,3.31,0,6.32,2.98,6.74,6.65,1.02,9.05,2.05,14.86,3.07,23.92Z" style="fill:#442c23; stroke-width:0px;"/><path d="M119.65,94.33h-25.9c-.86-7.59-2.03-17.66-2.81-24.57-.35-3.14-2.94-5.69-5.76-5.69-8.31,0-16.63,0-24.94,0-2.82,0-5.41,2.55-5.76,5.69-.78,6.9-2.05,16.98-2.94,24.57h-25.77c-3.12,0-5.65,2.53-5.65,5.65v85.5c0,3.12,2.53,5.65,5.65,5.65h93.88c3.12,0,5.65-2.53,5.65-5.65v-85.5c0-3.12-2.53-5.65-5.65-5.65Z" style="fill:#bcbcbc; mix-blend-mode:multiply; stroke-width:0px;"/><path d="M27.83,96.98h89.75c2.98,0,5.4,2.42,5.4,5.4v80.7c0,2.98-2.42,5.4-5.4,5.4H27.83c-2.98,0-5.4-2.42-5.4-5.4v-80.7c0-2.98,2.42-5.4,5.4-5.4Z" style="fill:#e8e8e8; stroke-width:0px;"/><path d="M92.38,105.73c.32,2.8-3.01,5.07-6.09,5.07h-27.17c-3.08,0-6.24-1.34-5.93-4.14.78-6.9,2.48-28.54,3.26-35.43.32-2.8,2.61-5.07,5.13-5.07,7.41,0,14.82,0,22.23,0,2.52,0,4.82,2.27,5.13,5.07.78,6.9,2.65,27.61,3.43,34.5Z" style="fill:#e8e8e8; stroke-width:0px;"/><rect x="59.2" y="73.89" width="27.02" height="19.57" style="fill:#161616; stroke-width:0px;"/><rect x="62.39" y="76.21" width="20.63" height="14.94" style="fill:#4c4c4c; stroke-width:0px;"/><rect x="67.09" y="79.61" width="11.23" height="8.13" style="fill:#161616; stroke-width:0px;"/><rect x="65.92" y="76.21" width="5.31" height="14.94" style="fill:#878787; opacity:.7; stroke-width:0px;"/><circle cx="70.08" cy="142.5" r="33.56" transform="translate(-87.76 159.88) rotate(-70.1)" style="fill:#d3d3d3; mix-blend-mode:multiply; stroke-width:0px;"/><circle cx="72.5" cy="140.73" r="36.84" transform="translate(-69.22 211.27) rotate(-89.2)" style="fill:none; stroke:#ff7676; stroke-miterlimit:10;"/><circle cx="72.5" cy="140.73" r="32.69" transform="translate(-69.1 211.51) rotate(-89.3)" style="fill:#4c4c4c; stroke-width:0px;"/><path d="M101.05,140.73c0,15.77-12.78,28.55-28.55,28.55s-28.55-12.78-28.55-28.55,12.78-28.55,28.55-28.55,28.55,12.78,28.55,28.55Z" style="fill:#161616; stroke-width:0px;"/><path d="M91.01,140.73c0,10.22-8.29,18.51-18.51,18.51s-18.51-8.29-18.51-18.51,8.29-18.51,18.51-18.51,18.51,8.29,18.51,18.51Z" style="fill:#898989; stroke-width:0px;"/><path d="M72.5,155.26c-8.01,0-14.53-6.52-14.53-14.53s6.52-14.53,14.53-14.53,14.53,6.52,14.53,14.53-6.52,14.53-14.53,14.53ZM72.5,127.52c-7.28,0-13.21,5.92-13.21,13.21s5.93,13.21,13.21,13.21,13.21-5.92,13.21-13.21-5.93-13.21-13.21-13.21Z" style="fill:#2d2d2d; stroke-width:0px;"/><path d="M82.32,135.26c0,2.2-1.78,3.98-3.98,3.98s-3.98-1.78-3.98-3.98,1.78-3.97,3.98-3.97,3.98,1.78,3.98,3.97Z" style="fill:#d3d3d3; opacity:.6; stroke-width:0px;"/><path d="M66.95,148.1c0,.99-.8,1.8-1.8,1.8s-1.8-.8-1.8-1.8.81-1.8,1.8-1.8,1.8.8,1.8,1.8Z" style="fill:#d3d3d3; opacity:.6; stroke-width:0px;"/><path d="M119.07,181.75c0,2.01-1.63,3.64-3.64,3.64s-3.64-1.63-3.64-3.64,1.63-3.64,3.64-3.64,3.64,1.63,3.64,3.64Z" style="fill:#6b6b6b; stroke-width:0px;"/><path d="M115.86,181.75c0,1.89-.19,3.42-.43,3.42s-.43-1.53-.43-3.42.19-3.42.43-3.42.43,1.53.43,3.42Z" style="fill:#161616; stroke-width:0px;"/><path d="M115.43,181.33c1.89,0,3.42.19,3.42.42s-1.53.43-3.42.43-3.42-.19-3.42-.43,1.53-.42,3.42-.42Z" style="fill:#161616; stroke-width:0px;"/><path d="M32.87,181.75c0,2.01-1.63,3.64-3.64,3.64s-3.64-1.63-3.64-3.64,1.63-3.64,3.64-3.64,3.64,1.63,3.64,3.64Z" style="fill:#6b6b6b; stroke-width:0px;"/><path d="M29.66,181.75c0,1.89-.19,3.42-.43,3.42s-.43-1.53-.43-3.42.19-3.42.43-3.42.43,1.53.43,3.42Z" style="fill:#161616; stroke-width:0px;"/><path d="M29.24,181.33c1.89,0,3.42.19,3.42.42s-1.53.43-3.42.43-3.42-.19-3.42-.43,1.53-.42,3.42-.42Z" style="fill:#161616; stroke-width:0px;"/><path d="M119.07,104.28c0,2.01-1.63,3.64-3.64,3.64s-3.64-1.63-3.64-3.64,1.63-3.64,3.64-3.64,3.64,1.63,3.64,3.64Z" style="fill:#6b6b6b; stroke-width:0px;"/><path d="M115.86,104.28c0,1.89-.19,3.42-.43,3.42s-.43-1.53-.43-3.42.19-3.42.43-3.42.43,1.53.43,3.42Z" style="fill:#161616; stroke-width:0px;"/><path d="M115.43,103.86c1.89,0,3.42.19,3.42.43s-1.53.43-3.42.43-3.42-.19-3.42-.43,1.53-.43,3.42-.43Z" style="fill:#161616; stroke-width:0px;"/><path d="M32.87,104.28c0,2.01-1.63,3.64-3.64,3.64s-3.64-1.63-3.64-3.64,1.63-3.64,3.64-3.64,3.64,1.63,3.64,3.64Z" style="fill:#6b6b6b; stroke-width:0px;"/><path d="M29.66,104.28c0,1.89-.19,3.42-.43,3.42s-.43-1.53-.43-3.42.19-3.42.43-3.42.43,1.53.43,3.42Z" style="fill:#161616; stroke-width:0px;"/><path d="M29.24,103.86c1.89,0,3.42.19,3.42.43s-1.53.43-3.42.43-3.42-.19-3.42-.43,1.53-.43,3.42-.43Z" style="fill:#161616; stroke-width:0px;"/><path d="M165.85,197.31c0,2.48-2.01,4.48-4.48,4.48h-17.68c-2.48,0-4.48-2.01-4.48-4.48v-118.43c0-2.48,2.01-4.48,4.48-4.48h23.72c2.48,0,9.46,2.01,9.46,4.48l-11.02,118.43Z" style="fill:#442c23; stroke-width:0px;"/><path d="M148.02,83.79c0-2.48,2.01-4.48,4.48-4.48h23.72c.17,0,.37.01.59.03l.06-.46c0-2.48-6.99-4.48-9.46-4.48h-23.72c-2.48,0-4.48,2.01-4.48,4.48v118.43c0,2.48,2.01,4.48,4.48,4.48h4.33v-118Z" style="fill:#bcbcbc; mix-blend-mode:multiply; stroke-width:0px;"/><path d="M139.21,84.16v19.23c4.94,4.82,13.48,8.01,23.2,8.01,3.67,0,7.17-.46,10.37-1.28l4.09-31.25s-.02-.1-.03-.15c-4.2-1.64-9.15-2.58-14.44-2.58-9.72,0-18.26,3.19-23.2,8.01Z" style="fill:#bcbcbc; mix-blend-mode:multiply; stroke-width:0px;"/><path d="M224.3,50.29c0,27.78-22.52,50.29-50.29,50.29s-50.29-22.51-50.29-50.29S146.23,0,174.01,0s50.29,22.52,50.29,50.29Z" style="fill:#7a7a7a; stroke-width:0px;"/><path d="M222.17,50.29c0,25.85-20.96,46.81-46.81,46.81s-46.81-20.96-46.81-46.81S149.51,3.48,175.36,3.48s46.81,20.96,46.81,46.81Z" style="fill:#afafaf; stroke-width:0px;"/><path d="M220.21,50.29c0,25.52-20.69,46.21-46.21,46.21s-46.21-20.69-46.21-46.21S148.49,4.08,174.01,4.08s46.21,20.69,46.21,46.21Z" style="fill:#efefef; stroke-width:0px;"/><path d="M162.97,5.42c-20.19,4.95-35.17,23.16-35.17,44.87s14.98,39.92,35.17,44.87c20.19-4.95,35.17-23.16,35.17-44.87s-14.98-39.92-35.17-44.87Z" style="fill:#dbdbdb; stroke-width:0px;"/><path d="M177.42,54.1c0,6.33-5.14,11.47-11.47,11.47s-11.47-5.14-11.47-11.47,5.14-11.47,11.47-11.47,11.47,5.14,11.47,11.47Z" style="fill:#f7f7f7; stroke-width:0px;"/><path d="M172.4,54.1c0,3.56-2.88,6.44-6.44,6.44s-6.44-2.88-6.44-6.44,2.88-6.44,6.44-6.44,6.44,2.88,6.44,6.44Z" style="fill:#161616; stroke-width:0px;"/><path d="M168.94,51.12c0,.83-.67,1.49-1.49,1.49s-1.49-.67-1.49-1.49.67-1.49,1.49-1.49,1.49.67,1.49,1.49Z" style="fill:#f7f7f7; opacity:.5; stroke-width:0px;"/><path d="M165.67,56.95c0,.53-.43.96-.96.96s-.96-.43-.96-.96.43-.96.96-.96.96.43.96.96Z" style="fill:#f7f7f7; opacity:.5; stroke-width:0px;"/><path d="M167.62,63.03c0,.92-.75,1.67-1.67,1.67s-1.66-.75-1.66-1.67.75-1.66,1.66-1.66,1.67.75,1.67,1.66Z" style="fill:#6b6b6b; stroke-width:0px;"/><path d="M166.15,63.03c0,.86-.09,1.56-.19,1.56s-.2-.7-.2-1.56.09-1.56.2-1.56.19.7.19,1.56Z" style="fill:#161616; stroke-width:0px;"/><path d="M165.95,62.83c.86,0,1.56.09,1.56.2s-.7.2-1.56.2-1.56-.09-1.56-.2.7-.2,1.56-.2Z" style="fill:#161616; stroke-width:0px;"/><path d="M167.62,45.18c0,.92-.75,1.67-1.67,1.67s-1.66-.75-1.66-1.67.75-1.67,1.66-1.67,1.67.75,1.67,1.67Z" style="fill:#6b6b6b; stroke-width:0px;"/><path d="M166.15,45.18c0,.86-.09,1.56-.19,1.56s-.2-.7-.2-1.56.09-1.56.2-1.56.19.7.19,1.56Z" style="fill:#161616; stroke-width:0px;"/><path d="M165.95,44.98c.86,0,1.56.09,1.56.2s-.7.2-1.56.2-1.56-.09-1.56-.2.7-.2,1.56-.2Z" style="fill:#161616; stroke-width:0px;"/><path d="M174.88,52.44c.92,0,1.67.75,1.67,1.67s-.75,1.66-1.67,1.66-1.67-.75-1.67-1.66.75-1.67,1.67-1.67Z" style="fill:#6b6b6b; stroke-width:0px;"/><path d="M174.88,53.91c.86,0,1.56.09,1.56.2s-.7.19-1.56.19-1.56-.09-1.56-.19.7-.2,1.56-.2Z" style="fill:#161616; stroke-width:0px;"/><path d="M174.68,54.1c0-.86.09-1.57.19-1.57s.2.7.2,1.57-.09,1.56-.2,1.56-.19-.7-.19-1.56Z" style="fill:#161616; stroke-width:0px;"/><path d="M157.03,52.44c.92,0,1.67.75,1.67,1.67s-.75,1.66-1.67,1.66-1.67-.75-1.67-1.66.75-1.67,1.67-1.67Z" style="fill:#6b6b6b; stroke-width:0px;"/><path d="M157.03,53.91c.86,0,1.56.09,1.56.2s-.7.19-1.56.19-1.56-.09-1.56-.19.7-.2,1.56-.2Z" style="fill:#161616; stroke-width:0px;"/><path d="M156.83,54.1c0-.86.09-1.57.2-1.57s.2.7.2,1.57-.09,1.56-.2,1.56-.2-.7-.2-1.56Z" style="fill:#161616; stroke-width:0px;"/></g></g></g></svg>`;

function svgToDataURL(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

let linie = new GeoJsonLayer({
    id: "linie",
    data: "/src/datas/linie-mit-polygon-updated.geojson",
    pickable: true,
    layout: {
        'visibility': 'visible'
    },
    stroked: true,
    lineWidthMinPixels: 2,
    opacity: 1,
    getLineColor: [45, 50, 125],
    visible: layersVisibility.linie,
    // Update tooltip position and content
    onHover: ({object, x, y})=>{updateTooltip(map, linie, {object, x, y})}
});
let bahnubergang = new GeoJsonLayer({
    id: "bahnubergang",
    data: "/src/datas/bahnubergang.geojson",
    pointType: 'icon',
    getIcon: (d) => ({
        url: svgToDataURL(railwayCrossingIcon),
        width: 512,
        height: 512
    }),
    iconSizeScale: 1,
    iconSizeMinPixels: 24,
    pickable: true,
    layout: {
        'visibility': 'none'
    },
    visible: layersVisibility.bahnubergang,
    // Update tooltip position and content
    onHover: ({object, x, y})=>{updateTooltip(map, bahnubergang, {object, x, y})}
});
let bahnhof = new GeoJsonLayer({
    id: "bahnhof",
    data: "/src/datas/linie-mit-betriebspunkten.geojson",
    pointType: 'icon',
    getIcon: (d) => ({
        url: svgToDataURL(bahnhofIcon),
        width: 512,
        height: 512
    }),
    iconSizeScale: 1,
    iconSizeMinPixels: 24,
    pickable: true,
    layout: {
        'visibility': 'visible'
    },
    visible: layersVisibility.bahnhof,
    // Update tooltip position and content
    onHover: ({object, x, y})=>{updateTooltip(map, bahnhof, {object, x, y})}
});
let bahnhofbenutzer = new ColumnLayer({
    id: 'bahnhofbenutzer',
    data: '/src/datas/filtered_anzahl-sbb-bahnhofbenutzer.json',
    diskResolution: 100,
    extruded: true,
    radius: 500,
    elevationScale: 0.1,
    getElevation: d => d.anzahl_bahnhofbenutzer,
    getFillColor: d => [255-((1-d.anzahl_bahnhofbenutzer/400000)*255/4), 180-((1-d.anzahl_bahnhofbenutzer/400000)*180/4), 0, 255],
    getPosition: d => d.coordinates,
    pickable: true,
    layout: {
        'visibility': 'visible'
    },
    visible: layersVisibility.bahnhofbenutzer,
    // Update tooltip position and content
    onHover: ({object, x, y})=>{updateTooltip(map, bahnhofbenutzer, {object, x, y})}
});
let historische_bahnhofbilder = new GeoJsonLayer({
    id: "historische_bahnhofbilder",
    data: "/src/datas/historische-bahnhofbilder.geojson",
    pointType: 'icon',
    getIcon: (d) => ({
        url: svgToDataURL(cameraIcon),
        width: 512,
        height: 512
    }),
    iconSizeScale: 1,
    iconSizeMinPixels: 24,
    pickable: true,
    layout: {
        'visibility': 'visible'
    },
    visible: layersVisibility.historische_bahnhofbilder,
    // Update tooltip position and content
    onHover: ({object, x, y})=>{updateTooltip(map, historische_bahnhofbilder, {object, x, y})}
});

let deckOverlay = new DeckOverlay({
    interleaved: true,
    layers: [
        linie,
        bahnubergang,
        bahnhof,
        bahnhofbenutzer,
        historische_bahnhofbilder
    ]
});

function setLayerVisibility(layer) {
    const clickedLayer = layer.layer;
    //console.log("layer: "+clickedLayer+", visibility: "+layer.visibility);
    //console.log(layer);
    
    /*const visibility = map.getLayoutProperty(
        clickedLayer,
        'visibility'
    );*/

    // Toggle layer visibility by changing the layout object's visibility property.
    if (layer.visibility === 'visible') {
        map.setLayoutProperty(
            clickedLayer,
            'visibility',
            'visible'
        );
    } else {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
    }
}

// instantiate the scrollama
var scroller = scrollama();
// disable scrollama for the homepage
//scrollama.disable();

map.on("load", function() {
    if (config.use3dTerrain) {
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
    };

    let mapControl = new mapboxgl.NavigationControl();
    map.addControl(mapControl, 'top-right');
    map.addControl(deckOverlay);
    let controlContainer = document.querySelector(".mapboxgl-control-container");
    // setup the instance, pass callback functions
    scroller
    .setup({
        step: '.step',
        offset: 0.9,
        progress: true
    })
    .onStepEnter(response => {
        var chapter = config.chapters.find(chap => chap.id === response.element.id);
        response.element.classList.add('active');
        map[chapter.mapAnimation || 'flyTo'](chapter.location);

        if (config.showMarkers) {
            marker.setLngLat(chapter.location.center);
        }
        if (chapter.onChapterEnter.length > 0) {
            chapter.onChapterEnter.forEach(setLayerVisibility);
        }
        if (chapter.callback) {
            window[chapter.callback]();
        }
        if (chapter.rotateAnimation) {
            map.once('moveend', function() {
                const rotateNumber = map.getBearing();
                map.rotateTo(rotateNumber + 90, {
                    duration: 24000, easing: function (t) {
                        return t;
                    }
                });
            });
        }
        if (chapter.id === 'creditentials') {
            map.getCanvasContainer().style = controlContainer.style =`
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s 500ms, opacity 500ms linear;`;
            credits.style = `
            visibility: visible;
            opacity: 1;
            transition: opacity 500ms linear;`;
        }
        else if (response.element.id !== 'homepage') {
            document.querySelector('#homepage>div').style = `transform: translateY(-100vh)`;
        }
        
    })
    .onStepExit(response => {
        var chapter = config.chapters.find(chap => chap.id === response.element.id);
        response.element.classList.remove('active');
        if (chapter.onChapterExit.length > 0) {
            chapter.onChapterExit.forEach(setLayerVisibility);
        }
        if (chapter.id === 'creditentials') {
            map.getCanvasContainer().style = controlContainer.style =`
            visibility: visible;
            opacity: 1;
            transition: opacity 500ms linear;`;
            credits.style = `
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s 500ms, opacity 500ms linear;`;
        }
    })
    .onStepProgress(response => {

        let holdingHand = document.getElementById('holding-hand');
        let map = document.getElementById('map');
        const homepage = document.querySelector('#homepage>div');
        if (response.element.id === 'homepage') {

            //console.log(response.progress);
            const homepageTrain = document.getElementById('train');
            if(response.progress < 0.25) {
                homepageTrain.style.transform = `translate(0vh)`;
            } else if(response.progress > 0.25 && response.progress < 0.5) {
                homepageTrain.style.transform = `translate(${(response.progress-0.25)*4*(4*window.innerHeight+1*window.innerWidth)}px)`;
            } else if(response.progress > 0.5) {
                homepageTrain.style.transform = `translate(${4*window.innerHeight+1*window.innerWidth}px)`;
            }

            if(response.progress < 0.45){
                homepage.style.transform = `translateY(0px)`;
            } else if(response.progress > 0.45 && response.progress < 0.75) {
                homepage.style.transform = `translateY(-${(response.progress-0.45)/3*1000}vh)`;
            }

            if(response.progress < 0.65){
                holdingHand.style.transform = map.style.transform = `translate(100vw, 40vh)`;
            } else if(response.progress > 0.65) {
                holdingHand.style.transform = map.style.transform = `translate(${(1-Math.min((response.progress-0.65)/0.3, 1))*100}vw, ${(1-Math.min((response.progress-0.65)/0.3, 1))*40}vh)`;
            }
        }
        else {
            holdingHand.style.transform = map.style.transform = `translate(0,0)`;
            homepage.style.transform = `translateY(-100vh)`;
        }
    });
});

// setup resize event
window.addEventListener('resize', scroller.resize);

export default map;