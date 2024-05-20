function initialization () {
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
    return tooltip;
}

function updateTooltip(map, layer, {object, x, y}) {
    // //console.log("updateTooltip");
    // //console.log(layer.id);
    // //console.log(map.getLayer(layer.id));
    // //console.log(map.getLayoutProperty(layer.id, 'visibility') === 'visible');
    const tooltip = document.querySelector('#tooltip');
    if (object && map.getLayoutProperty(layer.id, "visibility") === "visible") {
        if (!document.querySelector("#tooltip")) initialization();
        let tooltipHTML = "";
        //console.log("layer.id");
        //console.log(layer.id);
        //console.log("object");
        //console.log(object);
        switch (layer.id) {
        case "linie":
            tooltipHTML = `<p>${object.properties.liniename}</p>`;
            break;
        case "bahnubergang":
            tooltipHTML = `<p>${object.properties.name}</p>`;
            break;
        case "bahnhof":
            tooltipHTML = `<p>${object.properties.bezeichnung_offiziell}</p>`;
            break;
        case "bahnhofbenutzer":
            //console.log(object);
            tooltipHTML = `<p>${object.anzahl_bahnhofbenutzer.toLocaleString()} usagers (Gare de ${
            object.bahnhof_gare_stazione
            } - ${object.jahr})</p>`;
            break;
        case "historische_bahnhofbilder":
            //console.log("NOM DU FICHIER DE LA PHOTO HISTORIQUE");
            //console.log(object.properties.signatur_sbb_historic.toLowerCase());
            fetch(
            `https://data.sbb.ch/api/explore/v2.1/catalog/datasets/historische-bahnhofbilder/records?where=signatur_sbb_historic%3D%22F_116_00001_306%22&limit=20`
            )
            //fetch(`https://data.sbb.ch/api/explore/v2.1/catalog/datasets/historische-bahnhofbilder/records?select=filename&where=signatur_sbb_historic%20%3D%20%22${object.properties.signatur_sbb_historic.toLowerCase()}%22&limit=1`)
            .then((response) => {
                //console.log(response);
                return response.json();
            })
            .then((data) => {
                //console.log(data);
                tooltipHTML = `
                        <p>${object.properties.bahnhof}<br>${
                object.properties.datum_foto_1 || ""
                }</p>
                        <img src="${data.results[0].filename.url}" alt="${
                object.properties.bahnhof
                } - ${
                object.properties.datum_foto_1
                }" style="width: auto; height: 40vh;"/>
                    `;
                tooltip.innerHTML = tooltipHTML;

                tooltip.style.display = "block";
                let mapPosition = document
                .querySelector("#map")
                .getBoundingClientRect();
                tooltip.style.left = `${
                mapPosition.left + x - tooltip.offsetWidth
                }px`;
                if (mapPosition.top + y < window.innerHeight / 2)
                tooltip.style.top = `${mapPosition.top + y}px`;
                else
                tooltip.style.top = `${
                    mapPosition.top + y - tooltip.offsetHeight
                }px`;
                document.body.addEventListener("mousemove", (event) => {
                updateTooltip(null, { object: null, x: 0, y: 0 });
                document.body.removeEventListener("mousemove");
                });
            });
            break;
        }
        tooltip.innerHTML = tooltipHTML;

        tooltip.style.display = "block";
        let mapPosition = document.querySelector("#map").getBoundingClientRect();
        tooltip.style.left = `${mapPosition.left + x - tooltip.offsetWidth}px`;
        tooltip.style.top = `${mapPosition.top + y}px`;
    } else {
        tooltip.style.display = "none";
    }
}

export default updateTooltip;