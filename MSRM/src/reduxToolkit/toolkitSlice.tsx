import { createSlice } from "@reduxjs/toolkit";


const toolkitSlice = createSlice({
    name: "toolkit",
    initialState: {
        draftID: null,
        search: "",
        type: '',
    },
    reducers: {
        saveDraftMissionID(state, action) {
            state.draftID = action.payload
        },
        saveSearch(state, action) {
            state.search = action.payload
        },
        saveFilterType(state, action) {
            state.type = action.payload
        }
    }
})

export default toolkitSlice.reducer

export const { saveDraftMissionID, saveSearch, saveFilterType } = toolkitSlice.actions;