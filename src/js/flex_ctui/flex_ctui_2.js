    /**
     * BASE CLASS
     * contains initializing function and functions for augmented checkout
     * including Shopping Bag and Checkout Page asynchronous content updation
     */

    _ctoClass = function(Config) {

        var pageHooks = {
            orderConfirmation: {
                beforeReady: function() {
                    return -1;
                },
                onReady: function() {
                    var orderGiftOption = $('div#co-summary-gift');
                    if($.trim(orderGiftOption.find('.co-value').text()) == '$0.00') {
                        orderGiftOption.hide();
                    } else {
                        orderGiftOption.show();
                    }
                }
            },
            order: {
                beforeReady: function() {
                    return -1;
                },
                onReady: function() {
                    // clear input value if email/login field is prepopulated
                    var emailInput = $('input.co-formFields-email[name*="billingAddress.email"]');
                    if(!_cto.FormUtils.isValidEmail(emailInput.val())) {
                        emailInput.val('');
                    }
                    // detect shipping method change and update shipping method and order total
                    // when initial shipping method, shipping info is not completed at this stage

                    setInterval(function() {
                        if(_cto.statics.checkoutStageInfogram.ShippingInfoComplete)
                            if(_cto.statics.checkoutStageInfogram.ShippingInfoComplete == 'false')
                            {
                                if(window.cartData.isBorderFree == 'true' && cartData != null && cartData.itemsTotal != null && cartData.itemsTotal.search('\\$') < 0) {
                                    // BORDER FREE 1.1
                                    var currentShippingCostText = ($('#pc-shipping .pc-value').text() === 'FREE') ? '0.00' : $('#pc-shipping .pc-value').text();
                                    var selectedShippingCostElements = $('#co-shipping-method-options-container .co-shipping-selects.selected .co-shipping-method-cost');
                                    if (selectedShippingCostElements.length > 1) {
                                        selectedShippingCostElements = selectedShippingCostElements[0];
                                    }
                                    var selectedShippingCostText = selectedShippingCostElements.text(),
                                        actualShippingCostText = (selectedShippingCostText === 'FREE') ? '0.00' : selectedShippingCostText,
                                        subtotalCostText = $('#pc-subtotal .pc-value').text();

                                    if(currentShippingCostText != actualShippingCostText)
                                    {
                                        // update order total information
                                        var currentGrandTotal = $('#pc-grandtotal .pc-value').text().replace(',','');

                                        $('#pc-shipping .pc-value').html(selectedShippingCostText);

                                        // Get the calculator total
                                        // use numbers only for calculations- new variables xyzNumber - magic
                                        var currentShippingCostNumber = 0;
                                        if (currentShippingCostText !== "") {
                                            currentShippingCostNumber = parseFloat(currentShippingCostText.replace( /^\w+/g, '').replace(',', '').trim());
                                        }
                                        var selectedShippingCostNumber = 0;
                                        if (selectedShippingCostText !== "") {
                                            selectedShippingCostNumber = parseFloat(selectedShippingCostText.replace( /^\w+/g, '').replace(',', '').trim());
                                        }
                                        var actualShippingCostNumber = 0;
                                        if (actualShippingCostText !== "") {
                                            actualShippingCostNumber = parseFloat(actualShippingCostText.replace( /^\w+/g, '').replace(',', '').trim());
                                        }
                                        var subtotalCostNumber = 0;
                                        if (subtotalCostText !== "") {
                                            subtotalCostNumber = parseFloat(subtotalCostText.replace( /^\w+/g, '').replace(',', '').trim());
                                        }
                                        var currentGrandTotalNumber = 0;
                                        if (currentGrandTotal !== "") {
                                            currentGrandTotalNumber = parseFloat(currentGrandTotal.replace( /^\w+/g, '').replace(',', '').trim());
                                        }


                                        // Get the country prefix
                                        var orderCountryPrefix = currentGrandTotal.substring(0,3);

                                        // Grand Total calculation.
                                        var calcTotalRaw = (currentGrandTotalNumber * 1) + ((actualShippingCostNumber * 1) - (currentShippingCostNumber * 1));
                                        var calcTotalRounded = calcTotalRaw.toFixed(2);
                                        var calcTotal = orderCountryPrefix + " " + calcTotalRounded;
                                        $('#pc-grandtotal .pc-value').html(calcTotal);


                                        // TODO: Why is this calculation different?
                                        var estaraTotalNumber = (subtotalCostNumber * 1) + (actualShippingCostNumber * 1);
                                        var estaraTotalText = orderCountryPrefix + " " + estaraTotalNumber;
                                        $('#fasEstaraTotal').html(estaraTotalText);
                                    }
                                } else {
                                    // NOT BORDER FREE -
                                    var currentShippingCostText = ($('#pc-shipping .pc-value').text() === 'FREE') ? '$0.00' : $('#pc-shipping .pc-value').text();
                                    var selectedShippingCostElements = $('#co-shipping-method-options-container .co-shipping-selects.selected .co-shipping-method-cost');
                                    if (selectedShippingCostElements.length > 1) {
                                        selectedShippingCostElements = selectedShippingCostElements[0];
                                    }
                                    var selectedShippingCostText = selectedShippingCostElements.text(),
                                        actualShippingCostText = (selectedShippingCostText === 'FREE') ? '$0.00' : selectedShippingCostText,
                                        subtotalCostText = $('#pc-subtotal .pc-value').text();
                                    if(currentShippingCostText != actualShippingCostText)
                                    {
                                        /**
                                         * Formats a currency String.
                                         * <pre><code>
                                         * > prettyCurrency('1003.98')
                                         * "$1,003.98"
                                         * > prettyCurrency('13.00')
                                         * "$13.00"
                                         * > prettyCurrency('10003.98')
                                         * "$10,003.98"
                                         * > prettyCurrency('1000003.98')
                                         * "$1,000,003.98"
                                         * > prettyCurrency('13.98')
                                         * "$13.98"
                                         * </code></pre>
                                         * @param String
                                         * @returns {String}
                                         */
                                        var prettyCurrency = function(strN) {
                                            var nWithComma = strN.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                            return '$' + nWithComma;
                                        };
                                        // update order total information
                                        var currentGrandTotal = $('#pc-grandtotal .pc-value').text().replace(',','');
                                        $('#pc-shipping .pc-value').html(selectedShippingCostText);
                                        // Get the calculator total
                                        // TODO: We should avoid this type of currency calculation.
                                        var calcTotal = fasMoneyAbs((currentGrandTotal.substr(1) * 1) + ((actualShippingCostText.substr(1) * 1) - (currentShippingCostText.substr(1) * 1)));
                                        $('#pc-grandtotal .pc-value').html(prettyCurrency(calcTotal));
                                        // TODO: Why is this calculation different?
                                        $('#fasEstaraTotal').html('$' + fasMoneyAbs((subtotalCostText.substr(1) * 1) + (actualShippingCostText.substr(1) * 1)));
                                    }
                                }
                            }
                    }, 400);
                }
            }
        }
