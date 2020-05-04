import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from '../../helpers'

/**
  A temporary initial state has been created to test with the components and render meaningful
  on the screen. The action creators in the reducer are responsible for implementing the changes 
  that the user makes when editing the task.
*/

const task = { //sample input for fetch task API
  taskId: 'c3',
  title: "Hello World",
  description: "OK",
  ownerId: 1,
  statusId: 3,
  logs: [],
  archive: false,
  createdAt: "",
  updatedAt: ""
}

const sampleCheckList = [
  {
    checklistId: 1,
    description: "Finish Me",
    sectionIndex: "",
  },
  {
    checklistId: 2,
    description: "Hello World",
    sectionIndex: "",
  },
  {
    checklistId: 3,
    description: "What scene",
    sectionIndex: "",
  }
]

const sampleState = {
  archiveList: [
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
      title: "Code",
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

const initialState = {
  archiveList: [],
  checkList: [],
  taskList: [],
  subTaskIds: [],
  isPending: false,
  error: null
}

export const fetchTaskManager = createAsyncThunk(
  'taskData/fetchTaskManager',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 

    return sampleState.taskList
    //{}
    return await apiCaller('/api/task-manager/fetch', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    //	{taskList: [reqTaskObjFull/cusTaskObjFull]}
    /*
    {taskId: "String", title: "String", description: "String", submissionId: Number, ownerId: Number, 
    statusId: Number, subtasks:**: [subtaskObj2]}, logs: [logObj], archive: Boolean, createdAt: Date, updatedAt: Date}
    
    {title*: "String", description*: "String", ownerId*: Number, statusId*: Number}
    */
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

    return {task, archiveObj}
    //{taskId: "String"}
    return await apiCaller('/api/task-manager/task/fetch', {taskId}, 200, 
    (data) => {
      
    }, 
    rejectWithValue)  
    //{task: reqTaskObjFull/cusTaskObjFull}
    /*
    {taskId: "String", title: "String", description: "String", submissionId: Number, ownerId: Number, 
    statusId: Number, subtasks:**: [subtaskObj2]}, logs: [logObj], archive: Boolean, createdAt: Date, updatedAt: Date}
    
    {title*: "String", description*: "String", ownerId*: Number, statusId*: Number}
    */
  }
)

export const fetchCheckList = createAsyncThunk(
  'taskData/fetchCheckList',
  async (IdObj, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 
    
    const data = sampleCheckList

    return {IdObj, data}

    return await apiCaller('/api/submission/fetch-list', {}, 200, 
    (data) => {
      
    }, rejectWithValue)    
  }
)

export const fetchArchiveList = createAsyncThunk(
  'taskData/fetchArchiveList',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 
    return sampleState.archiveList

    //TBD
    return await apiCaller('/api/task-manager/fetch-archive', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    //{taskList: [taskDetailsObj]}
    //{taskId: "String", ownerId: Number, createdAt: Date, updatedAt: Date}
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
    // {task*: reqTaskObj}
    // {title*: "String", description*: "String", submissionId*: Number, ownerId*: Number, statusId*: Number, checklists**: [checklistObj]}
    return {data, reqTaskObject}
    return await apiCaller('/api/task-manager/task/req/create', {}, 201, 
    (data) => {
      
    }, rejectWithValue)  
    //{taskId: "String", subtasks: [subtaskObj2**], newLogs: [logObj]}
    //{subtaskId: Number, assigneeId: Number, description: "String", check: Boolean, createdAt: Date, updatedAt: Date}
    //{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}
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
    //{task*: cusTaskObj}
    //{title*: "String", description*: "String", ownerId*: Number, statusId*: Number}
    return await apiCaller('/api/task-manager/task/cus/create', {}, 201, 
    (data) => {
      
    }, rejectWithValue)  
    //{taskId: "String", newLogs: [logObj]}
    //{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}
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
    //{taskId*: "String", description*: "String"}
    return await apiCaller('/api/task-manager/log/add', {}, 201, 
    (data) => {
      
    }, rejectWithValue)  
    
    //{logId: Number, createdAt: Date, updatedAt: Date}
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
    // } else { //if subtask then don't do anything here but in the edit request task API
    // }

    return {data, editTaskObject}
    //{task*: editReqTaskObj}
    //{task*: editCusTaskObj}
    /*
    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, 
    subtasks**: [subtaskObj]}, archive**: Boolean}
    subtaskObj == {subtaskId*: Number, assigneeId**: Number, description**: "String", check**: Boolean}

    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, archive**: Boolean}
    */
    return await apiCaller('/api/task-manager/task/req/edit', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    
    //{newLog: logObj, subTaskIds**: [Number]}
    //{newLog: logObj}
    //{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}
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
    //{task*: editReqTaskObj}
    //{task*: editCusTaskObj}
    /*
    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, 
    subtasks**: [subtaskObj]}, archive**: Boolean}
    subtaskObj == {subtaskId*: Number, assigneeId**: Number, description**: "String", check**: Boolean}

    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, archive**: Boolean}
    */
    return await apiCaller('/api/task-manager/task/req/edit', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    
    //{newLog: logObj, subTaskIds**: [Number]}
    //{newLog: logObj}
    //{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}
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
    
    //{task*: editReqTaskObj}
    //{task*: editCusTaskObj}
    /*
    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, 
    subtasks**: [subtaskObj]}, archive**: Boolean}
    subtaskObj == {subtaskId*: Number, assigneeId**: Number, description**: "String", check**: Boolean}

    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, archive**: Boolean}
    */
    return
    return await apiCaller('/api/task-manager/task/req/edit', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  

    //{newLog: logObj, subTaskIds**: [Number]}
    //{newLog: logObj}
    //{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}
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

    //{task*: editReqTaskObj}
    //{task*: editCusTaskObj}
    /*
    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, 
    subtasks**: [subtaskObj]}, archive**: Boolean}
    subtaskObj == {subtaskId*: Number, assigneeId**: Number, description**: "String", check**: Boolean}

    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, archive**: Boolean}
    */
    return await apiCaller('/api/task-manager/task/req/edit', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    
    //{newLog: logObj, subTaskIds**: [Number]}
    //{newLog: logObj}
    //{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}
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
    
    //{task*: editReqTaskObj}
    //{task*: editCusTaskObj}
    /*
    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, 
    subtasks**: [subtaskObj]}, archive**: Boolean}
    subtaskObj == {subtaskId*: Number, assigneeId**: Number, description**: "String", check**: Boolean}

    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, archive**: Boolean}
    */
    return await apiCaller('/api/task-manager/task/req/edit', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    
    //{newLog: logObj, subTaskIds**: [Number]}
    //{newLog: logObj}
    //{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}
    
  }
)

export const linkFormToTask = createAsyncThunk( // only for request task
  'taskData/linkFormToTask',
  // if submission passed to the edit request task API, then get response main subTaskIds and store them
  async (submissionObj, { rejectWithValue }) => {
    const { taskId, submissionId } = submissionObj
    
    const data = {
      newLogs: [],
      subTaskIds: [1,2,3,4]
    }
    
    // call the "/api/task-manager/task/req/edit" API
    // send the taskId and the submissionId to backend in either case
    // data = {
    // newLogs: [],
    // }

    return {data, submissionObj}

    //{task*: editReqTaskObj}
    //{task*: editCusTaskObj}
    /*
    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, 
    subtasks**: [subtaskObj]}, archive**: Boolean}
    subtaskObj == {subtaskId*: Number, assigneeId**: Number, description**: "String", check**: Boolean}

    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, archive**: Boolean}
    */
    return await apiCaller('/api/task-manager/task/req/edit', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    
    //{newLog: logObj, subTaskIds**: [Number]}
    //{newLog: logObj}
    //{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}
  }
)

const taskdata = createSlice({
  name: 'taskData',
  initialState: initialState,
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

    unArchiveTask: (state, action) => { // on getting the archive tasks from server,
      // also get the taskOwner id with it so then adding task back to column is simple, for now hard-coding the column
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

    subTaskDisplay: (state, action) => {
      const {taskId} = action.payload

      state.taskList.map(subtaskObj => {
        if (subtaskObj.taskId === taskId) { // get the subtask Obj from the task list
          state.taskList.map(taskObj => {
            if (taskObj.taskId === subtaskObj.assTaskId) { // get the task obj from task list to which the sub task is associated
              taskObj.subTasks.map(assSubTask => {
                if (assSubTask.taskId === taskId) { // get the subtask form the task that is same as the current subtask
                  assSubTask.check = false
                  subtaskObj.check = false
                }
              })
            }
          })
        }
      })
    }
  },

  extraReducers: {
    [fetchTaskManager.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchTaskManager.fulfilled]: (state, action) => {
      state.taskList = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId[0] === 'r' && taskObj.subTasks.length !== 0) {
          taskObj.subTasks.map(subObj => {
            state.taskList.push(subObj)
          })
        }
      })
      
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
      const {IdObj, data} = action.payload
      state.checkList = data

      let subTaskObj = {}
      
      state.checkList.map(checkObj => {
        var subTaskId = state.subTaskIds.splice(0, 1) // get the every first id in the array
        console.log(checkObj)
        var subTaskDesc = checkObj.description
        state.taskList.map(taskObj => {
          if (taskObj.taskId === IdObj.taskId) {
            subTaskObj = {
              taskId: `s${subTaskId}`,
              assTaskId: IdObj.taskId, //associated taskId (task to which this subtask is associated with)
              ownerId: taskObj.ownerId,
              assigneeId: taskObj.ownerId,
              description: subTaskDesc,
              check: true
            }
            taskObj.subTasks.push(subTaskObj)
          }
        })
        state.taskList.push(subTaskObj)
      })
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
      
      if (editTaskObject.taskId[0] === 's') {
        state.taskList.map(taskObj => {
          if (taskObj.taskId === editTaskObject.taskId) {
            state.taskList.map(assTaskObj => {
              if(assTaskObj.taskId === taskObj.assTaskId) {
                assTaskObj.subTasks.map(assSubTask => {
                  if (assSubTask.taskId === editTaskObject.taskId) {
                    assSubTask.ownerId = editTaskObject.dstColumnId
                    assSubTask.assigneeId = editTaskObject.dstColumnId
                    taskObj.ownerId = editTaskObject.dstColumnId
                  }
                })
              }
            })
          }
        })
      } else {
        state.taskList.map(taskObj => {
          if(taskObj.taskId === editTaskObject.taskId) {
            taskObj.ownerId = editTaskObject.dstColumnId
            taskObj.logs = data.newLogs
          }
        })
      }
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
          state.subTaskIds = data.subTaskIds
        }
      })
      console.log(state.subTaskIds)
    },
    [linkFormToTask.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})

export const {
  archiveTask, 
  unArchiveTask,
  addTaskAssignees,
  deleteTaskAssignee,
  subTaskDisplay
} = taskdata.actions

export default taskdata.reducer