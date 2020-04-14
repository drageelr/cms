### CCA Management System - Commit Process and Restrictions
#### Pre-Process:
1. Check whether the GitHub email is verified or not, verify if it is not.
1. Install GPG key generator and generate key:
    * Open Terminal and run the following commands:

            sudo apt-get update

            sudo apt-get install gnupg

            gpg --gen-key
    * **Note:** Enter the following when prompted:
        1. Full Name
        2. GitHub Verified Email
        3. Password (Strong)

    * Run the following command:

            gpg --armor --export <email_address>

    * Copy from line `-----BEGIN PGP PUBLIC KEY BLOCK-----` 
      until line `-----END PGP PUBLIC KEY BLOCK-----` inclusive.               This is your GPG Key.

1. Add GPG Key to your account.
    * Go to [GitHub Settings](https://github.com/settings/)
    * Go to `SSH and GPG keys` Tab.
    * Press `New GPG Key` button and paste the copied key there.

1. Configure git on machine.
    * First, run the following command:

            gpg --list-secret-keys --keyid-format LONG

      This will result with mutliple lines. Your full name / user ID `uid` will be between 2 lines (`sec` and `ssb`). In the line directly above your full name (`sec`), copy the text starting after "/" and ending till the first white space encountered. It will be in the format <hex_string> after some rsa<number>. This is your signing key. 

    * Next, run the following commands:

            git config --global user.name "<user name>"

            git config --global user.email "<email_address>"

            git config --global user.signingkey <paste_key_here>

            test -r ~/.bash_profile && echo 'export GPG_TTY=$(tty)' >> ~/.bash_profile

            echo 'export GPG_TTY=$(tty)' >> ~/.profile


      ***Note:** Use the same name and email used to create the GPG key.*

1. Remember to commit in this manner from now onwards:

        git commit -S -m "message"

    Or run this command (by navigating into the repository first) instead and then commit without the `-S` flag:

        git config commit.gpgsign true

     ***Note:** You only need to run this command once in the repository's lifetime on your machine.*
         
         
#### Process
1. Create an **Issue** in GitHub Issues of the repository:
    * Go to [CMS GitHub Issues](https://github.com/drageelr/cms/issues/)
    * Click **New Issue** to create an issue. Use relevant labels, any description of the task / bug / enhancement required and add assignees.
2. Create a **Task** in Trello.
    * Link with the GitHub issue you just created. 
    * Add same assignees, with the **GitHub** label.
3. Add the `#issue_id` to link the commit with the issue in the footer the of commit message (when in terminal). Optionally, if the issue is to be closed by that commit then write`Closes #issue_id` instead.
4. Add a comment on the issue in GitHub with the specific client-master, server-master or master branch, in the case of a `bug` or `pull request` with the relevant label.

#### Restrictions
* Client-side developers can only edit the *client* directory and vice versa for server-side developers in the case of the *server* directory (to prevent merge conflicts on the `master` branch) until permitted access.
* You must follow the GitHub commit format in `docs/github-commit-format.md` or your commit will get rejected.
* Everyone is only allowed to work on their own client or server work in progress (wip) branches.
* No `wip` branch should be created from another *wip* branch OR *master* branch.

#### Branch Naming & Descriptions:
* `master`  for production. can only be merged by Hammad.
* `client-master` for approved  client development commits. can only be merged with by Hammad or Zoraiz.
* `server-master` for approved server development commits. can only be merged with by Hammad.
* `client-wip-<name_initials>` for client development by that specific person
* `server-wip-<name_initials>` for server development by that specific person
* *When working on a task / feature / issue:* Create a new branch if it does not exist (`client-wip-HN` for e.g. if Hammad wants to push a commit on the client-side if he was previously working on the server side.) This new branch should be created from either `client-master` or `server-master` not directly from `master`.
