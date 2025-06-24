/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { getMessageThunk, getPartners, sendMessageThunk } from "./message.thunk";

const initialState = {
  buttonLoading: false,
  screenLoading: false,
  messages: {}, // store messages per partner
  onlineUsers: [],
  partners: [],
  selectedPartner: null,
    partnersWithLastMessages: [],
   
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
   markMessagesSeen: (state, action) => {
  const { receiverId } = action.payload;

  if (!state.messages[receiverId]) return;

  state.messages[receiverId] = state.messages[receiverId].map((msg) => {
    // Only mark messages sent *by* that partner and not already seen
    if (!msg.seen && msg.senderId === receiverId) {
      return { ...msg, seen: true };
    }
    return msg;
  });
},

 addMessage: (state, action) => {
    const newMsg = action.payload;
    const partnerId = newMsg.senderId === state.currentUserId ? newMsg.receiverId : newMsg.senderId;

    if (!state.messages[partnerId]) {
      state.messages[partnerId] = [];
    }
    state.messages[partnerId].push(newMsg);

    // Now move that partner to top in partners array
    const partnerIndex = state.partners.findIndex(p => {
      const id = p.isNgo ? p.createdBy : p._id;
      return id === partnerId;
    });

    if (partnerIndex > -1) {
      const [partner] = state.partners.splice(partnerIndex, 1);
      state.partners.unshift(partner);
    }
  },

   setPartnersWithLastMessages(state, action) {
      state.partnersWithLastMessages = action.payload;
    },
    setNewMessage: (state, action) => {
      const receiverId = action.payload?.receiverId;
      const msgs = action.payload?.messages ?? [];

      if (!state.messages[receiverId]) {
        state.messages[receiverId] = [];
      }

      state.messages[receiverId].push(...msgs);
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    addPartner: (state, action) => {
      const exists = state.partners?.some(p => p._id === action.payload._id);
      if (!exists) state.partners.push(action.payload);
    },

    setSelectedPartner: (state, action) => {
      state.selectedPartner = action.payload;
    }
  },

  extraReducers: (builder) => {
    // send message
    builder.addCase(sendMessageThunk.pending, (state) => {
      state.buttonLoading = true;
    });

    builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
      const newMsg = action.payload?.responseData;
      const receiverId = action.meta?.arg?.receiverId;

      if (receiverId && newMsg) {
        if (!state.messages[receiverId]) {
          state.messages[receiverId] = [];
        }

        state.messages[receiverId].push(newMsg);
      }

      state.buttonLoading = false;
    });

    builder.addCase(sendMessageThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // get messages
    builder.addCase(getMessageThunk.pending, (state) => {
      state.buttonLoading = true;
    });

   builder.addCase(getMessageThunk.fulfilled, (state, action) => {
  const receiverId = action.meta?.arg?.receiverId;
  const msgs = action.payload?.messages ?? [];

  if (receiverId) {
    state.messages[receiverId] = msgs; // replace old messages with fetched messages
  }
  state.buttonLoading = false;
});


    builder.addCase(getMessageThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // get partners
    builder.addCase(getPartners.pending, (state) => {
      state.screenLoading = true;
    });

    builder.addCase(getPartners.fulfilled, (state, action) => {
      state.partners = action.payload?.partners ?? [];
      state.screenLoading = false;
    });

    builder.addCase(getPartners.rejected, (state) => {
      state.screenLoading = false;
    });
  }
});

export const { setNewMessage, setOnlineUsers, addPartner, setSelectedPartner , markMessagesSeen ,setPartnersWithLastMessages , addMessage} = messageSlice.actions;
export default messageSlice.reducer;
