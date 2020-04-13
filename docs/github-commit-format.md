### CCA Management System - GitHub Commit Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type** and a **subject**:

```
<type>: <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Example — `fix: remove unused dependency shortid`

Any line of the commit message cannot be longer 100 characters.

#### Type
Must be one of the following:

* **add**: Create capability (feature/test/dependency)
* **add**: Delete capability
* **fix**: Fix an issue e.g. bug, typo.
* **docs**: Documentation only changes.
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
* **refactor**: A code change that neither fixes a bug nor adds a feature.
* **perf**: A code change that improves performance.
* **test**: Adding missing tests.
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation.

#### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: `change` not `changed` nor `changes`,
* don't capitalize first letter,
* no dot (.) at the end.

#### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

#### Footer
The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**, e.g. Closes #2 (automatically closes Issue ID #2)

#### Guidelines:

- Do NOT assume the reviewer understands what the original problem was.
- Do NOT assume the reviewer has access to external web services/site.
- Do NOT assume the code is self-evident/self-documenting.
- Describe WHY A CHANGE is being made.
- Read the commit message to see if it HINTS AT IMPROVED CODE STRUCTURE.
- Ensure sufficient information to decide WHETHER TO REVIEW.
- The FIRST COMMIT LINE is the most important.
- Describe any LIMITATIONS of the current code.
- Do NOT include patch set-specific comments.

##### Main Rule:
The commit message must contain all the information required to fully understand & review the patch for correctness. The more the better.

- Provide a detailed description of the change in the following lines, breaking paragraphs where needed.
- The first line should be limited to 50 characters and should not end with a period.
- Subsequent lines should be wrapped at 72 characters.

#### Acknowlegements
* https://gist.github.com/develar/273e2eb938792cf5f86451fbac2bcd51
* https://wiki.openstack.org/wiki/GitCommitMessages#Information_in_commit_messages
