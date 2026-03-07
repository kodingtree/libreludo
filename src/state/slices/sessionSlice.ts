import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TSessionState = {
  gameStartTime: number;
  gameInactiveTime: number;
  autoRollAndMoveSinglePieceForHumans: boolean;
};

export const initialState: TSessionState = {
  gameInactiveTime: 0,
  gameStartTime: 0,
  autoRollAndMoveSinglePieceForHumans: false,
};

const reducers = {
  setGameStartTime: (state: TSessionState, action: PayloadAction<number>) => {
    state.gameStartTime = action.payload;
  },
  addToGameInactiveTime: (state: TSessionState, action: PayloadAction<number>) => {
    state.gameInactiveTime += action.payload;
  },
  setAutoRollAndMoveSinglePieceForHumans: (
    state: TSessionState,
    action: PayloadAction<boolean>
  ) => {
    state.autoRollAndMoveSinglePieceForHumans = action.payload;
  },
  clearSessionState: () => structuredClone(initialState),
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers,
});

export const {
  setGameStartTime,
  addToGameInactiveTime,
  setAutoRollAndMoveSinglePieceForHumans,
  clearSessionState,
} = sessionSlice.actions;

export default sessionSlice.reducer;
