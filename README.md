# Ma carte fidélité — projet fil rouge

Application Vue 3 qui permet à un client de consulter sa carte de fidélité :
solde de points, niveau, historique des achats et offres à activer.
Toutes les données sont **factices**.

## Contenu du dépôt

| Dossier | Rôle |
| --- | --- |
| `api/` | API factice (json-server) et logiciel de caisse, fournis prêts à l'emploi |
| `app/` | L'application Vue que vous développez pendant la formation (créée au module 1) |

## Démarrer l'API et la caisse

```bash
cd api
npm install
npm start
```

- API : http://localhost:3000 (`/cards`, `/purchases`, `/offers`, `/activations`, `/products`)
- Caisse factice : http://localhost:3000 dans le navigateur

La caisse sert à alimenter la base : identifiez une carte, ajoutez des produits,
encaissez. L'achat et les points apparaissent ensuite dans l'application.
Pour revenir aux données d'origine : `npm run seed` (dans `api/`). Les achats sont datés sur les 6 mois précédant la génération : relancez cette commande peu avant la formation.

### Cartes de test

| Numéro | Client | Niveau de départ |
| --- | --- | --- |
| 2990000000001 | Camille Martin | Argent |
| 2990000000002 | Léo Bernard | Argent |
| 2990000000003 | Inès Petit | Bronze |
| 2990000000004 | Hugo Durand | Or |
| 2990000000005 | Manon Leroy | Bronze |

## Règles métier

- 1 point par euro entier dépensé.
- Niveaux : Bronze (0 à 499 points), Argent (500 à 999), Or (1 000 et plus).
- Une offre activée dans l'application rapporte ses points bonus au prochain
  passage en caisse contenant un produit du rayon concerné, avant sa date limite.

## Exemples de requêtes (json-server 0.17)

```text
GET   /cards?number=2990000000001
GET   /purchases?cardId=1&_sort=date&_order=desc
GET   /purchases/12
GET   /offers
GET   /activations?cardId=1
POST  /activations        { "cardId": 1, "offerId": 3, "activatedAt": "…", "usedAt": null }
```

## Étapes et corrections

Chaque module a sa correction, sous forme de tag Git :

```bash
git tag                      # liste des étapes
git checkout etape-05        # récupérer la correction du module 5
git switch -c ma-branche etape-05   # repartir de cette correction
```
