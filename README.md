# backend-sim

`backend-sim` est un package NPM qui génère des données fictives et les expose via une API REST. Il permet de créer des jeux de données réalistes pour les tests, les démonstrations, ou les prototypes d'applications.

## Fonctionnalités

Le package permet de générer plusieurs types de données fictives :

### Types de données disponibles

- **Person** : Données personnelles d'un utilisateur (nom, prénom, adresse, etc.).
- **Finance** : Données financières (compte bancaire, carte de crédit, transactions, etc.).
- **Location** : Données de localisation (adresse, latitude, longitude, etc.).
- **Date** : Données temporelles (dates passées, futures, récentes, etc.).
- **Commerce** : Données commerciales (produits, prix, description, etc.).

Chaque type de données est généré via la fonction `generateFullData(type, count)`, où `type` est le type de données à générer, et `count` est le nombre d'éléments à générer (par défaut 1).

## Installation

Pour installer le package, exécutez la commande suivante :

```bash
npm install backend-sim
```

### Comment l'utiliser ?

1. **Installation dans ton projet** :
   - Tu peux installer ce package dans n'importe quel projet JavaScript avec la commande :

```bash
     npm install backend-sim
```

2. **Utilisation dans ton code** :
   - Ensuite, tu pourras l'importer et l'utiliser dans ton projet comme ceci :
```js
     import { generateFullData } from 'backend-sim';

     const data = generateFullData('person', 10);  // Générer 10 entrées de type 'person'
     console.log(data);  // Affiche les données générées
```

### Conclusion :

Avec cette structure, ton package **génère uniquement des données fictives** et peut être facilement importé dans un projet JavaScript où tu as besoin de données de test ou pour simuler des utilisateurs, des transactions financières, des informations géographiques, etc. Il ne y a pas de serveur ou d'API REST impliqué dans cette approche.

### Type pris en charge

```bash
person finance location commerce date