import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer} from '@deck.gl/layers';
import scrollama from "scrollama";
import mapboxgl, { Control } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import config from './config.js';

var alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty',
    'full': 'fully'
}

const layersVisibility = {
    'bahnubergang': true,
    'linie': true
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

let deckOverlay = new DeckOverlay({
    interleaved: true,
    layers: []
});

function updateDeckOverlay() {
    map.removeControl(deckOverlay);
    deckOverlay = new DeckOverlay({
    interleaved: true,
    layers: [
        new GeoJsonLayer({
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
            'visibility': 'visible'
        },
        visible: layersVisibility.bahnubergang,
        // Update tooltip position and content
        onHover: updateTooltip
        }),
        new GeoJsonLayer({
        id: "linie",
        data: "/src/datas/linie-mit-polygon.geojson",
        pickable: true,
        layout: {
            'visibility': 'visible'
        },
        stroked: true,
        lineWidthMinPixels: 3,
        opacity: 0.1,
        getLineColor: [0, 0, 255],
        visible: layersVisibility.linie,
        // Update tooltip position and content
        onHover: updateTooltip
        })
    ]
    });
    map.addControl(deckOverlay);
}

function setLayerVisibility(layer) {
    const clickedLayer = layer.layer;
    console.log("layer: "+clickedLayer+", visibility: "+layer.visibility);
    
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
    <li><a href="https://opentransportdata.swiss/en/cookbook/gtfs/">GTFS <em>(General Transit Feed Specification)</em></a></li>
    <li><a href="https://opentransportdata.swiss/en/cookbook/gtfs-rt/">GTFS-RT <em>(Realtime)</em></a></li>
    <li><a href="https://data.sbb.ch/explore/dataset/bahnubergang/information/">Passage à niveau CFF</a></li>
    <li><a href="https://data.sbb.ch/explore/dataset/linie/">Réseau des lignes CFF</a></li>
    <li><a href="https://data.sbb.ch/explore/dataset/anzahl-sbb-bahnhofbenutzer/">Nombre d’usagers de la gare CFF</a></li>
    <li><a href="https://data.sbb.ch/explore/dataset/linie-mit-polygon/">Ligne (graphique)</a></li>
    <li><a href="https://data.sbb.ch/explore/dataset/generalabo-halbtax-mit-bevolkerungsdaten/">Abonnement général/abonnement demi-tarif – avec données sur la population</a></li>
    <li><a href="https://data.sbb.ch/explore/dataset/historische-bahnhofbilder/">Images historiques de gares ferroviaires</a></li>
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
    updateDeckOverlay();
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