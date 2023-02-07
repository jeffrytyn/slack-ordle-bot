import {get_wordle_score, get_quordle_score, get_worldle_score, get_countryle_score} from "./game_parsers.js";
import assert from 'assert';


describe("Wordle", function(){
  it(("phrase with wordle"), () => {
    const [day, score] = get_wordle_score("wordle sucks")
    assert.equal("", day);
    assert.equal(-1, score);
  });

  it(("number wordle score"), () => {
    const [day, score] = get_wordle_score("wordle 579 1/6\n".toLowerCase())
    assert.equal("579", day);
    assert.equal(6, score);
  })
  
  it("X wordle score", () => {
    const [day, score] = get_wordle_score(`Wordle 579 X/6
    :white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:
    :white_large_square::white_large_square::large_yellow_square::large_yellow_square::large_green_square:
    :large_green_square::large_green_square::white_large_square::white_large_square::large_green_square:
    :large_green_square::large_green_square::white_large_square::white_large_square::large_green_square:
    :large_green_square::large_green_square::white_large_square::white_large_square::large_green_square:`.toLowerCase())
    assert.equal("579", day);
    assert.equal(0 , score);
  });
})

describe("Worldle", function(){
  it("phrase with worldle", () => {
    const [day, score] = get_worldle_score("worldle this is a phrase with worldle")
    assert.equal("", day);
    assert.equal(-1, score);
  })

  it("number worldle score", () => {
    const [day, score] = get_worldle_score(`#worldle #360 1/6 (100%)
    :large_green_square::large_green_square::large_green_square::large_green_square::large_green_square::tada:
    https://worldle.teuteuf.fr`.toLowerCase())
    assert.equal("360", day);
    assert.equal(6, score);
  });
  
  it("X worldle score", () => {
    const [day, score] = get_worldle_score(`#worldle #100 X/6 (83%)
    :white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:
    :white_large_square::white_large_square::large_yellow_square::large_yellow_square::large_green_square:
    :large_green_square::large_green_square::white_large_square::white_large_square::large_green_square:
    :large_green_square::large_green_square::white_large_square::white_large_square::large_green_square:
    :large_green_square::large_green_square::white_large_square::white_large_square::large_green_square:`.toLowerCase())
    assert.equal("100", day);
    assert.equal(0 , score);
  });
})

describe("Quordle", function(){
  it("X quordle score", () => {
    const [day, score] = get_quordle_score(`Daily Quordle 366
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
    `.toLowerCase())
    assert.equal("366", day);
    assert.equal(0, score);
  });

  it("number quordle score", () => {
    const [day, score] = get_quordle_score(`Daily Quordle 360
    :six::seven:
    :four::five:
    quordle.com
    :white_large_square::large_green_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::large_yellow_square::white_large_square::white_large_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::large_green_square: :white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:
    :large_yellow_square::white_large_square::white_large_square::white_large_square::large_yellow_square: :large_green_square::white_large_square::white_large_square::white_large_square::large_green_square:
    :large_yellow_square::white_large_square::white_large_square::white_large_square::white_large_square: :large_green_square::large_green_square::white_large_square::white_large_square::white_large_square:
    :white_large_square::white_large_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::white_large_square::white_large_square:
    :large_green_square::large_green_square::large_green_square::large_green_square::large_green_square: :white_large_square::white_large_square::large_yellow_square::large_green_square::white_large_square:
    :black_large_square::black_large_square::black_large_square::black_large_square::black_large_square: :large_green_square::large_green_square::large_green_square::large_green_square::large_green_square:
    :white_large_square::white_large_square::large_yellow_square::large_green_square::large_green_square: :white_large_square::white_large_square::white_large_square::large_green_square::large_yellow_square:
    :white_large_square::large_yellow_square::white_large_square::white_large_square::white_large_square: :white_large_square::white_large_square::white_large_square::large_yellow_square::white_large_square:
    :large_green_square::white_large_square::white_large_square::white_large_square::white_large_square: :white_large_square::large_green_square::white_large_square::white_large_square::white_large_square:
    :large_green_square::large_green_square::large_green_square::large_green_square::large_green_square: :white_large_square::white_large_square::white_large_square::large_green_square::large_yellow_square:
    :black_large_square::black_large_square::black_large_square::black_large_square::black_large_square: :large_green_square::large_green_square::large_green_square::large_green_square::large_green_square:
    `.toLowerCase());
    assert.equal("360", day);
    assert.equal(40-22, score);

  });
})

describe("Countryle", function(){
  it("number countryle score", () => {
    const [day, score] = get_countryle_score(`#Countryle 327
    Guessed in 2 tries.
    :large_green_circle::large_green_circle::white_circle::white_circle::white_circle:
    :large_green_circle::large_green_circle::large_green_circle::large_green_circle::large_green_circle:
    https://countryle.com`.toLowerCase());
    assert.equal("327", day);
    assert.equal(196-2, score);
  })
});
