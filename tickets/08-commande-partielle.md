# #8 · Une commande refusée fait quand même baisser le stock

**Type :** Bug (corrective)  
**Priorité :** Critique

**Signalé par :** le responsable logistique

Une commande de plusieurs produits est refusée parce que l'un d'eux n'a pas assez de stock, mais le stock des autres produits a déjà diminué.

**Pour reproduire :** commander 2 « Hub USB 4 ports » **et** 10 « Disque dur externe 2 To » (il n'en reste que 7), puis regarder le stock du hub.

**Attendu :** commande refusée, aucun stock modifié.
**Constaté :** commande refusée, mais le stock du hub a baissé de 2.

> Ticket difficile : il faut regarder la base de données, pas seulement l'écran. Pensez aux **transactions**.
