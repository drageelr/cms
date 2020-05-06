# CCA Management System - API Specification Document - V 1.0.0

## Table Of Contents
[ToC]

## Important Notes
- ==Every **Response Object** will contain `{statusCode: Number, statusName: "String", message: "String"}` in addition to the mentioned object.==
- ==All other APIs except **Authentication** API must send the `token`  as *"Authorization"* header with every request.==
- ==Every API which has a **Request Object** will have **Error** `3.1` as a **Possible Error.**==
- ==Every API apart from **Authentication** will have **Errors** `1.1`-`1.5` and `4.1` as a **Possible Error.**==
- ==Changes will be highlighted (apart from this section) as compared with the previous version==

## APIs

### 1. Authentication
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|CCA Login|Authentication for CCA Users|`/api/auth/cca/login`|`{email*: "String allow: ['lums.edu.pk']", password*: "String-min(8)-max(30)-[a-zA-Z0-9]"}`|POST|`{token: "String", user: {id: Number, firstName: "String", lastName: "String", picture: "String", permissions: "String"}}`|CCA|`2.1`|
|2|Society Login|Authentication for Society Users|`/api/auth/society/login`|`{email*: "String allow: ['lums.edu.pk']", password*: "String-min(8)-max(30)-[a-zA-Z0-9]"}`|POST|`{token: "String", user: {id: Number, name: "String", nameInitials: "String", patronEmail: "String", presidentEmail: "String"}`|Society|`2.1`|

- **Note: * means the field mentioned is required (For `Request Object`)**

### 2. User Management
*Note: Will contain APIs for actions related to creation / deletion / editing etc of CCA User (Admin/Member) and Society accounts.*
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|Create CCA Account|Creates an account for a CCA Member|`/api/account/cca/create-account`|`{ccaAccount*: ccaAccountObj}`|POST|`{ccaId: Number}`|CCA|`4.1`|
|2|Create Society Account|Creates an account for a Society|`/api/account/society/create-account`|`{societyAccount*: societyAccountObj}`|POST|`{societyId: Number}`|CCA|`4.1`|
|3|Edit CCA Account|Edits an account of a CCA Member|`/api/account/cca/edit-account`|`ccaAccount: ccaAccountObj "At least one field is required" "At least one field is required"`|POST|`{}`|CCA|`5.1`|
|4|Edit Society Account|Edits an account of a Society|`/api/account/society/edit-account`|`{societyAccount: societyAccountObj "At least one field is required"}`|POST|`{}`|CCA|`5.1`|
|5|Get CCA Account List|Fetches the list of all existing CCA Member Accounts|`/api/account/cca/account-list`|`{}`|POST|`{userList: userListCCA}`|CCA|`5.1`|
|6|Get Society Account List|Fetches the list of all existing Society Accounts|`/api/account/society/account-list`|`{}`|POST|`{userList: userListSociety}`|CCA|`5.1`|
|7|Change Password (CCA)|Changes the password of a CCA Member|`/api/account/cca/change-password`|`{passwordCurrent*: "String-min(8)-max(30)-[a-zA-Z0-9]", passwordNew*: "String-min(8)-max(30)-[a-zA-Z0-9]"}`|POST|`{}`|CCA|`2.1`|
|8|Change Password (Society)|Changes the password of a Society Account|`/api/account/society/change-password`|`{passwordCurrent*: "String-min(8)-max(30)-[a-zA-Z0-9]", passwordNew*: "String-min(8)-max(30)-[a-zA-Z0-9]"}`|POST|`{}`|Society|`2.1`|
|9|Change Picture (CCA)|Changes the picture of a CCA Member Account|`/api/account/cca/change-picture`|`{picture*: "String"}`|POST|`{}`|CCA|`2.1`|
|10|Change Society Theme|Changes theme of the society|`/api/account/society/change-theme`|`{themeColor: "String", darkMode: Boolean}`|`POST`|`{}`|Society||

