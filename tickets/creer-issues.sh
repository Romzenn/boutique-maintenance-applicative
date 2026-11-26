#!/bin/bash
# Crée une issue GitHub par ticket du dossier tickets/ (nécessite la CLI gh, connectée au dépôt).
# Usage : ./tickets/creer-issues.sh [seance1|seance2|tout]
cd "$(dirname "$0")"
case "${1:-tout}" in
  seance1) FILES=$(ls 0[1-8]-*.md) ;;
  seance2) FILES=$(ls 09-*.md 1*.md) ;;
  *)       FILES=$(ls [0-9]*.md) ;;
esac
for f in $FILES; do
  title=$(head -1 "$f" | sed 's/^# //')
  gh issue create --title "$title" --body-file "$f"
done
