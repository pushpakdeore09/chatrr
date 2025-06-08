import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export interface UserState {
  user: User | null;
}

const storedUser = localStorage.getItem("user");
const token = localStorage.getItem("token");

let parsedUser: User | null = null;

if (storedUser && token) {
  try {
    parsedUser = {
      ...JSON.parse(storedUser),
      token,
    };
  } catch (error) {
    console.error("Failed to parse user:", error);
  }
}

const initialState: UserState = {
  user: parsedUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
