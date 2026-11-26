# #12 · Node 18 est en fin de vie : passer à Node 22

**Type :** Maintenance adaptative  
**Priorité :** Haute

**Demandé par :** l'équipe infra

Node 18 ne reçoit plus de mises à jour de sécurité. L'application doit tourner sur Node 22 (LTS).

**À faire :** changer l'image Docker, relancer toute l'application, vérifier que les tests passent, lister les dépendances obsolètes (`npm outdated`) et mettre à jour ce qui peut l'être sans casser l'application.

**Livrable :** une note dans le CHANGELOG sur ce qui a été mis à jour et ce qui ne l'a pas été (avec la raison).
