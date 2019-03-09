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

    if ((p < 0) || (p > 1))
    {
        alert("NormSInv: Argument out of range.");
        retVal = 0;
    }
    else if (p < p_low)
    {
        q = Math.sqrt(-2 * Math.log(p));
        retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    else if (p <= p_high)
    {
        q = p - 0.5;
        r = q * q;
        retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    else
    {
        q = Math.sqrt(-2 * Math.log(1 - p));
        retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
}

$(document).ready(function () {

    var alpha = 0.05;
    var beta = 0.00;
    var power = 80;
    var trtGroupAName = "Treatment A";
    var trtGroupBName = "Treatment B";
    var nullHyp = 0;
    var altHyp = 0;
    var testType = $('.testTypes').val();
    var delta = 0;
    var sigma = 0;
    var nratio = 1; 
    var meandiff = 0;
    var absmeandiff = 0; 
    var terms2;
    var n_a = 0;
    var n_b = 0;
    var n_total = 0; 
    var selectedSigma = "powerone"

    var nullhypothesishtmldiv = '<div class="nullHypothesis">&mu;: <br> <textarea class="textNum" id="nullHyp" placeholder="0"></textarea> </div>'
    var althypothesishtmldiv = '<div class="altHypothesis">&mu;<sub>0</sub>: <br> <textarea class="textNum" id="altHyp" placeholder="0"></textarea> </div>'
    var stddevhtmldiv = '<div class="stddev"><span class="stddevpower" id="sigmapowerone">&sigma;</span><span id="bar"> | <span><span class="stddevpower" id="sigmapowertwo">&sigma;<sup>2</sup></span>: <br> <textarea class="textNum" id="stddevtext" placeholder="0"></textarea> </div>'
    var deltahtmldiv = '<div class="delta">&delta;: <br> <textarea class="textNum" id="deltaText" placeholder="0"></textarea> </div>'
    var meandiffhtmldiv = '<div class="meandiff">&mu;<sub>0</sub>-&mu;<sub>1</sub>: <br> <textarea class = "textNum" id="meandiffText" placeholder="0"></textarea></div>'
    var absmeandiffhtmldiv = '<div class="absmeandiff">|&mu;<sub>0</sub>-&mu;<sub>1</sub>|: <br> <textarea class = "textNum" id="absmeandiffText" placeholder="0"></textarea></div>'
    var ratiohtmldiv = '<div class="nratio">k:<br><textarea class="textNum" id="nratio" placeholder="1"></textarea></div>'

    var terms2 = [
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
        }

    ]


    $.each(terms2, function (index, item) {
        $('#668terms').append('<option value="' + terms2[index].term + '">')
    });

    $('.testTypes').change(function () {
        testType = $('.testTypes').val();
        $('#hypotheses').empty();
        console.log(testType);
        if (testType == "noninf1") {
            if ($('#n_ratio').attr('style') != "display: none" && $('#n_ratio').attr('style') != "display: none;") {
                $('#n_ratio').toggle()
            }
            if ($('.trtGroup_B').attr('style') != "display: none" && $('.trtGroup_B').attr('style') != "display: none;") {
                $('.trtGroup_B').toggle()
            }
            $('#testDisplayNull').html("H<sub>0</sub>: &mu; - &mu;<sub>0</sub> &lt; &delta;")
            $('#testDisplayAlt').html("H<sub>a</sub>: &mu; - &mu;<sub>0</sub> &ge; &delta;")
            $('#hypotheses').append(nullhypothesishtmldiv);
            $('#hypotheses').append(althypothesishtmldiv);
            $('#hypotheses').append(stddevhtmldiv);
            $('#hypotheses').append(deltahtmldiv)
        } else if (testType == "sup1") {
            $('#testDisplayNull').html("H<sub>0</sub>: &mu; - &mu;<sub>0</sub> = 0")
            $('#testDisplayAlt').html("H<sub>a</sub>: &mu; - &mu;<sub>0</sub> &ne; 0")
            if ($('#n_ratio').attr('style') != "display: none" && $('#n_ratio').attr('style') != "display: none;") {
                $('#n_ratio').toggle()
            }
            if ($('.trtGroup_B').attr('style') != "display: none" && $('.trtGroup_B').attr('style') != "display: none;") {
                $('.trtGroup_B').toggle()
            }
            $('#hypotheses').append(nullhypothesishtmldiv);
            $('#hypotheses').append(althypothesishtmldiv);
            $('#hypotheses').append(stddevhtmldiv);
        } else if (testType == "equiv1") {
            $('#testDisplayNull').html("H<sub>0</sub>: |&mu; - &mu;<sub>0</sub>| &ge; &delta;")
            $('#testDisplayAlt').html("H<sub>a</sub>: |&mu; - &mu;<sub>0</sub>| &lt; &delta;")
            if ($('#n_ratio').attr('style') != "display: none" && $('#n_ratio').attr('style') != "display: none;") {
                $('#n_ratio').toggle()
            }
            if ($('.trtGroup_B').attr('style') != "display: none" && $('.trtGroup_B').attr('style') != "display: none;") {
                $('.trtGroup_B').toggle()
            }
            $('#hypotheses').append(nullhypothesishtmldiv);
            $('#hypotheses').append(althypothesishtmldiv);
            $('#hypotheses').append(stddevhtmldiv);
            $('#hypotheses').append(deltahtmldiv)
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
        }
    });

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

    $(function () {
        $(".textAreaA").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                trtGroupAName = $('.textAreaA').val();
                $('.trtGroup_A').empty();
                $('.trtGroup_A').attr('id', 'finalName')
                $('.trtGroup_A').append("1. " + trtGroupAName);
            }
        });
    });

    $(function () {
        $("#resetOptions").click(function () {
            location.reload();
        });
    });

    $(function () {
        $("#simulate").click(function () {
            $('#samplesize').empty();
            console.log(testType)
            if (testType == "sup2") {
                let zbeta = NormSInv(1-beta)
                let zalphaover2 = NormSInv(1-(alpha/2))
                let kplusone = parseFloat(nratio) + 1;
                let naNum = kplusone * Math.pow(sigma,2) * Math.pow((zbeta+zalphaover2),2);
                let naden = Math.pow(meandiff,2)
                
                n_a=Math.ceil(naNum/naden);
                n_b=Math.ceil(n_a/parseFloat(nratio));
                n_total = n_a+n_b;
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                $('#samplesize').append("<p id = 'sampsizenum'>Your total sample size should be greater than or equal to " + n_total + ". You need at least " + n_a +" subjects for " + trtGroupAName+ " and at least " + n_b + " subjects for " + trtGroupBName +". Note: sample size calculations have been rounded up to nearest integer value.</p>")
            } else if (testType == "noninf2") {
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                $('#samplesize').append("<p id = 'sampsizenum'>Your total sample size should be greater than or equal to " + n_total + ". You need at least " + n_a +" subjects for " + trtGroupAName+ " and at least " + n_b + " subjects for " + trtGroupBName +". Note: sample size calculations have been rounded up to nearest integer value.</p>")
            } else if (testType == "equiv2") {
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                $('#samplesize').append("<p id = 'sampsizenum'>Your total sample size should be greater than or equal to " + n_total + ". You need at least " + n_a +" subjects for " + trtGroupAName+ " and at least " + n_b + " subjects for " + trtGroupBName +". Note: sample size calculations have been rounded up to nearest integer value.</p>")
            } else if (testType == "sup1") {
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                $('#samplesize').append("<p id = 'sampsizenum'>You need at least " + n_total +" subjects in your study (" + trtGroupAName + "). Note: sample size calculations have been rounded up to nearest integer value.</p>")
            } else if (testType == "noninf1") {
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                $('#samplesize').append("<p id = 'sampsizenum'>You need at least " + n_total +" subjects in your study (" + trtGroupAName + "). Note: sample size calculations have been rounded up to nearest integer value.</p>")
            } else if (testType == "equiv1") {
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                $('#samplesize').append("<p id = 'sampsizenum'>You need at least " + n_total +" subjects in your study (" + trtGroupAName + "). Note: sample size calculations have been rounded up to nearest integer value.</p>")
            } else {
                $('#samplesize').append("<h2>Sample Size Breakdown</h2>")
                $('#samplesize').append("<p id = 'sampsizenum'>Please select a test and fill out the appropriate parameter values.</p>")
            }
    
        });
    });

    $(function () {
        $(".textAreaB").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                trtGroupBName = $('.textAreaB').val();
                if (trtGroupBName == trtGroupAName) {
                    alert("You cannot have duplicate treatment group names.")
                } else {
                    $('.trtGroup_B').empty();
                    $('.trtGroup_B').attr('id', 'finalName')
                    $('.trtGroup_B').append("2. " + trtGroupBName);
                }
            }
        });
    });

    $(function () {
        $('#hypotheses').on('keypress', '.nratio', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                nratio = $('#nratio').val();
                for (var i = 0; i < nratio.length; i++) {
                    if (nratio.charCodeAt(i) == 46 || (nratio.charCodeAt(i) <= 57 && nratio.charCodeAt(i) >= 48)) {
                        if (i == nratio.length - 1) {
                            if (nratio.charCodeAt(i) != 46) {
                                $('.nratio').empty();
                                $('.nratio').attr('id', 'nValue')
                                $('.nratio').append("n<sub>0</sub> = " + nratio + "n<sub>1</sub>");
                            } else {
                                alert("You must enter a valid number.")
                                break;
                            }
                        }
                    } else {
                        alert("You must enter a valid number.")
                        break;
                    }
                }
            }
        });
    });

    $(function () {
        $('#hypotheses').on('keypress', '.meandiff', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                meandiff = $('#meandiffText').val();
                for (var i = 0; i < meandiff.length; i++) {
                    if (meandiff.charCodeAt(i) == 46 || (meandiff.charCodeAt(i) <= 57 && meandiff.charCodeAt(i) >= 48)) {
                        if (i == meandiff.length - 1) {
                            if (meandiff.charCodeAt(i) != 46) {
                                $('.meandiff').empty();
                                $('.meandiff').attr('id', 'meandiffValue')
                                $('.meandiff').append("&mu;<sub>0</sub>-&mu;<sub>1</sub>: " + meandiff);
                            } else {
                                alert("You must enter a valid number.")
                                break;
                            }
                        }
                    } else {
                        alert("You must enter a valid number.")
                        break;
                    }
                }
            }
        });
    });


    $(function () {
        $('#hypotheses').on('keypress', '.absmeandiff', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                absmeandiff = $('#absmeandiffText').val();
                for (var i = 0; i < absmeandiff.length; i++) {
                    if (absmeandiff.charCodeAt(i) == 46 || (absmeandiff.charCodeAt(i) <= 57 && absmeandiff.charCodeAt(i) >= 48)) {
                        if (i == absmeandiff.length - 1) {
                            if (absmeandiff.charCodeAt(i) != 46) {
                                $('.absmeandiff').empty();
                                $('.absmeandiff').attr('id', 'absmeandiffValue')
                                $('.absmeandiff').append("|&mu;<sub>0</sub>-&mu;<sub>1</sub>|: " + absmeandiff);
                            } else {
                                alert("You must enter a valid number.")
                                break;
                            }
                        }
                    } else {
                        alert("You must enter a valid number.")
                        break;
                    }
                }
            }
        });
    });

    $(function () {
        $('#hypotheses').on('keypress', '.delta', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                delta = $('#deltaText').val();
                for (var i = 0; i < delta.length; i++) {
                    if (delta.charCodeAt(i) == 46 || (delta.charCodeAt(i) <= 57 && delta.charCodeAt(i) >= 48)) {
                        if (i == delta.length - 1) {
                            if (delta.charCodeAt(i) != 46) {
                                $('.delta').empty();
                                $('.delta').attr('id', 'deltaValue')
                                $('.delta').append("&delta;: " + delta);
                            } else {
                                alert("You must enter a valid number.")
                                break;
                            }
                        }
                    } else {
                        alert("You must enter a valid number.")
                        break;
                    }
                }
            }
        });
    });

    $(function () {
        $('#hypotheses').on('keypress', '.stddev', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            //alert(code);
            console.log(selectedSigma)
            if (code == 13) {
                if (selectedSigma == "powerone") {
                    sigma = $('#stddevtext').val();
                    console.log(sigma)
                } else {
                    var sigmatemp = $('#stddevtext').val();
                    sigma = Math.sqrt(sigmatemp)
                    console.log(sigmatemp)
                    console.log(sigma)
                }
                for (var i = 0; i < sigma.length; i++) {
                    if (sigma.charCodeAt(i) == 46 || (sigma.charCodeAt(i) <= 57 && sigma.charCodeAt(i) >= 48)) {
                        if (i == sigma.length - 1) {
                            if (sigma.charCodeAt(i) != 46) {
                                $('.stddev').empty();
                                $('.stddev').attr('id', 'stddevvalue')
                                $('.stddev').append("&sigma;: " + sigma);
                            } else {
                                alert("You must enter a valid number.")
                                break;
                            }
                        }
                    } else {
                        alert("You must enter a valid number.")
                        break;
                    }
                }
            }
        });
    });


    $(function () {
        $('#hypotheses').on('keypress', '.nullHypothesis', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            //alert(code);
            if (code == 13) {
                nullHyp = $('#nullHyp').val();
                for (var i = 0; i < nullHyp.length; i++) {
                    if (nullHyp.charCodeAt(i) == 46 || (nullHyp.charCodeAt(i) <= 57 && nullHyp.charCodeAt(i) >= 48)) {
                        if (i == nullHyp.length - 1) {
                            if (nullHyp.charCodeAt(i) != 46) {
                                $('.nullHypothesis').empty();
                                $('.nullHypothesis').attr('id', 'nullValue')
                                $('.nullHypothesis').append("&mu;: " + nullHyp);
                            } else {
                                alert("You must enter a valid number.")
                                break;
                            }
                        }
                    } else {
                        alert("You must enter a valid number.")
                        break;
                    }
                }
            }
        });
    });

    $(function () {
        $('#hypotheses').on('keypress', '.altHypothesis', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            //alert(code);
            if (code == 13) {
                altHyp = $('#altHyp').val();
                for (var i = 0; i < altHyp.length; i++) {
                    if (altHyp.charCodeAt(i) == 46 || (altHyp.charCodeAt(i) <= 57 && altHyp.charCodeAt(i) >= 48)) {
                        if (i == altHyp.length - 1) {
                            if (altHyp.charCodeAt(i) != 46) {
                                $('.altHypothesis').empty();
                                $('.altHypothesis').attr('id', 'altValue')
                                $('.altHypothesis').append("&mu;<sub>0</sub>: " + altHyp);
                            } else {
                                alert("You must enter a valid number.")
                                break;
                            }
                        }
                    } else {
                        alert("You must enter a valid number.")
                        break;
                    }
                }
            }
        });
    });


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

    $(function () {
        $('#hypotheses').on('click', '.stddevpower', function() {
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

    $("#helptaboption").hover(function () {
        $(this).css("background-color", "#C1BDB3");
    }, function () {
        if ($('#helptab').attr('style') == "display: none" || $('#helptab').attr('style') == "display: none;") {
            $(this).css("background-color", "#D1CFC7");
        } else {
            $(this).css("background-color", "#C6C3B9");
        }
    });

    $("#sampsizetaboption").hover(function () {
        $(this).css("background-color", "#C1BDB3");
    }, function () {
        if ($('#sampsizetab').attr('style') == "display: none" || $('#sampsizetab').attr('style') == "display: none;") {
            $(this).css("background-color", "#D1CFC7");
        } else {
            $(this).css("background-color", "#C6C3B9");
        }
    });

    $(".searchBar").on('input', function () {
        $('.helpDefinitions').empty();
        var val = this.value.toLowerCase();
        $.each(terms2, function (index, item) {
            if (terms2[index].term.toLowerCase().indexOf(val) >= 0) {
                $('.helpDefinitions').append("<p><span class = 'term'>" + terms2[index].term + ":</span> <span class = 'def'>" + terms2[index].definition + "</span></p><br>")
            }

        });

        if (val == "") {
            $('.helpDefinitions').empty();
        }

    });



    alphaSlider();
    powerSlider();

})