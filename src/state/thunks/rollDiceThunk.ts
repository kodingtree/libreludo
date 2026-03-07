import { setDiceNumber, setIsPlaceholderShowing } from '../slices/diceSlice';
import type { TPlayerColour } from '../../types';
import type { AppDispatch, RootState } from '../store';
import { playSoundEffect } from '../../utils/soundEffects';

const DICE_PLACEHOLDER_DELAY = 225;

export function rollDiceThunk(colour: TPlayerColour, onDiceRoll: (diceNumber: number) => void) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { players, currentPlayerColour, isAnyTokenMoving, isGameEnded } = state.players;
    const { awaitingManualMoveColour } = state.session;
    const dice = state.dice.dice.find((d) => d.colour === colour);
    const player = players.find((p) => p.colour === colour);
    const hasAnyActiveToken = players.some((p) => p.tokens.some((t) => t.isActive));

    if (
      isGameEnded ||
      !player ||
      !dice ||
      currentPlayerColour !== colour ||
      isAnyTokenMoving ||
      hasAnyActiveToken ||
      dice.isPlaceholderShowing ||
      awaitingManualMoveColour !== null
    ) {
      return;
    }
    dispatch(setIsPlaceholderShowing({ colour, isPlaceholderShowing: true }));
    playSoundEffect('diceRoll');
    setTimeout(() => {
      const freshState = getState();
      const activeDice = freshState.dice.dice.find((d) => d.colour === colour);
      const activePlayer = freshState.players.players.find((p) => p.colour === colour);
      const isTurnStillValid = freshState.players.currentPlayerColour === colour;
      const diceNumber = Math.floor(Math.random() * 6) + 1;
      if (!activeDice || !activePlayer || !isTurnStillValid || freshState.players.isGameEnded) {
        if (activeDice?.isPlaceholderShowing) {
          dispatch(setIsPlaceholderShowing({ colour, isPlaceholderShowing: false }));
        }
        return;
      }
      dispatch(setIsPlaceholderShowing({ colour, isPlaceholderShowing: false }));
      dispatch(setDiceNumber({ colour, diceNumber }));
      onDiceRoll(diceNumber);
    }, DICE_PLACEHOLDER_DELAY);
  };
}
