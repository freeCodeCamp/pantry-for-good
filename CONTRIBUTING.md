# Contributor's Guide

We welcome pull requests from Free Code Camp campers (our students) and seasoned JavaScript developers alike! Follow these steps to contribute:

1. Find an issue that needs assistance by searching for the [Help Wanted](https://github.com/freeCodeCamp/Pantry-for-Good/labels/help%20wanted) tag.

2. Let us know you are working on it by posting a comment on the issue.

3. Read all the guidelines in this document before you start working on the issue.

If you find a bug that is not listed as an issue, feel free to add a new issue.

--------------------------------------------------------------------------------

## Contribution Guidelines

- [Prerequisites](#prerequisites)
- [Forking the Project](#forking-the-project)
- [Setup Pantry-for-Good](#setup-pantry-for-good)
- [Create a Branch](#create-a-branch)
- [Setup Linting](#setup-linting)
- [Make Changes](#make-changes)
- [Creating a Pull Request](#creating-a-pull-request)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Next Steps](#next-steps)

### Prerequisites

| Prerequisite                                | Version |
| ------------------------------------------- | ------- |
| [MongoDB](http://www.mongodb.org/downloads) | `~ ^3`  |
| [Node.js](http://nodejs.org)                | `~ ^6`  |
| [Git](https://git-scm.com/)

You'll need to have the latest verison of node.js installed. Either use your OS's package manager or follow the installation instructions on the [official website](http://nodejs.org).

This app uses MongoDB as its database engine. Follow [the instructions](https://docs.mongodb.com/manual/installation/#mongodb-community-edition) to install it locally.

If Node or MongoDB is already installed in your machine, run the following commands to validate the versions:

```shell
node -v
mongo --version
```

If your versions are lower than the prerequisite versions, you should update.

### Forking the Project

1. Go to the top level Pantry-for-Good repository page on github: [https://github.com/freeCodeCamp/Pantry-for-Good](https://github.com/freeCodeCamp/Pantry-for-Good)
2. Click the "Fork" Button in the upper right hand corner of the interface ([More Details Here](https://help.github.com/articles/fork-a-repo/))
3. After the repository has been forked, you will be taken to your copy of the Pantry-for-Good repo at `yourUsername/Pantry-for-Good`

#### Cloning Your Fork

1. Open a Terminal / Command Line / Bash Shell
2. Clone your fork of Pantry-for-Good

```shell
git clone https://github.com/yourUsername/Pantry-for-Good.git
```

##### (make sure to replace `yourUsername` with your GitHub Username)

This will create a directory `Pantry-for-Good` and download the entire Pantry-for-Good repo to it.

#### Setup Your Upstream

1. Change directory to the new Pantry-for-Good directory (`cd Pantry-for-Good`)
2. Use the git command to add a remote to the official Pantry-for-Good repo:

```shell
git remote add upstream https://github.com/freeCodeCamp/Pantry-for-Good.git
```

Congratulations, you now have a local copy of the Pantry for Good repo!

#### Maintaining Your Fork

Now that you have a copy of your fork, there is work you will need to do to keep it current.

##### **Rebasing from Upstream**

Do this prior to every time you create a branch for a pull request:

1. Make sure you are on the `staging` branch

  > ```shell
  > $ git status
  > On branch staging
  > Your branch is up-to-date with 'origin/staging'.
  > ```

  > If your aren't on `staging`, resolve outstanding files / commits and checkout the `staging` branch

  > ```shell
  > $ git checkout staging
  > ```

2. Do a pull with rebase against `upstream`

  > ```shell
  > $ git pull --rebase upstream staging
  > ```

  > This will pull down all of the changes to the official staging branch, without making an additional commit in your local repo.

3. (_Optional_) Force push your updated staging branch to your GitHub fork

  > ```shell
  > $ git push origin staging --force
  > ```

  > This will overwrite the staging branch of your fork.

### Setup Pantry-for-Good

Please follow the steps in the [README.md](README.md) document.


### Create a Branch

Before you start working, you will need to create a separate git branch specific to the issue / feature you're working on. You will push your work to this branch. Do not work off the staging branch.

#### Naming Your Branch

Name the branch something like `fix/xxx` or `feature/xxx` where `xxx` is a short description of the changes or feature you are attempting to add. For example `fix/email-login` would be a branch where you fix something specific to email login.

#### Adding Your Branch

To create a git branch on your local machine (and switch to this branch):

```shell
$ git checkout -b [name_of_your_new_branch]
```

and to push to GitHub:

```shell
$ git push origin [name_of_your_new_branch]
```

##### If you need more help with branching, take a look at [this](https://github.com/Kunena/Kunena-Forum/wiki/Create-a-new-branch-with-git-and-manage-branches).


### Setup Linting

We reccomend you have [ESLint running in your editor](http://eslint.org/docs/user-guide/integrations.html). It will highlight anything that doesn't conform to our Pantry-for-Good's coding style conventions. (you can find a summary of those rules [here](https://github.com/freeCodeCamp/Pantry-for-Good/blob/staging/.eslintrc)).

You can also check for linting errors by running the command
```shell
npm run lint
```

> Please do not ignore any linting errors, as they are meant to **help** you and to ensure a clean and simple code base.


### Make Changes
This bit is up to you!  After you make changes be sure to fix any lint warnings or errors before submitting a pull request.

### Creating a Pull Request

#### What is a Pull Request?

A pull request (PR) is a method of submitting proposed changes to a GitHub repository. You will make changes to copies of the files which make up Pantry-for-Good in a personal fork, then apply to have them accepted by Pantry-for-Good proper.

#### Important: ALWAYS EDIT ON A BRANCH

Take away only one thing from this document, it should be this: Never, **EVER**
make edits to the `staging` branch. ALWAYS make a new branch BEFORE you edit
files. This is critical, because if your PR is not accepted, your copy of
staging will be forever sullied and the only way to fix it is to delete your
fork and re-fork.

1.  Perform the maintenance step of rebasing `staging`.
2.  Ensure you are on the `staging` branch using `git status`:

```bash
$ git status
On branch staging
Your branch is up-to-date with 'origin/staging'.

nothing to commit, working directory clean
```

1.  If you are not on staging or your working directory is not clean, resolve
    any outstanding files/commits and checkout staging `git checkout staging`

2.  Create a branch off of `staging` with git: `git checkout -B
    branch/name-here` **Note:** Branch naming is important. Use a name like
    `fix/short-fix-description` or `feature/short-feature-description`. Review
     the [Contribution Guidelines](#contribution-guidelines) for more detail.

3.  Edit your file(s) locally with the editor of your choice

4.  Check your `git status` to see unstaged files.

5.  Add your edited files: `git add path/to/filename.ext` You can also do: `git
    add .` to add all unstaged files. Take care, though, because you can
    accidentally add files you don't want added. Review your `git status` first.

6.  Commit your edits: `git commit -m "Brief Description of Commit"`. Do not add the issue number in the commit message.

7.  Squash your commits, if there are more than one.

8.  Push your commits to your GitHub Fork: `git push -u origin your-branch-name`

9.  Submit a Pull Request

### Submitting a Pull Request

1.  Once the edits have been committed, you will be prompted to create a pull
    request on your fork's GitHub Page.

2.  Submit a pull request from your branch to FreeCodeCamp's Pantry-for-Good `staging` branch.

3.  The title (also called the subject) of your PR should be descriptive of your
    changes and succinctly indicates what is being fixed.

    -   **Do not add the issue number in the PR title or commit message.**

    -   Examples: `Add Test Cases to Bonfire Drop It` `Correct typo in Waypoint
        Size Your Images`

4.  In the body of your PR include a more detailed summary of the changes you
    made and why.

    -   If the PR is meant to fix an existing bug/issue, then, at the end of
        your PR's description, append the keyword `closes` and #xxxx (where xxxx
        is the issue number). Example: `closes #1337`. This tells GitHub to
        close the existing issue, if the PR is merged.

### Next Steps

#### If your PR is accepted

Once your PR is accepted, you may delete the branch you created to submit it.
This keeps your working fork clean.

You can do this with a press of a button on the GitHub PR interface. You can
delete the local copy of the branch with: `git branch -D branch/to-delete-name`

#### If your PR is rejected

Don't despair! You should receive solid feedback from the moderators as to
why it was rejected and what changes are needed.

Many Pull Requests, especially first Pull Requests, require correction or
updating. If you have used the GitHub interface to create your PR, you will need
to close your PR, create a new branch, and re-submit.

If you have a local copy of the repo, you can make the requested changes and
amend your commit with: `git commit --amend` This will update your existing
commit. When you push it to your fork you will need to do a force push to
overwrite your old commit: `git push --force`

Be sure to post in the PR conversation that you have made the requested changes.
