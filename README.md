# ScolaRecouv — version indépendante

Application pour gérer les frais scolaires, échéances et versements en FCFA.
Aucun compte ChatGPT n’est nécessaire : chaque école crée son identifiant et son mot de passe.

## Fonctions
- Accueil avec trois grandes actions : ajouter un élève, encaisser, consulter les impayés.
- Élèves, parents, classes et année scolaire.
- Frais nets et échéancier jusqu’à trois tranches.
- Paiements partiels, contrôle du solde et protection contre les doubles validations.
- Reçus imprimables / enregistrables en PDF depuis le navigateur.
- Annulation motivée d’un paiement avec conservation dans le journal.
- Relances WhatsApp à envoyer manuellement et historique des envois déclarés.
- Export CSV ouvrable dans Excel.
- Données sauvegardées dans PostgreSQL et isolées par compte.
- Connexion avec mot de passe haché et cookie de session sécurisé en production.

## Mise en ligne Render

Application : https://scolarecouv.onrender.com

Le dépôt est public. Le service Node.js utilise le plan gratuit à Francfort et une base PostgreSQL existante, avec des tables `scola_*` séparées. La connexion est configurée uniquement dans la variable secrète `DATABASE_URL` de Render.

Le Blueprint `render.yaml` décrit le service web et demande une connexion PostgreSQL existante ; il ne crée pas de base supplémentaire. La compilation installe explicitement les dépendances de développement, même avec `NODE_ENV=production`.

La base d’essai actuelle expire le 3 novembre 2026. Prévoir un stockage durable et des sauvegardes avant de confier des données scolaires réelles à cette installation.

## Exécution locale
Node.js >= 22.13 et une base PostgreSQL :
```
npm ci
npm test
npm run build
DATABASE_URL=postgresql://... npm start
```
Le serveur écoute sur `PORT` (3000 par défaut), et expose `/health`.

## Ce qui n’est pas activé
- Paiement mobile automatisé : les versements sont saisis après vérification par l’école.
- Envoi automatique de SMS / WhatsApp.
- Récupération du mot de passe par email.
- Plusieurs agents partageant le même établissement : un compte représente une école.
- Migration des données de l’ancienne version Sites. Prévoir un transfert avant de basculer si des données réelles y ont été saisies.

Le service indépendant est déployé. Aucune donnée de l’ancienne version Sites n’a été transférée.

## Validation effectuée
Compilation de l’interface, contrôle TypeScript, tests des mots de passe et des échéanciers, et parcours API avec PostgreSQL simulé (pg-mem) : inscription, connexion, paiement partiel, dépassement du solde, double validation, isolation des écoles, annulation et déconnexion. Render confirme le service actif ; le serveur et sa connexion PostgreSQL répondent HTTP 200 sur /health.
