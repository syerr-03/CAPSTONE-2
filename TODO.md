# TODO - Resolve Git Merge Conflicts and Push CAPSTONE-2

Current status: Merge conflicts in progress.

## Approved Plan Steps:

### 1. Resolve superproject conflicts (10/100%)
  - [x] Plan defined
  - [ ] Edit App.js: keep local Router version
  - [ ] Edit .gitignore: keep local Vite
  - [ ] Edit package.json: keep local Vite config
  - [ ] Edit README.md: use remote CAPSTONE project description
  - [ ] Edit src/App.css: use remote custom BrainyBits styles
  - [ ] Edit src/index.css: keep local
  - [ ] git rm --cached package-lock.json

### 2. Handle CAPSTONE-2 submodule (0/100%)
  - [ ] cd CAPSTONE-2 && ls
  - [ ] rm -rf CAPSTONE-2/CAPSTONE-2
  - [ ] git add -A && git commit -m \"cleanup nested dir\" or git checkout -- .
  - [ ] cd .. && git add CAPSTONE-2

### 3. Finalize merge (0/100%)
  - [ ] git add .
  - [ ] git commit -m \"Resolve merge conflicts favoring local Vite app changes\"
  - [ ] git push origin main

### 4. Post-push (0/100%)
  - [ ] npm install
  - [ ] npm run dev
  - [ ] Verify app runs and components work

Next step: Fix conflicted files starting with package.json (causing npm error)

