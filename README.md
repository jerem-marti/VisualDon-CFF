# VisualDon-CFF
Dans le cadre du cours de Visualisation de données (VisualDon) de la Haute École d'Ingénierie et de Gestion du canton de Vaud (HEIG-VD), je dois créer une page web de storytelling basée dur des données. Le but de la démarche est de prendre en main le framework D3JS.
Mon projet s'oriente vers la visualisation des données liées au transport féroviaire suisse.

## Contexte
_Contexte : d'où viennent les données, qui les a créées et dans quel contexte_

Les données utilisées proviennent de deux sources presque communes.

### CFF
Les CFF mette à disposition un nombre important d'Open Data concernant leur exploitation. Ces données sont importantes au sein de l'entreprise pour sa gestion. Il est clair qu'une entreprise nationale tels que les CFF se doit de collecter des informations afin de prendre des décisions concretes. Le but de mettre une partie de leurs données en libre accès est de soutenir l'innovation et le développement de services. Ces services auront pour eux un effet passif de renforcement de l'attrait des Transports publiques en Suisse. 
**Lien** : https://data.sbb.ch/

### Opentransportdata.swiss
Exploitée pour le compte de l’Office fédéral des transports, Opentransportdata.swiss est la plate-forme des données d’information des transports publics suisses et de la mobilité individuelle. Elle permet de consulter gratuitement des données relatives à la mobilité en générale et d’accéder à différents services.
Le but etait en 2017 et est encore maintenant l'amélioration du domaine numérique pour les transports par le biais de la mise à disposition des données.
Ayant été créée en collaboration entre les CFF, l'OFT et Liip, plusieurs dataset mise à disposition sur data.sbb (cf. ci-dessus) sont originaire de Opentransportdata. 
**Lien** : https://opentransportdata.swiss/

## Données
_Description : Comment sont structurées les données ? Parler du format, des attributs et du type de données_

Afin de créer mon projet de scrollytelling, je me suis basée sur deux "type" de données. Premièrement il y a les données concernant le traffic ferroviaire qui concerne les horaires, trajets, etc. Deuxièmement, des données concernant les services annexes et nécessaire à l'exploitation des trains tels que les rails, les gares, etc.

### Données du traffic féroviaire
Opentransportdata met à disposition deux sources de données concernat le traffique féroviaire suisse.
- GTFS _(General Transit Feed Specification)_
- GTFS-RT _(Realtime)_



- But: qu'est-ce que vous voulez découvrir ? Des tendances ? Vous voulez explorer ou expliquer?
- Références: Qui d'autre dans le web ou dans la recherche a utilisé ces données ? Dans quel but ?