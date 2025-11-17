import { combineReducers } from "@reduxjs/toolkit";
import ticketsReducer from "../api/tickets/ticketsSlice";
import authReducer from "../api/auth/authSlice";
import aiSuggestionReducer from "../api/tickets/aiSuggestionSlice";
import ticketDetailReducer from "../api/tickets/ticketDetailSlice";
import ticketStatsReducer from "../api/tickets/ticketStatsSlice";
import filesReducer from "../api/files/filesSlice";
import profileReducer from "../api/profile/profileSlice";
import notificationsReducer from "../api/notifications/notificationsSlice";
import usersReducer from "../api/users/usersSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  tickets: ticketsReducer,
  ticketDetail: ticketDetailReducer,
  aiSuggestion: aiSuggestionReducer,
  ticketStats: ticketStatsReducer,
  files: filesReducer,
  profile: profileReducer,
  notifications: notificationsReducer,
  users: usersReducer,
});

export default rootReducer;
