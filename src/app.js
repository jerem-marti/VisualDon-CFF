import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer, ColumnLayer} from '@deck.gl/layers';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import scrollama from "scrollama";
import mapboxgl, { Control } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import config from './config.js';
import { Layer } from 'deck.gl';

var alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty',
    'full': 'fully'
}

const layersVisibility = {
    'linie': true,
    'bahnubergang': true,
    'bahnhof': true,
    'bahnhofbenutzer': true,
    'generalabo': true,
    'historische_bahnhofbilder': true
}

var story = document.getElementById('story');
var features = document.createElement('div');
features.setAttribute('id', 'features');

var header = document.createElement('div');

if (config.title) {
    var titleText = document.createElement('h1');
    titleText.innerText = config.title;
    header.appendChild(titleText);
}

if (config.subtitle) {
    var subtitleText = document.createElement('h2');
    subtitleText.innerText = config.subtitle;
    header.appendChild(subtitleText);
}

if (config.byline) {
    var bylineText = document.createElement('p');
    bylineText.innerText = config.byline;
    header.appendChild(bylineText);
}

if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute('id', 'header');
    story.appendChild(header);
}

config.chapters.forEach((record, idx) => {
    var container = document.createElement('div');
    var chapter = document.createElement('div');

    if (record.title) {
        var title = document.createElement('h2');
        title.innerText = record.title;
        chapter.appendChild(title);
    }

    if (record.image) {
        var image = new Image();
        image.src = record.image;
        chapter.appendChild(image);
    }

    if (record.description) {
        var story = document.createElement('p');
        story.innerHTML = record.description;
        chapter.appendChild(story);
    }

    container.setAttribute('id', record.id);
    container.classList.add('step');
    if (idx === 0) {
        container.classList.add('active');
    }

    chapter.classList.add(config.theme);
    container.appendChild(chapter);
    container.classList.add(alignments[record.alignment] || 'centered');
    if (record.hidden) {
        container.classList.add('hidden');
    }
    features.appendChild(container);
});

story.appendChild(features);

var footer = document.createElement('div');

if (config.footer) {
    var footerText = document.createElement('p');
    footerText.innerHTML = config.footer;
    footer.appendChild(footerText);
}

if (footer.innerText.length > 0) {
    footer.classList.add(config.theme);
    footer.setAttribute('id', 'footer');
    story.appendChild(footer);
}

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


const tooltip = document.createElement('div');
tooltip.id = 'tooltip';
tooltip.style.position = 'fixed';
tooltip.style.zIndex = 6;
tooltip.style.pointerEvents = 'none';
tooltip.style.backgroundColor = 'white';
tooltip.style.padding = `0.5rem 1rem`; 
tooltip.style.borderRadius = `1rem`;
tooltip.style.boxShadow = `rgba(0, 0, 0, 0.1) 0px 0px 10px`;
document.body.append(tooltip);

