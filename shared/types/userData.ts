export type GameUserData = {
  currentStreak: number;
  bestStreak: number;
  totalPlayed: number;
  totalWins: number;
  averageGuesses: number;
  guessDistribution: number[]; // Array of 6 numbers representing wins in 1-6 guesses
}

export type RedditUserData = {
  username: string;
  userId: string;
}