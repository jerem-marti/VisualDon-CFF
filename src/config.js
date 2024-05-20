var config = {
    style: 'mapbox://styles/jerem-marti/clvzjtajr02dl01qz6y02cyfv',
    accessToken: process.env.MAPBOX_API,
    showMarkers: false,
    theme: 'light',
    use3dTerrain: false,
    title: '',
    subtitle: '',
    byline: '',
    footer: '',
    chapters: [
        {
            id: 'homepage',
            alignment: 'full',
            title: '',
            image: '',
            description: '',
            location: {
                center: [8.3, 46.8],
                zoom: 7,
                minZoom: 7,
                pitch: 0.00,
                bearing: 0.00,
                maxBounds: [
                    [5.5, 45.5], // Southwest coordinates
                    [10.8, 47.9] // Northeast coordinates
                ]
            },
            onChapterEnter: [
                {
                    layer: 'linie',
                    visibility: 'none'
                },
                {
                    layer: 'bahnubergang',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhof',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhofbenutzer',
                    visibility: 'none'
                },
                {
                    layer: 'historische_bahnhofbilder',
                    visibility: 'none'
                }
            ],
            onChapterExit: []
        },
        {
            id: 'chemin-de-fer-suisse',
            alignment: 'left',
            title: 'Lignes de chemin de fer suisses',
            image: '',
            description: `
            Le réseau ferroviaire suisse est l'un des plus denses et des plus efficaces au monde. Avec plus de 5 000 kilomètres de voies, il relie toutes les régions du pays, des montagnes majestueuses aux vallées pittoresques. Les CFF (Chemins de fer fédéraux suisses) sont le principal opérateur, mais plusieurs compagnies régionales jouent également un rôle crucial.
            <br><br><li>Fun Fact : Le Gotthard Base Tunnel, avec ses 57,1 kilomètres, est le tunnel ferroviaire le plus long du monde.</li>`,
            location: {
                center: [8.3, 46.8],
                zoom: 7,
                minZoom: 7,
                pitch: 0.00,
                bearing: 0.00,
                maxBounds: [
                    [5.5, 45.5], // Southwest coordinates
                    [10.8, 47.9] // Northeast coordinates
                ]
            },
            onChapterEnter: [
                {
                    layer: 'linie',
                    visibility: 'visible'
                },
                {
                    layer: 'bahnubergang',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhof',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhofbenutzer',
                    visibility: 'none'
                },
                {
                    layer: 'historische_bahnhofbilder',
                    visibility: 'none'
                }
            ],
            onChapterExit: []
        },
        {
            id: 'passages-a-niveau',
            alignment: 'left',
            title: 'Passages à niveau',
            image: '',
            description: `
            Les passages à niveau en Suisse sont conçus pour garantir la sécurité maximale. On en dénombre environ 1 800, et beaucoup sont équipés de barrières automatiques et de systèmes d'avertissement modernes. Le programme de suppression des passages à niveau non sécurisés continue de réduire les risques d'accidents.
            <br><br><li>Fun Fact : La Suisse a l'un des taux d'accidents aux passages à niveau les plus bas d'Europe grâce à ses mesures de sécurité rigoureuses.</li>
            `,
            location: {
                center: [8.3, 46.8],
                zoom: 7,
                minZoom: 7,
                pitch: 0.00,
                bearing: 0.00,
                maxBounds: [
                    [5.5, 45.5], // Southwest coordinates
                    [10.8, 47.9] // Northeast coordinates
                ]
            },
            onChapterEnter: [
                {
                    layer: 'linie',
                    visibility: 'visible'
                },
                {
                    layer: 'bahnubergang',
                    visibility: 'visible'
                },
                {
                    layer: 'bahnhof',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhofbenutzer',
                    visibility: 'none'
                },
                {
                    layer: 'historische_bahnhofbilder',
                    visibility: 'none'
                }
            ],
            onChapterExit: []
        },
        {
            id: 'gares-ferroviaires',
            alignment: 'left',
            title: 'Gares ferroviaires',
            image: '',
            description: `La Suisse compte plus de 800 gares ferroviaires, allant des grandes hubs internationaux comme Zurich et Genève aux petites stations pittoresques dans les Alpes. Chaque gare joue un rôle vital dans le réseau, assurant des connexions fluides et efficaces.`,
            location: {
                center: [8.3, 46.8],
                zoom: 7,
                minZoom: 7,
                pitch: 0.00,
                bearing: 0.00,
                maxBounds: [
                    [5.5, 45.5], // Southwest coordinates
                    [10.8, 47.9] // Northeast coordinates
                ]
            },
            onChapterEnter: [
                {
                    layer: 'linie',
                    visibility: 'visible'
                },
                {
                    layer: 'bahnubergang',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhof',
                    visibility: 'visible'
                },
                {
                    layer: 'bahnhofbenutzer',
                    visibility: 'none'
                },
                {
                    layer: 'historische_bahnhofbilder',
                    visibility: 'none'
                }
            ],
            onChapterExit: []
        },
        {
            id: 'nombre-passagers-gare',
            alignment: 'left',
            title: 'Nombre de passagers par gare',
            image: '',
            description: `Les gares les plus fréquentées, comme Zurich HB et Genève Cornavin, voient passer des centaines de milliers de passagers chaque jour. En 2019, Zurich HB a accueilli plus de 400 000 voyageurs par jour, en faisant l'une des gares les plus animées d'Europe.`,
            location: {
                center: [8, 46.8],
                zoom: 8.2,
                minZoom: 7,
                pitch: 75.00, // Adjust the pitch value to tilt the map
                bearing: 0.00,
                maxBounds: [
                    [5.5, 45.5], // Southwest coordinates
                    [10.8, 47.9] // Northeast coordinates
                ]
            },
            onChapterEnter: [
                {
                    layer: 'linie',
                    visibility: 'visible'
                },
                {
                    layer: 'bahnubergang',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhof',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhofbenutzer',
                    visibility: 'visible'
                },
                {
                    layer: 'historische_bahnhofbilder',
                    visibility: 'none'
                }
            ],
            onChapterExit: []
        },
        {
            id: 'photographie-historique-gares',
            alignment: 'left',
            title: 'Photos historiques des gares',
            image: '',
            description: `
            Les chemins de fer suisses ont une histoire riche et fascinante. Dès l'ouverture de la première ligne Zurich-Baden en 1847, le réseau s'est rapidement étendu. Les gares historiques comme celle de Lausanne, inaugurée en 1856, témoignent de l'évolution architecturale et technologique au fil des décennies.
            <br><br><li>Fun Fact : Le chemin de fer du Rigi, ouvert en 1871, est l'un des plus anciens chemins de fer à crémaillère au monde.</li>
            `,
            location: {
                center: [8.3, 46.8],
                zoom: 7,
                minZoom: 7,
                pitch: 0.00,
                bearing: 0.00,
                maxBounds: [
                    [5.5, 45.5], // Southwest coordinates
                    [10.8, 47.9] // Northeast coordinates
                ]
            },
            onChapterEnter: [
                {
                    layer: 'linie',
                    visibility: 'visible'
                },
                {
                    layer: 'bahnubergang',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhof',
                    visibility: 'none'
                },
                {
                    layer: 'bahnhofbenutzer',
                    visibility: 'none'
                },
                {
                    layer: 'historische_bahnhofbilder',
                    visibility: 'visible'
                }
            ],
            onChapterExit: []
        },  
         {
            id: 'creditentials',
            alignment: 'left',
            title: 'Merci !',
            image: '',
            description: `Merci d'avoir exploré les chemins de fer suisses avec nous. Nous espérons que cette découverte interactive vous a plu et vous a permis d'en apprendre davantage sur ce réseau exceptionnel. À bientôt pour de nouvelles aventures ferroviaires !`,
            location: {
                center: [8.3, 46.8],
                zoom: 7,
                minZoom: 7,
                pitch: 0.00,
                bearing: 0.00,
                maxBounds: [
                    [5.5, 45.5], // Southwest coordinates
                    [10.8, 47.9] // Northeast coordinates
                ]
            },
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};

export default config;