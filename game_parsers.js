const MAX_WORDLE_SCORE = 7;
const MAX_WORLDLE_SCORE = 7;
const MAX_QUORDLE_SCORE = 10;
const MAX_COUNTRYLE_SCORE = 196;

const get_wordle_score = (lowercase_txt) => {
  const wordle_ind = lowercase_txt.indexOf("wordle");
  if(wordle_ind === -1){ return [-1, -1]; }
  const sp1 = lowercase_txt.indexOf(" ", wordle_ind);
  const sp2 = lowercase_txt.indexOf(" ", sp1+1);
  const day = lowercase_txt.substring(sp1+1, sp2);
  const score_text = lowercase_txt.substring(sp2+1, sp2+2);
  return [day, score_text === 'x' ? 0 : MAX_WORDLE_SCORE - parseInt(score_text)];
}

const get_quordle_score = (lowercase_txt) => {
  const quordle_ind = lowercase_txt.indexOf("quordle");
  if(quordle_ind === -1){ return [-1, -1]; }
  const sp1 = lowercase_txt.indexOf(" ", quordle_ind);
  const col = lowercase_txt.indexOf(":", sp1+1);
  const day = lowercase_txt.substring(sp1+1, col);
  const score_emojis = lowercase_txt.substring(col, lowercase_txt.indexOf("quordle.com")).split(":")
  let total_score = 0;
  for(let emoji of score_emojis){
    if(emoji.length === 0) continue;
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
  }
  return [day, 4*MAX_QUORDLE_SCORE - total_score]
}

const get_worldle_score = (lowercase_txt) => {
  const worldle_ind = lowercase_txt.indexOf("#worldle");
  if(worldle_ind === -1){ return [-1, -1]; }
  const sp1 = lowercase_txt.indexOf(" ", worldle_ind);
  const sp2 = lowercase_txt.indexOf(" ", sp1+1);
  const day = lowercase_txt.substring(sp1+2, sp2);
  const score_text = lowercase_txt.substring(sp2+1, sp2+2);
  return [day, score_text === 'x' ? 0 : MAX_WORLDLE_SCORE - parseInt(score_text)];
}

const get_countryle_score = (lowercase_txt) => {
  const countryle_ind = lowercase_txt.indexOf("#countryle");
  if(countryle_ind === -1){ return [-1, -1]; }
  const sp1 = lowercase_txt.indexOf(" ", countryle_ind);
  const nl = lowercase_txt.indexOf("\n", sp1+1);
  const day = lowercase_txt.substring(sp1+1, nl);
  const score_ind = lowercase_txt.indexOf(" tries");
  const score_text = lowercase_txt.substring(score_ind-1, score_ind);
  return [day, score_text === 'x' ? 0 : MAX_COUNTRYLE_SCORE - parseInt(score_text)];
}

export {
  get_wordle_score,
  get_worldle_score,
  get_quordle_score,
  get_countryle_score
}