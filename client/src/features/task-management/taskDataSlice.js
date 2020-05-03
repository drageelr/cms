import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/**
  A temporary initial state has been created to test with the components and render meaningful
  on the screen. The action creators in the reducer are responsible for implementing the changes 
  that the user makes when editing the task.
*/

const archiveList = [
  {
    taskId: "r2",
    ownerId: 1,
    createdAt: "",
    updatedAt: "20/10/2020",
  },
  {
    taskId: "c2",
    ownerId: 2,
    createdAt: "",
    updatedAt: "17/03/2019",
  }
]

const task = {
  taskId: 'c3',
  title: "Hello World",
  description: "Main hoon jian, main hoon bara",
  ownerId: 1,
  statusId: 3,
  logs: [],
  archive: false,
  createdAt: "",
  updatedAt: ""
}

const sampleState = {
  archiveList: [],

  checkList: [
    {
      checklistId: 1,
      description: "Finish Me",
      sectionIndex: "",
      isChecked: false, // this attribute is added to each checklist object when fetched from an API CALL
    }
  ],

  taskList : [ // fetch Task Manager
    {
      taskId: 'r1',
      title: "Fix TM",
      description: "",
      submissionId: -1,
      ownerId: 1,
      statusId: 1,
      subTasks: [],
      logs: [],
      archive: false,
      createdAt: "",
      updatedAt: ""
    },
    {
      taskId: 'c1',
      title: "Bharwapa Laga Rakha hai",
      description: "",
      ownerId: 2,
      statusId: 2,
      logs: [],
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

export const fetchTask = createAsyncThunk(
  'taskData/fetchTask',
  async (archiveObj, { getState, rejectWithValue }) => {
    const {taskId, ownerId} = archiveObj
    
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 
    console.log(task, archiveObj)
    return {task, archiveObj}
  }
)

export const fetchCheckList = createAsyncThunk(
  'taskData/fetchCheckList',
  async (submissionId, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 

    return ''
  }
)

export const fetchArchiveList = createAsyncThunk(
  'taskData/fetchArchiveList',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 

    return archiveList
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

export const createNewLog = createAsyncThunk(
  'taskData/createNewLog',
  async (logObj, { rejectWithValue }) => {
    const { taskId, creatorId, description } = logObj
    
    const data = {
      logId: 1,
      createdAt: "20/08/2020",
      updatedAt: ""
    }

    return {data, logObj}
  }
)

export const moveTask = createAsyncThunk(
  'taskData/moveTask',
  async (editTaskObject, { rejectWithValue }) => {
    const { taskId, srcColumnId, dstColumnId } = editTaskObject
    
    const data = {
      newLogs: [],
    }
    
    //if(taskId[0] === 'r') { //come to the subtask move later
      // call the "/api/task-manager/task/req/edit" API
      // send the taskId and the dstColumnId to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // } else if (taskId[0] === 'c') {
      // call the "/api/task-manager/task/cus/edit" API
      // send the taskId and the dstColumnId to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // }
    return {data, editTaskObject}
  }
)

export const taskOwnerChange = createAsyncThunk(
  'taskData/taskOwnerChange',
  async (ownerChangeObj, { rejectWithValue }) => {
    const { taskId, owner } = ownerChangeObj
    
    const data = {
      newLogs: [],
    }
    
    //if(taskId[0] === 'r') {
      // call the "/api/task-manager/task/req/edit" API
      // send the taskId and the ownerId to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // } else if (taskId[0] === 'c') {
      // call the "/api/task-manager/task/cus/edit" API
      // send the taskId and the ownerId to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // }
    return {data, ownerChangeObj}
  }
)

export const updateTitle = createAsyncThunk(
  'taskData/updateTitle',
  async (titleObj, { rejectWithValue }) => {
    const { taskId, newTitle } = titleObj
    
    const data = {
      newLogs: [],
    }
    
    //if(taskId[0] === 'r') {
      // call the "/api/task-manager/task/req/edit" API
      // send the taskId and the newTitle to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // } else if (taskId[0] === 'c') {
      // call the "/api/task-manager/task/cus/edit" API
      // send the taskId and the newTitle to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // }
    return {data, titleObj}
  }
)

export const updateDescription = createAsyncThunk(
  'taskData/updateDescription',
  async (descObj, { rejectWithValue }) => {
    const { taskId, description } = descObj
    
    const data = {
      newLogs: [],
    }
    
    //if(taskId[0] === 'r') {
      // call the "/api/task-manager/task/req/edit" API
      // send the taskId and the description to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // } else if (taskId[0] === 'c') {
      // call the "/api/task-manager/task/cus/edit" API
      // send the taskId and the description to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // }
    return {data, descObj}
  }
)

export const changeTaskStatus = createAsyncThunk(
  'taskData/changeTaskStatus',
  async (statusObj, { rejectWithValue }) => {
    const { taskId, statusId } = statusObj
    
    const data = {
      newLogs: [],
    }
    
    //if(taskId[0] === 'r') {
      // call the "/api/task-manager/task/req/edit" API
      // send the taskId and the statusId to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // } else if (taskId[0] === 'c') {
      // call the "/api/task-manager/task/cus/edit" API
      // send the taskId and the statusId to backend in either case
    //   data = {
    //     newLogs: [],
    //   }
    // }
    return {data, statusObj}
  }
)

export const linkFormToTask = createAsyncThunk( // only for request task
  'taskData/linkFormToTask',
  async (submissionObj, { rejectWithValue }) => {
    const { taskId, submissionId } = submissionObj
    
    const data = {
      newLogs: [],
    }
    
    // call the "/api/task-manager/task/req/edit" API
    // send the taskId and the submissionId to backend in either case
    // data = {
    // newLogs: [],
    // }
    return {data, submissionObj}
  }
)

export const changeCheckStatus = createAsyncThunk( // only for request task
  'taskData/changeCheckStatus',
  async (checkItemObj, { rejectWithValue }) => {
    const { taskId, checkListObj, submissionId, status } = checkItemObj
    
    const data = {
      newLogs: [],
    }
    
      // call the "/api/task-manager/task/req/edit" API
      // send the taskId and the submissionId to backend in either case
      // data = {
      // newLogs: [],
  
    return {data, checkItemObj}
  }
)

let sId = 0

const taskdata = createSlice({
  name: 'taskData',
  initialState: sampleState,
  reducers: {
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

    unArchiveTask: (state, action) => { // when i get the archive tasks from server, i will also get the taskOwner id with it so then adding task back to column is simple, for now hardcoding the column
      const {taskId,ownerId} = action.payload 

      state.columns[ownerId].taskIds.push(taskId) // put the task back in owners list
      state.archiveList.map(id => {
        var filteredAry = state.archiveList.filter(function(e) { return e.id != taskId })
        state.archiveList = filteredAry
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

    createSubTask : (state, action) => {
      const {taskId, subTaskDesc} = action.payload

      let subTaskObj = {}

      sId +=1
      state.taskList.map(taskObj => {
        if (taskObj.taskId === taskId) {
          subTaskObj = {
            taskId: `s${sId}`,
            ownerId: taskObj.ownerId,
            assigneeId: taskObj.ownerId,
            description: subTaskDesc,
            check: false
          }
          taskObj.subTasks.push(subTaskObj)
        }
      })
      console.log(subTaskObj)
      state.taskList.push(subTaskObj)
    },
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

    [fetchCheckList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchCheckList.fulfilled]: (state, action) => {
      // set state.checkList = list received from backend
      // add an additional field for checklist, isChecked (boolean)
    },
    [fetchCheckList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [fetchArchiveList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchArchiveList.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.archiveList = action.payload
      }
    },
    [fetchArchiveList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [fetchTask.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchTask.fulfilled]: (state, action) => { // works for unarchive too as it fetches and pushes the task obj to the list
      const {task, archiveObj} = action.payload
      console.log(task, archiveObj)
      state.taskList.push(task)   
      
      // state.archiveList.map(obj => {
      //   var filteredAry = state.archiveList.filter(function(e) { return e.obj.taskId !== archiveObj.taskId })
      //   state.archiveList = filteredAry
      // })
    },
    [fetchTask.rejected]: (state, action) => {
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

    [createNewLog.fulfilled]: (state, action) => {
      const { data, logObj } = action.payload
      
      state.taskList.map(taskObj => {
        if(taskObj.taskId === logObj.taskId) {
          taskObj.logs.push({
            logId: data.logId,
            creatorId: logObj.creatorId,
            description: logObj.logText,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          })
        }
      })
    },
    [createNewLog.rejected]: (state, action) => {
      state.error = action.payload
    },

    [moveTask.fulfilled]: (state, action) => {
      const { data, editTaskObject } = action.payload
      
      console.log(data, editTaskObject)
      state.taskList.map(taskObj => {
        if(taskObj.taskId === editTaskObject.taskId) {
          taskObj.ownerId = editTaskObject.dstColumnId
          taskObj.logs = data.newLogs
        }
      })
    },
    [moveTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [taskOwnerChange.fulfilled]: (state, action) => {
      const {data, ownerChangeObj} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === ownerChangeObj.taskId) {
          taskObj.ownerId = ownerChangeObj.owner
          taskObj.logs = data.newLogs
        }
      })
    },
    [taskOwnerChange.rejected]: (state, action) => {
      state.error = action.payload
    },

    [updateTitle.fulfilled]: (state, action) => {
      const {data, titleObj} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === titleObj.taskId) {
          taskObj.title = titleObj.newTitle
          taskObj.logs = data.newLogs
        }
      })
    },
    [updateTitle.rejected]: (state, action) => {
      state.error = action.payload
    },

    [updateDescription.fulfilled]: (state, action) => {
      const {data, descObj} = action.payload

      state.taskList.map(taskObj => {
        if (taskObj.taskId === descObj.taskId) {
          taskObj.description = descObj.description
          taskObj.logs = data.newLogs
        }
      })
    },
    [updateDescription.rejected]: (state, action) => {
      state.error = action.payload
    },

    [changeTaskStatus.fulfilled]: (state, action) => {
      const {data, statusObj} = action.payload

      state.taskList.map(taskObj => {
        if(taskObj.taskId === statusObj.taskId) {
          taskObj.statusId = statusObj.statusId
          taskObj.logs = data.newLogs
        }
      })
    },
    [changeTaskStatus.rejected]: (state, action) => {
      state.error = action.payload
    },

    [linkFormToTask.fulfilled]: (state, action) => {
      const {data, submissionObj} = action.payload

      state.taskList.map(taskObj => {
        if (taskObj.taskId === submissionObj.taskId) {
          taskObj.submissionId = submissionObj.submissionId
          taskObj.logs = data.newLogs
        }
      })
    },
    [linkFormToTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [changeCheckStatus.fulfilled]: (state, action) => {
      const { data, checkItemObj} = action.payload
      
      state.checkList.map(objCheck => {
        if (checkItemObj.checkListObj.checklistId === objCheck.checklistId) {
          objCheck.isChecked = checkItemObj.status
          state.taskList.map(taskObj => {
            if(taskObj.taskId === checkItemObj.taskId) {
              taskObj.logs = data.newLogs
            }
          })
        }
      })
    },
    [changeCheckStatus.rejected]: (state, action) => {
      state.error = action.payload
    }
  }
})

export const {
  archiveTask, 
  unArchiveTask,
  addTaskAssignees,
  deleteTaskAssignee,
  createSubTask,
} = taskdata.actions

export default taskdata.reducer