#!/bin/bash

gatsby build

git checkout -- public/404.html

cd public
git add .
git commit -m'deploy'
git push
