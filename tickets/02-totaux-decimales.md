# #2 · Totaux du panier avec des décimales infinies

**Type :** Bug (corrective)  
**Priorité :** Majeure

**Signalé par :** un client

Dans le panier, certains montants s'affichent avec une longue suite de décimales (par exemple `62.199999999999996 €`).

**Pour reproduire :** ajouter 3 « Tapis de souris XL » et 1 « Hub USB 4 ports » au panier, ouvrir le panier.

**Attendu :** des montants arrondis au centime (ex. `62.2 €`).
**Constaté :** des décimales parasites sur le sous-total et le total.
