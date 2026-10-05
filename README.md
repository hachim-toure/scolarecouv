# ScolaRecouv — application indépendante

Gestion des scolarités en FCFA, accessible sans compte ChatGPT sur https://scolarecouv.onrender.com.

## Utilisation
- Trois actions principales : ajouter un élève, encaisser et consulter les impayés.
- Espace directeur : recettes du jour, échéances, répartition par moyen de paiement, clôture et réouverture motivée de la caisse.
- Comptes caissiers limités à leur établissement ; annulation et administration réservées au directeur.
- Reçus numérotés, versements partiels, contrôle du solde et protection contre une double validation.
- Coordonnées des parents et consentement aux messages, regroupement des familles par téléphone.
- Import CSV UTF-8 avec aperçu et détection des doublons ; export compatible Excel.
- Journal des opérations, sauvegarde JSON complète et restauration dans une école vide.
- Copie quotidienne interne actualisée au plus toutes les cinq minutes d’activité, conservée quatorze jours. Elle utilise la même base et ne remplace pas une sauvegarde externe.
- Application installable sur téléphone selon les possibilités du navigateur. Après une première ouverture réussie, l’interface est conservée localement. Les données privées et les paiements ne sont jamais mis en cache hors connexion.

## Hébergement actuel : essai gratuit
Le serveur peut se mettre en veille et les données nécessitent une connexion au serveur. Le cache de l’interface ne supprime pas le délai de réveil des API. La base gratuite actuelle expire le **3 novembre 2026**. Exporter les sauvegardes et prévoir une base durable avant cette date. Aucune nouvelle offre payante n’est activée par cette livraison.

## Messages automatiques
Le moteur WhatsApp est implémenté, mais les envois réels sont désactivés tant que le fournisseur et ses modèles ne sont pas connectés. Les rappels programmés nécessitent un serveur qui fonctionne en continu. Le directeur doit aussi activer la fonction et enregistrer le consentement du parent.

Un rappel concerne uniquement les échéances impayées de l’année active, au maximum une fois par élève sur sept jours. Le statut « accepté » signifie que le fournisseur a accepté la demande ; « livré » nécessite sa confirmation. Un résultat incertain n’est pas renvoyé automatiquement. Voir [OPERATIONS.md](OPERATIONS.md) pour l’activation.

## Exécution et vérification
Node.js >= 22.13 et PostgreSQL :

```sh
npm ci
npm test
npm run build
DATABASE_URL=postgresql://... npm start
```

`/health` vérifie l’accès à la base. Les migrations sont additives et limitées aux tables `scola_*`. Les tests utilisent PostgreSQL simulé : comptes, isolation des écoles, droits des caissiers, versements, annulation, clôture, import, sauvegarde/restauration, consentement, absence de double envoi et exclusion des données privées du cache. La livraison ne valide pas des envois réels auprès de WhatsApp.

Le Blueprint `render.yaml` reste une configuration d’essai gratuit. Il ne faut pas l’appliquer à nouveau pour migrer la base existante. Les mots de passe et identifiants fournisseur ne doivent jamais être ajoutés au dépôt.
