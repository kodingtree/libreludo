import React, { useCallback, useEffect, useRef } from 'react';
import { registerNewPlayer, setPlayerSequence } from '../../../../state/slices/playersSlice';
import { type TPlayerColour } from '../../../../types';
import Board from '../Board/Board';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../state/store';
import { registerDice } from '../../../../state/slices/diceSlice';
import { handlePostDiceRollThunk } from '../../../../state/thunks/handlePostDiceRollThunk';
import GameFinishedScreen from '../GameFinishedScreen/GameFinishedScreen';
import { changeTurnThunk } from '../../../../state/thunks/changeTurnThunk';
import { useMoveAndCaptureToken } from '../../../../hooks/useMoveAndCaptureToken';
import type { TPlayerInitData } from '../../../../types';
import { useNavigate } from 'react-router-dom';
import { playerCountToWord } from '../../../../game/players/logic';
import bg from '../../../../assets/bg.jpg';
import { usePageLeaveBlocker } from '../../../../hooks/usePageLeaveBlocker';
import {
  addToGameInactiveTime,
  setAutoRollAndMoveSinglePieceForHumans,
  setGameStartTime,
} from '../../../../state/slices/sessionSlice';
import { rollDiceThunk } from '../../../../state/thunks/rollDiceThunk';
import styles from './Game.module.css';

export const EXIT_MESSAGE = 'Are you sure you want to exit? Any progress made will be lost.';

type Props = {
  initData: TPlayerInitData[];
};

function Game({ initData }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const boardTileSize = useSelector((state: RootState) => state.board.boardTileSize);
  const {
    playerSequence,
    isGameEnded,
    playerFinishOrder,
    currentPlayerColour,
    players,
    isAnyTokenMoving,
  } = useSelector((state: RootState) => state.players);
  const { autoRollAndMoveSinglePieceForHumans, awaitingManualMoveColour } = useSelector(
    (state: RootState) => state.session
  );
  const { dice } = useSelector((state: RootState) => state.dice);
  const playersRegisteredInitiallyRef = useRef(true);
  const gameInactiveStartTime = useRef(0);
  const navigate = useNavigate();
  const moveAndCapture = useMoveAndCaptureToken();
  usePageLeaveBlocker(!isGameEnded && import.meta.env.PROD);
  useEffect(() => {
    if (initData.length === 0) return;
    dispatch(setPlayerSequence({ playerCount: playerCountToWord(initData.length) }));
    dispatch(setGameStartTime(Date.now()));
  }, [dispatch, initData.length]);

  useEffect(() => {
    if (initData.length === 0) return;
    for (let i = 0; i < initData.length; i++) {
      if (!playerSequence.length || !playersRegisteredInitiallyRef.current) return;
      dispatch(
        registerNewPlayer({
          name: initData[i].name,
          colour: playerSequence[i],
          isBot: initData[i].isBot,
        })
      );
      dispatch(registerDice(playerSequence[i]));
    }
    playersRegisteredInitiallyRef.current = false;
  }, [dispatch, playerSequence, initData]);

  useEffect(() => {
    const handlePageVisibilityChange = () => {
      if (isGameEnded) return;
      if (document.hidden) {
        gameInactiveStartTime.current = Date.now();
      } else {
        const now = Date.now();
        dispatch(addToGameInactiveTime(now - gameInactiveStartTime.current));
      }
    };
    document.addEventListener('visibilitychange', handlePageVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handlePageVisibilityChange);
  }, [dispatch, isGameEnded]);

  useEffect(() => {
    if (currentPlayerColour || players.length === 0 || initData.length === 0) return;
    dispatch(changeTurnThunk(moveAndCapture));
  }, [currentPlayerColour, dispatch, initData.length, moveAndCapture, players.length]);

  const handleDiceRoll = useCallback(
    (colour: TPlayerColour, diceNumber: number) => {
      if (initData.length === 0) return;
      dispatch(
        handlePostDiceRollThunk(colour, diceNumber, moveAndCapture, {
          autoMoveSinglePieceForHuman: autoRollAndMoveSinglePieceForHumans,
        })
      );
    },
    [autoRollAndMoveSinglePieceForHumans, dispatch, initData.length, moveAndCapture]
  );

  useEffect(() => {
    if (
      !autoRollAndMoveSinglePieceForHumans ||
      !currentPlayerColour ||
      awaitingManualMoveColour !== null ||
      isGameEnded ||
      isAnyTokenMoving
    )
      return;
    const currentPlayer = players.find((p) => p.colour === currentPlayerColour);
    const currentDice = dice.find((d) => d.colour === currentPlayerColour);
    if (!currentPlayer || !currentDice || currentPlayer.isBot) return;
    if (currentPlayer.tokens.some((t) => t.isActive)) return;
    if (currentDice.isPlaceholderShowing) return;
    if (players.some((p) => p.tokens.some((t) => t.isActive))) return;
    dispatch(rollDiceThunk(currentPlayerColour, (diceNumber) => handleDiceRoll(currentPlayerColour, diceNumber)));
  }, [
    autoRollAndMoveSinglePieceForHumans,
    awaitingManualMoveColour,
    currentPlayerColour,
    dice,
    dispatch,
    handleDiceRoll,
    isAnyTokenMoving,
    isGameEnded,
    players,
  ]);

  const handleExitBtnClick = () => navigate('/');

  return (
    <div
      className={styles.game}
      style={
        {
          '--board-tile-size': `${boardTileSize}px`,
          backgroundImage: `url(${bg})`,
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        aria-label="Exit button"
        className={styles.exitBtn}
        onClick={handleExitBtnClick}
      >
        &times;
      </button>
      <label className={styles.autoPlayToggle}>
        <input
          type="checkbox"
          checked={autoRollAndMoveSinglePieceForHumans}
          onChange={(e) => dispatch(setAutoRollAndMoveSinglePieceForHumans(e.target.checked))}
        />
        Auto roll + auto move single piece
      </label>
      <Board onDiceClick={handleDiceRoll} />
      {isGameEnded && <GameFinishedScreen playerFinishOrder={playerFinishOrder} />}
    </div>
  );
}

export default Game;
