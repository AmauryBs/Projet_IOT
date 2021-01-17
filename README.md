# API REST objet connecté
Ce projet est un développement d'une API REST pour la communication entre un objet connecté, une base de données et une application mobile Android.

## API
### Langage
L'API a été développée en Node.js et utilise Express comme serveur. Elle fait appel à une base de données MongoDB.
### Prérequis
Avoir installer mongoDB, Node.js et npm
### Installation et lancement
<ul>
  <li>Cloner le projet</li>
  <li>Se placer à la racine du projet (/nom_du_proj)</li>
  <li>Executer la commande suivante pour installer le projet : </li>
  
  ```
  npm install 
  ```
  <li>Puis : </li>
  
  ```
  node index.js ou nodemon index.js 
  ```
  Le serveur est lancé.
  </br>
  ![nodemon](screen/nodemon.PNG)
  </br>
  Vous pouvez maintenant l'utiliser.
</ul>

## Objet connecté
Le code pour l'objet connecté est disponible dans le dossier /ESP32 à la racine du projet.
La carte electronique est une ESP32 de chez adafruit avec un grove shield.
### Langage
L'API a été développée sur Arduino IDE
### Prérequis
Avoir installer Arduino IDE
### Installation et lancement
<ul>
  <li>Cloner le projet</li>
  <li>Trouver le code dans /ESP32/Projet_IoT/ avec Arduino IDE</li>
</ul>





