# Boutique Tech · atelier de maintenance applicative

Une petite boutique en ligne (Node.js, Express, PostgreSQL, Docker) qui fonctionne… à peu près.
Votre mission : **maintenir** cette application, ticket après ticket.

## Démarrer

```bash
docker compose up --build
```

| Service | Adresse |
|---|---|
| Site | http://localhost:8080 |
| API | http://localhost:3000/api |
| Base PostgreSQL | localhost:5432 (utilisateur `boutique`, mot de passe `boutique`) |

Compte de test : `alice@boutique.test` / `alice123`.

Repartir d'une base propre (produits, stocks, commandes) : `docker compose down -v` puis `docker compose up`.
Voir les journaux de l'API : `docker compose logs -f back`.

## Organisation du dépôt

```
back/     API Express (routes/, services/, tests dans test/)
front/    Site statique (index.html, app.js, style.css)
db/       Schéma et données de départ
tickets/  Le backlog : un fichier par ticket
```

## Lancer les tests

L'application doit tourner (`docker compose up`), puis :

```bash
cd back
npm install
npm test
```

## Méthode de travail

1. **Forkez** le dépôt, puis travaillez sur votre fork.
2. Un ticket = une branche : `fix/ticket-3`, `feature/ticket-9`…
3. **Reproduire d'abord**, corriger ensuite. Écrivez un test qui échoue, puis le correctif qui le fait passer.
4. Un commit clair par correctif : `fix(#3): la page 1 commence au premier produit`.
5. Fusionnez par *pull request* en mentionnant le ticket (`Closes #3`).
6. Tenez à jour le `CHANGELOG.md`.

Le dépôt GitHub final, son historique et son journal de maintenance sont évalués.
