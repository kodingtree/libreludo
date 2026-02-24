import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TPlayerColour } from '../../types';
import { ERRORS } from '../../utils/errors';
import type { TDice } from '../../types';

export type TDiceState = {
  dice: TDice[];
};

export const initialState: TDiceState = {
  dice: [],
};

export function getDice(state: TDiceState, colour: TPlayerColour): TDice {
  const dice = state.dice.find((d) => d.colour === colour);
  if (!dice) throw new Error(ERRORS.diceDoesNotExist(colour));
  return dice;
}

const reducers = {
  registerDice: (state: TDiceState, action: PayloadAction<TPlayerColour>) => {
    state.dice.push({
      colour: action.payload,
      diceNumber: 1,
      isPlaceholderShowing: false,
    });
  },
  setIsPlaceholderShowing: (
    state: TDiceState,
    action: PayloadAction<{ colour: TPlayerColour; isPlaceholderShowing: boolean }>
  ) => {
    const dice = getDice(state, action.payload.colour);
    dice.isPlaceholderShowing = action.payload.isPlaceholderShowing;
  },
  setDiceNumber: (
    state: TDiceState,
    action: PayloadAction<{ colour: TPlayerColour; diceNumber: number }>
  ) => {
    const dice = getDice(state, action.payload.colour);
    dice.diceNumber = action.payload.diceNumber;
  },
  clearDiceState: () => structuredClone(initialState),
};

const diceSlice = createSlice({
  name: 'dice',
  initialState,
  reducers,
});

export const {
  registerDice,
  setDiceNumber,
  setIsPlaceholderShowing,
  clearDiceState,
} = diceSlice.actions;

export default diceSlice.reducer;
