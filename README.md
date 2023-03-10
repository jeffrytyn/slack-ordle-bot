# slack-ordle-bot
Slack bot for tracking scores of -ordle games.<br>
Supported games are
- Wordle
- Worldle
- Quordle
- Countryle

## Setup
1. Create a new Slack app
2. Create a bot user in **OAuth and Permissions** and enable `chat:write`, `commands` scopes.
3. Create 2 slash commands corresponding to the `ordle-stat` and `ordle-top` functions.
4. Host the functions/API somewhere (I used [Netlify Functions](https://www.netlify.com/products/functions/) for a serverless approach).
5. Connect the slash commands to the hosted functions.
6. Enable **Event Subscriptions** and set the Request URL to the url for the `ordle-add` function.
7. Subscribe the bot to `message.channels`, `message.im`.
9. Create a [Firestore](https://firebase.google.com/docs/firestore) database, create a new web app, and set each attribute of the [config object](https://firebase.google.com/docs/web/learn-more#config-object) as an environment variable.
10. Add your Slack app signing secret as an environment variable.

## Point Calculations
Wordle: 7 - number of guesses<br>
Worldle: 7- number of guesses<br>
Quordle: 40 - total number of guesses<br>
Countryle: 196 - number of guesses<br>

## How To Use 
Paste the sharing text generated by the game into a public channel with OrdleBot.

<img width="401" alt="Screen Shot 2023-01-26 at 2 47 51 PM" src="https://user-images.githubusercontent.com/42385584/214935417-d7f4ab1b-bb79-49ed-b6d1-f811f7d1d9ab.png">

## Slash Commands
For this section, the Slack slash command for `orlde-stat` will be `/oadd` and `ordle-top` will be `/otop`, and so on.

### `/ostat <game>`
Displays the total score and number of days played by the message sender for `<game>`.

### `/otop <game> <num=5>`
Displays the top `<num>` players and their scores for `<game>`.<br>
If no value for `<num>` is provided, a default value of `5` is used.

## Adding New Games
To add support for new games, you'll need to make a function that parses out the sharing text into the day of the game and a score. This function can live in `game_parsers.js`. You'll then to need to edit `ordle-add.js` to include the game as well.
