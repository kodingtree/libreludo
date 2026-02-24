import { setDiceNumber, setIsPlaceholderShowing } from '../slices/diceSlice';
import type { TPlayerColour } from '../../types';
import type { AppDispatch, RootState } from '../store';
import { playSoundEffect } from '../../utils/soundEffects';

const DICE_PLACEHOLDER_DELAY = 225;

export function rollDiceThunk(colour: TPlayerColour, onDiceRoll: (diceNumber: number) => void) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().players.isGameEnded) return;
    dispatch(setIsPlaceholderShowing({ colour, isPlaceholderShowing: true }));
    playSoundEffect('diceRoll');
    setTimeout(() => {
      const dice = getState().dice.dice.find((d) => d.colour === colour);
      const diceNumber = Math.floor(Math.random() * 6) + 1;
      dispatch(setIsPlaceholderShowing({ colour, isPlaceholderShowing: false }));
      dispatch(setDiceNumber({ colour, diceNumber }));
      if (dice) onDiceRoll(diceNumber);
    }, DICE_PLACEHOLDER_DELAY);
  };
}
