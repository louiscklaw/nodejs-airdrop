Welcome, run this software on your develpment enviroment.

#### requirements

Must be able to run nodejs packages.

### Capabilities

exchange files between all of your devices, with your nodejs server you can upload and download files. to get files from computer to phone its simple, to get files from a phone to someone elses phone you could use social media but it might be faster to zip them all up, upload them to the nodejs server and download them.

there is 1 reserved word and its called upload

# How to run

```
git clone https://github.com/lozzoc/nodejs-airdrop.git
npm install
npm start
```

you can use enviroment variables or command line arguments. enviroment variables take preference.

```
npm install -g airdropjs
export port=1234 folder=../stuff && airdropjs
//or you can use command line
airdropjs -p 1234 -f ../stuff
```
