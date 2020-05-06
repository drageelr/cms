import { createSlice } from "@reduxjs/toolkit"

/**
  A temporary initial state has been created to test with the components and render meaningful
  on the screen. The action creators in the reducer are responsible for implementing the changes 
  that the user makes when editing the task.
*/

const initialState = {
  
  userData:[
    {
      id: "column-1",
      email: "",
      password: "",
      firstName: "Asher",
      lastName: "Javaid",
      picture: "",
      role: "",
      userType: "",
      permissions: {
        societyCRUD: true,
        ccaCRUD: true,
        accessFormMaker: true,
        createReqTask: true,
        createCustomTask: true,
        createTaskStatus: true,
        archiveTask: true,
        unarchiveTask: true,
        setFormStatus: true,
        addCCANote: true
      },
      timeStampCreated: ""
    },
    {
      id: "column-2",
      email: "",
      password: "",
      firstName: "Farkhanda",
      lastName: "Khan",
      picture: "",
      role: "",
      userType: "CCA",
      permissions: {
        societyCRUD: true,
        ccaCRUD: true,
        accessFormMaker: true,
        createReqTask: true,
        createCustomTask: true,
        createTaskStatus: true,
        archiveTask: true,
        unarchiveTask: true,
        setFormStatus: true,
        addCCANote: true
      },
      timeStampCreated: ""
    },
  ],
  
  users: ["Asher", "Farkhanda"],  

  columnOrder: ['column-1','column-2'],

  archiveList: [],
  
  taskStatuses : [
    {
      id : 'ts-1',
      name: "Backlog",
      color: '#808080',
    },
    {
      id : 'ts-2',
      name: "In Progress",
      color: '#FF6347',
    },
    {
      id : 'ts-3',
      name: "Done",
      color: '#00FF00',
    },
    {
      id : 'ts-4',
      name: "Urgent",
      color: '#FF0000',
    },
  ],

  tasks: {
    'r1': { // r stands for request task
      id: 'r1', 
      title: 'Group Logs', 
      formDataId: "", // stores the ID of the request that is linked to it
      description: "hello world", 
      ownerId:'column-1', 
      status: 'ts-1',
      assigneeList: [],
      subTasksList: [], // list that contains the subtasks linked with this task
      logsList: [
        {
          id: "log1",
          taskId: "r1",
          creatorId: "column-1",
          description: "Hello WOrld",
          timeStampCreated: "",
          timeStampModified: ""
        },
      ] 
    },
    'c2': { // c stands for request task
      id: 'c2', 
      title: 'Documents', 
      description: "world! good bye", 
      ownerId:'column-2', 
      status: 'ts-4',
      assigneeList: [], // assignees list
      logsList: []
    },
    'r2': { // r stands for request task
      id: 'r2',  // request task ID
      title: 'Something Something', // title of the task
      formDataId: "", // stores the ID of the request that is linked to it
      description: "bye world",  // description of the task
      ownerId:'column-2', // the owner(column) in which this task will go
      status: 'ts-1', // the color status id applied to this task
      assigneeList: [], // the list of assignees assigned to this task
      subTasksList: [], // list that contains the subtasks linked with this task
      logsList: []
    },
  },

  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Ashar Javaid',
      taskIds: ['r1']
    },
    'column-2': {
      id: 'column-2',
      title: 'Farkhanda Khan',
      taskIds: ['c2', 'r2']
    }
  },
  
  checkListItems : [
    // {
    //   id:"checkItem-1",
    //   formId: "R-ID-1",
    //   title: "Make the Checklist by tonight asap.",
    //   description: "I am trying my best.",
    //   sectionIndex: "1.1",
    //   isAssigned: false,
    //   isChecked: false,
    // },
    // {
    //   id:"checkItem-2",
    //   formId: "R-ID-1",
    //   title: "Complete UI tonight.",
    //   description: "OK",
    //   sectionIndex: "1.2",
    //   isAssigned: false,
    //   isChecked: false,
    // },
    // {
    //   id:"checkItem-3",
    //   formId: "R-ID-2",
    //   title: "Material UI complete",
    //   description: "Nothing",
    //   sectionIndex: "1.3",
    //   isAssigned: false,
    //   isChecked: false,
    // },
  ],
}

let cId = 1
let tId = 2
let sId = 0
let lId = 1