function updateTooltip(layer, {object, x, y}) {
    console.log("updateTooltip");
    console.log(layer.id);
    console.log(map.getLayer(layer.id));
    console.log(map.getLayoutProperty(layer.id, 'visibility') === 'visible');
  if (object && map.getLayoutProperty(layer.id, 'visibility') === 'visible') {
    let tooltipHTML = '';
    console.log("layer.id");
    console.log(layer.id);
    console.log("object");
    console.log(object);
    switch (layer.id) {
        case 'linie':
            tooltipHTML = `<p>${object.properties.liniename}</p>`;
            break; 
        case 'bahnubergang':
            tooltipHTML = `<p>${object.properties.name}</p>`;
            break;
        case 'bahnhof':
            tooltipHTML = `<p>${object.properties.bezeichnung_offiziell}</p>`;
            break;
        case 'bahnhofbenutzer':
            console.log(object);
            tooltipHTML = `<p>${object.anzahl_bahnhofbenutzer.toLocaleString()} usagers (Gare de ${object.bahnhof_gare_stazione} - ${object.jahr})</p>`;
            break;
        case 'generalabo':
            break;
        case 'historische_bahnhofbilder':
            fetch(`https://data.sbb.ch/api/explore/v2.1/catalog/datasets/historische-bahnhofbilder/records?select=filename&where=signatur_sbb_historic%20%3D%20%22`+object.signatur_sbb_historic+`%22&limit=1`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                tooltipHTML = `
                    <p>${object.properties.bahnhof}</p>
                    <p>${object.properties.datum_foto_1}</p>
                    <img src="${data.results[0].filename.url}" alt="${object.properties.bahnhof} - ${object.properties.datum_foto_1}" style="width: 100%; height: auto;"/>
                `;
            });
            break;
    }
    tooltip.innerHTML = tooltipHTML;

    tooltip.style.display = 'block';
    let mapPosition = document.querySelector('#map').getBoundingClientRect();
    tooltip.style.left = `${mapPosition.left+x-tooltip.offsetWidth}px`;
    tooltip.style.top = `${mapPosition.top+y}px`;
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

const bahnhofIcon = await fetchSVG('/src/assets/img/bahnhof.svg');

const cameraIcon = await fetchSVG('/src/assets/img/camera.svg');

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
    onHover: ({object, x, y})=>{updateTooltip(linie, {object, x, y})}
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
    onHover: ({object, x, y})=>{updateTooltip(bahnubergang, {object, x, y})}
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
    onHover: ({object, x, y})=>{updateTooltip(bahnhof, {object, x, y})}
});
let bahnhofbenutzer = new ColumnLayer({
    id: 'bahnhofbenutzer',
    data: '/src/datas/filtered_anzahl-sbb-bahnhofbenutzer.json',
    diskResolution: 100,
    extruded: true,
    radius: 500,
    elevationScale: 0.1,
    getElevation: d => d.anzahl_bahnhofbenutzer,
    getFillColor: d => [48, 128, d.anzahl_bahnhofbenutzer/400000 * 255, 255],
    getPosition: d => d.coordinates,
    pickable: true,
    layout: {
        'visibility': 'visible'
    },
    visible: layersVisibility.bahnhofbenutzer,
    // Update tooltip position and content
    onHover: ({object, x, y})=>{updateTooltip(bahnhofbenutzer, {object, x, y})}
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
    onHover: ({object, x, y})=>{updateTooltip(historische_bahnhofbilder, {object, x, y})}
});
let generalabo = new ColumnLayer({
    id: 'generalabo',
    data: '/src/datas/updated_generalabo_halbtax_mit_bevolkerungsdaten.json',
    diskResolution: 100,
    extruded: true,
    radius: 500,
    elevationScale: 1,
    getElevation: d => d.ga_ag,
    getFillColor: d => [48, 128, d.ga_ag/5000 * 255, 255],
    getPosition: d => d.coordinates,
    pickable: true,
    layout: {
        'visibility': 'none'
    },
    visible: layersVisibility.generalabo,
    // Update tooltip position and content
    onHover: ({object, x, y})=>{updateTooltip(generalabo, {object, x, y})}
});


let deckOverlay = new DeckOverlay({
    interleaved: true,
    layers: [
        linie,
        bahnubergang,
        bahnhof,
        bahnhofbenutzer,
        generalabo,
        historische_bahnhofbilder
    ]
});

