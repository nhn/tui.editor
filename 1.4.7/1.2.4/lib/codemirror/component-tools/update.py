#!/usr/bin/env python

from distutils.version import StrictVersion as V
import os
import re
from subprocess import check_output, check_call
import sys


# the first version we started maintaining as a component
first_version = V('5.20')
blacklist_tags = ['v3.02', '5.13.4']

tools = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.dirname(tools)
tag_sh = os.path.join(tools, 'cm-tags.sh')
build_sh = os.path.join(tools, 'build.sh')


lines = check_output(['npm', 'show', 'codemirror@*', 'version']).decode('utf8').splitlines()
# lines of the form "codemirror@version 'version'"
npm_versions = [ line.split()[0].split('@')[1] for line in lines ]

tags = set(check_output(['git', 'tag'], cwd=repo_root).decode('utf8').split())
built = []
for v in sorted(npm_versions, key=V):
    if v in tags:
        print("Already have", v)
        continue
    if V(v) < first_version:
        print("Skipping old version", v)
        continue
    print('building', v)
    check_call([build_sh, v], cwd=repo_root)
    built.append(v)

if built:
    check_call(['git', 'push', '--tags'], cwd=repo_root)
