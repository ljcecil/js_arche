        this.init = function() {

            // define console.log if it doesn't exists
            if(typeof window.console == 'undefined') { console = { log: function() {} }}

            // hide canvas and ajax forms before document ready
            $('<style type="text/css"> form.asyncForm { display: none; } </style>').appendTo('head');

            // invoke tealeaf for UI events
            if(Config.tealeaf.enabled) {
                Req(true,
                    '/web_assets/js/tealeaf/TealeafSDKConfig.js',
                    '/web_assets/js/tealeaf/TealeafSDK.js'
                );
            }

            $(document).ready(function() {

                // get current script name - e.g. "checkout/cart"
                var scriptName = _cto.scriptName();

                // detect ie6
                var agentIE6 = ($.browser.msie && $.browser.version.substr(0, 1) < 7) ? true : false;

                // detect ipad
                var agentIpad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;

                // save the earth. let's not pollute the global namespace
                _cto.statics = {
                    'stageLock': false,
                    'showCreditCardUpdateForm': false,
                    'isIE6': agentIE6,
                    'isIpad': agentIpad,
                    'lastRequestTime': new Date().getTime(),
                    'sessionExpired': false,
                    'checkoutStageInfogram': {},
                    'isShopPage': _cto.isShopPage(scriptName),
                    'isCartPage': _cto.isCartPage(scriptName),
                    'isOrderPage': _cto.isOrderPage(scriptName),
                    'isConfirmationPage': _cto.isConfirmationPage(scriptName),
                    'stateShippingMethodSelections': []
                }

                setTimeout(function() {
                    // preserve original s.pageName
                    if(typeof s.pageName != 'undefined') {
                        _cto.statics.pageName = s.pageName;
                    }
                }, 1600);

                // setup the experience
                _cto.RequestHandler.readyForms();
                _cto.previouslyVisited();
                _cto.createLoginModal();

                if(_cto.scriptName() == 'account/login') {
                    // fix login button (IE7)
                    if($.browser.msie && $.browser.version < 8) {
                        var inputLogin = $('input[name="/atg/userprofiling/ProfileFormHandler.login"]').hide(),
                            buttonHtml = '<input id="co-ie7CompatibleLoginButton" type="submit" value="&nbsp;" />',
                            bgImageUrl = inputLogin.attr('src'),
                            inputStyle = {
                                'background': 'url(' + bgImageUrl + ') no-repeat',
                                'border': 'none',
                                'width': '126px',
                                'height': '26px',
                                'cursor': 'pointer'
                            };
                        // create and deploy new button. click event triggers orignal button
                        $(buttonHtml)
                            .insertAfter(inputLogin)
                            .css(inputStyle)
                            .click(function(e) {
                                e.preventDefault();
                                inputLogin.trigger('click');
                            });
                    }
                }

                if(!_cto.statics.isCartPage && !_cto.statics.isOrderPage && !_cto.statics.isConfirmationPage) {
                    $('#canvas').css('visibility', 'visible');
                    _ctoMiniCart.triggers();
                    if(!_cto.statics.isConfirmationPage) {
                        _ctoMiniCart.populate();
                    }
                } else {
                    setTimeout(function() { $('body').addClass('is-checkout-page'); }, 200);
                    if(_cto.statics.isConfirmationPage) {
                        $('#canvas').css('visibility', 'visible');
                    }
                }
                if(_cto.statics.isOrderPage && !_cto.statics.isConfirmationPage) {
                    setTimeout(function() { $('body').addClass('is-order-page'); }, 200);
                    $('#pc-overflow:first').remove();
                    pageHooks.order.onReady();
                    // populate page with latest cart+checkout object
                    _cto.ajax({
                        url: '/store/common/json/checkout.jsp?task=checkoutOnLoadCart',
                        dataType: 'json',
                        success: function(data) {
                            if(_cto.isCartOrCheckoutObject(data)) {
                                _cto.stopChecks(data); // validate the user can continue
                                if(data.cart.bagCount == 0) {
                                    // redirect to shopping bag
                                    _cto.goHomeUnsecure()
                                } else {
                                    $('#canvas').css('visibility', 'visible');
                                    _cto.initOrderPage(data);
                                    _cto.initPhoneNumberBoxes();
                                }
                            }
                        }
                    });
                }

                if(_cto.statics.isCartPage) {
                    setTimeout(function() { $('body').addClass('is-cart-page'); }, 200);

                    //Smarter HQ: Cart Promo Div
                    $('<div id="shq_cart_promo"/>').insertBefore('#sb-wrapper #sb-content');

                    $('#pc-overflow:first').remove();
                    _cto.ajax({
                        url: '/store/common/json/cart.jsp?task=shoppingBagOnLoadCart&isCartPage=' + _cto.statics.isCartPage + '&isOrderPage=' + _cto.statics.isOrderPage + '&isShopPage=' + _cto.statics.isShopPage,
                        dataType: 'json',
                        success: function(data) {
                            if(_cto.isCartOrCheckoutObject(data)) {
                                $('#canvas').css('visibility', 'visible');
                                _cto.createCheckoutModals();
                                _cto.updateCart(data, true);
                            }
                        }
                    });
                }

                if(_cto.statics.isConfirmationPage) {
                    pageHooks.orderConfirmation.onReady();
                }

                //    _cto.initCityStateCountry(cscParams.shipping);

            });

        }();
