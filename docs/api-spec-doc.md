# CCA Management System - API Specification Document - V 1.0.0

## Table Of Contents
[ToC]

## Important Notes
- ==Every **Response Object** will contain `{statusCode: Number, statusName: "String", message: "String"}` in addition to the mentioned object.==
- ==All other APIs except **Authentication** API must send the `token`  as *"Bearer Token"* header with every request.==
- ==Every API has **Error** `3.1` as a **Possible Error.**==
- ==Changes will be highlighted (apart from this section) as compared with the previous version==

## APIs

### 1. Authentication
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|CCA Login|Authentication for CCA Users|`/api/auth/cca-login`|`{email: "String", password: "String"}`|POST|`{token: "String", , user: {id: Number, firstName: "String", lastName: "String", picture: "String", permissions: "String"}}`|CCA|`2.1`|
|2|Society Login|Authentication for Society Users|`/api/auth/society-login`|`{email: "String", password: "String"}`|POST|`{token: "String", , user: {id: Number, name: "String", nameInitials: "String", name}`|Society|`2.1`|

### 2. User Management
*Note: Will contain APIs for actions related to creation / deletion / editing etc of CCA User (Admin/Member) and Society accounts.*
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|Create CCA Account|Creates an account for a CCA Member|`/api/account/cca/create-account`|`{firstName*: "String", lastName*: "String", email*: "String", password*: "String", picture: "String", permissions: "String"}`|POST|`{}`|CCA|TBD|
|2|Edit CCA Account|Edits an account of a CCA Member|`/api/account/cca/edit-account`|`{firstName: "String", lastName: "String", email: "String", password: "String", picture: "String", permissions: "String"}`|PUT|`{}`|CCA|TBD|
|3|Delete CCA Account|Deletes an account of a CCA Member|`/api/account/cca/delete-account`|`{id*: Number}`|DELETE|`{}`|CCA|TBD|
|4|Create Society Account|Creates an account for a Society|`/api/account/society/create-account`|`{nameInitials*: "String", name*: "String", email*: "String", password*: "String", emailPresident*: "String", emailPatron*: "String"}`|POST|`{}`|CCA|TBD|
|5|Edit Society Account|Edits an account of a Society|`/api/account/society/edit-account`|`{nameInitials: "String", nameSociety: "String", emailSociety: "String", password: "String", emailPresident: "String", emailPatron: "String"}`|PUT|`{}`|CCA|TBD|
|6|Delete Society Account|Deletes an account of a Society|`/api/account/society/delete-account`|`{id*: Number}`|DELETE|`{}`|CCA|TBD|
|7|Change Society Password|Changes the password of a Society Account|`/api/society-dashboard/change-password`|`{passwordPrevious*: "String", passwordNew*: "String"}`|PUT|`{}`|Society|TBD|

### 3. Form Management
*Note: Will contain APIs for actions related to creation / deletion / editing etc of forms.*
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|Fetch Form Template|Fetches Form Template from Database|`/api/form/fetch`|`{}`|GET|`{id: Number, formID: Number, title: "String", isPublic: Boolean, sections: List<String>, sectionsOrder: List<Number>, components: JSON, componentsOrder: JSON, items: JSON, itemsOrrder: JSON, checklistItemIDs: List<Number>, creatorID: Number}`|CCA + Society|TBD|
|2|Create Form|Creates an Event Approval Form|`/api/form/fetch/create-form`|`{id*: Number, title*: "String", isPublic*: Boolean, sections*: List<"String">, sectionsOrder*: List<Number>, components*: JSON, componentsOrder*: JSON, items*: JSON, itemsOrder*: JSON, checklistItemIDs*: List<Number>, timestampCreated*: DateTime, creatorID*: Number}`|POST|`{}`|CCA|TBD|
|3|Edit Form|Edits an Event Approval Form|`/api/form/fetch/edit-form`|`{id*: Number, title: "String", isPublic: Boolean, sections: List<"String">, sectionsOrder: List<Number>, components: JSON, componentsOrder: JSON, items: JSON, itemsOrder: JSON, checklistItemIDs: List<Number>, timestampModified: DateTime, creatorID*: Number}`|PUT|`{}`|CCA|TBD|
|4|Delete Form|Deletes an Event Approval Form|`/api/form/fetch/delete-form`|`{id*: Number}`|DELETE|`{}`|CCA|TBD|
|5|Fetch Form List|Fetches list of form templates available|`/api/form/fetch-list`|`{}`|GET|`{formList: [{id: Number, title: "String"}]}`|CCA + Society|TBD|

