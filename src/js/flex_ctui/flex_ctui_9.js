            // email cart modal
            $('<div class="modalWindow" id="modalEmailCart"><table border="0" cellspacing="0" cellpadding="0"><tr class="modalControls"><td class="modalCaption"></td><td align="right"><a class="modalClose"></a></td></tr><tr><td colspan="2"><div class="coModalContent loading"></div></td></tr></table></div>').appendTo('body');
            jQuery('#modal-email').on('loaded.bs.modal', function (e) {
                _cto.RequestHandler.readyForms();
                $('#modal-email .coModalContent').css('height', 'auto').removeClass('loading');
                _cto.ajaxForm('form[name="checkEmailCart"]', {
                    dataType: 'json',
                    showLoader: false,
                    beforeSubmit: function() {
                        $('input[name="emailShoppingBag"]').attr('disabled', 'true');
                        $('.sb-email-cart-response div').hide();
                        $('<div class="sb-email-ajax-status waitMessage">Please wait...</div>').appendTo('.sb-email-cart-response');
                        if(document.getElementById('emailId').value && validateEmail(document.getElementById('emailId').value)){
                            $('#emailId').parent().removeClass('has-error');
                            //console.log($('#save-zipcode').attr("checked"));
                            var zipCodeValue = String($('#zip-codeinput').val()).trim();
                            if(($('#save-zipcode').attr("checked") == true && zipCodeValue.length) && !validateZip(zipCodeValue)){
                                $('.sb-email-ajax-status').remove();
                                $('.sb-email-cart-fail').html('<span class="sb-label">Please Enter a Valid Zip Code</span>').addClass('has-error');
                                $('.sb-email-cart-fail').fasToggle();
                                $('input[name="emailShoppingBag"]').removeAttr('disabled');
                                $('#zipcode-input').addClass('has-error');
                                $('#zip-codeinput').focus();
                                return false;

                            }else {
                                $('#zipcode-input').removeClass('has-error sb-email-cart-fail');
                            }
                        }else{
                            $('.sb-email-ajax-status').remove();
                            $('.sb-email-cart-fail').html('<span class="sb-label alert has-error">Please Enter a Valid E-Mail Address</span>');
                            $('.sb-email-cart-fail').fasToggle();
                            $('input[name="emailShoppingBag"]').removeAttr('disabled');
                            $('#emailId').parent().addClass('has-error');
                            $('#emailId').focus();

                            return false;

                        }
                    },
                    success: function(data) {
                        $('input[name="emailShoppingBag"]').removeAttr('disabled');
                        $('.sb-email-ajax-status').remove();
                        if(!data.formErrors || data.formErrors.length < 1) {
                            $('.sb-email-cart-success').fasToggle(function() {
                                setTimeout(function() {
                                    $('#sb-modal-emailWrapper').fasToggle(function() {
                                        _cto.closeModals();
                                    });
                                }, 2600);
                            });
                        } else {
                            $('.sb-email-cart-fail').html(data.formErrors[0].message);
                            $('.sb-email-cart-fail').fasToggle();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $('input[name="emailShoppingBag"]').removeAttr('disabled');
                        $('.sb-email-ajax-status').remove();
                        $('.sb-email-cart-fail').fasToggle();
                    }
                });
            })
            /*$('#modalEmailCart').jqm({
             target: 'div.coModalContent',
             ajax: '@href',
             title: '@title',
             trigger: 'a.modalEmailCartTrigger',
             onLoad: function() {
             _cto.RequestHandler.readyForms();
             $('#modalEmailCart .coModalContent').css('height', 'auto').removeClass('loading');
             _cto.ajaxForm('form[name="checkEmailCart"]', {
             dataType: 'json',
             showLoader: false,
             beforeSubmit: function() {
             $('input[name="emailShoppingBag"]').attr('disabled', 'true');
             $('.sb-email-cart-response div').hide();
             $('<div class="sb-email-ajax-status waitMessage">Please wait...</div>').appendTo('.sb-email-cart-response');
             if(document.getElementById('emailId').value && validateEmail(document.getElementById('emailId').value)){
             //console.log($('#save-zipcode').attr("checked"));
             if($('#save-zipcode').attr("checked") != true || validateZip($('#zip-codeinput').val())){}else{
             $('.sb-email-ajax-status').remove();
             $('.sb-email-cart-fail').html('<span class="sb-label alert">Please Enter a Valid Zip Code</span>');
             $('.sb-email-cart-fail').fasToggle();
             $('input[name="emailShoppingBag"]').removeAttr('disabled');
             $('#zip-codeinput').focus();
             return false;
             }
             }else{
             $('.sb-email-ajax-status').remove();
             $('.sb-email-cart-fail').html('<span class="sb-label alert">Please Enter a Valid E-Mail Address</span>');
             $('.sb-email-cart-fail').fasToggle();
             $('input[name="emailShoppingBag"]').removeAttr('disabled');
             $('#emailId').focus();
             return false;

             }
             },
             success: function(data) {
             $('input[name="emailShoppingBag"]').removeAttr('disabled');
             $('.sb-email-ajax-status').remove();
             if(!data.formErrors || data.formErrors.length < 1) {
             $('.sb-email-cart-success').fasToggle(function() {
             setTimeout(function() {
             $('#sb-modal-emailWrapper').fasToggle(function() {
             _cto.closeModals();
             });
             }, 2600);
             });
             } else {
             $('.sb-email-cart-fail').html(data.formErrors[0].message);
             $('.sb-email-cart-fail').fasToggle();
             }
             },
             error: function(jqXHR, textStatus, errorThrown) {
             $('input[name="emailShoppingBag"]').removeAttr('disabled');
             $('.sb-email-ajax-status').remove();
             $('.sb-email-cart-fail').fasToggle();
             }
             });
             }
             });*/

            // create credit card modal
            $('<div class="modalWindow" id="modalCheckoutCreateCreditCard"><table border="0" cellspacing="0" cellpadding="0"><tr class="modalControls"><td class="modalCaption"></td><td align="right"><a class="modalClose"></a></td></tr><tr><td colspan="2"><div class="coModalContent loading"></div></td></tr></table></div>').appendTo('body');
            $('#modalCheckoutCreateCreditCard').jqm({
                target: 'div.coModalContent',
                ajax: '@href',
                title: '@title',
                trigger: 'a.modalCheckoutCreateCreditCardTrigger',
                onLoad: function() {
                    $('#modalCheckoutCreateCreditCard').css('position', 'absolute');
                    $(document).scrollTop(0);
                    $('#modalCheckoutCreateCreditCard .coModalContent').removeClass('loading');
                    _cto.ajaxSubmit('form[name="frmCreateCreditCardLinkModal"]', {
                        dataType: 'html',
                        showLoader: false,
                        success: function(data) {
                            $('#modalCheckoutCreateCreditCard .coModalContent').html(data).css('height', 'auto');
                        }
                    });
                }
            });

            // update credit card modal
            $('<div class="modalWindow" id="modalCheckoutUpdateCreditCard"><table border="0" cellspacing="0" cellpadding="0"><tr class="modalControls"><td class="modalCaption"></td><td align="right"><a class="modalClose"></a></td></tr><tr><td colspan="2"><div class="coModalContent loading"></div></td></tr></table></div>').appendTo('body');
            $('#modalCheckoutUpdateCreditCard').jqm({
                target: 'div.coModalContent',
                ajax: '@href',
                title: '@title',
                trigger: 'a.modalCheckoutUpdateCreditCardTrigger',
                onLoad: function() {
                    $('#modalCheckoutUpdateCreditCard').css('position', 'absolute');
                    $(document).scrollTop(0);
                    $('#modalCheckoutUpdateCreditCard .coModalContent').removeClass('loading');
                    _cto.ajaxSubmit('form[name="frmUpdateCreditCardLink"]', {
                        dataType: 'html',
                        showLoader: false,
                        success: function(data) {
                            $('#modalCheckoutUpdateCreditCard .coModalContent').html(data).css('height', 'auto');
                        }
                    });
                }
            });
        }

        this.submitCreateCreditCardModal = function() {
            _cto.ajaxForm('form[name="frmCreateCreditCardModal"]', {
                dataType: 'json',
                showLoader: false,
                success: function(data, status, xhr) {
                    if(_cto.isCartOrCheckoutObject(data)) {
                        var formName = $(xhr).attr('name');
                        _ctoMiniCart.update(data.cart);
                        _cto.updateOrder(data, formName);
                        if(!_cto.containsErrors($.merge(data.checkout.formErrors, data.cart.formErrors))) {
                            _cto.closeModals();
                        }
                    }
                }
            });
        }

        this.submitSelectCreditCardJSON = function() {
            _cto.ajaxSubmit('form[name="frmSelectCreditCard"]', {
                dataType: 'json',
                showLoader: false,
                success: function(data, status, xhr) {
                    if(_cto.isCartOrCheckoutObject(data)) {
                        var billing = (typeof data.checkout.billing != 'undefined') ? data.checkout.billing : false;
                        if(billing.workingCreditCard) {
                            $('#coBillingUpdateCreditCardNumber').val(_cto.heDecode(billing.workingCreditCard.creditCardNumber.replace(/\X/g, '&#8226;')));
                            $('#coBillingUpdateCreditCardName').val(billing.workingCreditCardName);
                            $('#coBillingUpdateCreditCardType option').removeAttr('selected').parent().find('[value="' + billing.workingCreditCard.creditCardType + '"]').attr('selected', 'selected');
                            $('#co-billing-credit-card-exp-month option').removeAttr('selected').parent().find('[value="' + billing.workingCreditCard.expirationMonth + '"]').attr('selected', 'selected');
                            $('#co-billing-credit-card-exp-year option').removeAttr('selected').parent().find('[value="' + billing.workingCreditCard.expirationYear + '"]').attr('selected', 'selected');
                            $('#coCreditCardNameLink, #coCreditCardNameUpdate').val(billing.creditCardName);
                            if(billing.workingCreditCard.securityCode == 'false') {
                                $('#frmUpdateCreditCard_wrapper #co-ccard-form .co-cvv-field').show();
                            } else {
                                $('#frmUpdateCreditCard_wrapper #co-ccard-form .co-cvv-field').hide();
                            }
                            $('#frmUpdateCreditCard_wrapper input[id^="billingForm_fName"]').val(_cto.heDecode(_cto.heDecode(billing.workingCreditCard.address.firstName)));
                            $('#frmUpdateCreditCard_wrapper input[id^="billingForm_lName"]').val(_cto.heDecode(_cto.heDecode(billing.workingCreditCard.address.lastName)));
                            $('#frmUpdateCreditCard_wrapper input[id^="billingForm_add1"]').val(billing.workingCreditCard.address.address1);
                            $('#frmUpdateCreditCard_wrapper input[id^="billingForm_add2"]').val(billing.workingCreditCard.address.address2);
                            _cto.initCityStateCountry({
                                'preSelect': {
                                    'city': billing.workingCreditCard.address.city,
                                    'state': billing.workingCreditCard.address.state,
                                    'country': billing.workingCreditCard.address.countryCode
                                },
                                'countryTarget': '#frmUpdateCreditCard_wrapper select[id^="billingForm_country"]',
                                'stateTarget': '#frmUpdateCreditCard_wrapper div[id^="coBillingState"]',
                                'cityTarget': '#frmUpdateCreditCard_wrapper div[id^="coBillingCity"]',
                                'stateHiddenInput': '#frmUpdateCreditCard_wrapper input[id^="billingForm_state_hidden"]',
                                'cityHiddenInput': '#frmUpdateCreditCard_wrapper input[id^="billingForm_city_hidden"]',
                                'phoneTarget': '#frmUpdateCreditCard_wrapper input[id^="co-billing-phone"]'
                            });
                            $('#frmUpdateCreditCard_wrapper input[id^="billingForm_zip"]').val(billing.workingCreditCard.address.postalCode);
                            $('#frmUpdateCreditCard_wrapper input[id^="billingForm_phone"]').val(billing.workingCreditCard.address.phoneNumber);
                            _cto.initPhoneNumberBoxes();
                        }
                    }
                }
            });
        }

        this.submitSelectCreditCardModal = function() {
            _cto.ajaxSubmit('form[name="frmSelectCreditCard"]', {
                dataType: 'html',
                showLoader: false,
                success: function(data, status, xhr) {
                    $('#modalCheckoutUpdateCreditCard .coModalContent').html(data);
                }
            });
        }

        this.submitCreateCreditCardLinkModal = function() {
            _cto.ajaxSubmit('form[name="frmCreateCreditCardLinkModal"]', {
                dataType: 'html',
                showLoader: false,
                success: function(data) {
                    $('#modalCheckoutUpdateCreditCard .coModalContent .modal-update').animate({'opacity': 0}, 'slow', 'fasEaseOut', function() {
                        $(this).animate({'height': '+=22px'}, 'slow', 'fasEaseOut', function() {
                            $(this).parent().html(data);
                            $(this).animate({'opacity': 1}, 'slow', 'fasEaseOut');
                        });
                    });
                }
            });
        }

        this.submitUpdateCreditCardModal = function() {
            _cto.ajaxForm('form[name="frmUpdateCreditCardModal"]', {
                dataType: 'json',
                showLoader: false,
                success: function(data, status, xhr) {
                    if(_cto.isCartOrCheckoutObject(data)) {
                        var formName = $(xhr).attr('name');
                        _ctoMiniCart.update(data.cart);
                        _cto.updateOrder(data, formName);
                        if(!_cto.containsErrors($.merge(data.checkout.formErrors, data.cart.formErrors))) {
                            _cto.closeModals();
                        }
                    }
                }
            });
        }
