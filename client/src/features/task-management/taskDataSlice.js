import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from '../../helpers'

/**
  A temporary initial state has been created to test with the components and render meaningful
  on the screen. The action creators in the reducer are responsible for implementing the changes 
  that the user makes when editing the task.
*/

const initialState = {
  archiveList: [],
  checkList: [],
  taskList: [],
  subTaskIds: [],
  checklistAssignees: [],
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

    return await apiCaller('/api/task-manager/fetch', {}, 200, 
    (data) =>(data), 
    rejectWithValue)  
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

    return await apiCaller('/api/task-manager/task/fetch', { taskId }, 200, 
    (data) => ({data, archiveObj}), 
    rejectWithValue)  
  }
)

export const fetchCheckList = createAsyncThunk(
  'taskData/fetchCheckList',
  async (idObj, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 
    const { ownerId, submissionId } = idObj
    
    return await apiCaller('/api/form/fetch-checklist', { submissionId }, 200, 
    (data) => ({data, idObj}), rejectWithValue)    
  }
)

export const fetchArchiveList = createAsyncThunk(
  'taskData/fetchArchiveList',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 
    return {}

    //TBD
    return await apiCaller('/api/task-manager/fetch-archive', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    //{taskList: [taskDetailsObj]}
    //{taskId: "String", ownerId: Number, createdAt: Date, updatedAt: Date}
  }
)

export const createRequestTask = createAsyncThunk( // GIVES INTERNAL SERVER ERROR
  'taskData/createRequestTask',
  async (reqTaskObject, { getState, rejectWithValue }) => {
    const { title, description, submissionId, ownerId, statusId } = reqTaskObject
    const checklistIds = getState().taskData.checklistAssignees

    console.log(checklistIds)

    return await apiCaller('/api/task-manager/task/req/create', {
      task: {
        title,
        description,
        submissionId,
        ownerId,
        statusId,
        checklistIds
      }
    }, 201, 
    (data) => ({data, reqTaskObject}), 
    rejectWithValue)  
  }
)

export const createCustomTask = createAsyncThunk(
  'taskData/createCustomTask',
  async (cusTaskObject, { rejectWithValue }) => {
    const { title, description, ownerId, statusId } = cusTaskObject

    return await apiCaller('/api/task-manager/task/cus/create', {
      task: {
        title: title,
        description: description,
        ownerId: ownerId,
        statusId: statusId
      }
    }, 201, 
    (data) => ({data, cusTaskObject}), 
    rejectWithValue)
  }
)

export const createNewLog = createAsyncThunk(
  'taskData/createNewLog',
  async (logObj, { rejectWithValue }) => {
    const { taskId, creatorId, logText } = logObj
  
    return await apiCaller('/api/task-manager/log/add', {
      taskId: taskId,
      description: logText
    }, 201, 
    (data) => ({data, logObj}), 
    rejectWithValue)  
  }
)

export const moveTask = createAsyncThunk(
  'taskData/moveTask',
  async (editTaskObject, { rejectWithValue }) => {
    const { taskId, srcColumnId, dstColumnId } = editTaskObject

    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        ownerId: Number(dstColumnId)
      }
    }, 200, 
    (data) => ({data, editTaskObject}), 
    rejectWithValue)
  }
)

export const moveSubTask = createAsyncThunk(
  'taskData/moveSubTask',
  async (subTaskObject, { getState, rejectWithValue }) => {
    const { mainTaskId, subTaskList } = subTaskObject

    return await apiCaller('/api/task-manager/task/req/edit', {
      task: {
        taskId: mainTaskId,
        subTasks: subTaskList
      }
    }, 200, 
    (data) => ({data, mainTaskId}), 
    rejectWithValue)
  }
)

export const taskOwnerChange = createAsyncThunk(
  'taskData/taskOwnerChange',
  async (ownerChangeObj, { rejectWithValue }) => {
    const { taskId, owner } = ownerChangeObj
    console.log(ownerChangeObj) 

    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        ownerId: Number(owner)
      }
    }, 200, 
    (data) => ({data, ownerChangeObj}), 
    rejectWithValue)
  }
)

export const updateTitle = createAsyncThunk(
  'taskData/updateTitle',
  async (titleObj, { rejectWithValue }) => {
    const { taskId, newTitle } = titleObj

    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        title: newTitle
      }
    }, 200, 
    (data) => ({data, titleObj}), 
    rejectWithValue)
  }
)

export const updateDescription = createAsyncThunk(
  'taskData/updateDescription',
  async (descObj, { rejectWithValue }) => {
    const { taskId, desc } = descObj
    
    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        description: desc
      }
    }, 200, 
    (data) => ({data, descObj}), 
    rejectWithValue)
  }
)