- **Note: * means the field mentioned is required (For `Request Object`)**
- **Note: for `API 2.3` and `API 2.4`: Both `ccaAccountObj` and `societyAccountObj` in these API's request object can have the following 2 optional fields. 1) `themeColor: "String"`. 2) `darkMode: Boolean`.**

#### Object Schema
|#|Name|Object|
|-|----|------|
|1|`ccaAccountObj`|`{email: "String allow: ['lums.edu.pk], password: "String-min(8)-max(30)-[a-zA-Z0-9]", firstName: "String-min(1)-max(30)", lastName: "String-min(1)-max(30)", picture: "String", permissions: permissionsObj}`|
|2|`societyAccountObj`|`{email: "String" allow: ['lums.edu.pk'], password: "String-min(8)-max(30)-[a-zA-Z0-9]", name: "String-min(1)-max(100)", nameInitials: "String-min(1)-max(10)", presidentEmail: "String allow: ['lums.edu.pk']", patronEmail: "String allow: ['lums.edu.pk']"}`|
|3|`permissionsObj`|`{societyCRUD: Boolean, ccaCRUD: Boolean, accessFormMaker: Boolean, createReqTask: Boolean, createCustomTask: Boolean, createTaskStatus: Boolean, archiveTask: Boolean, unarchiveTask: Boolean, setFormStatus: Boolean, addCCANote: Boolean}`|
|4|`userListCCA`|`[{ccaId: Number, email: "String", role: "String", firstName: "String", lastName: "String", picture: "String", active: Boolean, permissions: permissionsObj}]`|
|5|`userListSociety`|`[{societyId: Number, email: "String", name: "String", nameInitials: "String", presidentEmail: "String", patronEmail: "String", active: Boolean}]`|


### 3. Form Management
*Note: Will contain APIs for actions related to creation / deletion / editing etc of forms.*
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|Create Form|Creates a new Form|`/api/form/create`|`{form*: formObjA}`|`POST`|`{formId: Number, checklistIds: [Number]}`|CCA|`6.1`|
|2|Edit Form|Edits an existing Form |`/api/form/edit`|`{form*: formObjB}`|`POST`|`{formId: Number, checklistIds: [Number]}`|CCA|`6.1`, `7.1`|
|3|Delete Form|Delete an existing Form|`/api/form/delete`|`{formId*: Number}`|`POST`|`{}`|CCA|`7.1`|
|4|Fetch Form|Fetches complete details of Form|`/api/form/fetch`|`{formId*: Number}`|`POST`|`{form: formObjC}`|CCA + Society|`7.1`|
|5|Fetch Form List|Fetches list of available Forms|`/api/form/fetch-list`|`{}`|`POST`|`{formList: [formListObj]}`|CCA + Society|`7.1`|
|6|Change Form Status|Declares a form as Public/Private|`/form/change-status`|`{formId*: Number, isPublic*: Boolean}`|`POST`|`{}`|CCA|`7.1`|
|7|Fetch Checklist|Fetches all checklists for a submission|`/api/form/fetch-checklist`|`{submissionId*: Number}`|`POST`|`{formId: Number, checklists: [checklistObj**]}`|CCA|`9.1`|

- **Note for `API 3.2`: 1) Send the complete form again - not only the edited portions. 2) In case of checklists, new ones should be given without their `checklistId` where as existing ones (either to alter or not) should be sent with it, otherwise new checklist item will be created. 3) Always returns the checklistIds in the order they are placed in the request array.**
- **Note for `API 3.4`: In case of Society user checklist won't be sent.**
- **Note for `API 3.5`: In case of Society user ** fields won't be sent.**
- **Note for `API 3.6`: If there is no checklist available for the submission, empty array for `checklists` will be returned.**
- **Note: * means the field mentioned is required. (For `Request Object` OR `Object Schema` referenced in it)**
- **Note: ** means the field mentioned might not always be there. (For `Response Object` OR `Object Schema` referenced in this and `Request Object`)**


