Welcome, run this software on your develpment enviroment.

#### requirements

Must be able to run nodejs packages.

### Capabilities

exchange files between all of your devices, with your nodejs server you can upload and download files. to get files from computer to phone its simple, to get files from a phone to someone elses phone you could use social media but it might be faster to zip them all up, upload them to the nodejs server and download them.

there is also a simple elegant user interface when you navigate to the http url in the output, it should help you easily navigate to the download links you desire without needing to type them out yourself.

there is 1 reserved word and its called upload

# How to run

```
git clone https://github.com/lozzoc/nodejs-airdrop.git
npm install
node airdrop.js -p 1234 -f ../stuff
```

you can use enviroment variables or command line arguments. enviroment variables take preference.

```
// im still working on this, not sure how to do a global install with a binary.
npm install -g airdropjs
export port=1234 folder=../stuff && airdropjs
//or you can use command line
airdropjs -p 1234 -f ../stuff
```

### how to use

- visit http://url/ to view a list of links of all the files in your download folder
- visit http://url/upload to upload your own files to the javascript server for distribution or whatever
