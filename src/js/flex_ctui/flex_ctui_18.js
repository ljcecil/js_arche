        this.showCreditCardForm = function(cscParams) {
            if(_cto.statics.showCreditCardUpdateForm == true) {
                $('#frmUpdateCreditCard_wrapper, #co-modal-savedCC, #co-ccard-form-header-wrapper').show();
                $('#frmCreateCreditCard_wrapper').hide();
                // invoke billing form city state and country selections
                if($('#frmUpdateCreditCard_wrapper div[id^="coBillingCity"] input').length < 1)
                    _cto.initCityStateCountry(cscParams.billingUpdate);
            } else {
                $('#frmUpdateCreditCard_wrapper, #co-modal-savedCC, #co-ccard-form-header-wrapper').hide();
                $('#frmCreateCreditCard_wrapper').show();
                // invoke billing form city state and country selections
                if($('#frmCreateCreditCard_wrapper div[id^="coBillingCity"] input').length < 1)
                    _cto.initCityStateCountry(cscParams.billingCreate);
            }
        }

        this.helpToolTip = function(statics) {
            $(statics.container).css({ 'opacity': 0, 'display': 'none' });
            $(statics.triggers).mouseover(function() {
                $(statics.container).css('display', 'block').stop(true).animate({'opacity': 1}, 'slow');
            }).mouseout(function() {
                $(statics.container).stop(true).animate({'opacity': 0}, 'slow', function() {
                    $(this).css('display', 'none');
                });
            });
        }

        this.helpToolTipCvv = function(statics) {
            var ccSelected = '';
            var ccType = '';
            var ccImages = [];
            var ccDefault = 'Visa';
            var urlTemplate = '/store/images/checkout_redesign/cvv_*.png';
            // Preload credit card images to use in help tooltip
            $(statics.form + ' .co-billing-credit-card-type:first option').each(function() {
                ccSelected = $(this).val();
                if(ccSelected && ccSelected != ccDefault) {
                    ccImages.push(urlTemplate.replace('*', ccSelected));
                }
            });
            // invoke preloader for images captured above
            preloadArray(ccImages);
            // events for credit card help tooltip (default is "Visa")
            $(statics.container).css({ 'opacity': 0, 'display': 'none' });
            $(statics.triggers).mouseover(function() {
                if(_cto.statics.isIE6) {
                    $(statics.form + ' #co-billing-credit-card-exp-month, ' + statics.form + ' #co-billing-credit-card-exp-year').css('visibility', 'hidden');
                }
                ccType = $(statics.form + ' .co-billing-credit-card-type').val();
                $(statics.imageContainer).attr('class', 'co-cvv-' + ((ccType) ? ccType : ccDefault)).parent().css('display', 'block').stop(true).animate({'opacity': 1}, 'slow');
            }).mouseout(function() {
                $(statics.container).stop(true).animate({'opacity': 0}, 'slow', function() {
                    $(this).css('display', 'none');
                    if(_cto.statics.isIE6) {
                        $(statics.form + ' #co-billing-credit-card-exp-month, ' + statics.form + ' #co-billing-credit-card-exp-year').css('visibility', 'visible');
                    }
                });
            });
        }

        this.giftMessageLimiter = function(el) {
            var charLimit = 30;
            var lineLimit = 4;
            var cleanList = [];
            var tempList = el.value.split('\n');
            for(var i = 0; i < tempList.length; i++) {
                if (/\S/.test(tempList[i])) {
                    cleanList.push(tempList[i].substring(0, charLimit));
                }
            }
            for(var j = 0; j < tempList.length; j++) {
                if(tempList[j].length > charLimit && !/[\n\r]/.test(tempList[j].charAt(charLimit))) {
                    el.value = cleanList.join('\n') + '\n' + ((cleanList.length < lineLimit) ? tempList[j].charAt(charLimit) : '');
                }
            }
            if(cleanList.length > lineLimit) {
                cleanList.pop();
                el.value = cleanList.join('\n');
            }
            el.onblur = function() {
                this.value = cleanList.join('\n');
            }
        }

        this.orderStageHeight = function(op) {
            //@@ why is this set?
            //$('#co-shipping').css('height', ((op) ? $('#co-shipping').height() : ''));
            $('#co-billing').css('height', ((op) ? $('#co-billing').height() : ''));
        }

        this.LOGSTEP = true;
        this.logStep = function(curr, prev) {
            if (this.LOGSTEP) {
                console.log("Checkout step changed: [ Current: \"" + curr + "\", Prev: \"" + prev + "\"]");
            }
        };

        this.initOrderPage = function(orderData) {

            // var to store hash
            var prevHash;

            // update view with order data
            _ctoMiniCart.build(orderData.cart, false);
            _cto.updateOrder(orderData, '', true);

            // create page modals
            _cto.createCheckoutModals();

            // store initCityStateCountry method parameters to avoid code duplication
            var cscParams = {
                'shipping': {
                    'countryTarget': '#co-shipping-content-container #shipEdit_country',
                    'stateTarget': '#co-shipping-content-container #coShipToState',
                    'cityTarget': '#co-shipping-content-container #coShipToCity',
                    'stateHiddenInput': '#co-shipping-content-container #shipEdit_state_hidden',
                    'cityHiddenInput': '#co-shipping-content-container #shipEdit_city_hidden',
                    'shippingMethodsContainer': '#co-shipping-method-inline',
                    'phoneTarget': '#co-shipping-content-container #co-shipping-phone'
                },
                'billingUpdate': {
                    'countryTarget': '#frmUpdateCreditCard_wrapper #billingForm_country',
                    'stateTarget': '#frmUpdateCreditCard_wrapper #coBillingState',
                    'cityTarget': '#frmUpdateCreditCard_wrapper #coBillingCity',
                    'stateHiddenInput': '#frmUpdateCreditCard_wrapper #billingForm_state_hidden',
                    'cityHiddenInput': '#frmUpdateCreditCard_wrapper #billingForm_city_hidden',
                    'phoneTarget': '#frmUpdateCreditCard_wrapper #co-billing-phone'
                },
                'billingCreate': {
                    'countryTarget': '#frmCreateCreditCard_wrapper #billingForm_country',
                    'stateTarget': '#frmCreateCreditCard_wrapper #coBillingState',
                    'cityTarget': '#frmCreateCreditCard_wrapper #coBillingCity',
                    'stateHiddenInput': '#frmCreateCreditCard_wrapper #billingForm_state_hidden',
                    'cityHiddenInput': '#frmCreateCreditCard_wrapper #billingForm_city_hidden',
                    'phoneTarget': '#frmCreateCreditCard_wrapper #co-billing-phone'
                }
            }
