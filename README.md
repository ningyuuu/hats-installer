# hats installer
The *hats* installer installs packages needed to run browsers automated functional test on Windows.
Simplifies the steps to setup test environment in Windows.

## Motivation
We believe that agile quality practices accelerate the delivery of quality applications.
To deal with a growing test backlog, test automation is a more scalable and cost-effective approach.

As a group of passionate quality engineers, we want to lower the barrier of entry to web app test automation so that everyone can contribute to software quality.

## Supported Platforms
*hats* has been tested on the following platforms:

##### Operating Systems
* Windows 10

##### Browsers
* Internet Explorer 11
* Google Chrome 54
* Firefox 54

## User setup
1. Download the latest [release](https://github.com/GovTechSG/hats-installer/release)
2. Unzip the package
3. Run run.bat

## Development setup
1. Install [git](https://git-scm.com/downloads)
2. Install [Node.js](https://nodejs.org/en/download)
3. Clone the repo
4. Use `run.bat` to launch the application.

## Running a test
1. Open a command prompt
2. Run the sample test script
```
pybot src/testpage/test.robot
```

## Contributions
We welcome your involvement, be it fixing bugs or implementing new features that you find relevant to this project.

To contribute, you may follow the steps below:
1. Fork the repo
2. Create a new branch from `development` to work on your contribution
3. Create a pull request back here!


## Troubleshooting

##### Test page not loading (Internet Explorer)
  - Please refer to [seleniumDriver and IE Driver Wiki](https://github.com/seleniumQuery/seleniumQuery/wiki/seleniumQuery-and-IE-Driver#protected-mode-exception-while-launching-ie-driver) to troubleshoot this issue.

##### ActiveX content blocked (Internet Explorer)
  - Go to Internet Options > Advanced > Security and check the box next to "Allow active content to run in files on My Computer"


## Contact

If you have questions or comments, please create an issue.

If you want to find out more about hats, you can email <hats.supp@gmail.com>.
