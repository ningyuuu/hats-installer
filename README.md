# hats installer

The *hats* installer installs packages needed to run browsers automated functional test on Windows.

## Motivations
We are a bunch of passionate quality engineers whom believes in the importance of agile quality engineering practices and delivering quality products or applications.  
This is our first step to enable both technical and non-technical people to be able to run automated functional test on web applications, which will help them achieve cost saving and free up their time to do more critical tasks.

## Supported Platforms
*hats* has been tested on the following platforms:

##### Operating Systems
* Windows 7
* Windows 10

##### Browsers
* Internet Explorer 10 & 11
* Google Chrome 54

## Prerequisites
* [Node.js 6](https://nodejs.org/en/download) (required to start application).
* [jdk8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) for [Selenium](http://www.seleniumhq.org/).
* [python2.7](https://www.python.org/downloads/) for the [Robot framework](http://robotframework.org/).
* pip (Included in python >=2.7.9).

## Development setup
1. Clone this current repo  
```
git clone http://github.com/govtechsg/hats-installer
```
2. Install dependencies  
```
npm install
```
3. Run application  
```
npm start
```

## License
[GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Contributions
We welcome your involvement in *hats*, be it fixing bugs or implementing new features that you find relevant to this project.

To contribute, you may follow the steps below:  
1. Create a new branch from `development` to work on your contribution  
2. Pull `development` branch again upon completion  
3. Go back to your own branch to merge development: `git merge development`  
4. Update the changelog  
5. Create a pull request back here!  

## Issues

##### Test page not loading (Internet Explorer)
  - Please refer to [seleniumDriver and IE Driver Wiki](https://github.com/seleniumQuery/seleniumQuery/wiki/seleniumQuery-and-IE-Driver#protected-mode-exception-while-launching-ie-driver) to troubleshoot this issue.

##### ActiveX content blocked (Internet Explorer)
  - Go to Internet Options > Advanced > Security and check the box next to "Allow active content to run in files on My Computer"

If you have identified what seems to be an issue, feel free to report it [here](https://github.com/GovTechSG/hats-installer/issues).

## Contact  

Do drop us an email at <hats.supp@gmail.com> for any inquiries or to know more about *hats*.
