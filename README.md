# BIOS668 Project Overview

The purpose of this project is to make an interface that can be used for making power and sample size calculations in various statistical plans. You can access the website at: 

samplesizecalc.com

or at: 

kyracm.github.io

## Website Explanation

In the main sample size calculator tab, the user can select a test to simulate. Upon selecting the desired test, the null and alternative hypothesis will populate and the user can enter the numbers they are using for their study. Pressing "Simulate Study" will calculate the minimum sample size that the user should obtain, and a breakdown of that calculation and a sample statistics paragraph will appear. 

If the user isn't sure about what the tests or parameters mean, or simply wants to learn more about various aspects of the study designs available on this website, they can go to the "help" tab and search for key words that they don't understand. Definitions of the terms will appear, and the user will not lose their progress in filling out their design parameters if they switch back and forth. 

In this project, HTML was used for the structure of the website, CSS was used for the visuals, and front-end JavaScript was used for the functionality. The HTML and JS portions of the code base have lots of comments in them so others can understand and add to the code. Anyone who wishes to supplement this website (i.e., future BIOS 668 students) can do so by creating their own GitHub account, cloning the code in this repo by using the "Clone or Download" button, and adding what they want to the three files that already exist. 

## Language Resources and How - To's

### External Resources
For information on syntax and language features for the languages used, look here: 
HTML - https://www.w3schools.com/html/
CSS - https://www.w3schools.com/css/
JavaScript - https://www.w3schools.com/js/

For information about the jQuery framework used, look here: 
jQuery - https://www.w3schools.com/jquery/

### Tutorials

- Adding vocabulary words to the terms section
  1. Open the script.js file and go to the `var terms =` portion. Expand this section by pressing the + key to the left. 
  2. Add the following code to add a term. The functions in place will add it to the existing vocabulary list in alphabetical order. The user will be able to find this term by searching now. 
  ```
    {
            "term": "<Your desired term here>",
            "definition": "<Your desired term's definition here>"
        }
  ```