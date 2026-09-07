#!/usr/bin/env bash
#
# catch-up.sh -- bring this scaffold up to the end of a given step.
#
#   ./catch-up.sh 5      apply steps 1 through 5
#   ./catch-up.sh 5 5    apply step 5 only
#
# It copies the finished files for those steps out of the reference repository
# and over your working tree. Anything you wrote in those files is replaced, so
# it is worth committing first if you want to keep your version.
#
# The reference repository is expected beside this one:
#
#   .../jakone-frontend-scaffold      <- you are here
#   .../jakone-frontend-final         <- the reference
#
# Point REFERENCE elsewhere if you unpacked it somewhere else.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REFERENCE="${REFERENCE:-$HERE/../jakone-frontend-final}"

if [ $# -lt 1 ]; then
  echo "usage: ./catch-up.sh <to-step> [from-step]" >&2
  exit 2
fi

TO="$1"
FROM="${2:-1}"

if [ ! -d "$REFERENCE/steps" ]; then
  cat >&2 <<MSG
Cannot find the reference repository.

Looked in: $REFERENCE

Unpack jakone-frontend-final beside this folder, or run:
  REFERENCE=/path/to/jakone-frontend-final ./catch-up.sh $TO
MSG
  exit 1
fi

for n in $(seq "$FROM" "$TO"); do
  dir="$REFERENCE/steps/$(printf 'step-%02d' "$n")"
  [ -d "$dir" ] || continue
  echo "step $n"
  # -a preserves nothing that matters here, but keeps the relative tree.
  (cd "$dir" && find . -type f -print0) | while IFS= read -r -d '' rel; do
    mkdir -p "$HERE/$(dirname "$rel")"
    cp "$dir/$rel" "$HERE/$rel"
    echo "   $rel"
  done
done

echo
echo "Done. Restart the dev server if it is not already watching."
