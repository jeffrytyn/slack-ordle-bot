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
3. Create 3 slash commands corresponding to the `ordle-add`, `ordle-stat`, `ordle-top` functions.
4. Host the functions/API somewhere (I used [Netlify Functions](https://www.netlify.com/products/functions/) for a serverless approach).
5. Connect the slash commands to the corresponding functions.
6. Give your bot a helpful description
7. Create a [Firestore](https://firebase.google.com/docs/firestore) database, create a new web app, and set the [config info](https://firebase.google.com/docs/web/learn-more#config-object) as environment variables.
8. Place your Slack app signing secret as an environment variable.

## Point Calculations
Wordle: 7 - number of guesses<br>
Worldle: 7- number of guesses<br>
Quordle: 40 - total number of guesses<br>
Countryle: 196 - number of guesses<br>

## Slash Commands
For this section, the Slack slash command for `orlde-add` will be `/oadd`, `ordle-stat` will be `/ostat`, and so on.
### `/oadd <text>`
`<text>` should be the text copied from the game when you want to share your result e.g.<br>
>Wordle 586 1/6
>
>🟩🟩🟩🟩🟩

### `/ostat <game>`
Displays the total score and number of days played by the Slack user for `<game>`

### `/otop <game> <num=5>`
Displays the top `<num>` players and their scores for `<game>`.<br>
If no value for `<num>` is provided, a default value of `5` is used.

## Adding New Games
To add support for new games, you'll need to make a function that parses out the sharing text into the day of the game and a score. This function can live in `game_parsers.js`. You'll then to need to edit `ordle-add` to include the game as well.