const taskdata = createSlice({
  name: 'taskData',
  initialState: initialState,
  reducers: {
    addTask: (state, action) => {
      const {ownerId, text, taskType} = action.payload
      
      tId += 1
      let typeInit = ""

      taskType === "request" ? typeInit="r" : typeInit="c"
      const taskId = `${typeInit}${tId}`

      const newTask = { 
        id: taskId, 
        title: text, 
        formDataId: "", // stores the ID of the request that is linked to it
        description: "", 
        ownerId: ownerId, 
        status: '',
        assigneeList: [],
        subTasksList: [],
        logsList:[]
      }
  
      state.tasks[taskId] = newTask
      state.columns[ownerId].taskIds.push(taskId)
    },
      
    moveTask: (state, action) => {
      const { srcColumnId, srcIndex, dstColumnId, dstIndex, taskId } = action.payload
  
      const srcColumn = state.columns[srcColumnId]
      const dstColumn = state.columns[dstColumnId]
  
      srcColumn.taskIds.splice(srcIndex, 1) // delete the single task Id from src index from the source column
      dstColumn.taskIds.splice(dstIndex, 0, taskId) //insert it at dst index in the dst column
    },

    updateDescription: (state, action) => {
      const {taskId, description} = action.payload
      
      state.tasks[taskId].description = description
    },

    updateTitle: (state, action) => {
      const {taskId, newTitle} = action.payload
      
      state.tasks[taskId].title = newTitle
    },

    archiveTask: (state, action) => { // send the task id to the server and create an archive of it
      const {taskId, ownerId} = action.payload

      state.columns[ownerId].taskIds.map(id => {
        if (taskId === id) {
          var filteredAry = state.columns[ownerId].taskIds.filter(function(e) { return e != id })
          const obj = state.tasks[taskId]
          state.archiveList.push(obj)
          state.columns[ownerId].taskIds = filteredAry
        } 
      })
    },

    unArchiveTask: (state, action) => { // when i get the archive tasks from server, i will also get the taskowner id with it so then adding task back to column is simple, for now hardcoding the column
      const {taskId,ownerId} = action.payload 
      
      state.columns[ownerId].taskIds.push(taskId) // put the task back in owners list
      state.archiveList.map(id => {
        var filteredAry = state.archiveList.filter(function(e) { return e.id != taskId })
        state.archiveList = filteredAry
      })
    },

    taskOwner: (state, action) => {
      const {taskId, owner} = action.payload
      
      state.tasks[taskId].ownerId = owner
    },

    addTaskAssignees: (state, action) => {
      const {taskId, value} = action.payload
      
      state.tasks[taskId].assigneeList.push(value)
    },

    changeTaskStatus: (state, action) => {
      const { taskId, status} = action.payload
      
      state.taskStatuses.map(statObj => {
        if(statObj.name === status) {
          state.tasks[taskId].status = statObj.id
        }
      })
    },
    
    deleteTaskAssignee: (state, action) => {
      const {taskId, person} = action.payload
      
      state.tasks[taskId].assigneeList.map(name =>{
        if(name === person) {
          var filteredAry = state.tasks[taskId].assigneeList.filter(function(e) { return e !== name })
          state.tasks[taskId].assigneeList = filteredAry
        }
      })
    },

    linkFormToTask : (state, action) => {
      const {taskId, requestId} = action.payload
      
      state.tasks[taskId].formDataId = requestId
    },

    changeCheckStatus: (state, action) => {
      const { taskId, checkListObj, status} = action.payload
      
      state.checkListItems.map(objCheck => {
        if (checkListObj.id === objCheck.id) {
          objCheck.isChecked = status
        }
      })
    },

    createSubTask : (state, action) => {
      const {taskId, userObj, checkListObj} = action.payload

      sId +=1

      let subObj = {
        id: `s${sId}`,
        taskId: taskId,
        statusId: "",
        assigneeId: userObj.id, 
        title: checkListObj.title, 
        description: checkListObj.description,
        sectionIndex: checkListObj.sectionIndex
      }
      state.tasks[taskId].subTasksList.push(subObj.id)
      state.columns[subObj.assigneeId].taskIds.push(subObj.id)
      state.tasks[subObj.id] = subObj

      state.checkListItems.map((tempObj, index) => { // the isAssigned property is set to true if a checklistItem has been assigned to an assignee
        if (tempObj.id === checkListObj.id) {
          tempObj.title = userObj.firstName + " -> " + tempObj.title
          tempObj.isAssigned = true
        }
      })
    },

    createNewLog: (state, action) => {
      const {taskId, logText} = action.payload
    
      lId+=1
      let newLog = {
        id: `log${lId}`,
        taskId: taskId,
        creatorId: state.tasks[taskId].ownerId,
        description: logText,
        timeStampCreated: "",
        timeStampModified: ""
      }

      state.tasks[taskId].logsList.push(newLog)
    }
  }
})
    
export const { 
  addTask, 
  updateTitle,
  updateDescription, 
  moveTask, 
  archiveTask, 
  unArchiveTask, 
  taskOwner,
  addTaskAssignees,
  changeTaskStatus,
  deleteTaskAssignee,
  changeCheckStatus, 
  linkFormToTask, 
  createSubTask,
  createNewLog,
} = taskdata.actions

export default taskdata.reducer