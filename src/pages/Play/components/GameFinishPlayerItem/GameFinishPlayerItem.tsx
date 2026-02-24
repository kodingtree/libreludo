import { type TPlayer, type TPlayerColour } from '../../../../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../state/store';
import { AnimatePresence, motion } from 'framer-motion';
import { playerColours } from '../../../../game/players/constants';
import styles from './GameFinishPlayerItem.module.css';

type Props = {
  rank: number;
  name: string;
  colour: TPlayerColour;
  isLast: boolean;
};

function getTimeString(startTime: number, finishTime: number, inactiveTime: number): string {
  if (finishTime === -1 || startTime === -1 || inactiveTime === -1) return '00:00';
  const diff = Math.abs(finishTime - startTime - inactiveTime);
  const minutes = diff / 1000 / 60;
  const seconds = diff / 1000 - Math.floor(minutes) * 60;
  const minutesStr = Math.floor(minutes).toString().padStart(2, '0');
  const secondsStr = Math.floor(seconds).toString().padStart(2, '0');
  return `${minutesStr}:${secondsStr}`;
}

function getOrdinalRank(rank: number): string {
  const mod100 = rank % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${rank}th`;
  switch (rank % 10) {
    case 1:
      return `${rank}st`;
    case 2:
      return `${rank}nd`;
    case 3:
      return `${rank}rd`;
    default:
      return `${rank}th`;
  }
}

function GameFinishPlayerItem({ colour, isLast, name, rank }: Props) {
  const { players } = useSelector((state: RootState) => state.players);
  const { gameStartTime, gameInactiveTime } = useSelector((state: RootState) => state.session);
  const { playerFinishTime } = players.find((p) => p.colour === colour) as TPlayer;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.gameFinishPlayerItem}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: rank * 0.1 }}
      >
        <span className={styles.rankBadge}>{getOrdinalRank(rank)}</span>
        <span
          className={styles.playerColourDot}
          style={{ backgroundColor: playerColours[colour] }}
        ></span>
        <span className={styles.gameFinishPlayerName}>{name}</span>
        <span className={styles.gameFinishTime}>
          {isLast ? '--:--' : getTimeString(gameStartTime, playerFinishTime, gameInactiveTime)}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

export default GameFinishPlayerItem;