export const changeTaskStatus = createAsyncThunk(
  'taskData/changeTaskStatus',
  async (statusObj, { rejectWithValue }) => {
    const { taskId, statusId } = statusObj
    
    return await apiCaller(taskId[0] === 'r' ? '/api/task-manager/task/req/edit' : '/api/task-manager/task/cus/edit', {
      task: {
        taskId: taskId,
        statusId: statusId
      }
    }, 200, 
    (data) => ({data, statusObj}), 
    rejectWithValue)   
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
                if (assSubTask.taskId === taskId) { // get the subtask from the task that is same as the current subtask
                  assSubTask.check = false
                  subtaskObj.check = false
                }
              })
            }
          })
        }
      })
    },

    editSubTask: (state, action) => {
      const {taskId, srcColumnId, dstColumnId} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === taskId) { // get the subtask in the taskList
          state.taskList.map(assTaskObj => {
            if(assTaskObj.taskId === taskObj.assTaskId) { // get the task whose subtask is this subtask
              assTaskObj.subTasks.map(assSubTask => {
                if (assSubTask.taskId === taskId) {
                  assSubTask.ownerId = dstColumnId
                  assSubTask.assigneeId = dstColumnId
                  taskObj.ownerId = dstColumnId
                }
              })
            }
          })
        }
      })
    },

    moveTaskSync: (state, action) => {
      const editTaskObject = action.payload

      state.taskList.forEach(taskObj => {
        if(taskObj.taskId === editTaskObject.taskId) {
          taskObj.ownerId = Number(action.payload.dstColumnId)
        }
      })
    },

    clearError: (state, action) => {
      state.error = null
    }
  },

  extraReducers: {
    [fetchTaskManager.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchTaskManager.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.taskList = action.payload.taskList
        
        // state.taskList.map(taskObj => {
        //   if (taskObj.taskId[0] === 'r' && taskObj.subTasks.length !== 0) {
        //     taskObj.subTasks.map(subObj => {
        //       state.taskList.push(subObj)
        //     })
        //   }
        // })
      }
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
      if (state.isPending === true) {
        state.isPending = false
        const {idObj, data} = action.payload
        state.checkList = data.checklists

        state.checklistAssignees = data.checklists.map(checklistItem => ({
            checklistId: checklistItem.checklistId, 
            assigneeId: idObj.ownerId
          })
        )
      }
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
      const {data, archiveObj} = action.payload

      console.log(data)
      //state.taskList.push(task)   
      
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
      console.log(action.payload)
      // let subTaskObj = {}
      
      // state.checkList.map(checkObj => {
      //   var subTaskId = state.subTaskIds.splice(0, 1) // get the every first id in the array
      //   var subTaskDesc = checkObj.description
      //   state.taskList.map(taskObj => {
      //     if (taskObj.taskId === IdObj.taskId) {
      //       subTaskObj = {
      //         taskId: `s${subTaskId}`,
      //         subtaskId: subTaskId,
      //         assTaskId: IdObj.taskId, //associated taskId (task to which this subtask is associated with)
      //         ownerId: taskObj.ownerId,
      //         assigneeId: taskObj.ownerId,
      //         description: subTaskDesc,
      //         check: true
      //       }
      //       taskObj.subTasks.push(subTaskObj)
      //     }
      //   })
      //   state.taskList.push(subTaskObj)
      // })

      state.taskList.push({
        taskId: action.payload.data.taskId,
        logs: action.payload.data.logs,
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
        logs: action.payload.data.logs,
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
      const {data, editTaskObject} = action.payload

      state.taskList.forEach(taskObj => {
        if(taskObj.taskId === editTaskObject.taskId) {
          taskObj.logs.push(data.newLog)
        }
      })
    },

    [moveTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [moveSubTask.fulfilled]: (state, action) => {
      const { data, mainTaskId } = action.payload
      
      state.taskList.map(taskObj => {
        if(taskObj.taskId === mainTaskId) {
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [moveSubTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [taskOwnerChange.fulfilled]: (state, action) => {
      const {data, ownerChangeObj} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === ownerChangeObj.taskId) {
          taskObj.ownerId = ownerChangeObj.owner
          taskObj.logs.push(data.newLog)
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
          taskObj.logs.push(data.newLog)
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
          taskObj.description = descObj.desc
          taskObj.logs.push(data.newLog)
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
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [changeTaskStatus.rejected]: (state, action) => {
      state.error = action.payload
    },

  }
})

export const {
  archiveTask, 
  unArchiveTask,
  addTaskAssignees,
  deleteTaskAssignee,
  subTaskDisplay, 
  editSubTask,
  moveTaskSync,
  clearError
} = taskdata.actions

export default taskdata.reducer