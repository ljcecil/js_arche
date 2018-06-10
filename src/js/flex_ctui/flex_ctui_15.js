        this.updateOrder = function(data, formName, suppressMbox) {
            if (!data.checkout) {
                console.log('updateOrder Checkout object is null.');
                return false;
            }
            var shipInfo = (typeof data.checkout.shipInfo != 'undefined') ? data.checkout.shipInfo[0] : false;
            var shipMethod = (typeof data.checkout.shipMethod != 'undefined') ? data.checkout.shipMethod[0] : false;
            var giftOption = (typeof data.checkout.giftOption != 'undefined') ? data.checkout.giftOption[0] : false;
            var billing = (typeof data.checkout.billing != 'undefined') ? data.checkout.billing : false;
            if(typeof billing.giftCard == 'undefined') billing.giftCard = {};

            if(!_cto.containsErrors(data.checkout.formErrors)) {

                // allow to user to continue to the next stage
                _cto.statics.stageLock = false;

                // validate user can continue with order
                _cto.stopChecks(data);

                // clear all form errors
                _cto.clearFormErrors('form');

                //@@ Development data
                /*
                 if (data && data.cart && data.cart.shipments) {
                 data.cart.shipments = [
                 data.cart.shipments[0],
                 data.cart.shipments[0]
                 ];
                 }
                 */

                this.multiShip = false;
                if (data && data.cart && data.cart.shipments && data.cart.shipments.length > 1) {
                    $('#co-shipping').removeClass('co-shipping-not-multi').addClass('co-shipping-has-multi');
                    this.multiShip = true;
                }else {
                    $('#co-shipping').removeClass('co-shipping-has-multi').addClass('co-shipping-not-multi');
                }
                if (data.cart.bagCount == 1) {
                    $('#co-shipping-multi-address, #co-shipping-edit-multi-address').hide();
                } else {
                    if (window.location.hash !== "#start") {
                        $('#co-shipping-edit-multi-address').show();
                    } else {
                        $('#co-shipping-multi-address').show();
                    }
                }

                //data.cart.shipments.push(data.cart.shipments[0]);
                //try {
                this.cartCollection = new CTUI.Cart(data.cart.shipments, data.cart.items);
                this.checkoutShipments = new CTUI.CheckoutShipments(this.cartCollection.shipments);
                //this.checkoutShipments.setGiftOptionsIndexes();
                this.checkoutShipments.render();
                //this.giftedItems = new CTUI.GiftedItems(data.cart.items, $('.co-shipping-gifted-items'));
                //this.giftedItems.render();
                //} catch(e) {
                //    console.group('Error Creating Shipments during updateOrder: %o', e);
                //    console.error(e.stack);
                //    console.groupEnd();
                //}

                // Rendering is complete. Bind checkout modal events.
                this.createCheckoutModals();
                $(window).trigger('ctoReady');

                // Another fix for char 160 in city;
                $('#co-shipping-review-city').each(function(){
                    $(this).text($(this).text().replace('\u00A0', ''));
                });

                // Update billing details using text from shipping.
                var firstShipmentClass = "";
                if (this.multiShip) {
                    firstShipmentClass = ".co-shipment-0";
                    $('.co-singleship-copy').addClass('co-shipping-copy-hide');
                    $('.co-multiship-copy').removeClass('co-shipping-copy-hide');
                } else {
                    $('.co-singleship-copy').removeClass('co-shipping-copy-hide');
                    $('.co-multiship-copy').addClass('co-shipping-copy-hide');
                }
                var v = firstShipmentClass + ' #co-shipping-review-';
                var createCCFormEl = 'form[name="frmCreateCreditCard"]';
                var u = createCCFormEl + ' #billingForm_';
                $(u + 'fName').val(_cto.heDecode($(v + 'firstName').text()));
                $(u + 'lName').val(_cto.heDecode($(v + 'lastName').text()));
                $(u + 'add1').val(_cto.heDecode($(v + 'address1').text()));
                $(u + 'add2').val(_cto.heDecode($(v + 'address2').text()));
                $(u + 'zip').val($(v + 'zip').text());
                $(u + 'phone').val($(v + 'phone').val());
                var cityText = $(v + 'city').text();
                if (cityText) {
                    cityText = cityText.replace('\u00A0', '');
                    cityText = $.trim(cityText.replace(',', ''));
                }
                _cto.initCityStateCountry({
                    'preSelect': {
                        'city': cityText,
                        'state': $(v + 'state').text(),
                        'country': $(v + 'countryCode').val()
                    },
                    'countryTarget': createCCFormEl + ' #billingForm_country',
                    'stateTarget': createCCFormEl + ' #coBillingState',
                    'cityTarget': createCCFormEl + ' #coBillingCity',
                    'stateHiddenInput': createCCFormEl + ' #billingForm_state_hidden',
                    'cityHiddenInput': createCCFormEl + ' #billingForm_city_hidden',
                    'phoneTarget': createCCFormEl + ' #co-billing-phone'
                });

                $('.co-multiship-copy span').text($(v + 'firstName').text() + ", " + $(v + 'address1').text());

                // update gift option html
                if(giftOption) {
                    _cto.orderStageHeight(false);
                    if(giftOption.giftReceipt == 'true') {
                        $('#co-gift-option-giftReceipt').show();
                    } else {
                        $('#co-gift-option-giftReceipt').hide();
                    }
                    if(giftOption.giftBox == 'true') {
                        $('#co-gift-option-giftBox').show();
                    } else {
                        $('#co-gift-option-giftBox').hide();
                    }
                    if(giftOption.userText) {
                        $('#co-gift-option-userText').html('"' + _cto.heDecode(giftOption.userText).replace(/<br>/g, '') + '"');
                    } else {
                        $('#co-gift-option-userText').html('');
                    }
                    $('#co-gift-option-description').hide();
                    $('#coRemoveGiftOption').show();
                    $('#coEditGiftOption').show();
                    $('#coAddGiftOption').hide();
                } else {
                    $('#co-gift-option-userText').html('');
                    $('#co-gift-option-description').show();
                    $('#co-gift-option-giftBox').hide();
                    $('#co-gift-option-giftReceipt').hide();
                    $('#coRemoveGiftOption').hide();
                    $('#coEditGiftOption').hide();
                    $('#coAddGiftOption').show();
                }

                // update applied gift card
                billing.amountOnGC = (billing.amountOnGC == '$0.00') ? false : billing.amountOnGC;
                if(billing.amountOnGC) {
                    if($('#pc-amountOnGC .pc-value').text() != billing.amountOnGC) {
                        $('#pc-amountOnGC').remove();
                        $('<div id="pc-amountOnGC" class="pc-totals-row" style="display: none; padding-top: 10px"><div class="pc-label">Applied Gift Card</div><div class="pc-value">$' + fasMoneyAbs(billing.amountOnGC) + '</div><div class="clear"></div></div>').insertAfter('#pc-grandtotal').fasToggle();
                    } else {
                        if($('#pc-amountOnGC').css('display') == 'none') {
                            $('#pc-amountOnGC').fasToggle();
                        }
                    }
                } else {
                    if($('#pc-amountOnGC').css('display') != 'none') {
                        $('#pc-amountOnGC').fasToggle();
                    }
                }
                // update amount due on credit card
                billing.amountOnCC = (billing.amountOnCC == '$0.00') ? false : billing.amountOnCC;
                if(billing.amountOnGC && billing.amountOnCC) {
                    if($('#pc-amountOnCC .pc-value').text() != billing.amountOnCC) {
                        $('#pc-amountOnCC').remove();
                        $('<div id="pc-amountOnCC" class="pc-totals-row" style="display: none"><div class="pc-label">Balance Due on Credit Card</div><div class="pc-value">$' + fasMoneyAbs(billing.amountOnCC) + '</div><div class="clear"></div></div>').insertAfter('#pc-amountOnGC').fasToggle();
                    } else {
                        if($('#pc-amountOnCC').css('display') == 'none') {
                            $('#pc-amountOnCC').fasToggle();
                        }
                    }
                } else {
                    if($('#pc-amountOnCC').css('display') != 'none') {
                        $('#pc-amountOnCC').fasToggle();
                    }
                }

                if(billing.isCreditCardPresent == 'true') {
                    $('.modalCheckoutCreateCreditCardTrigger').hide();
                    $('.modalCheckoutUpdateCreditCardTrigger').show();
                }else {
                    $('.modalCheckoutCreateCreditCardTrigger').show();
                    $('.modalCheckoutUpdateCreditCardTrigger').hide();
                }

                //is order eGift Card Only
                if(data.checkout.ElectronicOnlyOrder == 'true'){
                    $('#co-message-eGift-only').html('<div id="co-message-eGift-title">PLEASE NOTE:</div><div>Right now our systems still ask for a shipping address, even for eCards &ndash; so simply enter your billing address. Then finish checking out.</div>').show();
                }else{
                    $('#co-message-eGift-only').hide();
                }

                if(billing.isGiftCardPresent == 'true') {
                    if(billing.giftCard.applyToOrder == 'false') {
                        $('#co-billing-review-giftcard, #coGiftCardRemove').hide();
                        _cto.clearFormErrors('form[name="frmCreateGiftcard"]');
                        $('#co-billing-gift-result-number').html(billing.giftCard.giftCardNumber.replace(/\X/g, '&#8226;'));
                        $('#co-billing-gift-result-balance').html('$' + fasMoneyAbs(billing.giftCard.balanceAmount));
                        $('#co-billing-gift-form').stop().fadeOut(function() {
                            $('#co-billing-gift-result').stop().fadeIn().animate({'opacity': 1});
                        });
                    } else {
                        var cartTotal = data.cart.itemsTotal.split('$')[1].replace(',', '');
                        var appliedGC = (billing.giftCard.balanceAmount - cartTotal < 0) ? billing.giftCard.balanceAmount : cartTotal;
                        var remainBal = billing.giftCard.balanceAmount - appliedGC;
                        // manually set flag for order total after gift card
                        if(cartTotal - appliedGC == 0) {
                            data.checkout.GiftCardOnly = 'true';
                        } else {
                            data.checkout.GiftCardOnly = 'false';
                            if(window.location.hash == '#review' && billing.isCreditCardPresent == 'false') {
                                if($('.modalWindow:visible').length == 0) {
                                    $('#modalOrderTotalChanged').trigger('click');
                                }
                            }
                        }
                        $('#co-billing-review-gcNumber, #co-billing-gift-result-remove-number').html(billing.giftCard.giftCardNumber.replace(/\X/g, '&#8226;'));
                        $('#co-billing-review-gcApplied, #co-billing-gift-result-remove-amount').html('$' + fasMoneyAbs(appliedGC));
                        $('#co-billing-review-gcBalance').html('$' + fasMoneyAbs(remainBal));
                        $('#coGiftCardNameRemove').val(billing.giftCardName);
                        $('#coGiftCardCreate').hide();
                        $('#co-billing-review-giftcard, #coGiftCardRemove').show();
                    }
                } else {
                    $('#co-billing-review-giftcard, #coGiftCardRemove').hide();
                    $('#coGiftCardCreate').show();
                }

                if(billing.creditCard) {
                    // insert comma after city
                    if($('#co-billing-review-city').next('#co-comma').length == 0)
                        $('<span id="co-comma">,&nbsp;</span>').insertAfter('#co-billing-review-city');
                    // begin injecting data
                    $('#coBillingUpdateCreditCardName, #frmSelectCreditCard select[name*="UpdateCreditCardFormHandler.creditCardName"]').val(billing.creditCardName);
                    $('#coCreditCardNameLink, #coCreditCardNameUpdate').val(billing.creditCardName);

                    if(_cto.mergeErrors(data.checkout.formErrors).length < 1) {
                        $('#coBillingUpdateCreditCardNumber').val(_cto.heDecode(billing.creditCard.creditCardNumber.replace(/\X/g, '&#8226;')));
                        $('#coBillingUpdateCreditCardType option').removeAttr('selected').parent().find('[value="' + billing.creditCard.creditCardType + '"]').attr('selected', 'selected');
                        $('#co-billing-credit-card-exp-month option').removeAttr('selected').parent().find('[value="' + billing.creditCard.expirationMonth + '"]').attr('selected', 'selected');
                        $('#co-billing-credit-card-exp-year option').removeAttr('selected').parent().find('[value="' + billing.creditCard.expirationYear + '"]').attr('selected', 'selected');
                        $('#co-billing-review-ctype').html(billing.creditCard.creditCardType);
                        $('#co-billing-review-cnum').html(billing.creditCard.creditCardNumber.replace(/\X/g, '&#8226;'));
                        $('#co-billing-review-cexp').html('Expires ' + billing.creditCard.expirationMonth + '/' + billing.creditCard.expirationYear);
                    }

                    if(billing.workingCreditCard.creditCardNumber != '') {
                        billing.creditCard = billing.workingCreditCard;
                    }
                    if(billing.creditCard.securityCode == 'false') {
                        $('#frmUpdateCreditCard_wrapper #co-ccard-form .co-cvv-field').show();
                    } else {
                        $('#frmUpdateCreditCard_wrapper #co-ccard-form .co-cvv-field').hide();
                    }
                    // Double decode for names with single quotes.
                    $('#co-billing-review-firstName').html(_cto.heDecode(_cto.heDecode(billing.creditCard.address.firstName)));
                    $('#frmUpdateCreditCard_wrapper input[id^="billingForm_fName"]').val(_cto.heDecode(_cto.heDecode(billing.creditCard.address.firstName)));
                    $('#co-billing-review-lastName').html(_cto.heDecode(_cto.heDecode(billing.creditCard.address.lastName)));
                    $('#frmUpdateCreditCard_wrapper input[id^="billingForm_lName"]').val(_cto.heDecode(_cto.heDecode(billing.creditCard.address.lastName)));
                    $('#co-billing-review-address1').html(billing.creditCard.address.address1);
                    $('#frmUpdateCreditCard_wrapper input[id^="billingForm_add1"]').val(billing.creditCard.address.address1);
                    $('#co-billing-review-address2').html(billing.creditCard.address.address2);
                    $('#frmUpdateCreditCard_wrapper input[id^="billingForm_add2"]').val(billing.creditCard.address.address2);
                    $('#co-billing-review-city').html(billing.creditCard.address.city);
                    $('#co-billing-review-state').html(billing.creditCard.address.state);
                    $('#co-billing-review-country').html(billing.creditCard.address.country);
                    setTimeout(function() {
                        _cto.initCityStateCountry({
                            'preSelect': {
                                'city': billing.creditCard.address.city,
                                'state': billing.creditCard.address.state,
                                'country': billing.creditCard.address.countryCode
                            },
                            'countryTarget': '#frmUpdateCreditCard_wrapper select[id^="billingForm_country"]',
                            'stateTarget': '#frmUpdateCreditCard_wrapper div[id^="coBillingState"]',
                            'cityTarget': '#frmUpdateCreditCard_wrapper div[id^="coBillingCity"]',
                            'stateHiddenInput': '#frmUpdateCreditCard_wrapper input[id^="billingForm_state_hidden"]',
                            'cityHiddenInput': '#frmUpdateCreditCard_wrapper input[id^="billingForm_city_hidden"]',
                            'phoneTarget': '#frmUpdateCreditCard_wrapper input[id^="co-billing-phone"]'
                        });
                    }, 2000);
                    $('#co-billing-review-zip').html(billing.creditCard.address.postalCode);
                    $('#frmUpdateCreditCard_wrapper input[id^="billingForm_zip"]').val(billing.creditCard.address.postalCode);
                    $('#co-billing-review-phone').html(billing.creditCard.address.phoneFormatted);
                    $('#frmUpdateCreditCard_wrapper input[id^="billingForm_phone"]').val(billing.creditCard.address.phoneNumber);
                    _cto.initPhoneNumberBoxes();
                } else {
                    $('#co-billing-review-ctype').html('');
                    $('#co-billing-review-cnum').html('');
                    $('#co-billing-review-cexp').html('');
                    $('#co-billing-review-firstName').html('');
                    $('#co-billing-review-lastName').html('');
                    $('#co-billing-review-address1').html('');
                    $('#co-billing-review-address2').html('');
                    $('#co-billing-review-city').html('');
                    $('#co-billing-review-state').html('');
                    $('#co-billing-review-zip').html('');
                    $('#co-billing-review-country').html('');
                    $('#co-billing-review-phone').html('');
                }

                // update shipping methods
                if($('#coShipToState select').length) $('#coShipToState select').trigger('change');

                // we want to highlight both shipping address and
                // shipping method boxes when they are chronologically submitted
                if(formName == 'editShipTo') updateShipping = 1;
                if(typeof updateShipping != 'undefined' && formName == 'editShipMethod') {
                    updateBox = '.co-review-box.shippingUpdateAlert';
                    delete updateShipping;
                } else {
                    updateBox = '.co-review-box.' + formName + 'UpdateAlert';
                }
                // do not induce animation for shipping address update modal
                if(formName != 'editShipTo') {
                    $(updateBox).addClass('co-updated').animate(
                        { 'backgroundColor' : '#ffffff'},
                        Config.OrderPage.duration1,
                        function() {
                            $(this).removeClass('co-updated').removeAttr('style');
                        }
                    );
                }
                // update mbox in checkout
                if(_cto.isOrderPage()) {
                    if(!suppressMbox) {
                        _cto.updateMbox(data.checkout);
                    }
                }
            } else {
                var errors = _cto.mergeErrors(data.checkout.formErrors);
                // Call Form Validation
                this.formValidation(formName, errors);
            }
            if(_cto.statics.stageLock == false) {

                //@@ TODO: use this below.
                var hasMulti = false;
                if (data.checkout.shipments > 0) {
                    hasMulti = true;
                }

                // set flag to display update credit card form when appropriate
                if(billing.isCreditCardPresent == 'true') {
                    _cto.statics.showCreditCardUpdateForm = true;
                } else {
                    _cto.statics.showCreditCardUpdateForm = false;
                }
                // set flag to display email form under credit card
                if(data.checkout.RegistrationInfoCompleted == 'true') {
                    $('#co-email-form, #co-password-form').hide();
                } else {
                    $('#co-email-form, #co-password-form').show().css('opacity', 1);
                }

                // save checkout stage vars into a static var for use thoughout the application
                _cto.statics.checkoutStageInfogram = {
                    'BillingInfoCompleted': (data.checkout.BillingInfoCompleted) ? data.checkout.BillingInfoCompleted : 'false',
                    'ShippingInfoComplete': (data.checkout.ShippingInfoComplete) ? data.checkout.ShippingInfoComplete : 'false',
                    'creditCardSecurityCode': (data.checkout.billing.creditCard) ? data.checkout.billing.creditCard.securityCode : 'false',
                    'RegistrationInfoCompleted': (data.checkout.RegistrationInfoCompleted) ? data.checkout.RegistrationInfoCompleted : 'false',
                    'isGiftCardPresent': (data.checkout.isGiftCardPresent) ? data.checkout.isGiftCardPresent : 'false',
                    'isGiftCardPresent': (billing.isGiftCardPresent) ? billing.isGiftCardPresent : 'false',
                    'giftCardAppliedToOrder': (billing.giftCard.applyToOrder) ? billing.giftCard.applyToOrder : 'false',
                    'GiftCardOnly': (billing.GiftCardOnly) ? billing.GiftCardOnly : 'false'
                };

                // change the user's view to reflect checkout stage

                // GIFTCARDREGISTER
                if(data.checkout.RegistrationInfoCompleted == 'false' &&
                    billing.isGiftCardPresent == 'true' &&
                    billing.giftCard.applyToOrder == 'true' &&
                    data.checkout.GiftCardOnly == 'true' &&
                    data.checkout.ShippingInfoComplete == 'true') {
                    window.location.hash = '#giftCardRegister';
                    return;
                }

                // GIFTCARDADDITIONALPAYMENT
                if(/*data.checkout.RegistrationInfoCompleted == 'false' &&*/
                billing.isGiftCardPresent == 'true' &&
                billing.giftCard.applyToOrder == 'true' &&
                data.checkout.GiftCardOnly == 'false' &&
                data.checkout.BillingInfoCompleted == 'false' &&
                data.checkout.ShippingInfoComplete == 'true') {
                    window.location.hash = '#giftCardAdditionalPayment';
                    return;
                }

                // PAYMENT
                if(window.location.hash != '#review' &&
                    data.checkout.GiftCardOnly == 'false' &&
                    data.checkout.BillingInfoCompleted == 'false' &&
                    data.checkout.ShippingInfoComplete == 'true') {
                    window.location.hash = '#payment';
                    return;
                }

                // SHIPPING
                if(data.checkout.ShippingInfoComplete == 'false' &&
                    data.checkout.BillingInfoCompleted == 'true') {
                    window.location.hash = '#shipping';
                    return;
                }

                // REVIEW
                if(data.checkout.BillingInfoCompleted == 'true' &&
                    data.checkout.ShippingInfoComplete == 'true' &&
                    data.checkout.RegistrationInfoCompleted == 'true') {
                    window.location.hash = '#review';
                    return;
                }

                // START
                if(data.checkout.BillingInfoCompleted == 'false' &&
                    data.checkout.ShippingInfoComplete == 'false') {
                    window.location.hash = '#start';
                    return;
                }


            }

        }
