import { describe, expect, it } from 'vitest';
import diceReducer, {
  clearDiceState,
  getDice,
  initialState,
  registerDice,
  setDiceNumber,
  setIsPlaceholderShowing,
  type TDiceState,
} from '../../src/state/slices/diceSlice';
import type { TDice } from '../../src/types';

describe('Test dice slice reducers', () => {
  describe('registerDice', () => {
    it('should register a new die for the given player color', () => {
      const newState = diceReducer(initialState, registerDice('blue'));
      expect(newState.dice).toHaveLength(1);
      expect(newState.dice[0]).toEqual({
        colour: 'blue',
        diceNumber: 1,
        isPlaceholderShowing: false,
      } as TDice);
    });
  });
  describe('setIsPlaceholderShowing', () => {
    it('should update isPlaceholderShowing for the specified player color', () => {
      const newState = diceReducer(
        diceReducer(initialState, registerDice('blue')),
        setIsPlaceholderShowing({ colour: 'blue', isPlaceholderShowing: true })
      );
      expect(newState.dice[0].isPlaceholderShowing).toBe(true);
    });
  });
  describe('setDiceNumber', () => {
    it('should update the dice number for the specified player colour', () => {
      const state = diceReducer(initialState, registerDice('blue'));
      const newState = diceReducer(state, setDiceNumber({ colour: 'blue', diceNumber: 6 }));
      expect(getDice(newState, 'blue').diceNumber).toBe(6);
    });
  });
  describe('clearDiceState', () => {
    it('should clear dice state', () => {
      const initState: TDiceState = {
        dice: [
          { colour: 'blue', diceNumber: 1, isPlaceholderShowing: false },
          { colour: 'green', diceNumber: 1, isPlaceholderShowing: false },
        ],
      };

      expect(diceReducer(initState, clearDiceState())).toEqual(initialState);
    });
  });
});

describe('Test dice helpers', () => {
  describe('getDice', () => {
    it('should return the dice matching the specified player color', () => {
      const state: TDiceState = {
        dice: [
          { colour: 'blue', diceNumber: 1, isPlaceholderShowing: false },
          { colour: 'green', diceNumber: 1, isPlaceholderShowing: false },
        ],
      };

      expect(getDice(state, 'blue')).toEqual(state.dice[0]);
    });
    it('should throw an error if no dice matches the specified player color', () => {
      const state: TDiceState = {
        dice: [
          { colour: 'blue', diceNumber: 1, isPlaceholderShowing: false },
          { colour: 'green', diceNumber: 1, isPlaceholderShowing: false },
        ],
      };
      expect(() => getDice(state, 'white' as never)).toThrowError();
    });
    it('should throw an error if the dice state is empty', () => {
      expect(() => getDice(initialState, 'blue')).toThrowError();
    });
  });
});
