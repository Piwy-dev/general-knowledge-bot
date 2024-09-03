# General Knowledge Bot
General Knowledge Bot is a bot discord about general knowledge. It offers many features and commands to test your general knowledge with your server members. Each time a member uses a test command, he earns points if he answers correctly and loses points in the oposite case. These points and other options are saved in a database. For more information, please refer to our [terms of services](https://byp-studio.pyhaubruge.repl.co/terms-of-services.html) and [privacy policy](https://byp-studio.pyhaubruge.repl.co/privacy-policy.html).

### Multilingual
This bot supports 3 languages : French, English and Dutch : [see how to configure](#configuration-commands)

### Add the bot
Add the bot to your server : [link](https://discord.com/api/oauth2/authorize?client_id=803979491373219840&permissions=8&scope=applications.commands%20bot)

## Commands list
### Test commands
1. `/truefalse` send you a message containing a proposition. Once done you can click on the apropriate button depanding if you think the proposition is true or false.
2. `/flag` sends you a message containing a flag. Once done you can enter the name of the country that correspond to the flag by clicking on the button at the bottom of the message.
3. `/capital` sends you a message containing a contry name. Once done you can enter the name of the country's capital by clicking on the button at the bottom of the message.
4. `/logo` sends you a message containing a logo. Once done you can enter the name of the company that has this logo by clicking on the button at the bottom of the message.

### Irregular verbs commands
1. `/verbs-list` send a message containing the list off all verbs in function of the following options :
    - `language` the language of the verbs list (English or Dutch)
    - `showtrad` if True display the infinitive of the verb and its translation in French ; else display the infinitive, the imperfect and the past participle.
2. `/study-infinitive` documentation to come ...
3. `/study-imperfect` documentation to come ...
4. `/study-participle` documentation to come ...

### Study commands
1. `/questions` displays a question about a subject.

    __Available subjects__
    - Philosophy : 65 questions
3. `/cards` displays a card about a topic in a subject.
   
    __Available subjects__
    - Algebra : 1 topic, 4 cards
    - Algorithmics : 5 topic, 18 cards
    - Electronics : 2 topics, 16 cards

### Points commands
1. `/profile` shows the points of the sellected `user`
    - `user` a sever's member
2. `/leaderboard` shows the 20 first members of the server with the more points.
3. `/adminxp` changes the points of the selected `user`. This command is only available for administrators.
    - `user` a sever's member
    
### Configuration commands
1. `/setlang` change the bot's language to the selected `language`
    - `language` a supported language (French, English, Dutch)


Bot created by : piwy_


Current version : 1.3.8
