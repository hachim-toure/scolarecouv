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
1. Créer un dépôt GitHub privé nommé `scolarecouv`.
2. Envoyer le contenu de ce dossier à la racine du dépôt, en conservant les fichiers cachés utiles.
3. Connecter le dépôt à Render comme Blueprint (`render.yaml`).
4. Vérifier l’offre de chaque ressource puis appliquer le Blueprint.
5. Après la mise en ligne, ouvrir l’URL et créer le compte de l’établissement.

`render.yaml` demande un service web et une base PostgreSQL gratuits. L’offre gratuite est destinée aux essais : la base gratuite expire après 30 jours et ne fournit pas de sauvegardes. Référence : https://render.com/docs/free . Prévoir une solution de stockage durable avant un usage réel. Aucune dépense ni ressource Render n’a été créée dans cette livraison.

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

Le dossier est prêt à être déployé. L’ancien lien reste inchangé jusqu’au déploiement et à la validation du nouveau service.

## Validation effectuée
Compilation de l’interface, contrôle TypeScript, tests des mots de passe et des échéanciers, et parcours API avec PostgreSQL simulé (pg-mem) : inscription, connexion, paiement partiel, dépassement du solde, double validation, isolation des écoles, annulation et déconnexion. La validation finale sur le PostgreSQL hébergé reste à effectuer après déploiement.
