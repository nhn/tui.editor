#!/usr/bin/env bash
set -e

if [[ -z "$1" ]]; then
    echo "please specify a tag to build"
    exit -1
fi

TAG="$1"

if [[ ! -z "$(git tag | grep "^$TAG\$")" ]]; then
    echo "tag $1 already exists"
    exit -1
fi

repo="$(dirname $(dirname $0))"
test -f "$repo/component-tools/$(basename $0)"

td="$(mktemp -d)"
cd "$td"
npm install codemirror@$TAG


cd "$repo"
rsync -ar --delete --exclude .git --exclude component-tools "$td/node_modules/codemirror/" "$repo/"
cp component-tools/bower.json "$repo/"
rm -rf "$td"

git add -A
git commit -am "Build component $TAG"
git tag -am "release $TAG" $TAG
