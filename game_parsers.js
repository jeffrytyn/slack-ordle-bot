const MAX_WORDLE_SCORE = 7;
const MAX_WORLDLE_SCORE = 7;
const MAX_QUORDLE_SCORE = 10;
const MAX_COUNTRYLE_SCORE = 7;

const get_wordle_score = (lowercase_txt) => {
  if(lowercase_txt.includes("wordle")){
    const slash_ind = lowercase_txt.indexOf("/");
    const score_text = lowercase_txt.substring(slash_ind-1, slash_ind);
    return (score_text === 'x') ? 0 : MAX_WORDLE_SCORE - parseInt(score_text);
  }else{
    return -1;
  }
}

const get_quordle_score = (lowercase_txt) => {
  if(lowercase_txt.includes("quordle")){
    const score_text = lowercase_txt.substring(lowercase_txt.indexOf(":"), lowercase_txt.indexOf("quordle.com"));
    const slack_emoji_texts = score_text.split(":");
  }else{
    return -1;
  }
}

const get_worldle_score = (lowercase_txt) => {
  if(lowercase_txt.includes("worldle")){
    const slash_ind = lowercase_txt.indexOf("/");
    const score_text = lowercase_txt.substring(slash_ind-1, slash_ind);
    return (score_text === 'x') ? 0 : MAX_WORLDLE_SCORE - parseInt(score_text);
  }else{
    return -1;
  }
}

const get_countryle_score = (lowercase_txt) => {
  if(lowercase_txt.includes("countryle")){
    const score_ind = lowercase_txt.indexOf(" tries");
    const score_text = lowercase_txt.substring(score_ind-1, score_ind);
    return (score_text === 'x') ? 0 : MAX_COUNTRYLE_SCORE - parseInt(score_text);
  }else{
    return -1;
  }
}

export {
  get_wordle_score,
  get_worldle_score,
  get_quordle_score,
  get_countryle_score
}