# thyme plane

[![thyme plane](https://github.com/aldorr/thyme-plane/raw/master/src/assets/logo.png)](https://github.com/aldorr/thyme-plane)

**thyme plane** is a PWA created with [vue.js](https://vuejs.org/)  & [buefy](https://buefy.org/) for making time entry and calculation easier. Adding clients, adding projects, and time for each project is simple. Then doing monthly calculations with filters by client and project makes creating reports a cinch.

[![npm](https://img.shields.io/badge/npm-v6.12.1-success?)](https://github.com/npm/cli)
[![license](https://img.shields.io/badge/license-MIT-informational?")](https://github.com/aldorr/thyme-plane/blob/master/LICENSE)

## Project setup

## git steps

* make new branch
* clone repository (i.e.):

    ```bash
    git clone https://github.com/aldorr/thyme-plane.git
    ```

* make changes
* submit changes
* submit pull request

## npm steps

### Install Dependencies

```bash
npm install
```

### Compile and serve hot-reloading for development

```bash
npm run serve
```

______

### Try it out with your own firebase setup

* First set up a Firebase rtdb.

  * Rules
  
  ``` json
  {
    "rules": {
        ".read": "auth.uid !== null && data.child('users').child(auth.uid) !== null",
        ".write": "auth.uid !== null && data.child('users').child(auth.uid) !== null"
    }
  }
  ```
  
  * Add Authorized User and make user in Database with same UID (so above rules work)

* Then copy the .env.sample to .env

* Add the appropriate variables to the .env file.

* You may need to add the appropriate tables as well.

______

### Compile and minify for production

```bash
npm run build
```

### Run your tests

```bash
npm run test
```

TODO: write tests

### Lints and fixes files

```bash
npm run lint
```

### Deploy script included

```bash
npm run deploy
```

* You can also make your own `deploy.sh` script
* or use the one provided with your own surge account
* add your domain to /public/CNAME

### Customize configuration

See vue.js CLI [Configuration Reference](https://cli.vuejs.org/config/).

## License

Code released under [MIT](https://github.com/buefy/buefy/blob/master/LICENSE) license.

## Version

* Version 0.5.0

## Full Demo

Try it out here

* [https://thyme-demo.surge.sh/](https://thyme-demo.surge.sh/)

User

* demo-user@aldorr.net

PW

* Easy-T0-Guess-Passw0rds

## Communication

* notify about issues here
* or directly on discord: https://discord.gg/2U8EmG
