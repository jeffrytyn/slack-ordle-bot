const MAX_WORDLE_SCORE = 7;
const MAX_WORLDLE_SCORE = 7;
const MAX_QUORDLE_SCORE = 10;
const MAX_COUNTRYLE_SCORE = 196;

const get_wordle_score = (lowercase_txt) => {
  const reg = /^wordle (\d+) ([x1-6])\/6\n/
  const matches = lowercase_txt.match(reg);
  if(!matches) return ["", -1];
  const day = matches[1];
  const score_text = matches[2];
  return [day, score_text === 'x' ? 0 : MAX_WORDLE_SCORE - parseInt(score_text)];
}

const get_quordle_score = (lowercase_txt) => {
  const reg = /^daily quordle (\d+)\n((?:\s*[:_a-z]+\n){2})\s*quordle.com/
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

const get_worldle_score = (lowercase_txt) => {
  const reg = /^(?:<#C.*?\|worldle>|#worldle) #(\d+) ([x1-6])\/6 \((?:100%|[1-9]\d?%|0%)\)/
  const matches = lowercase_txt.match(reg);
  if(!matches) return ["", -1];
  const day = matches[1];
  const score_text = matches[2];
  return [day, score_text === 'x' ? 0 : MAX_WORLDLE_SCORE - parseInt(score_text)];
}

const get_countryle_score = (lowercase_txt) => {
  const reg = /^(?:<#C.*?\|countryle>|#countryle) (\d+)\s+Guessed in (\d+) tries./
  const matches = lowercase_txt.match(reg);
  if(!matches) return ["", -1];
  const day = matches[1];
  const score_text = matches[2];
  return [day, score_text === 'x' ? 0 : MAX_COUNTRYLE_SCORE - parseInt(score_text)];
}

export {
  get_wordle_score,
  get_worldle_score,
  get_quordle_score,
  get_countryle_score
}