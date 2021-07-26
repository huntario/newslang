#!/usr/bin/env python3

import subprocess
def run(*args):
    return subprocess.check_call(['git'] + list(args))

def branch():
    branch = input("\nType in the name of the branch you want to make:" + 
                  "\n example: FIX-header-spacing ")
    br = f'{branch}'
    commitM = input("\nType in the commit message: ")
    cm = f'{commitM}'
    run("checkout", "-b", br)
    run("add", "." )
    run("commit", "-m", cm)
    run("checkout", "main")
    run("merge", br)
    run("push", "origin", "main")
branch()
