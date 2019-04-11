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

### Functions Available For Use
The following functions are already implemented and can be used by anyone wishing to add more functionality to the website.
- `treatmentAText()`
  - This function is used to capture what the user inputs for the text box representing treatment A. It is called when the simulate button is pressed. 
- `treatmentBText()`
  - This function is used to capture what the user inputs for the text box representing treatment B. It is called when the simulate button is pressed. 
- `nratioText()`
  - This function ensures that the user has entered a valid number for the ratio of participants in the two treatment groups. This function is called when the simulate button is pressed. You can only call this function if the user can enter this ratio as a parameter.
- `meandiffText()`
  - This function ensures that the user has entered a valid number for the mean difference between treatment groups. This function is called when the simulate button is pressed. You can only call this function if the user can enter the mean difference as a parameter.
- `meandiffText_onesamp()`
  - This function ensures that the user has entered a valid number for the mean difference between the standard and the treatment group. This function is called when the simulate button is pressed. You can only call this function if the user can enter the one sample mean difference as a parameter.
- `absmeandiffText()`
  - This function ensures that the user has entered a valid number for the absolute value mean difference between treatment groups. This function is called when the simulate button is pressed. You can only call this function if the user can enter the absolute value mean difference as a parameter.
- `absmeandiffText_onesamp()`
  - This function ensures that the user has entered a valid number for the mean difference between the standard and the treatment group. This function is called when the simulate button is pressed. You can only call this function if the user can enter the absolute value one sample mean difference as a parameter.
- `deltaTextInput()`
  - This function ensures that the user has entered a valid number for delta. This function is called when the simulate button is pressed. You can only call this function if the user can enter delta as a parameter.
- `prop1Input()`
  - This function ensures that the user has entered a valid number for proportion 1. This function is called when the simulate button is pressed. You can only call this function if the user can enter proportion 1 as a parameter.
- `prop2Input()`
  - This function ensures that the user has entered a valid number for proportion 2. This function is called when the simulate button is pressed. You can only call this function if the user can enter proportion 2 as a parameter.
- `mu1Input()`
  - This function ensures that the user has entered a valid number for mu 1. This function is called when the simulate button is pressed. You can only call this function if the user can enter mu 1 as a parameter.
- `mu2Input()`
  - This function ensures that the user has entered a valid number for mu 2. This function is called when the simulate button is pressed. You can only call this function if the user can enter mu 2 as a parameter.
- `clusterSizeInput()`
  - This function ensures that the user has entered a valid number for cluster size. This function is called when the simulate button is pressed. You can only call this function if the user can enter cluster size as a parameter.
- `bigdeltainput()`
  - This function ensures that the user has entered a valid number for big delta. This function is called when the simulate button is pressed. You can only call this function if the user can enter big delta as a parameter.
- `iccinput()`
  - This function ensures that the user has entered a valid number for ICC. This function is called when the simulate button is pressed. You can only call this function if the user can enter ICC as a parameter.
- `kinput()`
  - This function ensures that the user has entered a valid number for k. This function is called when the simulate button is pressed. You can only call this function if the user can enter k as a parameter.
- `stddevTextInput()`
  - This function ensures that the user has entered a valid number for standard deviation. This function is called when the simulate button is pressed. You can only call this function if the user can enter standard deviation as a parameter.
- `stddev1TextInput()`
  - This function ensures that the user has entered a valid number for standard deviation 1 (this is only used for tests requiring two standard deviations). This function is called when the simulate button is pressed. You can only call this function if the user can enter standard deviation 1 as a parameter.
- `stddev2TextInput()`
  - This function ensures that the user has entered a valid number for standard deviation 2 (this is only used for tests requiring two standard deviations). This function is called when the simulate button is pressed. You can only call this function if the user can enter standard deviation 2 as a parameter.

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
- Adding a test (Note: the script.js file has been *extensively* commented. Refer to this file if you have questions about this process)
  1. The first step to adding a test type is to go to the index.html file and find the div with the id "typeOfTest"
  2. You should then add your desired test as an option. Be sure to give it an easily identifiable value attribute. The syntax is: `<option value="noSpacesIDValue">The test name that you would like to display to the user</option>`
  3. Navigate to the script.js file and find the following function definition: `$('.testTypes').change(function ()`. Expand it with the + button to the left if need be. Add the following else if block:
     ```
     } else if (testType == <The ID value you assigned your test>) {
          $('#testDisplayNull').html("Null hypothesis goes here")
          $('#testDisplayAlt').html("Alternative hypothesis goes here")
          $('#hypotheses').append(The variable name for the parameter you want the user to enter goes here)
          $('#variableDefinitionList').append(The variable name for the parameter definition you want the user to see goes here)
     }
     ```
     In the main block of the else if statment, you will add your null and alternative hypothesis, variable definitions that will appear on the right side of the page, and parameter inputs that appear on the left side of the page. To see an example of this, look at the current tests that exist in this function. 
      - The available parameter divs for use are as follows. 
        - Standard deviation: `stddevhtmldiv`
        - Delta: `deltahtmldiv`
        - Mean difference: `meandiffhtmldiv`
        - Absolute value mean difference: `absmeandiffhtmldiv`
        - Treatment 1 and 2 n ratio: `ratiohtmldiv`
        - Mean difference for one sample: `meandiffhtmldiv_onesamp`
        - Absolute value mean difference for one sample: `absmeandiffhtmldiv_onesamp`
        - Proportion 1: `prop1div`
        - Proportion 2: `prop2div`
        - ICC: `iccdiv`
        - K: `kdiv`
        - Cluster size: `clustersizediv`
        - Cluster test delta (big delta): `clusterdeltadiv`
        - Mu 1: `m1div`
        - Mu 2: `m2div`
        - Standard deviation 1: `stddev1htmldiv`
        - Standard deviation 2: `stddev2htmldiv`
      - The available parameter definitions for use are as follows.
        - Standard deviation: `stddevdef`
        - Delta: `deltadef`
        - Mean difference (1 sample): `meandiffdef_onesamp`
        - Mean difference (2 sample): `meandiffdef_twosamp`
        - Treatment group n ratio: `ratiodeff`
        - K: `kdef`
        - ICC: `iccdef`
        - Cluster Size: `mdef`
        - Proportion: `propdef`
        - Cluster test delta (big delta) for proportions: `clusterdeltadef`
        - Cluster test delta (big delta) for means: `clusterdeltameandef`
        - Mean: `meandef`

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
      This is the function that actually calculates your sample size. To access the parameter values inputted by the user, call one of the pre-defined functions that matches the parameter you need. For example, if your test involves a user-inputted standard deviation, call the function `stddevTextInput();`. The names of these functions can be found throughout the script.js file, and are denoted with comments. Additionally, a list of all callable functions is above. Use whatever variables you would like to make this calculation, but make sure your final sample size variable is named `n_total`. Your function should alert the user if they didn't input parameter values correctly. That is what the if-else block within the larger if-else block above does.