function setLayerVisibility(layer) {
    const clickedLayer = layer.layer;
    console.log("layer: "+clickedLayer+", visibility: "+layer.visibility);
    console.log(layer);
    
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


if (config.showMarkers) {
    var marker = new mapboxgl.Marker({ color: config.markerColor });
    marker.setLngLat(config.chapters[0].location.center).addTo(map);
}

//homepage initialization
let homepage = document.querySelector("#homepage>div");
homepage.style.transform = `translateY(-100vh)`;

let homepageTitle = document.createElement('h1');
homepageTitle.id = 'title';
homepageTitle.innerText = 'Découvrez les chemins de fer suisses';

let homepageInviteToScroll = document.createElement('div');
homepageInviteToScroll.id = 'invite-to-scroll';
let inviteToScrollTagline = document.createElement('p');
inviteToScrollTagline.innerText = 'Défilez vers le bas pour commmencer votre voyage';
let inviteToScrollIcon = document.createElement('img');
inviteToScrollIcon.src = './src/assets/img/double-arrow-down.svg';
homepageInviteToScroll.append(inviteToScrollTagline);
homepageInviteToScroll.append(inviteToScrollIcon);

let homepageTrain = document.createElement('img');
homepageTrain.src = './src/assets/img/train.svg';
homepageTrain.id = 'train';

homepage.appendChild(homepageTitle);
homepage.appendChild(homepageInviteToScroll);
homepage.appendChild(homepageTrain);
//End of homepage initialization

//Credits initialization
let creditentialsTitle = document.createElement('h2');
creditentialsTitle.innerText = 'Crédits';
let creditentialsIntro = document.createElement('p');
creditentialsIntro.innerHTML = `
Ce site a été réalisé par <a href="https://www.linkedin.com/in/jermarti/" target="_blank">Jérémy Martin</a> dans le cadre du cours de <a href="https://gaps.heig-vd.ch/public/fiches/uv/uv.php?id=7326&plan=785" target="_blank">Visualisation de données (VisualDon)</a> de la Haute École d'Ingénierie et de Gestion du canton de Vaud (<a href="https://heig-vd.ch/" target="_blank">HEIG-VD</a>).`;
let creditentialsText = document.createElement('h3');
creditentialsText.innerHTML = `Données utilisées et provenance`;
let creditentialsList = document.createElement('ul');
creditentialsList.innerHTML = `
    <li>
        <a href="https://opentransportdata.swiss/fr/">Plateforme open data pour la mobilité en Suisse</a>
        <ul>
            <li><a href="https://opentransportdata.swiss/en/cookbook/gtfs/">GTFS <em>(General Transit Feed Specification)</em></a></li>
            <li><a href="https://opentransportdata.swiss/en/cookbook/gtfs-rt/">GTFS-RT <em>(Realtime)</em></a></li>
        </ul>
    </li>
    <li>
        <a href="https://data.sbb.ch/pages/home/">SBB Open Data</a>
        <ul>
            <li><a href="https://data.sbb.ch/explore/dataset/bahnubergang/information/">Passage à niveau CFF</a></li>
            <li><a href="https://data.sbb.ch/explore/dataset/linie/">Réseau des lignes CFF</a></li>
            <li><a href="https://data.sbb.ch/explore/dataset/anzahl-sbb-bahnhofbenutzer/">Nombre d’usagers de la gare CFF</a></li>
            <li><a href="https://data.sbb.ch/explore/dataset/linie-mit-polygon/">Ligne (graphique)</a></li>
            <li><a href="https://data.sbb.ch/explore/dataset/generalabo-halbtax-mit-bevolkerungsdaten/">Abonnement général/abonnement demi-tarif – avec données sur la population</a></li>
            <li><a href="https://data.sbb.ch/explore/dataset/historische-bahnhofbilder/">Images historiques de gares ferroviaires</a></li>
        </ul>
    </li>
    <li>
        <a href="https://www.swisstopo.admin.ch/fr">Office fédéral de topographie swisstopo</a>
        <ul>
            <li><a href="https://www.swisstopo.admin.ch/fr/repertoire-officiel-des-localites#R%C3%A9pertoire-des-localit%C3%A9s---Download">Répertoire des localités</a></li>
        </ul>
    </li>
    `;
let credits = document.createElement('div');
credits.id = 'credits';
credits.appendChild(creditentialsTitle);
credits.appendChild(creditentialsIntro);
credits.appendChild(creditentialsText);
credits.appendChild(creditentialsList);
document.getElementById("map").appendChild(credits);
//End of credits initialization

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
        if (response.element.id === 'homepage') {

            console.log(response.progress);

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

let timeoutId = null;
function handleClick(event) {
    const touchHand = document.getElementById('touching-hand');
    console.log(document.querySelector("#touching-hand"));
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    touchHand.style.top = mouseY - touchHand.clientHeight*0.02 + 'px';
    touchHand.style.right = (window.innerWidth - touchHand.clientWidth*0.10 - mouseX) + 'px';
    timeoutId = setTimeout(function() {
        touchHand.style.top = '85vh';
        touchHand.style.right = '100vw';
        timeoutId = null;
    }, 900);
}

function moveLadybug() {
    const ladybug = document.getElementById('ladybug');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const ladybugWidth = ladybug.clientWidth;
    const ladybugHeight = ladybug.clientHeight;

    let x = Math.random() * (windowWidth - ladybugWidth);
    let y = Math.random() * (windowHeight - ladybugHeight);

    let dx = (Math.random() - 0.5) * 2;
    let dy = (Math.random() - 0.5) * 2;

    function animate() {
        x += dx;
        y += dy;

        if (x + ladybugWidth >= windowWidth || x <= 0) {
            dx = -dx;
        }

        if (y + ladybugHeight >= windowHeight || y <= 0) {
            dy = -dy;
        }

        const rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        ladybug.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

        requestAnimationFrame(animate);
    }

    animate();
}

moveLadybug();
console.log(map);

document.addEventListener('click', handleClick);