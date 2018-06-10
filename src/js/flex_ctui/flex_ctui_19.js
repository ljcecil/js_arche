            // checkout step handler
            $.history.init(function() {

                setInterval(function() {

                    switch(window.location.hash) {

                        case '#start':

                            if(prevHash == window.location.hash) {
                                /* Current: #start
                                 * Prev: (current) */
                                break;

                            } else {
                                /* Current: #start
                                 * Prev: (any) */
                                _cto.logStep('#start', '(any)');

                                // lock the stage if user submits the form again
                                if(prevHash == '#payment' || prevHash == '#review') _cto.statics.stageLock = true;

                                prevHash = window.location.hash;

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':shipping' , siteCatalyst_loginStatus);

                                $('#co-shipping').removeClass('co-review-stage');
                                $('#co-billing-header').addClass('co-inactive-default-section');
                                $('#co-content').removeClass().addClass('start-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Shipping Information',
                                    'src': '../images/checkout_redesign/co_review_header_shippingInfo.gif'
                                });

                                $('#co-content').children().stop(true); // stop current animations
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); // reset styles

                                $('#co-shipping-options, #co-billing-options').show().
                                    css('opacity', 1);

                                $('#co-shipping-options').
                                    css('zIndex', 1);

                                //@@ fix this
                                $('#co-shipping-review, #co-billing-review, #co-billing-content, #co-order-review-actions, #co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                //@@ fix this
                                //$('#co-shipping').css('height', $('#co-shipping-content').outerHeight());

                                $('#co-billing').css('height', $('#co-billing-header').outerHeight() - 1);

                                // update inline shipping form country select/input
                                if($('#coShipToCity input').length < 1)
                                    _cto.initCityStateCountry(cscParams.shipping);

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                            }

                            break

                        /*   case '#shipping':
                         *   Case for #shipping removed. This step was causing an issue DTC-3706 during the checkout process and the #shipping step appears to be un-needed
                         */

                        case '#payment':

                            if(prevHash == window.location.hash) {
                                /* Current: #payment
                                 * Prev: current */
                                break;

                            } else if(!prevHash) {
                                /* Current: #payment
                                 * Prev: (none) */
                                _cto.logStep('#payment', '(none)');

                                prevHash = window.location.hash;

                                _cto.showCreditCardForm(cscParams);

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);

                                // clear form errors
                                _cto.clearFormErrors('form');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');

                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });

                                $('#co-content').children().stop(true); // stop current animations
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); // reset styles

                                $('#co-shipping-proceed').
                                    css({ 'height': '20px', 'opacity': 0, 'padding': 0, 'left': -1000 });

                                $('#co-billing-options').show().
                                    css('opacity', 1);

                                $('#co-billing-gift-result').removeAttr('style').hide();
                                $('#co-billing-gift-form').removeAttr('style').show();


                                $('#co-billing-gift-result-remove, #co-billing-review, #co-shipping-options, #co-order-commit-actions, #co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                $('#co-billing-header').css('zIndex', 1);

                                //@@ fix this
                                $('#co-shipping').
                                    css('height',
                                    $('#co-shipping-header').outerHeight() +
                                    $('#co-shipping-review').outerHeight());
                                $('#co-shipping-options').show().css('opacity', 1);
                                $('#co-shipping').css('height', 'auto');


                                $('#co-billing').
                                    css('height',
                                    $('#co-billing-header').outerHeight() +
                                    $('#co-billing-content').outerHeight());

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');
                                break;

                            } else if(prevHash == '#giftCardRegister') {
                                /* Current: #payment
                                 * Prev: #giftCardRegister */
                                _cto.logStep('#payment', '#giftCardRegister)');

                                prevHash = window.location.hash;

                                // remove current gift card so user can check balance of another
                                document.frmRemoveGiftcard.submit();

                                _cto.showCreditCardForm(cscParams);

                                // clear inputs
                                $('#co-billing-gift-form input[type="text"]').val('');

                                // clear form errors
                                _cto.clearFormErrors('form');

                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });

                                $('#co-content').children().not('.asyncForm, #co-order-review-actions, #co-shipping-proceed, #co-shipping, #co-shipping-options').removeAttr('style'); // reset styles

                                $('#co-shipping-review').
                                    css('zIndex', 2);

                                $('#co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                $('#co-billing-header').css('zIndex', 1);
                                //$('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', 'relative');

                                var runOnce = 0;
                                _cto.orderStageHeight(false);
                                $('#co-billing-gift-result-remove, #frmRegisterInline_wrapper').animate({ 'opacity': 0 },
                                    Config.OrderPage.duration2,
                                    'fasEaseIn',
                                    function() {
                                        if(runOnce < 1) {
                                            $('#co-billing-gift-result-remove, #frmRegisterInline_wrapper, #creditCardForm_container, #co-billing-gift-form').fasToggle({
                                                'duration': Config.OrderPage.duration2,
                                                'callback': function() {
                                                    _cto.orderStageHeight(true);
                                                    if(_cto.statics.isIE6) $('#co-content select').show().css('opacity', 1);
                                                }
                                            });
                                        }
                                        runOnce++;
                                    }
                                );
                            } else if(prevHash == '#giftCardAdditionalPayment') {
                                /* Current: #payment
                                 * Prev: #giftCardAdditionalPayment */
                                _cto.logStep('#payment', '#giftCardAdditionalPayment)');

                                prevHash = window.location.hash;

                                // remove current gift card so user can check balance of another
                                document.frmRemoveGiftcard.submit();

                                _cto.showCreditCardForm(cscParams);

                                // clear inputs
                                $('#co-billing-gift-form input[type="text"]').val('');

                                // clear form errors
                                _cto.clearFormErrors('form');

                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });

                                $('#co-content').children().not('.asyncForm, #co-order-review-actions, #co-shipping-proceed, #co-shipping, #co-shipping-options').removeAttr('style'); // reset styles

                                $('#co-shipping-review').
                                    css('zIndex', 2);

                                $('#co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                //if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                $('#co-billing-header').css('zIndex', 1);
                                //$('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', 'relative');

                                var runOnce = 0;
                                _cto.orderStageHeight(false);
                                $('#co-billing-gift-result-remove').animate({ 'opacity': 0 },
                                    Config.OrderPage.duration2,
                                    'fasEaseIn',
                                    function() {
                                        if(runOnce < 1) {
                                            $('#co-billing-gift-result-remove, #co-billing-gift-form').fasToggle({
                                                'duration': Config.OrderPage.duration2,
                                                'callback': function() {
                                                    _cto.orderStageHeight(true);
                                                    //if(_cto.statics.isIE6) $('#co-content select').show().css('opacity', 1);
                                                }
                                            });
                                        }
                                        runOnce++;
                                    }
                                );
                            } else if(prevHash == '#shipping') {
                                /* Current: #payment
                                 * Prev: #shipping */
                                _cto.logStep('#payment', '#shipping)');

                                prevHash = window.location.hash;

                                _cto.showCreditCardForm(cscParams);

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);

                                // clear form errors
                                _cto.clearFormErrors('form');

                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });

                                $('#co-content').children().not('.asyncForm, #co-shipping, #co-shipping-options, #co-shipping-proceed').removeAttr('style'); // reset styles

                                $('#co-shipping-review').
                                    css('zIndex', 2);

                                $('#co-order-commit-actions, #co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);

                                coShippingHeight = $('#co-shipping-header').outerHeight() + $('#co-shipping-review').outerHeight();
                                coBillingHeight = $('#co-billing-content').outerHeight();

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                $('#co-billing-header').css('zIndex', 2);
                                //$('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', 'relative');

                                $('#co-shipping-options, #co-shipping-proceed').
                                    animate({ 'opacity': 0 },
                                    Config.OrderPage.duration1,
                                    function(){
                                        $(this).hide();
                                        $('#co-shipping-proceed').animate({ 'height': '20px', 'paddingTop': 0, 'paddingBottom': 0 },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                $(this).css('left', -1000);
                                            }
                                        );
                                        $('#co-shipping').
                                            animate({ 'height': coShippingHeight },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                //this will remove inactive class from #co-billing-header
                                                $('#co-billing-header').removeClass('co-inactive-default-section');
                                                $('#co-shipping-review').show().
                                                    animate({ 'opacity': 1 },
                                                    Config.OrderPage.duration1,
                                                    function() {
                                                        $('#co-billing').
                                                            animate({ 'height': coBillingHeight },
                                                            Config.OrderPage.duration2,
                                                            'fasEaseIn',
                                                            function() {
                                                                $('#co-billing-options').css('zIndex', 1);
                                                                $('#co-billing-content, #co-order-review-actions').show().
                                                                    animate({ 'opacity': 1 },
                                                                    Config.OrderPage.duration1,
                                                                    function() {
                                                                        $('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', '');
                                                                        $('#co-billing-header').css('zIndex', '');
                                                                        if(_cto.statics.isIE6) $('#co-content select').show().css('opacity', 1);;
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );

                            } else if(prevHash != '#review') {
                                /* Current: #payment
                                 * Prev: (not #review) */
                                _cto.logStep('#payment', 'not #review)');

                                prevHash = window.location.hash;

                                _cto.showCreditCardForm(cscParams);

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);

                                // clear form errors
                                _cto.clearFormErrors('form');

                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });

                                $('#co-content').children().not('.asyncForm, #co-shipping, #co-shipping-options').removeAttr('style'); // reset styles

                                $('#co-shipping-review').
                                    css('zIndex', 2);

                                $('#co-order-review-actions, #co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);

                                var coShippingHeight = $('#co-shipping').outerHeight();
                                var coBillingHeight = $('#co-billing-content').outerHeight();

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                $('#co-billing-header').css('zIndex', 2);
                                //$('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', 'relative');


                                $('#co-shipping-options, #co-shipping-proceed').
                                    animate({ 'opacity': 1 },
                                    Config.OrderPage.duration1,
                                    function(){
                                        $('#co-shipping-proceed').animate({ 'height': '20px', 'paddingTop': 0, 'paddingBottom': 0 },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                $(this).hide();
                                                $(this).css('left', -1000);
                                            }
                                        );
                                        $('#co-shipping').
                                            animate({ 'height': coShippingHeight },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                //this will remove inactive class from #co-billing-header
                                                $('#co-billing-header').removeClass('co-inactive-default-section');
                                                $('#co-shipping-review').show().
                                                    animate({ 'opacity': 1 },
                                                    Config.OrderPage.duration1,
                                                    function() {
                                                        $('#co-billing').
                                                            animate({ 'height': coBillingHeight },
                                                            Config.OrderPage.duration2,
                                                            'fasEaseIn',
                                                            function() {
                                                                $('#co-billing-options').css('zIndex', 1);
                                                                $('#co-billing-content, #co-order-review-actions').show().
                                                                    animate({ 'opacity': 1 },
                                                                    Config.OrderPage.duration1,
                                                                    function() {
                                                                        $('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', '');
                                                                        $('#co-billing-header').css('zIndex', '');
                                                                        if(_cto.statics.isIE6) $('#co-content select').show().css('opacity', 1);;
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );

                            } else {
                                /* Current: #payment
                                 * Prev: (any other: !none, !#giftCardRegister, !#giftCardAdditionalPayment, !shipping, !!#review) */
                                // @@ is this a valid scenario?
                                _cto.logStep('#payment', 'see code');

                                prevHash = window.location.hash;
                                $('#modalEditAll').trigger('click');
                                _cto.statics.stageLock = true;
                                window.location.hash = '#review';

                            }

                            break;

                        case '#giftCardRegister':

                            if(prevHash == window.location.hash) {
                                /* Current: #giftCardRegister
                                 * Prev: (current) */
                                break;

                            } else if(!prevHash || prevHash == '#giftCardAdditionalPayment') {
                                /* Current: #giftCardRegister
                                 * Prev: none or #giftCardAdditionalPayment */
                                _cto.logStep('#giftCardRegister', 'none or #giftCardAdditionalPayment');

                                // lock the stage if user submits the form again
                                if(prevHash == '#review') _cto.statics.stageLock = true;

                                prevHash = window.location.hash;

                                _cto.showCreditCardForm(cscParams);

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);

                                // clear form errors
                                _cto.clearFormErrors('form');

                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('giftCardRegister-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });

                                $('#co-content').children().stop(true); // stop current animations
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); // reset styles

                                $('#co-shipping-proceed').
                                    css({ 'height': '20px', 'opacity': 0, 'padding': 0, 'left': -1000 });

                                $('#frmRegisterInline_wrapper, #co-billing-gift-result-remove, #co-billing-gift-collapsed, #co-billing-options').show().
                                    css('opacity', 1);

                                $('#co-billing-gift-result').removeAttr('style').hide();
                                $('#co-billing-gift-form').removeAttr('style').hide();

                                $('#co-billing-gift-uncollapsed, #creditCardForm_container, #co-billing-review, #co-shipping-options, #co-order-commit-actions, #co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                $('#co-billing-header').css('zIndex', 1);

                                $('#co-shipping').
                                    css('height',
                                    $('#co-shipping-header').outerHeight() +
                                    $('#co-shipping-review').outerHeight());

                                $('#co-billing').
                                    css('height',
                                    $('#co-billing-header').outerHeight() +
                                    $('#co-billing-options').outerHeight());

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                break;

                            } else if(prevHash == '#payment') {
                                /* Current: #giftCardRegister
                                 * Prev: #payment */
                                _cto.logStep('#giftCardRegister', '#payment');

                                prevHash = window.location.hash;

                                _cto.showCreditCardForm(cscParams);

                                // clear form errors
                                _cto.clearFormErrors('form');

                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);

                                var runOnce = 0;
                                _cto.orderStageHeight(false);
                                $('#co-billing-gift-result-remove, #frmRegisterInline_wrapper, #creditCardForm_container, #co-billing-gift-form:visible, #co-billing-gift-result:visible').fasToggle({
                                    'duration': Config.OrderPage.duration2,
                                    'callback': function() {
                                        if(runOnce < 1) {
                                            $('#co-billing-gift-result-remove, #frmRegisterInline_wrapper').animate({ 'opacity': 1 },
                                                Config.OrderPage.duration2,
                                                'fasEaseIn',
                                                function() {
                                                    _cto.orderStageHeight(true);
                                                    if(_cto.statics.isIE6) $('#co-content select').show().css('opacity', 1);
                                                }
                                            );
                                        }
                                        runOnce++;
                                    }
                                });

                                break;

                            } else if(prevHash == '#review') {
                                /* Current: #giftCardRegister
                                 * Prev: #review */

                                prevHash = window.location.hash;
                                $('#modalEditAll').trigger('click');
                                _cto.statics.stageLock = true;
                                window.location.hash = '#review';

                            } else {
                                /* Current: #giftCardRegister
                                 * Prev: (any other) !none, !#giftCardAdditionalPayment, !#payment, !#review  */
                                _cto.logStep('#giftCardRegister', 'any other');

                                prevHash = window.location.hash;

                                _cto.showCreditCardForm(cscParams);

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);

                                // clear form errors
                                _cto.clearFormErrors('form');

                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('giftCardRegister-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });

                                $('#co-content').children().not('.asyncForm, #co-shipping, #co-shipping-options').removeAttr('style'); // reset styles

                                $('#co-shipping-review').
                                    css('zIndex', 2);

                                $('#co-order-review-actions, #co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);

                                coShippingHeight = $('#co-shipping-header').outerHeight() + $('#co-shipping-review').outerHeight();
                                coBillingHeight = $('#co-billing-content').outerHeight();

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                $('#co-billing-header').css('zIndex', 2);
                                //$('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', 'relative');

                                $('#co-shipping-options, #co-shipping-proceed').
                                    animate({ 'opacity': 0 },
                                    Config.OrderPage.duration1,
                                    function(){
                                        $(this).hide();
                                        $('#co-shipping-proceed').animate({ 'height': '20px', 'paddingTop': 0, 'paddingBottom': 0 },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                $(this).css('left', -1000);
                                                $(this).hide();
                                            }
                                        );
                                        $('#co-shipping').
                                            animate({ 'height': coShippingHeight },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                //this will remove inactive class from #co-billing-header
                                                $('#co-billing-header').removeClass('co-inactive-default-section');
                                                $('#co-shipping-review').show().
                                                    animate({ 'opacity': 1 },
                                                    Config.OrderPage.duration1,
                                                    function() {
                                                        $('#co-billing').
                                                            animate({ 'height': coBillingHeight },
                                                            Config.OrderPage.duration2,
                                                            'fasEaseIn',
                                                            function() {
                                                                $('#co-billing-options').css('zIndex', 1);
                                                                $('#co-billing-content, #co-order-review-actions').show().
                                                                    animate({ 'opacity': 1 },
                                                                    Config.OrderPage.duration1,
                                                                    function() {
                                                                        $('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', '');
                                                                        $('#co-billing-header').css('zIndex', '');
                                                                        if(_cto.statics.isIE6) $('#co-content select').show().css('opacity', 1);
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );

                            }

                            break;

                        case '#giftCardAdditionalPayment':

                            if(prevHash == window.location.hash) {
                                /* Current: #giftCardAdditionalPayment
                                 * Prev: (current) */

                                break;

                            } else if(!prevHash || prevHash == '#giftCardRegister') {
                                /* Current: #giftCardAdditionalPayment
                                 * Prev: none or #giftCardRegister */
                                _cto.logStep('#giftCardAdditionalPayment', 'none or #giftCardRegister');

                                // lock the stage if user submits the form again
                                if(prevHash == '#review') _cto.statics.stageLock = true;

                                prevHash = window.location.hash;

                                _cto.showCreditCardForm(cscParams);

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);

                                // clear form errors
                                _cto.clearFormErrors('form');

                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('giftCardRegister-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });

                                $('#co-content').children().stop(true); // stop current animations
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); // reset styles

                                $('#co-shipping-proceed').
                                    css({ 'height': '20px', 'opacity': 0, 'padding': 0, 'left': -1000 });

                                $('#creditCardForm_container, #co-billing-gift-result-remove, #co-billing-gift-collapsed, #co-billing-options').show().
                                    css('opacity', 1);

                                $('#co-billing-gift-result').removeAttr('style').hide();
                                $('#co-billing-gift-form').removeAttr('style').hide();

                                $('#frmRegisterInline_wrapper, #co-billing-gift-uncollapsed, #co-billing-review, #co-shipping-options, #co-order-commit-actions, #co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                $('#co-billing-header').css('zIndex', 1);

                                $('#co-shipping').
                                    css('height',
                                    $('#co-shipping-header').outerHeight() +
                                    $('#co-shipping-review').outerHeight());

                                $('#co-billing').
                                    css('height',
                                    $('#co-billing-header').outerHeight() +
                                    $('#co-billing-content').outerHeight());

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                break;

                            } else if(prevHash == '#payment') {
                                /* Current: #giftCardAdditionalPayment
                                 * Prev: #payment */
                                _cto.logStep('#giftCardAdditionalPayment', '#payment');

                                prevHash = window.location.hash;

                                _cto.showCreditCardForm(cscParams);

                                var runOnce = 0;
                                _cto.orderStageHeight(false);
                                $('#co-billing-gift-result-remove, #co-billing-gift-form:visible, #co-billing-gift-result:visible').fasToggle({
                                    'duration': Config.OrderPage.duration2,
                                    'callback': function() {
                                        if(runOnce < 1) {
                                            $('#co-billing-gift-result-remove').animate({ 'opacity': 1 },
                                                Config.OrderPage.duration2,
                                                'fasEaseIn',
                                                function() {
                                                    _cto.orderStageHeight(true);
                                                }
                                            );
                                        }
                                        runOnce++;
                                    }
                                });

                                break;

                            } else if(prevHash == '#review') {
                                /* Current: #giftCardAdditionalPayment
                                 * Prev: #review */

                                prevHash = window.location.hash;
                                $('#modalEditAll').trigger('click');
                                _cto.statics.stageLock = true;
                                window.location.hash = '#review';

                            } else {
                                /* Current: #giftCardAdditionalPayment
                                 * Prev: !none, #giftCardRegister, !#payment, !#review */
                                _cto.logStep('#giftCardAdditionalPayment', '!none, #giftCardRegister, !#payment, !#review');

                                prevHash = window.location.hash;

                                _cto.showCreditCardForm(cscParams);

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);

                                // clear form errors
                                _cto.clearFormErrors('form');

                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('giftCardAdditionalPayment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });

                                $('#co-content').children().not('.asyncForm, #co-shipping, #co-shipping-options').removeAttr('style'); // reset styles

                                $('#co-shipping-review').
                                    css('zIndex', 2);

                                $('#co-order-review-actions, #co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);

                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);

                                coShippingHeight = $('#co-shipping-header').outerHeight() + $('#co-shipping-review').outerHeight();
                                coBillingHeight = $('#co-billing-content').outerHeight();

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                $('#co-billing-header').css('zIndex', 2);
                                //$('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', 'relative');

                                $('#co-shipping-options, #co-shipping-proceed').
                                    animate({ 'opacity': 0 },
                                    Config.OrderPage.duration1,
                                    function(){
                                        $(this).hide();
                                        $('#co-shipping-proceed').animate({ 'height': '20px', 'paddingTop': 0, 'paddingBottom': 0 },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                $(this).css('left', -1000);
                                            }
                                        );
                                        $('#co-shipping').
                                            animate({ 'height': coShippingHeight },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                //this will remove inactive class from #co-billing-header
                                                $('#co-billing-header').removeClass('co-inactive-default-section');
                                                $('#co-shipping-review').show().
                                                    animate({ 'opacity': 1 },
                                                    Config.OrderPage.duration1,
                                                    function() {
                                                        $('#co-billing').
                                                            animate({ 'height': coBillingHeight },
                                                            Config.OrderPage.duration2,
                                                            'fasEaseIn',
                                                            function() {
                                                                $('#co-billing-options').css('zIndex', 1);
                                                                $('#co-billing-content, #co-order-review-actions').show().
                                                                    animate({ 'opacity': 1 },
                                                                    Config.OrderPage.duration1,
                                                                    function() {
                                                                        $('#co-shipping-options, #co-billing-options, #co-billing-content').css('position', '');
                                                                        $('#co-billing-header').css('zIndex', '');
                                                                        if(_cto.statics.isIE6) $('#co-content select').show().css('opacity', 1);;
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );

                            }

                            break;

                        case '#review':

                            if(prevHash == window.location.hash) {
                                /* Current: #review
                                 * Prev: (current) */
                                break;

                            } else if(prevHash == '#start' || !prevHash) {
                                /* Current: #review
                                 * Prev: #start or none */
                                _cto.logStep('#review', '#start or none');
                                prevHash = window.location.hash;

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':orderReview' , siteCatalyst_loginStatus);

                                // clear form errors
                                _cto.clearFormErrors('form');

                                $('.co-review-box').addClass('activeCopyState');

                                $('#co-shipping, #co-billing').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('review-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Order Review',
                                    'src': '../images/checkout_redesign/co_review_header_orderReview.gif'
                                });

                                $('#co-content').children().stop(true); // stop current animations
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); // reset styles

                                $('#co-shipping-proceed').
                                    css({ 'height': '20px', 'opacity': 0, 'padding': 0, 'left': -1000 });

                                $('#co-billing-content, #co-order-review-actions, #co-shipping-review, #co-billing-review, #co-order-commit-actions,#co-order-commit-actions-top').show().
                                    css('opacity', 1);

                                //$('#co-shipping-options, #co-billing-options, #co-order-review-actions').hide().css('opacity', 0);
                                $('#co-billing-options, #co-order-review-actions').hide().css('opacity', 0);

                                /*
                                 //@@ TODO: fix height
                                 $('#co-shipping').
                                 css('height',
                                 $('#co-shipping-header').outerHeight() +
                                 $('#co-shipping-review').outerHeight());
                                 */

                                $('#co-billing').
                                    css('height',
                                    $('#co-billing-header').outerHeight() +
                                    $('#co-billing-review').outerHeight());


                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                // borderfree terms statement
                                if(window.cartData.isBorderFree == 'true') {
                                    $('#borderfree-partner-terms').show();
                                }

                                break;

                            } else if(prevHash == '#shipping') {
                                /* Current: #review
                                 * Prev: #shipping */
                                _cto.logStep('#review', '#shipping');

                                prevHash = window.location.hash;

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':orderReview' , siteCatalyst_loginStatus);

                                // clear form errors
                                _cto.clearFormErrors('form');


                                $('.co-review-box').addClass('activeCopyState');

                                $('#co-shipping, #co-billing').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('review-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Order Review',
                                    'src': '../images/checkout_redesign/co_review_header_orderReview.gif'
                                });

                                $('#co-content').children().stop(true); // stop current animations
                                $('#co-content').children().not('.asyncForm, #co-shipping-proceed, #co-shipping, #co-shipping-options, #co-billing, #co-billing-options').removeAttr('style'); // reset styles

                                $('#co-order-commit-actions').hide().
                                    css('opacity', 0);

                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);

                                coShippingHeight =
                                    $('#co-shipping-header').outerHeight() +
                                    $('#co-shipping-review').outerHeight();

                                // display checkout page content
                                $('#co-content').css('visibility', 'visible');

                                //$('#co-shipping-options').css('position', 'relative');

                                $('#co-shipping-options, #co-order-review-actions').
                                    animate({ 'opacity': 0 },
                                    Config.OrderPage.duration1,
                                    'fasEaseIn',
                                    function() {
                                        $(this).hide();
                                        $('#co-order-review-actions').animate({ 'height': '0px', 'paddingTop': 0, 'paddingBottom': 0 },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                $(this).css('left', -1000);
                                            }
                                        );
                                        $('#co-shipping').
                                            animate({ 'height': coShippingHeight },
                                            Config.OrderPage.duration2,
                                            'fasEaseIn',
                                            function() {
                                                $('#co-shipping-review, #co-order-commit-actions,#co-order-commit-actions-top').show().
                                                    animate({ 'opacity': 1 },
                                                    Config.OrderPage.duration1,
                                                    function() {
                                                        $('#co-shipping-review').css('zIndex', 1);
                                                        $('#co-shipping-content').show().
                                                            animate({ 'opacity': 1 },
                                                            Config.OrderPage.duration1,
                                                            function() {
                                                                $('#co-shipping-review').css('zIndex', 2);
                                                                $('#co-shipping-options').css('position', '');
                                                                if(_cto.statics.isIE6) $('#co-content select').show().css('opacity', 1);
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );

                                // borderfree terms statement
                                if(window.cartData.isBorderFree == 'true') {
                                    $('#borderfree-partner-terms').show();
                                }

                            } else {
                                /* Current: #review
                                 * Prev: !none, !start, !#shipping,  */
                                _cto.logStep('#review', '!none, !start, !#shipping');

                                prevHash = window.location.hash;

                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':orderReview' , siteCatalyst_loginStatus);

                                if(_cto.statics.stageLock == false) {

                                    // clear form errors
                                    _cto.clearFormErrors('form');

                                    $('.co-review-box').addClass('activeCopyState');

                                    $('#co-shipping, #co-billing').addClass('co-review-stage');
                                    $('#co-content').removeClass().addClass('review-step');
                                    $('#co-main-header img').attr({
                                        'alt': 'Checkout: Order Review',
                                        'src': '../images/checkout_redesign/co_review_header_orderReview.gif'
                                    });

                                    $('#co-content').children().stop(true); // stop current animations
                                    $('#co-content').children().not('.asyncForm, #co-shipping-proceed, #co-shipping, #co-shipping-options, #co-billing, #co-billing-options').removeAttr('style'); // reset styles

                                    $('#co-order-commit-actions').hide().
                                        css('opacity', 0);

                                    if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);

                                    coBillingHeight =
                                        $('#co-billing-header').outerHeight() +
                                        $('#co-billing-review').outerHeight();

                                    // display checkout page content
                                    $('#co-content').css('visibility', 'visible');

                                    $('#co-billing-header').css('zIndex', 2);
                                    //$('#co-billing-options, #co-billing-content').css('position', 'relative');

                                    $('#co-billing-options, #co-order-review-actions').
                                        animate({ 'opacity': 0 },
                                        Config.OrderPage.duration1,
                                        'fasEaseIn',
                                        function() {
                                            $(this).hide();
                                            $('#co-order-review-actions').animate({ 'height': '0px', 'paddingTop': 0, 'paddingBottom': 0 },
                                                Config.OrderPage.duration2,
                                                'fasEaseIn',
                                                function() {
                                                    $(this).css('left', -1000);
                                                }
                                            );
                                            $('#co-billing').
                                                animate({ 'height': coBillingHeight },
                                                Config.OrderPage.duration2,
                                                'fasEaseIn',
                                                function() {
                                                    $('#co-billing-review, #co-order-commit-actions,#co-order-commit-actions-top').show().
                                                        animate({ 'opacity': 1 },
                                                        Config.OrderPage.duration1,
                                                        function() {
                                                            $('#co-billing-review').css('zIndex', 1);
                                                            $('#co-billing-content').show().
                                                                animate({ 'opacity': 1 },
                                                                Config.OrderPage.duration1,
                                                                function() {
                                                                    _cto.orderStageHeight(false);
                                                                    $('#co-billing-review').css('zIndex', 2);
                                                                    $('#co-billing-header').css('zIndex', '');
                                                                    $('#co-billing-options, #co-billing-content').css('position', '');
                                                                    if(_cto.statics.isIE6) $('#co-content select').show().css('opacity', 1);
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );

                                }

                                // borderfree terms statement
                                if(window.cartData.isBorderFree == 'true') {
                                    $('#borderfree-partner-terms').show();
                                }

                            }

                            break;
                    }

                }, 200);

            }, { unescape: ',/' });
        }
    }
