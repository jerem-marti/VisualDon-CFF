# VisualDon-CFF
Dans le cadre du cours de Visualisation de données (VisualDon) de la Haute École d'Ingénierie et de Gestion du canton de Vaud (HEIG-VD), je dois créer une page web de storytelling basée sur des données. Le but de la démarche est de prendre en main le framework D3.js. Mon projet s'oriente vers la visualisation des données liées au transport ferroviaire suisse.

## Contexte
_D'où viennent les données, qui les a créées et dans quel contexte ?_

Les données utilisées proviennent de deux sources presque communes :

### CFF
Les CFF mettent à disposition un nombre important d'Open Data concernant leur exploitation. Ces données sont importantes au sein de l'entreprise pour sa gestion. Il est clair qu'une entreprise nationale telle que les CFF se doit de collecter des informations afin de prendre des décisions concrètes. Le but de mettre une partie de leurs données en libre accès est de soutenir l'innovation et le développement de services. Ces services auront pour eux un effet passif de renforcement de l'attrait des transports publics en Suisse.
**Lien** : https://data.sbb.ch/

### Opentransportdata.swiss
Exploitée pour le compte de l’Office fédéral des transports, Opentransportdata.swiss est la plateforme des données d’information des transports publics suisses et de la mobilité individuelle. Elle permet de consulter gratuitement des données relatives à la mobilité en général et d’accéder à différents services. Le but était en 2017 et est encore maintenant l'amélioration du domaine numérique pour les transports par le biais de la mise à disposition des données. Ayant été créée en collaboration entre les CFF, l'OFT et Liip, plusieurs datasets mis à disposition sur data.sbb.ch (cf. ci-dessus) sont originaires de Opentransportdata.
**Lien** : https://opentransportdata.swiss/

## Données
_Comment sont structurées les données ? Parler du format, des attributs et du type de données._

Afin de créer mon projet de scrollytelling, je me suis basé sur deux "types" de données. Premièrement, il y a les données concernant le trafic ferroviaire qui concernent les horaires, trajets, etc. Deuxièmement, des données concernant les services annexes nécessaires à l'exploitation des trains tels que les rails, les gares, etc.

### Données du traffic féroviaire suisse
Opentransportdata met à disposition deux sources de données concernant le trafic ferroviaire suisse :
- GTFS _(General Transit Feed Specification)_
- GTFS-RT _(Realtime)_

GTFS est une norme ouverte qui permet de représenter de manière cohérente les horaires et les informations géographiques des services de transport public. Elle est utilisée par les agences de transport pour publier leurs données de transport, ce qui permet ensuite aux développeurs d'applications de créer des outils de navigation, des horaires et des services de planification de trajets pour les usagers. GTFS définit un format spécifique pour les données, habituellement sous forme de fichiers CSV zippés, comprenant des informations telles que les arrêts, les trajets, les horaires et d'autres détails opérationnels.

GTFS-Realtime, quant à lui, est une extension du GTFS qui fournit des informations en temps réel sur le transport public, comme les retards, les annulations ou les modifications temporaires des itinéraires. Il utilise un format basé sur le protocole Protocol Buffers de Google, qui est plus léger et plus rapide à analyser que le format CSV. GTFS-RT permet aux utilisateurs d'accéder à des informations à jour sur l'état du réseau de transport, améliorant ainsi la planification des trajets et l'expérience globale des usagers du transport public.

**Liens** : 
- https://gtfs.org/
- https://opentransportdata.swiss/fr/dataset/timetable-2024-gtfs2020

**Accès aux données** :
live (GTFS-RT) sont disponibles via une API. Cependant, il est nécessaire d'être identifié avec un token pour y avoir accès. Voici le lien d'inscription : https://opentransportdata.swiss/en/register/

Les informations concernant les tarifs d'accès et les conditions sont accessibles via : https://opentransportdata.swiss/en/terms-of-use/

### Données annexes au traffic féroviaire suisse
Les données annexes ont été choisies en fonction du storytelling. Nous pouvons y retrouver les datasets suivants :
- [Passage à niveau CFF](https://data.sbb.ch/explore/dataset/bahnubergang/information/)
- [Réseau des lignes CFF](https://data.sbb.ch/explore/dataset/linie/)
- [Nombre d’usagers de la gare CFF](https://data.sbb.ch/explore/dataset/anzahl-sbb-bahnhofbenutzer/)
- [Ligne (graphique)](https://data.sbb.ch/explore/dataset/linie-mit-polygon/)
- [Abonnement général/abonnement demi-tarif – avec données sur la population](https://data.sbb.ch/explore/dataset/generalabo-halbtax-mit-bevolkerungsdaten/)
- [Images historiques de gares ferroviaires](https://data.sbb.ch/explore/dataset/historische-bahnhofbilder/)

## But du projet
_Qu'est-ce que vous voulez découvrir ? Des tendances ? Vous voulez explorer ou expliquer ?_

Le but du projet est de mettre en exergue l'aspect gargantuesque des Chemins de Fer suisses. Par exemple,
> "En moyenne, un train circule toutes les 12 minutes en Suisse. La Suisse est la championne mondiale en matière de densité de trains. Avec en moyenne 93,8 trains qui circulent chaque jour par ligne, soit un train toutes les 12 minutes." - [RTS](https://www.rts.ch/info/suisse/1169490-la-suisse-championne-mondiale-du-rail.html#:~:text=En%20moyenne%2C%20un%20train%20circule,arrive%20loin%20devant%20le%20Japon.)

Le projet se basera principalement sur une carte interactive de la Suisse qui verra les informations changer en fonction du défilement de l'utilisateur. Le défi principal est d'afficher les trains en temps réel sur la carte puis d'agrémenter l'expérience avec diverses informations concernant l'exploitation des trains.

## Références
_Qui d'autre sur le web ou dans la recherche a utilisé ces données ? Dans quel but ?_

Les services de transports tels que :
- [CFF](https://www.sbb.ch/)
- [BLS](https://www.bls.ch/)
- [FAIRTIQ](https://fairtiq.com/)
- [Carte de réseau infrastructure ferroviaire](https://maps.trafimage.ch/)

