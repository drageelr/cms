import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/**
  A temporary initial state has been created to test with the components and render meaningful
  on the screen. The action creators in the reducer are responsible for implementing the changes 
  that the user makes when editing the task.
*/

const initialState = {

  archiveList: [],// fetch this list when required

  taskList : [ // fetch Task Manager
    {
      taskId: 'r1',
      title: "Fix TM",
      description: "",
      submissionId: -1,
      ownerId: 1,
      statusId: 1,
      subTasks: [
        {
          subTaskId: 1,
          assigneeId: 1,
          description: "",
          check: false
        }
      ],
      logs: [
        {
          logId: 1,
          creatorId: 1,
          description: "",
          createdAt: "",
          updatedAt: ""
        }
      ],
      archive: false,
      createdAt: "",
      updatedAt: ""
    },
    {
      taskId: 'c1',
      title: "Bharwapa Laga Rakha hai",
      description: "",
      submissionId: 1,
      ownerId: 2,
      statusId: 2,
      logs: [
        {
          logId: 1,
          creatorId: 1,
          description: "",
          createdAt: "",
          updatedAt: ""
        }
      ],
      archive: false,
      createdAt: "",
      updatedAt: ""
    }
  ],

  isPending: false,
  error: null,
}

export const fetchTaskManager = createAsyncThunk(
  'taskData/fetchTaskManager',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 

    return ''
  }
)

export const createRequestTask = createAsyncThunk(
  'taskData/createRequestTask',
  async (reqTaskObject, { rejectWithValue }) => {
    const { title, description, submissionId, ownerId, statusId } = reqTaskObject

    const data = {
      taskId: "rn",
      subTaskIds: [],
      newLogs: []
    }

    return {data, reqTaskObject}
  }
)

export const createCustomTask = createAsyncThunk(
  'taskData/createCustomTask',
  async (cusTaskObject, { rejectWithValue }) => {
    const { title, description, ownerId, statusId } = cusTaskObject

    const data = {
      taskId: "cn",
      newLogs: []
    }

    return {data, cusTaskObject}
  }
)

let sId = 0
let lId = 1

const taskdata = createSlice({
  name: 'taskData',
  initialState: initialState,
  reducers: {
    moveTask: (state, action) => {
      const { srcColumnId, srcIndex, dstColumnId, dstIndex, taskId } = action.payload
      
      // probably call the edit API as we want to update the ownerID of the task

      state.taskList.map(taskObj => {
        if(taskObj.taskId === taskId) {
          taskObj.ownerId = dstColumnId
        }
      })
    },
    
    updateTitle: (state, action) => {
      const {taskId, newTitle} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === taskId) {
          taskObj.title = newTitle
        }
      })
    },

    updateDescription: (state, action) => {
      const {taskId, description} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === taskId) {
          taskObj.description = description 
        }
      })
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
      const {taskId, ownerId} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === taskId) {
          taskObj.ownerId = ownerId
        }
      })
    },

    changeTaskStatus: (state, action) => {
      const { taskId, statusId} = action.payload

      state.taskList.map(taskObj => {
        if(taskObj.taskId === taskId) {
          taskObj.statusId = statusId
        }
      })
    },

    linkFormToTask : (state, action) => {
      const {taskId, requestId} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === taskId) {
          taskObj.submissionId = requestId
        }
      })
    },

    addTaskAssignees: (state, action) => {
      const {taskId, value} = action.payload
      
      state.tasks[taskId].assigneeList.push(value)
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
  },
  extraReducers: {
    [fetchTaskManager.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchTaskManager.fulfilled]: (state, action) => {
      // set state.taskList = list received from backend
      
      // if we wish to store the columnOrder in the redux else, frontend storage is fine
      // let tempColumnOrder = []
      // state.taskList.map(taskObj => {
      //   tempColumnOrder.push(taskObj.ownerId) // this will give me an array with all the columns associated to tasks with duplications
      // })
      // state.columnOrder = Array.from(new Set(tempColumnOrder)) // this sets the columnOrder === to an array with unique columnIds
    },
    [fetchTaskManager.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [createRequestTask.fulfilled]: (state, action) => {
      state.taskList.push({
        taskId: action.payload.data.taskId,
        logs: action.payload.data.newLogs,
        subTasks: action.payload.data.subTaskIds,
        ...action.payload.reqTaskObject
      })
      state.error = 'Request Task Created'
    },
    [createRequestTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [createCustomTask.fulfilled]: (state, action) => {
      state.taskList.push({
        taskId: action.payload.data.taskId,
        logs: action.payload.data.newLogs,
        ...action.payload.cusTaskObject
      })
      state.error = 'Custom Task Created'
    },
    [createCustomTask.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})
    
export const {  
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