$(document).ready(function(){
    //Claim Code onsubmit fix (missing id)
    if($('body').hasClass('is-shopping-bag')) {
        $('input.claimCodeField[placeholder="Enter promo"]').attr('id', 'claimCodeField');
    }

    // Show popup for final sale DTC-3390
    $(window).resize(function(){

        if(window.matchMedia("(max-device-width: 767px)").matches){
            $(".item-is-clearance .clearance-tooltip, .product-price-final .clearance-tooltip").removeClass("top").addClass("left");
        } else {
            $(".item-is-clearance .clearance-tooltip, .product-price-final .clearance-tooltip").removeClass("left").addClass("top");
        }
    }).resize();

    //Clear previous Gift Balance Message
    $('#gc-submit').click(function(){
        $('#zone-error2').html('');
    });
    // executes when complete page is fully loaded, including all frames, objects and images
    $('#CheckoutPage #checkout-guest-sre').live('click', function(){
        _cto.closeModals();
        sr_$.payrunner.Controller.initializePayRunner();
        return false;
    });

    if($('#srEnabled').length > 0) {
        $('#checkout-login-sre').live('click',function() {
            loadCheckoutLoginForm();
        });


        //DTC-4733 - Submit login form on pressing enter
        $("form[name='loginSREForm']").live('keypress', function(e){
            // key code for enter is 13
            if (e.which === 13) {
                loadCheckoutLoginForm();
                e.preventDefault();
            }
        });
    }
});


function loadCheckoutLoginForm() {
    _cto.ajaxSubmit('form[name="loginSREForm"]', {
        dataType: 'json',
        showLoader: false,
        success: function(data) {
            if(data.errors){
                var checkoutLoginErrors = jQuery.parseJSON(data.errors)[0].email || jQuery.parseJSON(data.errors)[0].password;
                $('.checkout-login-form').hide();
                var $alert = $('<div class="alert alert-danger checkout-login-form">' + checkoutLoginErrors + '</div>');
                $('.login-wrap').before($alert);
            }else{
                _cto.closeModals();
                if(data.associate=='false') {
                    sr_$.payrunner.Controller.initializePayRunner();
                } else {
                    location.reload();
                }
            }

        },
        error: function(errorMessage) {
            if($(errorMessage.response).find('.alert-danger') != undefined){
                var errorMessageresponse = $(errorMessage.response).find('.alert-danger').html().replace(/<!--(.*?)-->/, "");
                var $alert = $('<div class="alert alert-danger checkout-login-form">' + errorMessageresponse + '</div>');
                $('.checkout-login-form').hide();
                $('.login-wrap').before($alert);
                console.log("AJAX Error=" + _cto.Lang.global.general + ' (' + errorMessageresponse + ')');
            }
        }
    });
}

function loadDualEligibilityDivForHazmat(){
    if(cartData.hazMatError == 'true'){
        var srHeaderDiv = $("div[name='sr_headerDiv']");

        if(srHeaderDiv.length){
            srHeaderDiv.remove();
            $('div.sr-cart').append('<div name="sr_dualEligibilityDiv"></div>');
        }
    }
}

function loadHeaderDivForHazmat(){
    var srDualEligibility = $("div[name='sr_dualEligibilityDiv']");

    if(srDualEligibility.length){
        srDualEligibility.remove();
        $('div.sr-cart').append('<div name="sr_headerDiv"></div>');
    }
}