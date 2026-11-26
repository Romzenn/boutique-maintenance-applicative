# #1 · Impossible de commander le dernier exemplaire

**Type :** Bug (corrective)  
**Priorité :** Majeure

**Signalé par :** le service client

Un client veut acheter les 7 derniers « Disque dur externe 2 To » et la commande est refusée avec « Stock insuffisant », alors que la fiche produit affiche bien "7 en stock".

**Pour reproduire :** se connecter (alice@boutique.test), ajouter 7 « Disque dur externe 2 To » au panier, cliquer sur *Commander*.

**Attendu :** la commande est acceptée et le stock passe à 0.
**Constaté :** message d'erreur « Stock insuffisant pour Disque dur externe 2 To ».