#### Object Schema
|#|Name|Object|
|-|----|------|
|1|`formObjA`|`{title*: "String", isPublic*: Bool, sections*: [sectionObj], components*: [componentObj], items*: [itemObj], checklistItems**: [{sectionId*: Number, description*: "String"}]}`|
|2|`formObjB`|`{formId*: Number, title*: "String", isPublic*: Bool, sections*: [sectionObj], components*: [componentObj], items*: [itemObj], checklistItems**: [{checklistId**: Number, sectionId*: Number, description*: "String"}]}`|
|3|`formObjC`|`{formId*: Number, title*: "String", isPublic*: Bool, sections*: [sectionObj], components*: [componentObj], items*: [itemObj], checklistItems**: [{checklistId*: Number, sectionId*: Number, description*: "String"}]}`|
|2|`sectionObj`|`{sectionId*: Number, title*: "String-min(1)-max(100)", componentsOrder*: [Number]}`|
|3|`componentObj`|`{componentId*: Number, title*: "String-min(1)-max(100)", itemsOrder*: [Number]}`|
|4|`itemObj`|`{itemId*: Number, type*: "String", label*: "String", required*: Bool, defaultVisibility*: Bool, placeHolder**: "String", maxLength**: Number, options**: optionObj, conditionalItems**: conItemObject, fileTypes**: "String"}`|
|5|`optionObj`|`{optionId*: Number, data*: "String"}`|
|6|`conItemObj`|`{optionId*: Number, itemId*: Number}`|
|7|`formListObj`|`{formId: Number, title: "String", isPublic: Bool, timestampModified**: "DateString", creatorName**: "String"}`|
|8|`checklistObj`|`{checklistId: Number, sectionId: Number, description: "String"}`|

### 4. Request Management
*Note: Will contain APIs for submitting / editing forms / viewing (CCA + Society), getting request list, updating request status (CCA) etc*
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|Submit Form|Submits a form for approval (if needed) and then to CCA|`/api/submission/submit`|`{formID*: Number, submissionID*: Number, itemsData*: itemsObj}`|POST|`{timestampCreated: DateTime, timestampModified: DateTime}`|Society|`7.1, 8.1`|
|2|Add CCA Note|Attaches a Note from CCA to a request|`/api/submission/cca/add-note`|`{submissionId*: Number, note*: "String-min(1)-max(100)"}`|POST|`{}`|CCA|`9.1`|
|3|Add Society Note|Attaches a Note from Society to a request|`/api/submission/society/add-note`|`{submissionId*: Number, note*: "String-min(1)-max(100)"}`|POST|`{}`|Society|`9.1`|
|4|Fetch Submission List|Fetches list of all submissions made|`/api/submission/fetch-list`|`{statusList: ["String"], timeObj*: timeObj}`|POST|`{submissions: submissionsList}`|CCA+Society|`9.1`|
|5|Update Submission Status|Status of existing submission updated|`/api/submission/update-status`|`{submissionId*: Number, status*: "String", issue: "String-min(1)-max(500)"}`|POST|`{}`|CCA|`8.1, 9.1`|
|6|Fetch Submission|Fetches a submission with complete details|`/api/submission/fetch`|`{submissionId*: Number}`|POST|`{itemsData: itemsObj, ccaNotes: ["String"], societyNotes: ["String"], formId: Number}`|CCA+Society|`9.1`|

### Object Schema
|#|Name|Object|
|-|----|------|
|1|`itemsObj`|`{itemId: Number, data: Object}`|
|2|`timeObj`|`{dateStart: DateTime, dateEnd: DateTime}`|
|3|`submissionsList`|`[{submissionId: Number, societyId: Number, status: "String", formId: Number, formTitle: "String", societyName: "String", societyNameInitials: "String", timestampCreated: DateTime, timestampModified: DateTime}]`|

