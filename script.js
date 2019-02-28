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
    var terms = {};
    var displayedTerms = [];

    terms["Non-inferiority Test"] = "test definition";
    terms["testitem1"] = "test definition";
    terms["test item 1"] = "test definition";
    terms["testitem2"] = "test definition";
    for (var key in terms) {
        $('#668terms').append('<option value="' + key + '">')
    }

    $('.testTypes').change(function () {
        testType = $('.testTypes').val();
        $('.hypotheses').empty();
        console.log(testType);
        if (testType == "noninf") {
            $('#testDisplayNull').html("H<sub>0</sub>: &mu; - &mu;<sub>0</sub> &lt; &delta;")
            $('#testDisplayAlt').html("H<sub>a</sub>: &mu; - &mu;<sub>0</sub> &ge; &delta;")
            $('#hypotheses').append('<div class="nullHypothesis">&mu;: <br> <textarea class="nullHyp" placeholder="0"></textarea> </div> <div class="altHypothesis">&mu;<sub>0</sub>: <br> <textarea class="altHyp" placeholder="0"></textarea> </div><div class="stddev">&sigma;: <br> <textarea class="stddevtext" placeholder="0"></textarea> </div>')
            $('#hypotheses').append('<div class="delta">&delta;: <br> <textarea class="deltaText" placeholder="0"></textarea> </div>')
        } else if (testType == "sup") {
            $('#testDisplayNull').html("H<sub>0</sub>: &mu; - &mu;<sub>0</sub> = 0")
            $('#testDisplayAlt').html("H<sub>a</sub>: &mu; - &mu;<sub>0</sub> &ne; 0")
            $('#hypotheses').append('<div class="nullHypothesis">&mu;: <br> <textarea class="nullHyp" placeholder="0"></textarea> </div> <div class="altHypothesis">&mu;<sub>0</sub>: <br> <textarea class="altHyp" placeholder="0"></textarea> </div><div class="stddev">&sigma;: <br> <textarea class="stddevtext" placeholder="0"></textarea> </div>')
        } else if (testType == "equiv") {
            $('#testDisplayNull').html("H<sub>0</sub>: |&mu; - &mu;<sub>0</sub>| &ge; &delta;")
            $('#testDisplayAlt').html("H<sub>a</sub>: |&mu; - &mu;<sub>0</sub>| &lt; &delta;")
            $('#hypotheses').append('<div class="nullHypothesis">&mu;: <br> <textarea class="nullHyp" placeholder="0"></textarea> </div> <div class="altHypothesis">&mu;<sub>0</sub>: <br> <textarea class="altHyp" placeholder="0"></textarea> </div><div class="stddev">&sigma;: <br> <textarea class="stddevtext" placeholder="0"></textarea> </div>')
            $('#hypotheses').append('<div class="delta">&delta;: <br> <textarea class="deltaText" placeholder="0"></textarea> </div>')
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
                console.log(power);
            });
        });
        beta = (100 - power) / 100.0;
        console.log(beta);
    };

    $(function () {
        $(".textAreaA").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            //alert(code);
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
        $(".textAreaB").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            //alert(code);
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
        $('#hypotheses').on('keypress', '.delta', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            //alert(code);
            if (code == 13) {
                delta = $('.deltaText').val();
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
            if (code == 13) {
                sigma = $('.stddevtext').val();
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
        $('#hypotheses').on('keypress', '.nullHyp', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            //alert(code);
            if (code == 13) {
                nullHyp = $('.nullHyp').val();
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
        $('#hypotheses').on('keypress', '.altHyp', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            //alert(code);
            if (code == 13) {
                altHyp = $('.altHyp').val();
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
        displayedTerms = [];
        var val = this.value.toLowerCase();
        for (var key in terms) {
            if (key.toLowerCase().indexOf(val) >= 0) {
                if (!displayedTerms.includes(key)) {
                    $('.helpDefinitions').append("<p id='" + key + "' " + "><span class = 'term'>" + key + ":</span> <span class = 'def'>" + key.value + "</span></p>")
                    displayedTerms.push(key)
                }
            }
        }
        if (val == "") {
            $('.helpDefinitions').empty();
            displayedTerms = [];
        }
    });

    alphaSlider();
    powerSlider();

})