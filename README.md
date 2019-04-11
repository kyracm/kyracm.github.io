# BIOS668 Project Documentation

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
- HTML - https://www.w3schools.com/html/
- CSS - https://www.w3schools.com/css/
- JavaScript - https://www.w3schools.com/js/

For information about the jQuery framework used, look here: 
- jQuery - https://www.w3schools.com/jquery/

### Tutorials

- Adding vocabulary words to the terms section
  * Open the script.js file and go to the `var terms =` portion. Expand this section by pressing the + button to the left. 
  * Add the following code to add a term. The functions in place will add it to the existing vocabulary list in alphabetical order. The user will be able to find this term by searching now. Note: Be sure to separate added terms with a comma. 
  ```
    {
        "term": "<Your desired term here>",
        "definition": "<Your desired term's definition here>"
    }
  ```
- Adding a test 
  1. The first step to adding a test type is to go to the index.html file and find the div with the id "typeOfTest"
  2. You should then add your desired test as an option. Be sure to give it an easily identifiable value attribute. The syntax is: `<option value="noSpacesIDValue">The test name that you would like to display to the user</option>`
  3. Navigate to the script.js file and find the following function definition: `$('.testTypes').change(function ()`. Expand it with the + button to the left if need be. Add the following else if block:
     ```
     } else if (testType == <The ID value you assigned your test>) {
       
     }
     ```
     In the main block of the else if statment, you will add your null and alternative hypothesis, variable definitions that will appear on the right side of the page, and parameter inputs that appear on the left side of the page. To see an example of this, look at the current tests that exist in this function. 
       - Note: Variables that represent definitions and parameter divs already exist. Simply look for your desired parameter values from lines 76-92, and your desired definitions from lines 95-106. Reference the variable names to add these sections to your test. 
  4. Navigate to the script.js file and find the following function definition: `$("#simulate").click(function () {`. Expand it with the + button to the left if need be. Add the following else if block:
     ```
     } else if (testType == <The ID value you assigned your test>) {
         $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
              if (n_total == 0 || isNaN(parseFloat(n_total))) {
                  $('#samplesize').append("<p id = 'sampsizenum'>Please correctly fill out the parameter values.</p>")
              } else {
                  $('#samplesize').append("<p id = 'sampsizenum'>You should give a brief run down of the values you calculated here.</p>")
                  $('#samplesize').append("<h2>Sample statistics paragraph</h2>")
                  $('#samplesize').append("<p id = 'sampsizepar'>You should put an example statistics paragraph here.</p>")
                  }
     }
     ```
      This is the function that actually calculates your sample size. To access the parameter values inputted by the user, call one of the pre-defined functions that matches the parameter you need. For example, if your test involves a user-inputted standard deviation, call the function `stddevTextInput();`. The names of these functions can be found throughout the script.js file, and are denoted with comments. Use whatever variables you would like to make this calculation. Your function should alert the user if they didn't input parameter values correctly. That is what the if-else block within the larger if-else block above does.