### 5. Task Management
*Note: Will contain APIs actions related to creating /editing / delete tasks, archiving / unarchiving task archives and creating / editing / deleting task statuses.*
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|Create Request Task|Creates a request task linked with a form submission. Can't send logs.|`/api/task-manager/task/req/create`|`{task*: reqTaskObj}`|`POST`|`{taskId: "String", subtasks: [subtaskObj2**], newLogs: [logObj]}`|`CCA`|`5.1, 9.1, 10.1, 11.1`|
|2|Create Custom Task|Creates a custom task. Can't send logs.|`/api/task-manager/task/cus/create`|`{task*: cusTaskObj}`|`POST`|`{taskId: "String", newLogs: [logObj]}`|`CCA`|`5.1, 10.1`|
|3|Edit Request Task|Edits a request task linked with a form submission. Can't edit logs, subissionId.|`/api/task-manager/task/req/edit`|`{task*: editReqTaskObj}`|`POST`|`{newLog: logObj, subTaskIds**: [Number]}`|`CCA`|`3.1, 5.1, 10.1, 12.1, 13.1`|
|4|Edit Custom Task|Edits a custom task. Can't edit logs.|`/api/task-manager/task/cus/edit`|`{task*: editCusTaskObj}`|`POST`|`{newLog: logObj}`|`CCA`|`3.1, 5.1, 10.1, 12.1`|
|5|Add Log|Adds a log to task|`/api/task-manager/log/add`|`{taskId*: "String", description*: "String"}`|`POST`|`{logId: Number, createdAt: Date, updatedAt: Date}`|`CCA`|`12.1`|
|6|Fetch Task Manager|Returns all tasks in the task manager|`/api/task-manager/fetch`|`{}`|`POST`|`{taskList: [reqTaskObjFull/cusTaskObjFull]}`|`CCA`|`12.1`|
|7|Fetch Archive Manager|Returns all archived tasks based on a filter|`/api/task-manager/fetch-archive`|`{}`|`POST`|`{taskList: [taskDetailsObj]}`|`CCA`|`12.1`|
|8|Fetch Task|Returns complete details of a task|`/api/task-manager/task/fetch`|`{taskId: "String"}`|`POST`|`{task: reqTaskObjFull/cusTaskObjFull}`|`CCA`|`12.1`|
|9|Create Task Status|Creates a new task status|`/api/task-manager/task-status/create`|`{name*: "String", color*: "String"}`|`POST`|`{statusId: Number}`|`CCA`|` `|
|10|Edit Task Status|Edits an existing task status|`/api/task-manager/task-status/edit`|`{statusId*: Number, name**: "String", color**: "String"}`|`POST`|`{}`|`CCA`|`10.1`|
|11|Delete Task Status|Deletes an existing task status|`/api/task-manager/task-status/delete`|`{statusId*: Number}`|`POST`|`{}`|`CCA`|`10.1`|
|12|Fetch Task Statuses|Fetches all task statuses|`/api/task-manager/task-status/fetch-all`|`{}`|`POST`|`{statuses: [statusId: Number, name: "String", color: "String"]}`|`CCA`|`10.1`|

- **Note for `API 5.3` and `API 5.4`: Only send optional parameters denoted by ** in `Object Schema` if they have to be updated.**
- **Note for `API 5.7`: Just fetches the basic details to be shown in the Archive Manager.**
- **Note for `API 5.8`: Will be used to fetch details of a task in Archive Manager when clicked on them for details, however can also fetch details of unarchived tasks as well.**
- **Note for `Object Schema 5.8`: `subtaskId` will be returned as `-1` if the log is created by the server itself.**
- **Note: * means the field mentioned is required. (For `Request Object` OR `Object Schema` referenced in it)**
- **Note: ** means the field mentioned might not always be there. (For `Response Object` OR `Object Schema` referenced in this and `Request Object`)**

