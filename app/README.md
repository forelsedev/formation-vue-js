# Ma carte fidélité — application Vue

Application Vue 3 (Composition API, Vue Router, Pinia) du fil rouge de la formation.

## Commandes

```bash
npm install        # installe les dépendances
npm run dev        # serveur de développement : http://localhost:5173
npm run test:unit  # tests unitaires (Vitest), en mode surveillance
npm run build      # build de production dans dist/
npm run preview    # sert le build de production : http://localhost:4173
npm run lint       # vérification du code
```

L'API factice doit tourner en parallèle (dossier `../api`, `npm start`).
Son adresse se règle dans `.env` (développement) et `.env.production` (build).

## Organisation

| Dossier | Contenu |
| --- | --- |
| `src/views` | Pages associées aux routes |
| `src/components` | Composants réutilisables |
| `src/composables` | Logique réactive réutilisable (`useRequest`, `usePurchases`, `useAutoRefresh`) |
| `src/stores` | Stores Pinia : compte et offres |
| `src/services` | Accès à l'API |
| `src/utils` | Règles métier et formatage, sans dépendance à Vue |