### 4. Request Management
*Note: Will contain APIs for submitting / editing forms / viewing (CCA + Society), getting request list, updating request status (CCA) etc*
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|Submit Form|Submits a form for approval (if needed) and then to CCA|`/api/form-submission`|`{formID*: Number, itemsData*: List<JSON>}`|POST|`{id: Number}`|Society|TBD|
|2|Edit Form|Edits a form submitted by a Society|`/api/form-submission/edit`|`{id*: Number, itemsData*: List<JSON>}`|PUT|`{}`|Society|TBD|
|3|View Form Submission|Views a form already submitted by a society|`/api/form-submission/view`|`{id*: Number}`|GET|`{id: Number, formID: Number, userID: Number, title: "String", isPublic: Boolean, sections: List<"String">, sections_order: List<Number>, components: List<JSON>, componenetsOrder: List<Number>, itemsData: List<JSON>, itemsOrder: List<Number>}, formStatus: "String", ccaNote: "String", societyNotes: List<"String">`|CCA + Society|TBD|
|4|Add Note Society|Adds a note by a Soceity to a submitted form|`/api/form-submission/add-note-society`|`{id*: Number, societyNote*: "String"}`|POST|`{}`|Society|TBD|
|5|Get CCA Request List|Displays list of all requests in process|`/api/form-submission/cca-list`|`{filter: "String"}`|GET|`{formDataList: [{id: Number, title: "String", date: DateTime, society: "String", status: "String"}]}`|CCA|TBD|
|6|Get Society Request List|Displays list of all requests by a society|`/api/form-submission/society-list`|`{}`|GET|`{formDataList: [{id: Number, title: "String", date: DateTime, society: "String", status: "String"}]}`|Society|TBD|
|7|Update Request Status|Changes the status of a request in process|`/api/form-submission/update-status-cca`|`{id*: Number, status*: "String"}`|PUT|`{}`|CCA|TBD|
|8|Add Note CCA|Adds a note by CCA to a submitted request|`/api/form-submission/add-note-cca`|`{id*: Number, ccaNote*: "String"}`|POST|`{}`|CCA|TBD|
|9|Update Request Status (President/Patron)|Changes the status of a request for approval|`/api/form-submission/update-status-pp`|`{id*: Number, status*: "String", issueNote: "String"}`|PUT|`{}`|President + Patron|TBD|

### 5. Task Management
*Note: Will contain APIs actions related to creating /editing / delete tasks, archiving / unarchiving task archives and creating / editing / deleting task statuses.*
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|Possible Errors|
|-|----|-----------|-----|------------|--------------|---------------|------|---------------|
|1|Fetch Task|Gets details of a created task from database|`/api/task-manager-window/task-editor/task-details`|`{id*: Number}`|GET|`{formDataID: Number, title: "String", description: "String", ownerID: Number, statusID: Number, logIDs: List<Number>, assigneeList: List<Number>, subtaskList: List<JSON>}`|
|2|Create Task|Creates a Custom/Request task| `/api/task-manager-window/task-editor`|`{id*: Number, formDataID*: Number, title*: "String", description*: "String", ownerID*: Number, statusID*: Number, logIDs: List<Number>, assigneeList: List<Number>}`|POST|`{}`|CCA|TBD|
|3|Create Subtask|Creates a subtask for an existing task|`/api/task-manager-window/task-editor`|`{id*: Number, taskID*: Number, statusID*: Number, assigneeID*: Number, title*: "String", description: "String", sectionIndex: "String"}`|POST|`{}`|CCA|TBD|
|4|Edit Task|Edits a Custom/Request task|`/api/task-manager-window/task-editor/task-details`|`{id*: Number, formDataID*: Number, title: "String", description: "String", ownerID*: Number, statusID: Number, logIDs: List<Number>, assigneeList: List<Number>}`|PUT|`{}`|CCA|TBD|
|5|Edit Subtask|Edits a subtask of an existing task|`/api/task-manager-window/task-editor/task-details`|`{id*: Number, taskID*: Number, statusID: Number, assigneeID: Number, title: "String", description: "String", sectionIndex: "String"}`|PUT|`{}`|CCA|TBD|
|6|Delete Task|Deletes a Custom/Request task|`/api/task-manager-window/task-editor/task-details`|`{id*: Number}`|DELETE|`{}`|CCA|TBD|
|7|Delete Subtask|Deletes a subtask of an existing task|`/api/task-manager-window/task-editor/task-details`|`{id*: Number}`|DELETE|`{}`|CCA|TBD|
|8|Create Task Status|Creates a task status for assigning|`/api/task-status-manager`|`{name*: "String", colorHex*: "String"}`|POST|`{id: Number}`|CCA|TBD|
|9|Edit Task Status|Edits a task status being assigned|`/api/task-status-manager/task-status-details`|`{id*: Number, name: "String", colorHex: "String"}`|PUT|`{}`|CCA|TBD|
|10|Delete Task Status|Deletes a task status being assigned|`/api/task-status-manager/task-status-details`|`{id*: Number}`|DELETE|`{}`|CCA|TBD|
|11|Archive Task|Archives a task and its related components|`/api/task-manager-window/task-editor/task-archiver`|`{formDataID*: Number, title: "String", description: "String", ownerID*: Number, statusID*: Number, logIDs*: List<Number>, assigneeList*: List<Number>}`|POST|`{id: Number}`|CCA|TBD|
|12|Unarchive Task|Unarchives a task and its related components|`/api/task-manager-window/task-editor/task-archiver`|`{id*: Number}`|POST|`{formDataID: Number, title: "String", description: "String", ownerID: Number, statusID: Number, logIDs: List<Number>, assigneeList: List<Number>}`|CCA|TBD|

**Note: * means the field mentioned is required**

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
