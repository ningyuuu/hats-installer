*** Settings ***
Documentation     A test suite with a single test for Beanie
...               Created by Robot Extension
Library           Selenium2Library    timeout=10
Library				    OperatingSystem

*** Variables ***
#${BROWSER}    ie

*** Test Cases ***
Beanie test using Internet Explorer
	Log    %{path}%
	Log    ${CURDIR}
	Run Keyword If    ${IE_EXISTS}    Beanie test    ie

Beanie test using Chrome
	Log    %{path}%
	Log    ${CURDIR}
	Run Keyword If    ${CHROME_EXISTS}    	Beanie test    chrome

Beanie test using Firefox
	Log    %{path}%
	Log    ${CURDIR}
	Run Keyword If    ${FF_EXISTS}    	Beanie test    ff

*** Keywords ***
Beanie test
	[Arguments]    ${browser}
  Open Browser  file://${TEMPDIR}/testpage/Beanie.html  ${browser}
  Wait Until Page Contains Element  //i[@id="link-edit-1-i"]
  Click Element  //i[@id="link-edit-1-i"]
  Wait Until Page Contains Element  //input[@name="device[name]"]
  Input Text  //input[@name="device[name]"]  iPhone 7 - hello
  Wait Until Page Contains Element  //button[@name="button"]
  Click Element  //button[@name="button"]
  Close Browser
  #Open Browser  file://C:/Users/devops/AppData/Local/Temp/testpage/temp.html  ${BROWSER}
