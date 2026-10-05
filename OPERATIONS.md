# Activation de l’hébergement et des messages

## Conditions avant production
1. Faire approuver le coût de l’hébergement continu et du stockage durable. Ne pas créer de ressource payante sans cet accord.
2. Exporter chaque école en JSON, vérifier le fichier et conserver une copie extérieure au serveur.
3. Passer le service existant sur une offre sans veille et protéger la base existante par une offre durable, ou migrer de manière contrôlée vers une nouvelle base. La base actuelle est partagée : conserver les autres tables et applications. La restauration applicative importe uniquement une école vide et ne migre pas les identifiants, sessions ou comptes caissiers.
4. Vérifier une connexion, un versement, une annulation motivée, une clôture de caisse et une restauration de test avec PostgreSQL réel. Activer les sauvegardes du fournisseur, documenter leur rétention et tester la récupération.
5. Positionner `SCHOOL_STORAGE_DURABLE=true` uniquement lorsque le stockage durable est effectivement actif. Ce drapeau est informatif : il ne change pas l’offre du fournisseur.

## WhatsApp via Twilio
Utiliser un compte Twilio avec un émetteur WhatsApp Business actif et un Messaging Service associé. Faire approuver deux modèles transactionnels, puis renseigner leurs identifiants dans les variables d’environnement du service, jamais dans le dépôt ni un message public :

- `TWILIO_ACCOUNT_SID` : compte AC…
- `TWILIO_AUTH_TOKEN` : secret du compte
- `TWILIO_MESSAGING_SERVICE_SID` : service MG…
- `TWILIO_REMINDER_CONTENT_SID` : modèle HX… de rappel
- `TWILIO_RECEIPT_CONTENT_SID` : modèle HX… de reçu

Variables du modèle de rappel : 1 établissement, 2 élève, 3 montant exigible restant en FCFA, 4 date de la dernière échéance exigible, 5 contact de l’école.

Variables du modèle de reçu : 1 établissement, 2 élève, 3 montant versé en FCFA, 4 date du versement, 5 solde restant, 6 numéro du reçu.

Exemples de textes à soumettre à l’approbation du fournisseur :

> Bonjour, {{1}} vous informe que la scolarité de {{2}} présente un montant exigible restant de {{3}}, pour l’échéance du {{4}}. Pour vérifier votre situation ou convenir d’un règlement, contactez {{5}}.

> {{1}} confirme un versement de {{3}} pour {{2}}, enregistré le {{4}}. Reçu {{6}}. Solde restant : {{5}}. Merci.

Les modèles peuvent être refusés ou reclassés par le fournisseur. Vérifier leur tarification et leur approbation avant de lancer des envois. Les tarifs d’envoi sont distincts de l’hébergement.

Sur un serveur continu, mettre `SCHOOL_AUTOMATION_ENABLED=true` : la tâche interne s’exécute toutes les minutes et prépare aussi les copies quotidiennes internes. Alternative : un ordonnanceur externe peut appeler `POST /api/automation/run` avec l’en-tête `x-automation-key` égal à `AUTOMATION_SECRET`, un secret aléatoire d’au moins 32 caractères. Ce point d’entrée ne dispense pas de fiabiliser l’hébergement. Aucun ordonnanceur externe n’est créé par la livraison.

Le directeur active ensuite les rappels/reçus dans « Messages automatiques ». Tester d’abord sur un numéro consentant et autorisé, puis vérifier le statut réellement livré. Les messages manuels ouverts dans WhatsApp restent des messages à envoyer par l’utilisateur.

## Sauvegardes et récupération
Les copies internes sont conservées dans la même base : une suppression, une expiration ou une panne de cette base peut aussi les perdre. La sauvegarde JSON est le moyen applicatif de conserver une copie externe ; son empreinte détecte une modification accidentelle, pas une falsification par un tiers. Elle contient des informations personnelles et financières : la conserver dans un emplacement à accès limité.

Pour récupérer une école : créer un compte directeur vide, prévisualiser le JSON dans « Sauvegardes », puis restaurer. Les reçus existants numérotés sont conservés. Les anciens reçus sans numéro reçoivent un numéro lors de la restauration. Recréer les comptes caissiers et vérifier les consentements ; les automatismes restent désactivés après restauration.

## Ouverture sur téléphone
Ouvrir une première fois l’application avec internet. Installer avec le bouton proposé si le navigateur le permet. Un bandeau signale une nouvelle version disponible : la charger après avoir terminé une saisie. Aucune opération financière n’est enregistrée hors connexion. Après une erreur réseau lors d’un paiement, consulter le journal avant de recommencer.

Documentation fournisseur : https://render.com/docs/free et https://www.twilio.com/docs/content/send-templates-created-with-the-content-template-builder.
