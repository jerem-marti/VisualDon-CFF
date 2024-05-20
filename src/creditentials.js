
//Credits initialization
let creditentialsTitle = document.createElement('h2');
creditentialsTitle.innerText = 'Crédits';
let creditentialsIntro = document.createElement('p');
creditentialsIntro.innerHTML = `
Ce site a été réalisé par <a href="https://www.linkedin.com/in/jermarti/" target="_blank">Jérémy Martin</a> dans le cadre du cours de <a href="https://gaps.heig-vd.ch/public/fiches/uv/uv.php?id=7326&plan=785" target="_blank">Visualisation de données (VisualDon)</a> de la Haute École d'Ingénierie et de Gestion du canton de Vaud (<a href="https://heig-vd.ch/" target="_blank">HEIG-VD</a>).`;
let creditentialsData = document.createElement('h3');
creditentialsData.innerHTML = `Données utilisées et provenance`;
let creditentialsDataList = document.createElement('ul');
creditentialsDataList.innerHTML = `
    <li>
        <a href="https://data.sbb.ch/pages/home/">SBB Open Data</a>
        <ul>
            <li><a href="https://data.sbb.ch/explore/dataset/bahnubergang/information/">Passage à niveau CFF</a></li>
            <li><a href="https://data.sbb.ch/explore/dataset/linie/">Réseau des lignes CFF</a></li>
            <li><a href="https://data.sbb.ch/explore/dataset/anzahl-sbb-bahnhofbenutzer/">Nombre d’usagers de la gare CFF</a></li>
            <li><a href="https://data.sbb.ch/explore/dataset/linie-mit-polygon/">Ligne (graphique)</a></li>
            <li><a href="https://data.sbb.ch/explore/dataset/historische-bahnhofbilder/">Images historiques de gares ferroviaires</a></li>
        </ul>
    </li>
    `;
    let creditentialsText = document.createElement('h3');
    creditentialsText.innerHTML = `Sources et références des textes`;
    let creditentialsTextList = document.createElement('ul');
    creditentialsTextList.innerHTML = `
        <li>Office fédéral de la statistique (OFS) : <a href="https://www.bfs.admin.ch/bfs/fr/home/statistiques/mobilite-transports/enquetes/oev.html">Statistiques des transports publics suisses</a></li>
        <li>CFF : <a href="https://company.sbb.ch/fr/entreprise/profil/publications/rapport-de-gestion.html">Rapport annuel des CFF</a></li>
        <li>Wikipedia : <a href="https://fr.wikipedia.org/wiki/Transport_ferroviaire_en_Suisse">Chemins de fer en Suisse</a></li>
    `;
let credits = document.createElement('div');
credits.id = 'credits';
credits.appendChild(creditentialsTitle);
credits.appendChild(creditentialsIntro);
credits.appendChild(creditentialsData);
credits.appendChild(creditentialsDataList);
credits.appendChild(creditentialsText);
credits.appendChild(creditentialsTextList);
document.getElementById("map").appendChild(credits);
//End of credits initialization