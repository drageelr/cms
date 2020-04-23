import { createSlice } from "@reduxjs/toolkit"

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
      permissions: "",
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
      permissions: "",
      timeStampCreated: ""
    },
    {
      id: "column-3",
      email: "",
      password: "",
      firstName: "Farrukh",
      lastName: "Rasool",
      picture: "",
      role: "",
      permissions: "",
      timeStampCreated: ""
    },
  ],
  users: ["Farrukh", "column-1", "Zoraiz", "Hamza F", "Hammad", "Hamza A", "column-2"],  
  columnOrder: ['column-1','column-2'],
  archiveList: [],
  taskStatuses : [
    {
      id : 'ts-1',
      name: "Backlog",
      colorHex: '#808080',
    },
    {
      id : 'ts-2',
      name: "In Progress",
      colorHex: '#FF6347',
    },
    {
      id : 'ts-3',
      name: "Done",
      colorHex: '#00FF00',
    },
    {
      id : 'ts-4',
      name: "Urgent",
      colorHex: '#FF0000',
    },
  ],
  tasks: {
    'r1': { // r stands for request task
      id: 'r1', 
      title: 'Group Logs', 
      formDataId: "R-ID-1", // stores the ID of the request that is linked to it
      desc: "hello world", 
      ownerId:'column-1', 
      status: 'ts-1',
      assList: [],
      subTasksList: [], // list that contains the subtasks linked with this task
      logsList: []
    },
    'c2': { // c stands for request task
      id: 'c2', 
      title: 'Documents', 
      desc: "world! good bye", 
      ownerId:'column-2', 
      status: 'ts-4',
      assList: [], // assignees list
      logsList: []
    },
    'r2': { // r stands for request task
      id: 'r2',  // request task ID
      title: 'Something Something', // title of the task
      formDataId: "", // stores the ID of the request that is linked to it
      desc: "bye world",  // description of the task
      ownerId:'column-2', // the owner(column) in which this task will go
      status: 'ts-1', // the color status id applied to this task
      assList: [], // the list of assignees assigned to this task
      subTasksList: [], // list that contains the subtasks linked with this task
      logsList: []
    },

    // 'rtask-101': {
    //   taskId: "rqt1", 
    //   formDataId:"form1", 
    //   title: "Title1", 
    //   desc: "Nothing Much",
    //   ownerId: "owner1",
    //   statusId: "ts1", //ts1 = task status 1
    //   assList: [],
    //   logIds: []
    // }
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
    {
      id:"checkItem-1",
      formId: "R-ID-1",
      title: "Please make the Checklist part asap.",
      description: "I am trying my best.",
      sectionIndex: "1.1",
      isAssigned: false,
      isChecked: false,
    },
    {
      id:"checkItem-2",
      formId: "R-ID-1",
      title: "Complete UI tonight.",
      description: "OK",
      sectionIndex: "1.2",
      isAssigned: false,
      isChecked: false,
    },
    {
      id:"checkItem-3",
      formId: "R-ID-2",
      title: "Material UI complete",
      description: "Nothing",
      sectionIndex: "1.3",
      isAssigned: false,
      isChecked: false,
    },
  ]
}

let cId = 1
let tId = 2
let sId = 1

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
        desc: "", 
        ownerId: ownerId, 
        status: '',
        assList: [],
        subTasksList: [],
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

    editTaskDesc: (state, action) => {
      const {taskId, description} = action.payload
      state.tasks[taskId].desc = description
    },

    archiveTask: (state, action) => { // send the task id to the server and create an archive of it
      const {taskId, ownerId} = action.payload
      console.log(ownerId)
      state.columns[ownerId].taskIds.map(id => {
        if (taskId === id) {
          var filteredAry = state.columns[ownerId].taskIds.filter(function(e) { return e !== id })
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
        var filteredAry = state.archiveList.filter(function(e) { return e.id !== taskId })
        state.archiveList = filteredAry
      })
    },

    taskOwner: (state, action) => {
      const {taskId, owner} = action.payload
      state.tasks[taskId].ownerId = owner
    },

    addTaskAssignees: (state, action) => {
      const {taskId, value} = action.payload
      state.tasks[taskId].assList.push(value)
      //console.log(state.tasks[taskId].assList)
    },

    changeTaskStatus: (state, action) => {
      const { taskId, status} = action.payload
      console.log(taskId, status)
      state.taskStatuses.map(statObj => {
        if(statObj.name === status) {
          state.tasks[taskId].status = statObj.id
        }
      })
      // console.log(state.tasks[taskId].status)
    },
    
    deleteTaskAssignee: (state, action) => {
      const {taskId, person} = action.payload
      state.tasks[taskId].assList.map(name =>{
        if(name === person) {
          var filteredAry = state.tasks[taskId].assList.filter(function(e) { return e !== name })
          state.tasks[taskId].assList = filteredAry
        }
      })
      console.log(state.tasks[taskId].assList)
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
      let subId = 1

      if(state.tasks[taskId].subTasksList.length===0 || state.tasks[taskId].subTasksList === null) {
        subId = 1
      } else {
        subId = state.tasks[taskId].subTasksList.length + 1
      }

      let subObj = {
        id: `s${sId}`,
        taskId: taskId,
        statusId: "",
        assigneeId: userObj.id, 
        title: checkListObj.title, 
        description: checkListObj.description,
        sectionIndex: checkListObj.sectionIndex
      }
      state.tasks[taskId].subTasksList.push(subObj)

      state.checkListItems.map((tempObj, index) => { // the isAssigned property is set to true if a checklistItem has been assigned to an assignee
        if (tempObj.id === checkListObj.id) {
          tempObj.title = userObj.firstName + " -> " + tempObj.title
          tempObj.isAssigned = true
        }
      })
    },
  }
})
    
export const { 
  addTask, 
  editTaskDesc, 
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
} = taskdata.actions

export default taskdata.reducer