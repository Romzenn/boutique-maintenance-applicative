# #13 · Le calcul du total est écrit à deux endroits

**Type :** Maintenance préventive (refactoring)  
**Priorité :** Normale

**Constat de l'équipe :** le calcul des totaux (sous-total, remise, livraison) est copié dans deux fichiers du back. Chaque correctif doit être fait deux fois, avec un risque d'oubli.

**À faire :** extraire ce calcul dans un service unique, utilisé par les deux routes, avec des tests unitaires (sans base de données). Aucune modification du comportement visible.

> Un bon refactoring se fait avec des tests verts avant, pendant et après.
