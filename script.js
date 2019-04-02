//The below function was found on Stack Overflow and computes Z score values. DO NOT MODIFY. 
function NormSInv(p) {
    var a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
    var a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
    var b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
    var b4 = 66.8013118877197, b5 = -13.2806815528857, c1 = -7.78489400243029E-03;
    var c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373;
    var c5 = 4.37466414146497, c6 = 2.93816398269878, d1 = 7.78469570904146E-03;
    var d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
    var p_low = 0.02425, p_high = 1 - p_low;
    var q, r;
    var retVal;

    if ((p < 0) || (p > 1)) {
        alert("NormSInv: Argument out of range.");
        retVal = 0;
    }
    else if (p < p_low) {
        q = Math.sqrt(-2 * Math.log(p));
        retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    else if (p <= p_high) {
        q = p - 0.5;
        r = q * q;
        retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    else {
        q = Math.sqrt(-2 * Math.log(1 - p));
        retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
}

$(document).ready(function () {

    //These are the global variables that are used in the website. 
    var alpha = 0.05;
    var beta = 0.20;
    var power = 80;
    var trtGroupAName = "Treatment A";
    var trtGroupBName = "Treatment B";
    var testType = $('.testTypes').val();
    var delta = 0;
    var sigma = 0;
    var nratio = 1;
    var meandiff = 0;
    var absmeandiff = 0;
    var absmeandiff_onesamp = 0;
    var meandiff_onesamp = 0;
    var terms;
    var n_a = 0;
    var n_b = 0;
    var n_total = 0;
    var selectedSigma = "powerone"

    //When a user selects a study design, different parameters need to show up. For example, some tests need delta places
    //while others do not. The below variables are the HTML code needed to create parameter places on the website.
    //These include standard deviation (or variance; the user can choose between the two), delta, mean difference for one and
    //two sample, absolute value mean difference for one and two sample, 
    //the ratio of subjects in n1 to n2 (only applicable for two sample). To add other parameters, follow the pattern
    //below. 
    var stddevhtmldiv = '<div class="stddev"><span class="stddevpower" id="sigmapowerone">&sigma;</span><span id="bar"> | <span><span class="stddevpower" id="sigmapowertwo">&sigma;<sup>2</sup></span>: <br> <textarea class="textNum" id="stddevtext" placeholder="0"></textarea> </div>'
    var deltahtmldiv = '<div class="delta">&delta;: <br> <textarea class="textNum" id="deltaText" placeholder="0"></textarea> </div>'
    var meandiffhtmldiv = '<div class="meandiff">&mu;<sub>0</sub>-&mu;<sub>1</sub>: <br> <textarea class = "textNum" id="meandiffText" placeholder="0"></textarea></div>'
    var absmeandiffhtmldiv = '<div class="absmeandiff">|&mu;<sub>0</sub>-&mu;<sub>1</sub>|: <br> <textarea class = "textNum" id="absmeandiffText" placeholder="0"></textarea></div>'
    var ratiohtmldiv = '<div class="nratio">k:<br><textarea class="textNum" id="nratio" placeholder="1"></textarea></div>'
    var meandiffhtmldiv_onesamp = '<div class="meandiff_onesamp">&mu;-&mu;<sub>0</sub>: <br> <textarea class = "textNum" id="meandiffText_onesamp" placeholder="0"></textarea></div>';
    var absmeandiffhtmldiv_onesamp = '<div class="absmeandiff_onesamp">|&mu;-&mu;<sub>0</sub>|: <br> <textarea class = "textNum" id="absmeandiffText_onesamp" placeholder="0"></textarea></div>';

    var stddevdef = "<li id = 'variableDefinition'>The standard deviation (&sigma;) is a value that indicates the extent of deviation for a group as a whole from the mean.</li>";
    var deltadef = "<li id = 'variableDefinition'>Delta (&delta;) is the allowable difference between two group mean values without indicating significance.</li>";
    var meandiffdef_onesamp = "<li id = 'variableDefinition'> The mean difference (&mu; - &mu;<sub>0</sub>) is the hypothesized mean difference between the experimental and standard treatments.</li>";
    var meandiffdef_twosamp = "<li id = 'variableDefinition'> The mean difference (&mu;<sub>0</sub> - &mu;<sub>1</sub>) is the hypothesized mean difference between two treatment groups.</li>";
    var ratiodeff = "<li id = 'variableDefinition'>K is the ratio of patients in each group, and is equivalent to n<sub>0</sub>/n<sub>1</sub>.</li>";


    //The terms found in the help tab are JSON objects below. To add more, simply follow the pattern below. The function
    //directly underneath the terms list adds all the terms to a list that the user can search on the website. DO NOT
    //MODIFY that function. 
    var terms = [
        {
            "term": "Non-Inferiority Test",
            "definition": "A non-inferiority test is used to show that the effect of some treatment A on a specific endpoint is no worse, by more than a pre-specified amount (&delta;), than that of some treatment B"
        },
        {
            "term": "One Sample",
            "definition": "A one sample test is used to compare one sample group to an assumed population parameter value of the outcome of interest"
        },
        {
            "term": "Two Sample",
            "definition": "A two sample test is used to compare two different sample groups to each other"
        },
        {
            "term": "Superiority Test",
            "definition": "A superiority test is used to show that the effect of one treatment on a specific endpoint is superior to that of another treatment"
        },
        {
            "term": "Equivalence Test",
            "definition": "An equivalence test is used to show that the effects of two treatments on a specific endpoint differ by no more than a pre-specified amount (&delta;)"
        },
        {
            "term": "Power",
            "definition": "Power is correctly rejecting the null hypothesis when an alternative hypothesis is true. It is the probability of avoiding a type II error, and is equivalent to 1-&beta;"
        },
        {
            "term": "Observational Studies",
            "definition": "An observational study collects data from an existing situation. The data collection does not intentionally interfere with the running of the system."
        },
        {
            "term": "Experimental Studies",
            "definition": "An experiment is a study in which an investigator deliberately sets one or more factors to a specified level. This leads to stronger scientific/causal inference."
        },
        {
            "term": "Clinical Trial",
            "definition": "Any investigation in human subjects intended to discover or verify the clinical, pharmacological, and/or other pharmacodynamic effects of an investigational product(s), whether approved for marketing or not, and/or to identify any adverse reactions to an investigational product(s), and/or to study absorption, distribution, metabolism, and excretion of an investigational product(s) with the objective of ascertaining its efficacy and/or safety."
        },
        {
            "term": "Control (placebo)",
            "definition": "Subjects are split into at least two groups- those receiving the experimental agent and those receiving a standard treatment for the condition (an active control), no treatment, or a placebo."
        },
        {
            "term": "Double blind",
            "definition": "When a study is ‘double-blinded’, neither the investigator nor the subject knows which treatment the subject is to receive."
        },
        {
            "term": "Randomization",
            "definition": "The random assignment of patients into treatment groups. If subjects are assigned randomly into these groups, the study is a randomized controlled trial."
        },
        {
            "term": "Phase I Clinical Trial",
            "definition": "The goal of this type of trial is to assess toxicity; determine drug’s pharmacokinetic and pharmacodynamic profiles; and determine doses resulting in sufficient biological levels of the drug."
        },
        {
            "term": "Phase II Clinical Trial",
            "definition": "The goal of this type of trial is to determine the drug’s short-term risks, and to examine preliminary effectiveness of the drug."
        },
        {
            "term": "Phase III Clinical Trial",
            "definition": "The goal of this type of trial is to determine the drug’s effectiveness; determine long term drug safety, and confirm Phase II findings. "
        },
        {
            "term": "Dose Limiting Toxicity (DLT)",
            "definition": "Treatment related non-hematological toxicity of grade 3 or higher, or treatment related hematological toxicity of grade 4 or higher"
        },
        {
            "term": "Maximum Tolerated Dose (MTD)",
            "definition": "Usually, the therapeutic effect of a drug is believed to increase with dose. However, the dose of a study drug a subject can receive is often limited by toxicity. Hence the target dose is the maximum dose that is tolerable. The maximum tolerated dose is the dose such that Pr(dose limiting toxicity at MTD)=&gamma;, where &gamma; is the target DLT rate"
        },
        {
            "term": "Type I Error",
            "definition": "The rejection of a true null hypothesis, also known as a 'false positive' finding or conclusion. Pr(p<.05|H<sub>0</sub>) Aim to keep type I error rate under &alpha;"
        },
        {
            "term": "Type II Error",
            "definition": "The failure to reject a false null hypothesis, also known as a 'false negative' finding or conclusion. P(p>.05|H<sub>a</sub>). Aim to keep type II error rate under &beta;"
        },
        {
            "term": "Alpha",
            "definition": "The rate you wish to keep type I error under."
        },
        {
            "term": "Beta",
            "definition": "The rate you wish to keep type II rate under. Equal to 1-power."
        },
        {
            "term": "Non inferiority margin",
            "definition": "Definition of non-inferiority often set by clinically relevant differences. Margins should be specified a priori and approved by the FDA."
        },
        {
            "term": "Standard deviation",
            "definition": "A measure that is used to quantify the amount of variation or dispersion of a set of data values from the mean."
        },
        {
            "term": "Cross sectional study",
            "definition": "A clinical trial design in which groups are assigned to study conditions and different members are observed at each measurement occasion. This is the best design when the research question involves change within an entire population."
        },
        {
            "term": "Cohort study",
            "definition": "A clinical trial design in which groups are assigned to study conditions and the same members are observed at each measurement occasion. This is the best design when the research question involves change within specific members of the population."
        },
        {
            "term": "Starting dose",
            "definition": "The murine LD10 is the dose with approximately 10% mortality established in preclinical studies in animals. One-tenth or two-tenths of the equivalent of LD10, expressed in milligrams per meter squared, is often used as a starting dose in Phase I oncology trials."
        },
        {
            "term": "Dose level selection",
            "definition": "The dose levels are usually selected by the investigational team prior to the onset of the trial. The set of doses can be chosen according to the modified Fibonacci sequence in which higher escalation steps have decreasing relative increments."
        },
        {
            "term": "Mean difference",
            "definition": "The difference of the mean value of interest between two treatment groups."
        },
        {
            "term": "k",
            "definition": "In a two sample test, k is the ratio of patients in each group (k=n<sub>0</sub>/n<sub>1</sub>)"
        },
        {
            "term": "Factorial cluster design",
            "definition": "A cluster design in which the researcher is interested in the effect of two or more independent factors."
        },
        {
            "term": "Single factor cluster design",
            "definition": "A cluster design in which the effect of a single intervention is of interest."
        },
        {
            "term": "Selection bias",
            "definition": "Bias due to differences between groups existing at baseline that might explain posttest differences among study conditions"
        },
        {
            "term": "History and differential history bias",
            "definition": "Bias due to any external influence (other than the intervention) that can affect the results of a study"
        },
        {
            "term": "Maturation and differential maturation bias",
            "definition": "Bias due to natural growth or development (cognitive or physical) affecting results of the study"
        },
        {
            "term": "Contamination bias",
            "definition": "Bias due to important components of the intervention finding their way into the control/placebo condition"
        },
        {
            "term": "Subjective allocation",
            "definition": "The assignment of interventions by the investigators in a subjective way"
        },
        {
            "term": "Systematic allocation",
            "definition": "The assignment of treatments in a non-subjective, non-random manner"
        },
        {
            "term": "Parallel design",
            "definition": "A trial design in which patients receive only one of two or more concurrently administered treatments"
        },
        {
            "term": "Stratification",
            "definition": "Classifying participants on one or more prognostic factors before randomizing"
        },
        {
            "term": "Minimization",
            "definition": "Minimize the imbalance across multiple factors - including the characteristics of the participants already randomized - rather than just treatment group imbalance"
        },
        {
            "term": "Cross over design",
            "definition": "A trial design in which subjects receive a sequence of two or more treatments during a given time period with the object of studying differences between the treatments"
        },
        {
            "term": "Carry over effect",
            "definition": "In a cross over design; when the effects of treatment in the first period carries over and impacts the estimates of the next treatment effect"
        },
        {
            "term": "Period effect",
            "definition": "Some factor might cause a patient’s underlying condition to deteriorate; or, treatment might be effective in early but not late stage of disease"
        },
        {
            "term": "Clustered designs",
            "definition": "Designs in which observations at one level are nested within units or clusters at a higher level. These designs are typically used when the effect of individual-level factors are of interest, as well as cluster-level factors."
        }
    ]

    //This function sorts the terms alphabetically
    terms.sort(function (a, b) {
        var contentA = a.term.toLowerCase();
        var contentB = b.term.toLowerCase();
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });

    $.each(terms, function (index, item) {
        $('#668terms').append('<option value="' + terms[index].term + '">')
    });

    //This function changes what parameter values are displayed when a user selects a test type. It first
    // resets all the global variables to their default and then appends the parameter divs (established above) to the
    //hypotheses section. 
    $('.testTypes').change(function () {
        testType = $('.testTypes').val();
        $('#hypotheses').empty();
        delta = 0;
        sigma = 0;
        trtGroupAName = "Treatment A";
        trtGroupBName = "Treatment B";
        nratio = 1;
        meandiff = 0;
        absmeandiff = 0;
        nullHyp = 0;
        altHyp = 0;
        $('#samplesize').empty()
        $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
        $('#samplesize').append("<p id = 'sampsizenum'>Please correctly fill out the parameter values.</p>")
        $('#samplesize').append('<ul id="variableDefinitionList"></ul>')
        if (testType == "noninf1") {
            if ($('#n_ratio').attr('style') != "display: none" && $('#n_ratio').attr('style') != "display: none;") {
                $('#n_ratio').toggle()
            }
            if ($('.trtGroup_B').attr('style') != "display: none" && $('.trtGroup_B').attr('style') != "display: none;") {
                $('.trtGroup_B').toggle()
            }
            $('#testDisplayNull').html("H<sub>0</sub>: &mu; - &mu;<sub>0</sub> &lt; &delta;")
            $('#testDisplayAlt').html("H<sub>a</sub>: &mu; - &mu;<sub>0</sub> &ge; &delta;")
            $('#hypotheses').append(meandiffhtmldiv_onesamp);
            $('#hypotheses').append(stddevhtmldiv);
            $('#hypotheses').append(deltahtmldiv)
            $('#variableDefinitionList').append(meandiffdef_onesamp)
            $('#variableDefinitionList').append(stddevdef)
            $('#variableDefinitionList').append(deltadef)
        } else if (testType == "sup1") {
            $('#testDisplayNull').html("H<sub>0</sub>: &mu; - &mu;<sub>0</sub> = 0")
            $('#testDisplayAlt').html("H<sub>a</sub>: &mu; - &mu;<sub>0</sub> &ne; 0")
            if ($('#n_ratio').attr('style') != "display: none" && $('#n_ratio').attr('style') != "display: none;") {
                $('#n_ratio').toggle()
            }
            if ($('.trtGroup_B').attr('style') != "display: none" && $('.trtGroup_B').attr('style') != "display: none;") {
                $('.trtGroup_B').toggle()
            }
            $('#hypotheses').append(meandiffhtmldiv_onesamp);
            $('#hypotheses').append(stddevhtmldiv);
            $('#variableDefinitionList').append(meandiffdef_onesamp)
            $('#variableDefinitionList').append(stddevdef)
        } else if (testType == "equiv1") {
            $('#testDisplayNull').html("H<sub>0</sub>: |&mu; - &mu;<sub>0</sub>| &ge; &delta;")
            $('#testDisplayAlt').html("H<sub>a</sub>: |&mu; - &mu;<sub>0</sub>| &lt; &delta;")
            if ($('#n_ratio').attr('style') != "display: none" && $('#n_ratio').attr('style') != "display: none;") {
                $('#n_ratio').toggle()
            }
            if ($('.trtGroup_B').attr('style') != "display: none" && $('.trtGroup_B').attr('style') != "display: none;") {
                $('.trtGroup_B').toggle()
            }
            $('#hypotheses').append(absmeandiffhtmldiv_onesamp);
            $('#hypotheses').append(stddevhtmldiv);
            $('#hypotheses').append(deltahtmldiv)
            $('#variableDefinitionList').append(meandiffdef_onesamp)
            $('#variableDefinitionList').append(stddevdef)
            $('#variableDefinitionList').append(deltadef)
        } else if (testType == "noninf2") {
            if ($('#n_ratio').attr('style') == "display: none" || $('#n_ratio').attr('style') == "display: none;") {
                $('#n_ratio').toggle()
            }
            if ($('.trtGroup_B').attr('style') == "display: none" || $('.trtGroup_B').attr('style') == "display: none;") {
                $('.trtGroup_B').toggle()
            }
            $('#testDisplayNull').html("H<sub>0</sub>: &mu;<sub>0</sub> - &mu;<sub>1</sub> &lt; &delta;")
            $('#testDisplayAlt').html("H<sub>a</sub>: &mu;<sub>0</sub> - &mu;<sub>1</sub> &ge; &delta;")
            $('#n_ratio').html("n<sub>0</sub> = k*n<sub>1</sub>")
            $('#hypotheses').append(meandiffhtmldiv);
            $('#hypotheses').append(stddevhtmldiv);
            $('#hypotheses').append(deltahtmldiv);
            $('#hypotheses').append(ratiohtmldiv);
            $('#variableDefinitionList').append(meandiffdef_twosamp)
            $('#variableDefinitionList').append(stddevdef)
            $('#variableDefinitionList').append(deltadef)
            $('#variableDefinitionList').append(ratiodeff)
        } else if (testType == "sup2") {
            if ($('#n_ratio').attr('style') == "display: none" || $('#n_ratio').attr('style') == "display: none;") {
                $('#n_ratio').toggle()
            }
            if ($('.trtGroup_B').attr('style') == "display: none" || $('.trtGroup_B').attr('style') == "display: none;") {
                $('.trtGroup_B').toggle()
            }
            $('#testDisplayNull').html("H<sub>0</sub>: &mu;<sub>0</sub> - &mu;<sub>1</sub> = 0")
            $('#testDisplayAlt').html("H<sub>a</sub>: &mu;<sub>0</sub> - &mu;<sub>1</sub> &ne; 0")
            $('#n_ratio').html("n<sub>0</sub> = k*n<sub>1</sub>")
            $('#hypotheses').append(meandiffhtmldiv);
            $('#hypotheses').append(stddevhtmldiv);
            $('#hypotheses').append(ratiohtmldiv);
            $('#variableDefinitionList').append(meandiffdef_twosamp)
            $('#variableDefinitionList').append(stddevdef)
            $('#variableDefinitionList').append(ratiodeff)
        } else if (testType == "equiv2") {
            if ($('#n_ratio').attr('style') == "display: none" || $('#n_ratio').attr('style') == "display: none;") {
                $('#n_ratio').toggle()
            }
            if ($('.trtGroup_B').attr('style') == "display: none" || $('.trtGroup_B').attr('style') == "display: none;") {
                $('.trtGroup_B').toggle()
            }
            $('#testDisplayNull').html("H<sub>0</sub>: |&mu;<sub>0</sub> - &mu;<sub>1</sub>| &ge; &delta;")
            $('#testDisplayAlt').html("H<sub>a</sub>: |&mu;<sub>0</sub> - &mu;<sub>1</sub>| &lt; &delta;")
            $('#n_ratio').html("n<sub>0</sub> = k*n<sub>1</sub>")
            $('#hypotheses').append(absmeandiffhtmldiv);
            $('#hypotheses').append(stddevhtmldiv);
            $('#hypotheses').append(deltahtmldiv);
            $('#hypotheses').append(ratiohtmldiv);
            $('#variableDefinitionList').append(meandiffdef_twosamp)
            $('#variableDefinitionList').append(stddevdef)
            $('#variableDefinitionList').append(deltadef)
            $('#variableDefinitionList').append(ratiodeff)
        }
    });

    //This function creates the alpha slider. It is called at the bottom of this file.
    var alphaSlider = function () {
        var slider = $('#alpha'),
            range = $('.alpha_range'),
            value = $('.alpha_value');

        slider.each(function () {
            value.each(function () {
                var value = $(this).prev().attr('value');
                alpha = value;
                $(this).html(value);
            });

            range.on('input', function () {
                alpha = this.value;
                $(this).next(value).html(this.value);
                console.log(alpha);

            });
        });
    };

    //This function creates the power slider. It is called at the bottom of this file.
    var powerSlider = function () {
        var slider = $('#power'),
            range = $('.power_range'),
            value = $('.power_value');

        slider.each(function () {
            value.each(function () {
                var value = $(this).prev().attr('value');
                power = value;
                $(this).html(value + "%");
            });

            range.on('input', function () {
                power = this.value;
                $(this).next(value).html(this.value + "%");
                beta = (100 - power) / 100.0;
            });
        });

    };

    //This function assigns the text the user inputs for the name of treatment one to the treatment one global varialbe.
    var treatmentAText = function () {
        trtGroupAName = $('.textAreaA').val();
        if (trtGroupAName == "") {
            trtGroupAName = "Treatment A"
        }
    };

    //This function refreshes the page when the reset button is pressed.
    $(function () {
        $("#resetOptions").click(function () {
            location.reload();
        });
    });

    //This function calculates the sample size for each of the 6 tests and displays the paragraphs and sample size
    //breakdowns for each one. 
    $(function () {
        $("#simulate").click(function () {
            treatmentAText();
            stddevTextInput();
            treatmentBText();
            $('#samplesize').empty();
            console.log(testType)
            if (testType == "sup2") {
                nratioText();
                meandiffText();
                let zbeta = NormSInv(1 - beta)
                let zalphaover2 = NormSInv(1 - (alpha / 2))
                let kplusone = parseFloat(nratio) + 1;
                let naNum = kplusone * Math.pow(sigma, 2) * Math.pow((zbeta + zalphaover2), 2);
                let naden = Math.pow(meandiff, 2)
                n_b = Math.ceil((naNum / naden) / parseFloat(nratio));
                n_a = n_b * parseFloat(nratio);
                n_total = n_a + n_b;
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                if (n_total == 0 || isNaN(parseFloat(n_total))) {
                    $('#samplesize').append("<p id = 'sampsizenum'>Please correctly fill out the parameter values.</p>")
                } else {
                    $('#samplesize').append("<p id = 'sampsizenum'>Your total sample size should be greater than or equal to " + n_total + ". You need at least " + n_a + " subjects for " + trtGroupAName + " and at least " + n_b + " subjects for " + trtGroupBName + ". Note: sample size calculations for both treatment groups have been rounded up to nearest integer value.</p>")
                    $('#samplesize').append("<h2>Sample statistics paragraph</h2>")
                    $('#samplesize').append("<p id = 'sampsizepar'>To detect a statistically significant superiority of " + trtGroupAName + " over " + trtGroupBName + ", " + n_total + " subjects are needed, with " + n_a + " in " + trtGroupAName + " and " + n_b + " in " + trtGroupBName + ". This provides " + power + "% power and a type one error rate of " + alpha + ".</p>")
                }
            } else if (testType == "noninf2") {
                nratioText();
                meandiffText();
                deltaTextInput();
                let zbeta = NormSInv(1 - beta)
                let zalpha = NormSInv(1 - alpha)
                let kplusone = parseFloat(nratio) + 1;
                let naNum = kplusone * Math.pow(sigma, 2) * Math.pow((zbeta + zalpha), 2);
                let naden = Math.pow(meandiff - delta, 2)
                n_b = Math.ceil((naNum / naden) / parseFloat(nratio));
                n_a = n_b * parseFloat(nratio);
                n_total = n_a + n_b;
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                if (n_total == 0 || isNaN(parseFloat(n_total))) {
                    $('#samplesize').append("<p id = 'sampsizenum'>Please correctly fill out the parameter values.</p>")
                } else {
                    $('#samplesize').append("<p id = 'sampsizenum'>Your total sample size should be greater than or equal to " + n_total + ". You need at least " + n_a + " subjects for " + trtGroupAName + " and at least " + n_b + " subjects for " + trtGroupBName + ". Note: sample size calculations for both treatment groups have been rounded up to nearest integer value.</p>")
                    $('#samplesize').append("<h2>Sample statistics paragraph</h2>")
                    $('#samplesize').append("<p id = 'sampsizepar'>To conclude that there is statistical evidence to suggest " + trtGroupBName + " is not inferior to " + trtGroupAName + ", " + n_total + " (with " + n_a + " in " + trtGroupAName + " and " + n_b + " in " + trtGroupBName + ") subjects are needed. This provides a Type I error rate of " + alpha + " and " + power + "% power.</p>")
                }
            } else if (testType == "equiv2") {
                nratioText();
                absmeandiffText();
                deltaTextInput();
                let zbeta = NormSInv(1 - beta)
                let zalpha = NormSInv(1 - alpha)
                let kplusone = parseFloat(nratio) + 1;
                let naNum = kplusone * Math.pow(sigma, 2) * Math.pow((zbeta + zalpha), 2);
                let naden = Math.pow(delta - absmeandiff, 2)
                n_b = Math.ceil((naNum / naden) / parseFloat(nratio));
                n_a = n_b * parseFloat(nratio);
                n_total = n_a + n_b;
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                if (n_total == 0 || isNaN(parseFloat(n_total))) {
                    $('#samplesize').append("<p id = 'sampsizenum'>Please correctly fill out the parameter values.</p>")
                } else {
                    $('#samplesize').append("<p id = 'sampsizenum'>Your total sample size should be greater than or equal to " + n_total + ". You need at least " + n_a + " subjects for " + trtGroupAName + " and at least " + n_b + " subjects for " + trtGroupBName + ". Note: sample size calculations for both treatment groups have been rounded up to nearest integer value.</p>")
                    $('#samplesize').append("<h2>Sample statistics paragraph</h2>")
                    $('#samplesize').append("<p id = 'sampsizepar'>If there is truly no difference between " + trtGroupAName + " and " + trtGroupBName + ", then " + n_total + " subjects (with " + n_a + " in " + trtGroupAName + " and " + n_b + " in " + trtGroupBName + ") are needed ensure that the limits of a two-sided confidence interval will exclude a difference in means of more than " + delta + " only " + alpha * 100.0 + "% of the time. This provides " + power + "% power and a type one error rate of " + alpha + ".</p>")
                }
            } else if (testType == "sup1") {
                meandiffText_onesamp();
                let zoneminusbeta = NormSInv(1 - beta)
                let zoneminusalphaover2 = NormSInv(1 - (alpha / 2))
                let nNum = Math.pow(sigma, 2) * Math.pow((zoneminusbeta + zoneminusalphaover2), 2);
                let nDen = Math.pow(meandiff_onesamp, 2)
                let n_total = Math.ceil(nNum / nDen);
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                if (n_total == 0 || isNaN(parseFloat(n_total))) {
                    $('#samplesize').append("<p id = 'sampsizenum'>Please correctly fill out the parameter values.</p>")
                } else {
                    $('#samplesize').append("<p id = 'sampsizenum'>You need at least " + n_total + " subjects in your study (" + trtGroupAName + "). Note: sample size calculations have been rounded up to nearest integer value.</p>")
                    $('#samplesize').append("<h2>Sample statistics paragraph</h2>")
                    $('#samplesize').append("<p id = 'sampsizepar'>To detect a statistically significant superiority of " + trtGroupAName + " over the standard treatment, " + n_total + " subjects are needed. This provides " + power + "% power and a type one error rate of " + alpha + ".</p>")
                }
            } else if (testType == "noninf1") {
                deltaTextInput();
                meandiffText_onesamp();
                let zoneminusbeta = NormSInv(1 - beta)
                let zoneminusalpha = NormSInv(1 - alpha)
                let nNum = Math.pow(sigma, 2) * Math.pow((zoneminusbeta + zoneminusalpha), 2);
                let nDen = Math.pow(meandiff_onesamp - delta, 2)
                let n_total = Math.ceil(nNum / nDen);
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                if (n_total == 0 || isNaN(parseFloat(n_total))) {
                    $('#samplesize').append("<p id = 'sampsizenum'>Please correctly fill out the parameter values.</p>")
                } else {
                    $('#samplesize').append("<p id = 'sampsizenum'>You need at least " + n_total + " subjects in your study (" + trtGroupAName + "). Note: sample size calculations have been rounded up to nearest integer value.</p>");
                    $('#samplesize').append("<h2>Sample statistics paragraph</h2>")
                    $('#samplesize').append("<p id = 'sampsizepar'>To conclude that there is statistical evidence to suggest " + trtGroupAName + " is not inferior to the standard treatment, " + n_total + " subjects are needed. This provides a Type I error rate of " + alpha + " and " + power + "% power.</p>")
                }
            } else if (testType == "equiv1") {
                deltaTextInput();
                absmeandiffText_onesamp();
                let zbetaovertwo = NormSInv(beta/2)
                let zalpha = NormSInv(alpha)
                let nNum = Math.pow(sigma, 2) * Math.pow((zbetaovertwo + zalpha), 2);
                let nDen = Math.pow(delta - absmeandiff_onesamp, 2)
                let n_total = Math.ceil(nNum / nDen);
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                if (n_total == 0 || isNaN(parseFloat(n_total))) {
                    $('#samplesize').append("<p id = 'sampsizenum'>Please correctly fill out the parameter values.</p>")
                } else {
                    $('#samplesize').append("<p id = 'sampsizenum'>You need at least " + n_total + " subjects in your study (" + trtGroupAName + "). Note: sample size calculations have been rounded up to nearest integer value.</p>")
                    $('#samplesize').append("<h2>Sample statistics paragraph</h2>")
                    $('#samplesize').append("<p id = 'sampsizepar'>If there is truly no difference between the standard treatment and " + trtGroupAName + ", then " + n_total + " subjects are needed ensure that the limits of a two-sided confidence interval will exclude a difference in means of more than " + delta + " only " + alpha * 100.0 + "% of the time. This provides " + power + "% power and a type one error rate of " + alpha + ".</p>")
                }
            } else {
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                $('#samplesize').append("<p id = 'sampsizenum'>Please select a test and fill out the parameter values.</p>")
            }
        });
    });

    //This function assigns the text the user inputs for the name of treatment two to the treatment two global varialbe.
    var treatmentBText = function () {
        trtGroupBName = $('.textAreaB').val();
        if (trtGroupBName == "") {
            trtGroupBName = "Treatment B"
        } else if (trtGroupBName == trtGroupAName) {
            alert("You cannot have duplicate treatment group names.")
        }
    };

    //This function makes sure the user has typed in a valid floating point number for nratio and assigns
    //this number to the global variable for nratio. 
    var nratioText = function () {
        nratio = $('#nratio').val();
        var slash = 0;
        if (nratio.indexOf('/') > -1) {
            slash = 1;
        }
        nratio = parseFloat(nratio)
        if (slash == 1) {
            alert("Please enter this ratio as a decimal, not a fraction.")
            nratio = "a"
        } else {
            for (var i = 0; i < nratio.length; i++) {
                if (nratio.charCodeAt(i) == 46 || (nratio.charCodeAt(i) <= 57 && nratio.charCodeAt(i) >= 48)) {
                    if (i == nratio.length - 1) {
                        if (nratio.charCodeAt(i) == 46) {
                            alert("You must enter a valid number for k.")
                            break;
                        }
                    }
                } else {

                    alert("You must enter a valid number for k.")

                    break;
                }
            }
        }
    };

    //This function makes sure the user has typed in a valid floating point number for mean difference and assigns
    //this number to the global variable for mean difference. 
    var meandiffText = function () {
        meandiff = $('#meandiffText').val();
        var slash = 0;
        if (meandiff.indexOf('/') > -1) {
            slash = 1;
        }
        meandiff = parseFloat(meandiff)
        if (slash == 1) {
            alert("Please enter mean difference as a decimal, not a fraction.")
            meandiff = "a"
        } else {
            for (var i = 0; i < meandiff.length; i++) {
                if (meandiff.charCodeAt(i) == 46 || (meandiff.charCodeAt(i) <= 57 && meandiff.charCodeAt(i) >= 48)) {
                    if (i == meandiff.length - 1) {
                        if (meandiff.charCodeAt(i) == 46) {
                            alert("You must enter a valid number for mean difference.")
                            break;
                        }
                    }
                } else {

                    alert("You must enter a valid number for mean difference.")

                    break;
                }
            }
        }

    };


    //This function makes sure the user has typed in a valid floating point number for one sample mean difference and assigns
    //this number to the global variable for one sample mean difference. 
    var meandiffText_onesamp = function () {
        meandiff_onesamp = $('#meandiffText_onesamp').val();
        var slash = 0;
        if (meandiff_onesamp.indexOf('/') > -1) {
            slash = 1;
        }
        meandiff_onesamp = parseFloat(meandiff_onesamp)
        if (slash == 1) {
            alert("Please enter mean difference as a decimal, not a fraction.")
            meandiff_onesamp = "a"
        } else {
            for (var i = 0; i < meandiff_onesamp.length; i++) {
                if (meandiff_onesamp.charCodeAt(i) == 46 || (meandiff_onesamp.charCodeAt(i) <= 57 && meandiff_onesamp.charCodeAt(i) >= 48)) {
                    if (i == meandiff_onesamp.length - 1) {
                        if (meandiff_onesamp.charCodeAt(i) == 46) {
                            alert("You must enter a valid number for mean difference.")
                            break;
                        }
                    }
                } else {

                    alert("You must enter a valid number for mean difference.")

                    break;
                }
            }
        }

    };

    //This function makes sure the user has typed in a valid floating point number for absolute value mean difference and assigns
    //this number to the global variable for absolute value mean difference. 
    var absmeandiffText = function () {
        absmeandiff = $('#absmeandiffText').val();
        var slash = 0;
        if (absmeandiff.indexOf('/') > -1) {
            slash = 1;
        }
        absmeandiff = parseFloat(absmeandiff)
        if (slash == 1) {
            alert("Please enter absolute value mean difference as a decimal, not a fraction.")
            absmeandiff = "a"
        } else {
            for (var i = 0; i < absmeandiff.length; i++) {
                if (absmeandiff.charCodeAt(i) == 46 || (absmeandiff.charCodeAt(i) <= 57 && absmeandiff.charCodeAt(i) >= 48)) {
                    if (i == absmeandiff.length - 1) {
                        if (absmeandiff.charCodeAt(i) != 46) {
                            alert("You must enter a valid number for absolute value mean difference.")
                            break;
                        }
                    }
                } else {

                    alert("You must enter a valid number for absolute value mean difference.")

                    break;
                }
            }
        }
    };

    //This function makes sure the user has typed in a valid floating point number for one sample absolute value mean difference and assigns
    //this number to the global variable for one sample absolute value mean difference.
    var absmeandiffText_onesamp = function () {
        absmeandiff_onesamp = $('#absmeandiffText_onesamp').val();
        var slash = 0;
        if (absmeandiff_onesamp.indexOf('/') > -1) {
            slash = 1;
        }
        absmeandiff_onesamp = parseFloat(absmeandiff_onesamp)
        if (slash == 1) {
            alert("Please enter absolute value mean difference as a decimal, not a fraction.")
            absmeandiff_onesamp = "a"
        } else {
            for (var i = 0; i < absmeandiff_onesamp.length; i++) {
                if (absmeandiff_onesamp.charCodeAt(i) == 46 || (absmeandiff_onesamp.charCodeAt(i) <= 57 && absmeandiff_onesamp.charCodeAt(i) >= 48)) {
                    if (i == absmeandiff_onesamp.length - 1) {
                        if (absmeandiff_onesamp.charCodeAt(i) == 46) {
                            alert("You must enter a valid number for absolute value mean difference.")
                            break;
                        }
                    }
                } else {

                    alert("You must enter a valid number for absolute value mean difference.")

                }
            }
        }
    };

    //This function makes sure the user has typed in a valid floating point number for delta and assigns
    //this number to the global variable for delta.
    var deltaTextInput = function () {
        delta = $('#deltaText').val();
        var slash = 0;
        if (delta.indexOf('/') > -1) {
            slash = 1;
            console.log(slash)
        }
        delta = parseFloat(delta);
        if (slash == 1) {
            alert("Please enter delta as a decimal, not a fraction.")
            delta = "a"
        } else {
            for (var i = 0; i < delta.length; i++) {
                if (delta.charCodeAt(i) == 46 || (delta.charCodeAt(i) <= 57 && delta.charCodeAt(i) >= 48)) {
                    if (i == delta.length - 1) {
                        if (delta.charCodeAt(i) == 46) {
                            alert("You must enter a valid number for delta.")
                            break;
                        }
                    }
                } else {
                    alert("You must enter a valid number for delta.")

                    break;
                }
            }
        }
    };

    //This function makes sure the user has typed in a valid floating point number for standard deviation and assigns
    //this number to the global variable for standard deviation. Additionally, it detects whether the user has 
    //chosen to enter the variance or standard deviation. If the user has chosen to enter the variance, the square root of
    //that number is stored into the global variable sigma for standard deviation. 
    var stddevTextInput = function () {
        if (selectedSigma == "powerone") {
            sigma = $('#stddevtext').val();
            console.log(sigma)
        } else {
            var sigmatemp = $('#stddevtext').val();
            sigma = Math.sqrt(sigmatemp)
            console.log(sigmatemp)
            console.log(sigma)
        }
        var slash = 0;
        if (sigma.indexOf('/') > -1) {
            slash = 1;
        }
        sigma = parseFloat(sigma);
        if (slash == 1) {
            alert("Please enter standard deviation as a decimal, not a fraction.")
            sigma = "a"
        } else {
            for (var i = 0; i < sigma.length; i++) {
                if (sigma.charCodeAt(i) == 46 || (sigma.charCodeAt(i) <= 57 && sigma.charCodeAt(i) >= 48)) {
                    if (i == sigma.length - 1) {
                        if (sigma.charCodeAt(i) == 46) {
                            alert("You must enter a valid number for standard deviation.")
                            break;
                        }
                    }
                } else {

                    alert("You must enter a valid number for standard deviation.")

                    break;
                }
            }
        }
    };


    //This function switches the tabs correctly when the user presses a tab button. 
    $(function () {
        $('.tablinks').click(function () {
            if ($(this).attr('id') == "sampsizetaboption") {
                if ($('#sampsizetab').attr('style') == "display: none" || $('#sampsizetab').attr('style') == "display: none;") {
                    $('#sampsizetab').toggle();
                    $('#helptab').toggle();
                    $('#sampsizetaboption').css('background-color', "#C6C3B9");
                    $('#helptaboption').css('background-color', "#D1CFC7");
                }
            } else if ($(this).attr('id') == "helptaboption") {
                if ($('#helptab').attr('style') == "display: none" || $('#helptab').attr('style') == "display: none;") {
                    $('#sampsizetab').toggle();
                    $('#helptab').toggle();
                    $('#helptaboption').css('background-color', "#C6C3B9");
                    $('#sampsizetaboption').css('background-color', "#D1CFC7");
                }
            }
        });
    });

    //This function registers whether a user has selected standard deviation or variance, and stores this
    //as a global variable. This is used in the standard deviation function. 
    $(function () {
        $('#hypotheses').on('click', '.stddevpower', function () {
            if ($(this).attr('id') == "sigmapowerone") {
                selectedSigma = "powerone"
                $('#sigmapowerone').css('color', "#615E65");
                $('#sigmapowertwo').css('color', "#8E8C91");
            } else if ($(this).attr('id') == "sigmapowertwo") {
                selectedSigma = "powertwo"
                $('#sigmapowerone').css('color', "#8E8C91");
                $('#sigmapowertwo').css('color', "#615E65");
            }
        });
    });

    //This function is purely for asthetic purposes; it changes the color of the help tab when the user hovers over it.
    $("#helptaboption").hover(function () {
        $(this).css("background-color", "#C1BDB3");
    }, function () {
        if ($('#helptab').attr('style') == "display: none" || $('#helptab').attr('style') == "display: none;") {
            $(this).css("background-color", "#D1CFC7");
        } else {
            $(this).css("background-color", "#C6C3B9");
        }
    });

    //This function is purely for asthetic purposes; it changes the color of the sample size tab when the user hovers over it.
    $("#sampsizetaboption").hover(function () {
        $(this).css("background-color", "#C1BDB3");
    }, function () {
        if ($('#sampsizetab').attr('style') == "display: none" || $('#sampsizetab').attr('style') == "display: none;") {
            $(this).css("background-color", "#D1CFC7");
        } else {
            $(this).css("background-color", "#C6C3B9");
        }
    });

    //This function registers what the user is typing in to the search bar in the help tab and fills in matching vocab
    //words from the term/definition JSON pairs defined at the top of this file. 
    $(".searchBar").on('input', function () {
        $('.helpDefinitions').empty();
        var val = this.value.toLowerCase();
        $.each(terms, function (index, item) {
            if (terms[index].term.toLowerCase().indexOf(val) >= 0) {
                $('.helpDefinitions').append("<p><span class = 'term'>" + terms[index].term + ":</span> <span class = 'def'>" + terms[index].definition + "</span></p><br>")
            }

        });
        if (val == "") {
            $('.helpDefinitions').empty();
        }

    });

    alphaSlider();
    powerSlider();
})