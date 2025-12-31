# Changing Default Branch to Main

This document provides instructions for completing the default branch change to `main`.

## Steps to Complete

### 1. Merge this PR

First, merge this PR which contains:
- README.md referencing `main` as the default branch
- CI workflow configured to run on `main` branch
- This documentation

### 2. Create the Main Branch

After merging this PR, create the `main` branch from the current default branch:

```bash
git checkout <current-default-branch>
git pull
git checkout -b main
git push origin main
```

### 3. Change Default Branch on GitHub

1. Go to the repository on GitHub: `https://github.com/skorotkiy/JourneyJournal`
2. Navigate to **Settings** → **Branches**
   - Note: You need admin access to the repository to change this setting
3. Under "Default branch", click the switch branches icon
4. Select `main` from the dropdown
5. Click "Update" and confirm the change

### 4. Update Local Repositories

After the default branch is changed on GitHub, update local clones:

```bash
# Fetch the latest changes
git fetch origin

# Update the remote HEAD reference
git remote set-head origin main

# Switch to the main branch
git checkout main

# Set up tracking
git branch -u origin/main
```

### 5. (Optional) Delete Old Default Branch

If the old default branch is no longer needed:

```bash
# Delete locally
git branch -d <old-branch-name>

# Delete remotely
git push origin --delete <old-branch-name>
```

## Verification

After completing these steps, verify the change:

```bash
# Check the default branch
git symbolic-ref refs/remotes/origin/HEAD
# Should show: refs/remotes/origin/main

# Verify remote branches
git branch -r
# Should show origin/main
```

## CI/CD Considerations

The CI workflow (`.github/workflows/ci.yml`) has been configured to run on the `main` branch. Once the branch is created and set as default, the workflow will automatically run on pushes and pull requests to `main`.

## References

- [GitHub Documentation: Changing the default branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/changing-the-default-branch)
