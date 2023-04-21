const MAX_WORDLE_SCORE = 7;
const MAX_WORLDLE_SCORE = 7;
const MAX_DUMBLE_SCORE = 7;
const MAX_QUORDLE_SCORE = 10;
const MAX_COUNTRYLE_SCORE = 196;

export const get_wordle_score = (lowercase_txt) => {
  const reg = /^wordle (\d+) ([x1-6])\/6\n/
  const matches = lowercase_txt.match(reg);
  if(!matches) return ["", -1];
  const day = matches[1];
  const score_text = matches[2];
  return [day, score_text === 'x' ? 0 : MAX_WORDLE_SCORE - parseInt(score_text)];
}

export const get_quordle_score = (lowercase_txt) => {
  const reg = /^daily quordle (\d+)\n((?:\s*[:_a-z]+\n){2})/
  const matches = lowercase_txt.match(reg);
  if(!matches) return ["", -1];
  const day = matches[1];
  const score_emojis = matches[2].replace(/\s+/g,'').split(":")
  let total_score = 0;
  for(let emoji of score_emojis){
    if(emoji.length === 0 || emoji === " ") continue;
    if(emoji === "large_red_square"){ total_score += 10; }
    else if(emoji === "one") { total_score += 1; }
    else if(emoji === "two") { total_score += 2; }
    else if(emoji === "three") { total_score += 3; }
    else if(emoji === "four") { total_score += 4; }
    else if(emoji === "five") { total_score += 5; }
    else if(emoji === "six") { total_score += 6; }
    else if(emoji === "seven") { total_score += 7; }
    else if(emoji === "eight") { total_score += 8; }
    else if(emoji === "nine") { total_score += 9; }
    else {return ["", -1]};    
  }
  return [day, 4*MAX_QUORDLE_SCORE - total_score]
}

export const get_worldle_score = (lowercase_txt) => {
  const reg = /^(?:<#C.*?\|worldle>|#worldle) #(\d+) ([x1-6])\/6 \((?:100%|[1-9]\d?%|0%)\)/
  const matches = lowercase_txt.match(reg);
  if(!matches) return ["", -1];
  const day = matches[1];
  const score_text = matches[2];
  return [day, score_text === 'x' ? 0 : MAX_WORLDLE_SCORE - parseInt(score_text)];
}

export const get_countryle_score = (lowercase_txt) => {
  const reg = /^(?:<#C.*?\|countryle>|#countryle) (\d+)\s+guessed in (\d+) tries./
  const matches = lowercase_txt.match(reg);
  if(!matches) return ["", -1];
  const day = matches[1];
  const score_text = matches[2];
  return [day, score_text === 'x' ? 0 : MAX_COUNTRYLE_SCORE - parseInt(score_text)];
}

export const get_dumble_score = (lowercase_txt) => {
  const reg = /^dumble (\d+) ([x1-6])\/6\n/
  const matches = lowercase_txt.match(reg);
  if(!matches) return ["", -1];
  const day = matches[1];
  const score_text = matches[2];
  return [day, score_text === 'x' ? 0 : MAX_DUMBLE_SCORE - parseInt(score_text)];
}

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const get_year_UTC = () => {
  return new Date().getUTCFullYear();
}

const BASE_DATE = new Date("2023-04-20");
export const GAME_INFO = {
  "wordle": {
    "parser": get_wordle_score,
    "day_number": 670,
  },
  "worldle": {
    "parser": get_worldle_score,
    "day_number": 454,
  },
  "quordle": {
    "parser": get_quordle_score,
    "day_number": 451,
  },
  "countryle": {
    "parser": get_countryle_score,
    "day_number": 425,
  },
  "dumble": {
    "parser": get_dumble_score,
    "day_number": 474,
  }
}

const get_game_day = (date, game_name) => {
  return Math.floor((date-BASE_DATE)/1000/60/60/24) + GAME_INFO[game_name].day_number;
}
export const is_valid_day = (game_name, submitted_day) => {
  const valid_day = get_game_day(Date.now(), game_name);
  return {valid_day, res: Math.abs(valid_day - submitted_day) <= 1};
}

export const SUPPORTED_GAMES = new Set(Object.keys(GAME_INFO));