#### Object Schema
|#|Name|Object|
|-|----|------|
|1|`reqTaskObj`|`{title*: "String", description*: "String", submissionId*: Number, ownerId*: Number, statusId*: Number, checklists**: [checklistObj]}`|
|2|`checklistObj`|`{checklistId*: Number, assigneeId*: Number}`|
|3|`cusTaskObj`|`{title*: "String", description*: "String", ownerId*: Number, statusId*: Number}`|
|4|`editReqTaskObj`|`{taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, subtasks**: [subtaskObj]}, archive**: Boolean`|
|5|`subtaskObj`|`{subtaskId*: Number, assigneeId**: Number, description**: "String", check**: Boolean}`|
|6|`editCusTaskObj`|`{taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, archive**: Boolean}`|
|7|`reqTaskObjFull`|`{taskId: "String", title: "String", description: "String", submissionId: Number, ownerId: Number, statusId: Number, subtasks:**: [subtaskObj2]}, logs: [logObj], archive: Boolean, createdAt: Date, updatedAt: Date`|
|8|`subtaskObj2`|`{subtaskId: Number, assigneeId: Number, description: "String", check: Boolean, createdAt: Date, updatedAt: Date}`|
|9|`cusTaskObjFull`|`{taskId: "String", title: "String", description: "String", ownerId: Number, statusId: Number, logs: [logObj], archive: Boolean, createdAt: Date, updatedAt: Date}`|
|10|`logObj`|`{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}`|
|11|`taskDetailsObj`|`{taskId: "String", title: "String", ownerId: Number, archive: Boolean, createdAt: Date, updatedAt: Date}`|

### 6. File Management
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|File Upload|Upload file for submission|`/api/file/upload`|`file` sent with `multipart/form-data` header|`POST`|`{fileToken: "String"}`|Society|`TBD`|
|2|File Download|Download file from submission|`/api/file/download`|`{submissionId*: Number, itemId*: Number}`|`POST`|CCA + Society|`10.1`, `15.1`|

- **Note for `API 6.1`: `fileToken` recieved is to be sent as `data` for `item` which has the `type` "file".**
- **Note: * means the field mentioned is required. (For `Request Object` OR `Object Schema` referenced in it)**
- **Note: ** means the field mentioned might not always be there. (For `Response Object` OR `Object Schema` referenced in this and `Request Object`)**

