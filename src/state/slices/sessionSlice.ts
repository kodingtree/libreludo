import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TPlayerColour } from '../../types';

type TSessionState = {
  gameStartTime: number;
  gameInactiveTime: number;
  autoRollAndMoveSinglePieceForHumans: boolean;
  awaitingManualMoveColour: TPlayerColour | null;
};

export const initialState: TSessionState = {
  gameInactiveTime: 0,
  gameStartTime: 0,
  autoRollAndMoveSinglePieceForHumans: false,
  awaitingManualMoveColour: null,
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
    if (!action.payload) state.awaitingManualMoveColour = null;
  },
  setAwaitingManualMoveColour: (
    state: TSessionState,
    action: PayloadAction<TPlayerColour | null>
  ) => {
    state.awaitingManualMoveColour = action.payload;
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
  setAwaitingManualMoveColour,
  clearSessionState,
} = sessionSlice.actions;

export default sessionSlice.reducer;
