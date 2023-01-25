import {get_wordle_score} from "./game_parsers.js";
import assert from 'assert';


describe("Wordle", function(){
  it("wordle score with ios emojis", () => {
    assert.equal(3, get_wordle_score(`Wordle 585 4/6

    ⬛⬛🟨⬛🟩
    ⬛🟩⬛⬛🟩
    ⬛🟩🟩⬛🟩
    🟩🟩🟩🟩🟩`.toLowerCase()));
  });
  
  it("X wordle score with slack emojis", () => {
    assert.equal(0, get_wordle_score(`Wordle 579 X/6
    :white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:
    :white_large_square::white_large_square::large_yellow_square::large_yellow_square::large_green_square:
    :large_green_square::large_green_square::white_large_square::white_large_square::large_green_square:
    :large_green_square::large_green_square::white_large_square::white_large_square::large_green_square:
    :large_green_square::large_green_square::white_large_square::white_large_square::large_green_square:`.toLowerCase()));
  });
})

describe("Quordle", function(){
  it("quordle score with ios emojis", () => {
    assert.equal(0, get_quordle_score(`Daily Quordle 366
    :large_red_square::large_red_square:
    :large_red_square::large_red_square:
    quordle.com
    :white_large_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :white_large_square::large_yellow_square::white_large_square::white_large_square::large_yellow_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :white_large_square::large_yellow_square::white_large_square::white_large_square::large_yellow_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :white_large_square::large_yellow_square::white_large_square::white_large_square::large_yellow_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :white_large_square::large_yellow_square::white_large_square::white_large_square::large_yellow_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :white_large_square::large_yellow_square::white_large_square::white_large_square::large_yellow_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :white_large_square::large_yellow_square::white_large_square::white_large_square::large_yellow_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :white_large_square::large_yellow_square::white_large_square::white_large_square::large_yellow_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :white_large_square::large_yellow_square::white_large_square::white_large_square::large_yellow_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :white_large_square::large_yellow_square::white_large_square::white_large_square::large_yellow_square:
    :white_large_square::large_yellow_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::white_large_square::large_green_square:
    :white_large_square::large_yellow_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::white_large_square::large_green_square:
    :white_large_square::large_yellow_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::white_large_square::large_green_square:
    :white_large_square::large_yellow_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::white_large_square::large_green_square:
    :white_large_square::large_yellow_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::white_large_square::large_green_square:
    :white_large_square::large_yellow_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::white_large_square::large_green_square:
    :white_large_square::large_yellow_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::white_large_square::large_green_square:
    :white_large_square::large_yellow_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::white_large_square::large_green_square:
    `));
  });
})