## Status Codes
**Note: These status codes have been altered for use in CMS. For further elaboration visit this [link.](https://restfulapi.net/http-status-codes/)**
### 1. Sucess
|#|Name|Code|Description|
|-|----|----|-----------|
|1|`OK`|`200`|<ul><li>Action requested by client successfully carried out.</li></ul> <ul><li>No other specific code in `2xx` series is appropriate.</li></ul> <ul><li>**Always has a response body** (apart from `status` and `message`).</li></ul>|
|2|`CREATED`|`201`|<ul><li>A resource is created inside a collection.</li></ul> <ul><li>Always returns this code **only after** successful creation of the resource.</li></ul>|
|3|`ACCEPTED`|`202`|<ul><li>Request has been accepted, but will be processed later on.</li></ul> <ul><li>Always returns this code **before execution** of requested process.</li></ul>|
|4|`NO CONTENT`|`203`|<ul><li>Action requested by client successfuly carried out.</li></ul> <ul><li>**Never returns a response body** (apart from `status` and `message`).</li></ul>|

### 2. Redirection
|#|Name|Code|Description|
|-|----|----|-----------|
|1|`MOVED PERMANENTLY`|`301`|<ul><li>API shifted to **new URI**.</li></ul> <ul><li>Always returns **new URI** in response body(apart from `status` and `message`).</li></ul>|
|2|`SEE OTHER`|`303`|<ul><li>Controller resource has finished it's work, but the **response is on some other URI** sent in response body (apart from `status` and `message`).</li></ul>|
|3|`NOT MODIFIED`|`304`|<ul><li>Resource has not been modified since the version specified by the request.</li></ul> <ul><li>**Never returns a response body** (apart from `status` and `message`).</li></ul>|
|4|`TEMPORARY REDIRECT`|`307`|<ul><li>Client's request woudl not be processed **since URI has temporarily been changed**.</li></ul> <ul><li>Always returns **temporary URI** in response body(apart from `status` and `message`).</li></ul>|

### 3. Client Error
|#|Name|Code|Description|
|-|----|----|-----------|
|1|`BAD REQUEST`|`400`|<ul><li>Generic client-side error status.</li></ul> <ul><li>No other specific code in `4xx` series is appropriate.</li></ul>|
|2|`UNAUTHORIZED`|`401`|<ul><li>Client request to a resource without proper authorization - **either no or wrong credentials.**</li></ul>|
|3|`FORBIDDEN`|`403`|<ul><li>Client doesn't have access to the requested resource.</li></ul>|
|4|`NOT FOUND`|`404`|<ul><li>Invalid URI (API Route).</li></ul>|
|5|`NOT ACCEPTABLE`|`406`|<ul><li>API can't generate client's preffered media type.</li></ul>|
|6|`UNSUPPORTED MEDIA TYPE`|`415`|<ul><li>API can't process client's supplied media type.</li></ul>|

### 4. Server Error
|#|Name|Code|Description|
|-|----|----|-----------|
|1|`INTERNAL SERVER ERROR`|`500`|<ul><li>Error occured at sever side - not the client's fault.</li></ul>|
|2|`NOT IMPLEMENTED`|`501`|<ul><li>API not implemented but exists.</li></ul>|

### 5. Misc
|#|Name|Code|Description|
|-|----|----|-----------|
|1|`NOT A STATUS CODE`|`any number apart from ones mentioned above`|<ul><li>Error Code not available.</li></ul>|

## Error Objects
### Introduction
Error object standard:
```javascript=1
{
name: "String",
subName: "String",
details: object/"String"/Number
}
```
Hence, standard error output:
```javascript=1
{
statusCode: Number, 
statusName: "String", 
message: "String", 
error: {
    name: "String", 
    subName: "String", 
    details: object/"String"/Number
  }
}
```

### Errors
**Note: `INTERNAL SERVER ERROR` does not have an error object.**
|#|Name|Sub-Name|Status Code|Details Object|Description|
|-|----|-----------|--------|-------|-----------|
|1.1|`TokenError`|`N/A`|`400`|`"String"`|JWT token is missing OR invalid|
|1.2|`TokenError`|`N/A`|`404`|`"String"`|JWT token is invalid (user not found).|
|1.3|`TokenError`|`TokenExpiredError`|`400`|`"String"`|JWT token is expired.|
|1.4|`TokenError`|`JsonWebTokenError`|`400`|`"String"`|JWT token is invalid.|
|1.5|`TokenError`|`NotBeforeError`|`400`|`"String"`|JWT token is not yet active.|
|2.1|`AuthenticationError`|`N/A`|`401`|`"String"`|Unable to verify credentials.|
|3.1|`ValidationError`|`N/A`|`400`|`[{parameter: "String"}]` where a key-value pair represent parameter and their corresponding error.|API parameters are not valid.|
|4.1|`ForbiddenAccessError`|`N/A`|`403`|`"String"`|User does not have the necessary permission to access resource|
|5.1|`DuplicateUserError`|`N/A`|`400`|`"String"`|User with the same detail(s) already exists|
|6.1|`UserNotFoundError`|`N/A`|`404`|`"String"`|User with the given parameters is not found|
|7.1|`FormValidationError`|`N/A`|`400`|`"String"`|Logical error in form parameters|
|8.1|`FormNotFoundError`|`N/A`|`404`|`"String"`|Form with the given parameters is not found|
|9.1|`SubmissionValidationError`|`N/A`|`404`|`"String"`|Submission is not valid|
|10.1|`SubmissionNotFoundError`|`N/A`|`404`|`"String"`|Submission with the given parameters is not found|
|11.1|`TaskStatusNotFoundError`|`N/A`|`404`|`"String"`|Task Status with the given parameters is not found|
|12.1|`ChecklistNotFoundError`|`N/A`|`404`|`"String"`|Checklist with the given parameters is not found|
|13.1|`TaskNotFoundError`|`N/A`|`404`|`"String"`|Task with the given parameters is not found|
|14.1|`SubTaskNotFoundError`|`N/A`|`404`|`"String"`|Sub Task with the given parameters is not found|
|15.1|`FileNotFoundError`|`N/A`|`404`|`"String"`|File with the given parameters is not found|