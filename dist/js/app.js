var quietTimeShipping = 'null'; 
var createCCFormEl = 'form[name="frmCreateCreditCard"]';
var updateCCFormEl = 'form[name="frmUpdateCreditCard"]';
if(typeof prodList === 'undefined') var prodList = [];
if(typeof qtyList === 'undefined') var qtyList = [];
if(typeof s_account === 'undefined') var s_account = '';
if(typeof certonaPageId === 'undefined') var certonaPageId = '';
function _D() {
    if(s_account.indexOf('comdev') > -1 ||s_account.indexOf('comqa')) {
        console.log(arguments);
    }
}
(function($) {
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
                    var emailInput = $('input.co-formFields-email[name*="billingAddress.email"]');
                    if(!_cto.FormUtils.isValidEmail(emailInput.val())) {
                        emailInput.val('');
                    }
                    setInterval(function() {
                        if(_cto.statics.checkoutStageInfogram.ShippingInfoComplete)
                            if(_cto.statics.checkoutStageInfogram.ShippingInfoComplete == 'false')
                            {
                                if(window.cartData.isBorderFree == 'true' && cartData != null && cartData.itemsTotal != null && cartData.itemsTotal.search('\\$') < 0) {
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
                                        var currentGrandTotal = $('#pc-grandtotal .pc-value').text().replace(',','');
                                        $('#pc-shipping .pc-value').html(selectedShippingCostText);
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
                                        var orderCountryPrefix = currentGrandTotal.substring(0,3);
                                        var calcTotalRaw = (currentGrandTotalNumber * 1) + ((actualShippingCostNumber * 1) - (currentShippingCostNumber * 1));
                                        var calcTotalRounded = calcTotalRaw.toFixed(2);
                                        var calcTotal = orderCountryPrefix + " " + calcTotalRounded;
                                        $('#pc-grandtotal .pc-value').html(calcTotal);
                                        var estaraTotalNumber = (subtotalCostNumber * 1) + (actualShippingCostNumber * 1);
                                        var estaraTotalText = orderCountryPrefix + " " + estaraTotalNumber;
                                        $('#fasEstaraTotal').html(estaraTotalText);
                                    }
                                } else {
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
                                        var prettyCurrency = function(strN) {
                                            var nWithComma = strN.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                            return '$' + nWithComma;
                                        };
                                        var currentGrandTotal = $('#pc-grandtotal .pc-value').text().replace(',','');
                                        $('#pc-shipping .pc-value').html(selectedShippingCostText);
                                        var calcTotal = fasMoneyAbs((currentGrandTotal.substr(1) * 1) + ((actualShippingCostText.substr(1) * 1) - (currentShippingCostText.substr(1) * 1)));
                                        $('#pc-grandtotal .pc-value').html(prettyCurrency(calcTotal));
                                        $('#fasEstaraTotal').html('$' + fasMoneyAbs((subtotalCostText.substr(1) * 1) + (actualShippingCostText.substr(1) * 1)));
                                    }
                                }
                            }
                    }, 400);
                }
            }
        }
        this.init = function() {
            if(typeof window.console == 'undefined') { console = { log: function() {} }}
            $('<style type="text/css"> form.asyncForm { display: none; } </style>').appendTo('head');
            if(Config.tealeaf.enabled) {
                Req(true,
                    '/web_assets/js/tealeaf/TealeafSDKConfig.js',
                    '/web_assets/js/tealeaf/TealeafSDK.js'
                );
            }
            $(document).ready(function() {
                var scriptName = _cto.scriptName();
                var agentIE6 = ($.browser.msie && $.browser.version.substr(0, 1) < 7) ? true : false;
                var agentIpad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
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
                    if(typeof s.pageName != 'undefined') {
                        _cto.statics.pageName = s.pageName;
                    }
                }, 1600);
                _cto.RequestHandler.readyForms();
                _cto.previouslyVisited();
                _cto.createLoginModal();
                if(_cto.scriptName() == 'account/login') {
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
                    _cto.ajax({
                        url: '/store/common/json/checkout.jsp?task=checkoutOnLoadCart',
                        dataType: 'json',
                        success: function(data) {
                            if(_cto.isCartOrCheckoutObject(data)) {
                                _cto.stopChecks(data); 
                                if(data.cart.bagCount == 0) {
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
            });
        }();
        this.Lang = {
            'global' : {
                'general' : 'There was a problem while processing your request. Please click OK and try again. '
            },
            'itemLevel': {
                'inventoryError': 'We\'re sorry, but this item is no longer available.'
            },
            'formErrors': {
                'global': 'Please review the highlighted areas below to continue.',
                'login': {
                    'email': 'Please enter a valid email address.',
                    'password': 'Please enter your password.'
                },
                'freezeOrder': 'We could not process your order at this time. If you feel you received this in error, please call customer service at '
            }
        }
        this.getSessionIdFromCookie = function() {
            if (document.cookie == '') return null;
            var cookies = document.cookie.split(';');
            for(var i = 0; i < cookies.length; i++) {
                var pair = cookies[i].split('=');
                if(pair[0]=='JSESSIONID') return unescape(pair[1]);
            }
        }
        this.heDecode = function(encodedString) {
            return $('<span/>').html(encodedString).text();
        }
        this.animScrollTop = function(duration, callback, formName) {
            var runOnce = 0;
            if($('form[name="' + formName + '"]').offset().top - $(document).scrollTop() < 100) {
                $('html, body').animate({ scrollTop: $('form[name="' + formName + '"]').offset().top - 300 }, duration, function() {
                    if(runOnce < 1) { callback(); } runOnce++;
                });
            } else {
                callback();
            }
        }
        this.closeModals = function() {
            try {
                jQuery('.modal:visible').modal('hide');
                $('.modalWindow').jqmHide(); 
            } catch(e) {
                $('.modal .close').trigger('click');
                $('.modalWindow .qvClose').trigger('click'); 
            }
        }
        this.goHomeUnsecure = function() {
            document.location = _cto.getHomeUnsecure();
        }
        this.getHomeUnsecure = function() {
            return document.location.href.split('/store')[0] + '/store/home.jsp';
        }
        this.sessionTimeoutModal = function() {
            _cto.closeModals();
            $('#modalSessionTimedOut').trigger('click');
            $('.jqmOverlay').unbind();
        }
        this.getTaskFromUrl = function(url) {
            var q = url.split('?')[1];
            if(!q) return false;
            q = q.split('&');
            for(var i = 0 ; i < q.length; i++) {
                var o = q[i].split('=');
                if(o[0] == 'task') return o[1]
            }
        }
        this.ajaxBeforeSerializeUrl = function(form, url) {
            var formName = form.attr('name');
            if(_cto.statics.isOrderPage && (formName == 'qvFrmAddToBag' || formName == 'couponForm')) {
                form.find('input[name*="SuccessURL"], input[name*="ErrorURL"]').val('/store/common/json/checkout.jsp');
                url = url.replace('/json/cart.jsp', '/json/checkout.jsp');
            }
            if(_cto.statics.isCartPage) {
                url = url + '&isCartPage=-1';
            }
            return _cto.RequestHandler.urlReprice(url, formName);
        }
        this.ajax = function(o) {
            $.ajax($.extend(o, {
                url: _cto.RequestHandler.urlReprice(o.url),
                beforeSend: function(xhr) {
                    if(_cto.RequestHandler.handleSessionRedirect()) { return false; }
                },
                complete: function(xhr) {
                    _cto.RequestHandler.responseRedirect(xhr);
                }
            }));
        }
        this.ajaxForm = function(r, o) {
            $(r).ajaxForm($.extend(o, {
                beforeSerialize: function(form) {
                    this.url = _cto.ajaxBeforeSerializeUrl(form, this.url);
                },
                beforeSend: function(xhr) {
                    if(_cto.RequestHandler.handleSessionRedirect()) { return false; }
                },
                complete: function(xhr) {
                    _cto.RequestHandler.responseRedirect(xhr);
                }
            }));
        }
        this.ajaxSubmit = function(r, o) {
            $(r).ajaxSubmit($.extend(o, {
                beforeSerialize: function(form) {
                    this.url = _cto.ajaxBeforeSerializeUrl(form, this.url);
                },
                beforeSend: function(xhr) {
                    if(_cto.RequestHandler.handleSessionRedirect()) { return false; }
                },
                complete: function(xhr) {
                    _cto.RequestHandler.responseRedirect(xhr);
                }
            }));
        }
        this.isCartOrCheckoutObject = function(data) {
            var isModalLogin;
            if(typeof data == 'object') {
                if(data.modalLogin) {
                    if(data.modalLogin == 'true') isModalLogin = true;
                } else {
                    isModalLogin = false;
                }
                if(isModalLogin || data.items || data.checkout) return -1;
            }
            return 0;
        }
        this.clearSessionLaunchModal = function() {
            _cto.statics.sessionExpired = true;
            $.cookie('JSESSIONID', null, {path:'/', secure: ((document.location.protocol == 'https:') ? true : false)});
            _cto.sessionTimeoutModal();
        }
        this.RequestHandler = this.FormHandler = this.FormUtils = {
            handleSessionRedirect: function() {
                if(_cto.statics.isOrderPage) {
                    var currentEpochTime = new Date().getTime();
                    var secondsSinceLastRequest = (currentEpochTime - _cto.statics.lastRequestTime) / 1000;
                    _cto.statics.lastRequestTime = currentEpochTime;
                    if(secondsSinceLastRequest > Config.sessionTimeout.seconds || _cto.statics.sessionExpired) {
                        _cto.clearSessionLaunchModal();
                        return -1;
                    } else {
                        return 0;
                    }
                }
                return 0;
            },
            responseRedirect: function(xhr) {
                if(xhr.readyState == 4 && (_cto.statics.isOrderPage || _cto.statics.isCartPage)) {
                    var data = xhr.responseText;
                    if(typeof data != 'object') {
                        if(/<\/head>/i.test(data) && xhr.status != 500) {
                            _cto.clearSessionLaunchModal();
                            return -1;
                        } else if(trim(data).substring(0, 1) != '<') {
                            data = eval('(' + data + ')');
                        } else {
                            return 0;
                        }
                    }
                    if(data.modalLogin == 'false' && data.location) {
                        if(data.location.indexOf('/store/home.jsp') > -1) {
                            _cto.clearSessionLaunchModal();
                        } else {
                            document.location = data.location;
                        }
                        return -1;
                    } else {
                        return 0;
                    }
                }
                return 0;
            },
            readyForms: function() {
                $('form.asyncForm').show();
                $('.co-global-error').html(_cto.Lang.formErrors.global);
                for (i = 0; i < document.forms.length; i++) {
                    document.forms[i]._submit = document.forms[i].submit;
                    document.forms[i].submit = function (event) {
                        target = event ? event.target : this;
                        if ($(target).attr('class').indexOf('asyncForm') != -1) {
                            $(target).submit();
                        } else {
                            target._submit();
                        }
                    }
                }
                _cto.ajaxForm('.asyncForm', this.ajaxConfig);
            },
            ajaxConfig: {
                dataType: 'json',
                showLoader: true,
                timeout: Config.ajaxTimeout.duration,
                success: function(data, status, xhr) {
                    if(_cto.isCartOrCheckoutObject(data)) {
                        $form = $(xhr);
                        var formName = $form.attr('name');
                        if(data.cart) data.formErrors = data.cart.formErrors;
                        if(_cto.isAddToBag() && data.formErrors.cart.length > 0) {
                            $('#alert.modalWindow').jqmHide();
                            var m = '';
                            $(data.formErrors.cart).each(function() {
                                m += ' ' + this.message;
                            });
                            $form.find('.product-zone-error-message').html(m).removeClass('hide').show();
                        } else {
                            $form.find('.product-zone-error-message').html('').addClass('hide').hide();
                            if(data.modalLogin == 'true') {
                                _cto.closeModals();
                                $('#pc-btn-checkout2').trigger('click');
                            } else {
                                _ctoTagging.doTracking(data, formName); 
                                if(((data.cart) ? data.cart.wishlist : data.wishlist) == 'false') {
                                    var ele = 'html';
                                    if ($('body').scrollTop() > 0){ ele = 'body'; }
                                    if(_cto.statics.isCartPage) {
                                        if(data.recentlyAdded.price.length > 0){
                                            _cto.updateCart(data);
                                        }else{
                                            _cto.updateCart(data);
                                        }
                                    } else if(_cto.statics.isOrderPage) {
                                        _ctoMiniCart.update(data, formName);
                                        _cto.updateOrder(data, formName);
                                    } else {
                                        _ctoMiniCart.isAddToBag = true;
                                        _ctoMiniCart.update(data, formName);
                                    }
                                    _cto.closeModals();
                                } else {
                                    $('#alert').jqmHide();
                                }
                            }
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(_cto.Lang.global.general + ' (' + textStatus + ')');
                    _cto.closeModals();
                }
            },
            urlReprice: function(url, formName) {
                var task = ((typeof formName == 'string') ? formName : null) || _cto.getTaskFromUrl(url);
                if((_cto.statics.isCartPage && $.inArray(task, $.merge(Config.repriceRequests.asyncFormNames.cartPage, Config.repriceRequests.ajaxTaskParams.cartPage)) > -1) ||
                    (_cto.statics.isOrderPage && $.inArray(task, $.merge(Config.repriceRequests.asyncFormNames.checkoutPage, Config.repriceRequests.ajaxTaskParams.checkoutPage)) > -1)) {
                    return url + ((url.indexOf('?') < 0) ? '?' : '&') + 'reprice=true';
                } else {
                    return url;
                }
            },
            validateLogin: function(parent) {
                parent = (parent) ? parent : 'body';
                $(parent + ' .validateFormLogin').submit(function() {
                    values = {};
                    errors = [];
                    $.each($(this).serializeArray(), function(i, field) {
                        values[field.name] = field.value;
                    });
                    if(!_cto.FormUtils.isValidEmail(values['login'])) {
                        errors.push({
                            'login' : _cto.Lang.formErrors.login.email
                        });
                    }
                    if(!values['password']) {
                        errors.push({
                            'password' : _cto.Lang.formErrors.login.password
                        });
                    }
                    if(errors.length) {
                        $('.form-error').removeClass('form-error');
                        $('.form-error-msg').remove();
                        $.each(errors, function(index, error){
                            $.each(error, function(index, error){
                                index = (index == 'email') ? 'login' : index; 
                                if($(parent + ' .validateFormLogin' + ' input[name=' + index + '] + .form-error-msg').length < 1) {
                                    e = $(parent + ' .validateFormLogin' + ' input[name=' + index + ']');
                                    e.addClass('form-error');
                                    $('<div class="form-error-msg">' + error + '</div>').insertAfter(e);
                                }
                            });
                        });
                        return false;
                    }
                    return true;
                });
            },
            isValidEmail: function(email) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
            },
            phoneNumberBoxes: function() {
                $('.phoneNumberBoxes').each(function() {
                    var inputObserveInt = 0, observeTimeout = 0;
                    var isTechTable = function(){return (navigator.userAgent.indexOf("FAS TechTable") != -1)};
                    var phone = $(this).find('.coFormPhone').val().split('-').join('');
                    var parent = $(this);
                    var $primaryPhone = $(parent).find('.frmPhone1');
                    if(isTechTable() && !$primaryPhone.hasClass('frmPhoneIntl')){
                        $primaryPhone.attr('maxlength',10).addClass('ttPhone');
                        $(parent).find('.frmPhone2, .frmPhone3, .dash').remove();
                    }
                    if($(parent).find('.frmPhone1').attr('maxlength') == 3) {
                        $(parent).find('.frmPhone1').val(phone.substring(0, 3));
                        $(parent).find('.frmPhone2').val(phone.substring(3, 6));
                        $(parent).find('.frmPhone3').val(phone.substring(6, 10));
                    } else {
                        $(parent).find('.frmPhone1').val(phone);
                    }
                    if(isTechTable()){
                        $(parent).find('.co-formPhone').unbind('keyup change');
                        $(parent).find('.co-formPhone').blur(function(){
                            clearInterval(inputObserveInt);
                        })
                            .focus(function() {
                                clearInterval(inputObserveInt);
                                var $phoneInput = $(this);
                                inputObserveInt = setInterval(function() {
                                    var inputClass = $phoneInput.attr('class');
                                    var charCount  = $phoneInput.val().length;
                                    if(charCount <= 10){
                                        clearTimeout(observeTimeout)
                                    }else{
                                        $(parent).find('.frmPhone1').val($(parent).find('.coFormPhone').val().substring(0, 10));
                                        $phoneInput.blur();
                                        clearInterval(inputObserveInt);
                                        clearTimeout(observeTimeout)
                                    }
                                    $(parent).find('.coFormPhone').val($primaryPhone.val());
                                }, 100);
                                observeTimeout = setTimeout(function(){$phoneInput.blur();clearInterval(inputObserveInt)},2000);
                            });
                    }else{
                        $(parent).find('.co-formPhone').bind('keyup change', function() {
                            var inputClass = $(this).attr('class');
                            var charCount  = $(this).val().length;
                            if(inputClass != 'frmPhone3' && charCount == 3) {
                                $(this).next().focus();
                            }
                            $(parent).find('.coFormPhone').val(
                                $(parent).find('.frmPhone1').val() +
                                $(parent).find('.frmPhone2').val() +
                                $(parent).find('.frmPhone3').val()
                            );
                        });
                    }
                });
            }
        };
        this.initPhoneNumberBoxes = this.FormUtils.phoneNumberBoxes;
        this.clearObjDataTimeouts = function(obj, tids) {
            $.each(tids, function(index, tid) {
                if(typeof obj.data(tid) != 'undefined' && obj.data(tid) != '') {
                    clearTimeout(obj.data(tid));
                    obj.data(tid, '');
                }
            });
        }
        this.toggleSubscribe = function()
        {
            if($('.ibf-email-optin-checkbox').attr('checked'))
            {
                $('.checkout-emailFrequencyDropDownDiv').css({'display':'block'})
                _cto.orderStageHeight(false);
            }
            else
            {
                $('.checkout-emailFrequencyDropDownDiv').css({'display':'none'})
                _cto.orderStageHeight(true);
            }
        }
        this.checkVoiceMsgBox = function()
        {
            if($('.checkout-phoneCallOptOut').attr('checked'))
            {
                $('.checkout-receiveRecordedMsgs').checked(true);
            }
        }
        this.displayCaslDiv = function()
        {
            var strCountry = $('#billingForm_country').val();
            if(strCountry  == 'USA')
            {
                $('#statelableid').html('State');
                $('#zipcodeid').html('ZIP Code');
            }
            else if(strCountry == 'CAN'){
                $('#statelableid').html('Province');
                $('#zipcodeid').html('Postal Code');
            }
            else if(strCountry == 'GBR'){
                $('#statelableid').html('County');
                $('#zipcodeid').html('Postal Code');
            }
            else{
                $('#statelableid').html('State/Region');
                $('#zipcodeid').html('Postal Code');
            }
            if(strCountry != 'USA' && strCountry != '')
            {
                $('.co-billing-email-casl,.checkout-form-row-casl').css({'display':'block'})
                $('.checkout-promo-slot-container-casl').css({'display':'block'})
                _cto.orderStageHeight(false);
            }
            else
            {
                $('.co-billing-email-casl,.checkout-form-row-casl').css({'display':'none'})
                $('.checkout-promo-slot-container-casl').css({'display':'none'})
                _cto.orderStageHeight(true);
            }
        }
        this.createLoginModal = function() {
            $('<div class="modalWindow" id="modalLogin"><table border="0" cellspacing="0" cellpadding="0"><tr class="modalControls"><td class="modalCaption"></td><td align="right"><a class="modalClose"></a></td></tr><tr><td colspan="2"><div class="coModalContent loading"></div></td></tr></table></div>').appendTo('body');
            $('#modalLogin').jqm({
                target: 'div.coModalContent',
                ajax: '@href',
                title: '@title',
                trigger: 'a.modalLoginTrigger',
                onLoad: function() {
                    $('#modalLogin .coModalContent').removeClass('loading');
                    $('#modalLogin').prev('div').unbind('click');
                }
            });
        }
        this.createCheckoutModals = function() {
            var self = this;
            this.checkoutModalGuid = Math.floor(Math.random() * 100000000);
            $('<div class="modalWindow" id="modalCheckoutOption'+ this.checkoutModalGuid +'"><table border="0" cellspacing="0" cellpadding="0"><tr class="modalControls"><td class="modalCaption"></td><td align="right"><a class="modalClose"></a></td></tr><tr><td colspan="2"><div class="coModalContent loading"></div></td></tr></table></div>').appendTo('body');
            $('a.modalCheckoutOptionTrigger').unbind().each(function() {this['jqmShow'] = undefined});
            $('#modalCheckoutOption' + this.checkoutModalGuid).jqm({
                target: 'div.coModalContent',
                ajax: '@href',
                title: '@title',
                trigger: 'a.modalCheckoutOptionTrigger',
                timeout: Config.ajaxTimeout.duration,
                onLoad: function() {
                    $('#modalCheckoutOption' + self.checkoutModalGuid + ' .coModalContent').css('height', 'auto').removeClass('loading');
                    _cto.ajaxForm('form[name="addEditGift"], form[name="frmCreateGiftcardModal"], form[name="frmCreateGiftcard4"], form[name="editShipTo"], form[name="editShipMethod"]', {
                        dataType: 'json',
                        showLoader: false,
                        success: function(data, status, xhr) {
                            if(_cto.isCartOrCheckoutObject(data)) {
                                var formName = $(xhr).attr('name');
                                if(_cto.statics.isCartPage) {
                                    _cto.updateCart(data.cart);
                                    _cto.createCheckoutModals();
                                } else {
                                    _ctoMiniCart.update(data.cart);
                                    _cto.updateOrder(data, formName);
                                    _cto.createCheckoutModals();
                                }
                                if(!_cto.containsErrors($.merge(data.checkout.formErrors, data.cart.formErrors))) {
                                    if(formName == 'frmCreateGiftcardModal') {
                                        if(data.checkout.billing.giftCard.applyToOrder == 'false') {
                                            _cto.clearFormErrors('form[name="frmCreateGiftcardModal"]');
                                            $('#modal-add-giftCard #co-billing-gift-result-number').html(billing.giftCard.giftCardNumber.replace(/\X/g, '&#8226;'));
                                            $('#modal-add-giftCard #co-billing-gift-result-balance').html('$' + fasMoneyAbs(billing.giftCard.balanceAmount));
                                            $('#modal-add-giftCard #co-billing-gift-form').stop().fadeOut(function() {
                                                $('#modal-add-giftCard #co-billing-gift-result').stop().fadeIn();
                                            });
                                        } else {
                                            _cto.closeModals();
                                        }
                                    } else {
                                        _cto.closeModals();
                                    }
                                    if(formName == 'editShipTo') {
                                        if(!data.checkout.shipMethod){
                                            $('.editShipMethodUpdateAlert .modalCheckoutOptionTrigger').click();
                                        }
                                    }
                                }
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            alert(_cto.Lang.global.general + ' (' + textStatus + ')');
                            _cto.closeModals();
                        }
                    });
                }
            });
            $('<div class="modalWindow" id="modalCheckoutOptionLocked"><table border="0" cellspacing="0" cellpadding="0"><tr class="modalControls"><td class="modalCaption"></td></tr><tr><td colspan="2"><div class="coModalContent loading"></div></td></tr></table></div>').appendTo('body');
            $('#modalCheckoutOptionLocked').jqm({
                target: 'div.coModalContent',
                ajax: '@href',
                title: '@title',
                trigger: 'a.modalCheckoutOptionLockedTrigger',
                timeout: Config.ajaxTimeout.duration,
                onLoad: function() {
                    $('.jqmOverlay').unbind();
                    $('#modalCheckoutOptionLocked .coModalContent').css('height', 'auto').removeClass('loading');
                    _cto.ajaxForm('form[name="removeHazMatForm"], form[name="editShipTo"]', {
                        dataType: 'json',
                        showLoader: false,
                        success: function(data, status, xhr) {
                            if(_cto.isCartOrCheckoutObject(data)) {
                                var formName = $(xhr).attr('name');
                                if(_cto.statics.isCartPage) {
                                    _cto.updateCart(data.cart);
                                } else {
                                    _ctoMiniCart.update(data.cart);
                                    _cto.updateOrder(data, formName);
                                }
                                if(!_cto.containsErrors($.merge(data.checkout.formErrors, data.cart.formErrors))) {
                                    _cto.closeModals();
                                    switch(formName)
                                    {
                                        case 'editShipTo':
                                            $('.editShipMethodUpdateAlert .modalCheckoutOptionTrigger').click();
                                            break;
                                        case 'removeHazMatForm':
                                            $('#modalEditShippingMethod').trigger('click');
                                            break;
                                    }
                                }
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            alert(_cto.Lang.global.general + ' (' + textStatus + ')');
                            _cto.closeModals();
                        }
                    });
                }
            });
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
        this.scrapeProductIdFromUrl = function(url) {
            if(url.indexOf('productId=') > -1) {
                return url.split('productId=')[1].split('&')[0].replace('#', '');
            } else {
                return '';
            }
        }
        this.scrapeCatIdFromUrl = function(url) {
            if(url.indexOf('catId=') > -1) {
                return url.split('catId=')[1].split('&')[0].replace('#', '');
            } else {
                return '';
            }
        }
        this.scriptName = function() {
            var path = window.location.pathname.split('store/');
            return path[path.length - 1].split('.')[0];
        }
        this.isCartPage = function(scriptName) {
            if(!scriptName) {
                scriptName = _cto.scriptName();
            }
            if(scriptName == 'checkout/cart' || scriptName == 'common/checkout/cart') {
                return -1;
            } else {
                return 0;
            }
        }
        this.isOrderPage = function(scriptName) {
            if(!scriptName) {
                scriptName = _cto.scriptName();
            }
            if(scriptName == 'checkout/checkout2') {
                return -1;
            } else {
                return 0;
            }
        }
        this.isShopPage = function(scriptName) {
            if(!scriptName) {
                scriptName = _cto.scriptName();
            }
            var nonShopLocs = [
                'checkout',
                'account',
                'wish_list'
            ];
            if($.inArray(scriptName.split('/')[0], nonShopLocs) == -1) {
                return -1
            } else {
                return 0;
            }
        }
        this.isConfirmationPage = function(scriptName) {
            if(!scriptName) {
                scriptName = _cto.scriptName();
            }
            if(scriptName == 'checkout/orderConfirmation') {
                return -1;
            } else {
                return 0;
            }
        }
        this.isAddToBag = function() {
            if($('#product-actions').length || $('.product-form-controls').length) {
                return -1;
            } else {
                return 0;
            }
        }
        this.previouslyVisited = function() {
            if(!_cto.statics.isShopPage) {
                previousUrl = $.cookie('previousUrl');
                if(window.location.href == previousUrl || !previousUrl) {
                    $('.sb-contShop-link').attr('href', _cto.getHomeUnsecure());
                } else {
                    $('.sb-contShop-link').attr('href', previousUrl);
                }
            } else if(!!!location.pathname.match('login.jsp'))  {
                $.cookie('previousUrl', window.location.href, {path: '/'});
            }
        }
        this.containsErrors = function(errors) {
            if(!isEmptyObject(errors.cart) ||
                !isEmptyObject(errors.coupon) ||
                !isEmptyObject(errors.shipping) ||
                !isEmptyObject(errors.giftOptions) ||
                !isEmptyObject(errors.creditCard) ||
                !isEmptyObject(errors.billing) ||
                !isEmptyObject(errors.giftCard) ||
                !isEmptyObject(errors.commitOrder)) {
                return -1;
            } else {
                return 0
            }
        }
        this.mergeErrors = function(errors) {
            var merged = [];
            if(!isEmptyObject(errors.cart))
                $.merge(merged, errors.cart);
            if(!isEmptyObject(errors.coupon))
                $.merge(merged, errors.coupon);
            if(!isEmptyObject(errors.shipping))
                $.merge(merged, errors.shipping);
            if(!isEmptyObject(errors.giftOptions))
                $.merge(merged, errors.giftOptions);
            if(!isEmptyObject(errors.creditCard))
                $.merge(merged, errors.creditCard);
            if(!isEmptyObject(errors.billing))
                $.merge(merged, errors.billing);
            if(!isEmptyObject(errors.giftCard))
                $.merge(merged, errors.giftCard);
            if(!isEmptyObject(errors.commitOrder))
                $.merge(merged, errors.commitOrder);
            return merged;
        }
        this.continueToCheckoutCheck = function(cartContainsInventoryError){
            var $shoppingBagproceedToCheckoutBtns = $('.is-shopping-bag #pc-btn-checkout[type="submit"]');
            if(_cto.statics.cartItemAvailableCount == _cto.statics.cartItemNotAvailableCount && _cto.statics.cartContainsInventoryError){
                $shoppingBagproceedToCheckoutBtns.attr('disabled','true');
                return false;
            }else{
                $shoppingBagproceedToCheckoutBtns.removeAttr('disabled');
                return true;
            }
        }
        this.updateBagCount = function(count, cartContainsInventoryError) {
            if(cartContainsInventoryError) {
                $('#header .bag-count').html('<span class="pc-alert-error-text">!</span>');
            } else {
                $('#pc-bag-count, #header .bag-count').html((count | 0));
            }
        }
        this.updateMbox = function(data) {
            var mboxParams = [];
            if(data.isCommonMboxParams) {
                $(data.mboxParameters).each(function() {
                    mboxParams.push(this.mboxParameterName + '=' + this.mboxParameterValue);
                });
            }
            if(data.mboxes) {
                $(data.mboxes).each(function() {
                    if(this.mboxName.indexOf('persistentCart') == -1) {
                        if(!data.isCommonMboxParams) {
                            mboxParams = [];
                            $(this.mboxParameters).each(function() {
                                mboxParams.push(this.mboxParameterName + '=' + this.mboxParameterValue);
                            });
                        }
                        try {
                            mboxFactoryDefault.update(this.mboxName, mboxParams);
                        } catch(e) {};
                    }
                });
            }
        }
        this.getProductInfo = function(prodInfoObject){
            var prodId = prodInfoObject.id|| '';
            var prodInfoLabel = prodInfoObject.label|| '';
            var inseamArray = ['Regular', 'Short', 'Long', 'Tall', 'Petite'];
            var value = '';
            if(typeof cartData == 'object' && prodInfoLabel){
                $.each(cartData.items,function(idx,object){
                    if(object.itemId == prodId){
                        if(object.hasOwnProperty(prodInfoLabel)){
                            value=object[prodInfoLabel]
                        }else if(prodInfoLabel == 'inseam'){
                            $.each(inseamArray,function(idx,item){
                                var productSize = object.size || '';
                                if(!!~productSize.indexOf(item)){
                                    value = item;
                                }
                            });
                        } ;
                    }
                })
            }
            return value;
        }
        triggerCartRefesh = false;
        this.updateCartComplete = function(callbackEventsObj){
            var cbObj = callbackEventsObj || '';
            if(cbObj){
                for (var prop in cbObj) {
                    if(cbObj[prop] instanceof Function){
                        cbObj[prop]();
                    }
                }
            }
        }
        this.inventoryCheck = function(data,isSoldOutOnly){
            if(!data) return;
            var isSoldOutOnly =  isSoldOutOnly || '';
            var inventoryAlerts = false;
            var inventoryErrorType = '';
            var inventoryErrorItems = [];
            $.each(data.items, function(index, item) {
                if(this.itemNotAvailable) {
                    inventoryErrorItems.push(item);
                }
            });
            if(inventoryErrorItems.length){
                inventoryAlerts = {};
                if(data.items.length == inventoryErrorItems.length){
                    inventoryErrorType = 'soldOut'
                }else{
                    if(isSoldOutOnly) inventoryAlerts = '';
                    inventoryErrorType = 'someItems'
                }
                if(inventoryAlerts){
                    inventoryAlerts.alertType =  inventoryErrorType;
                    inventoryAlerts.items =  inventoryErrorItems;
                }
                return inventoryAlerts;
            }
            return inventoryAlerts;
        };
        this.updateCart = function(data, suppressMbox) {
            window.cartData = data;
            if(data.bagCount != 0){
                $('.checkout-btn.hide').removeClass('hide');
            }else{
                $('.checkout-btn').addClass('hide');
            }
            var callbackEvents = {};
            $(window).trigger("cartDataReady");
            $('#sb-cart-errors .sb-error-message').remove();
            $.each(data.formErrors.cart, function() {
                var $alert = $('<div class="alert alert-danger sb-error-message" style="display: none;">' + _cto.heDecode(this.message) + '</div>')
                if (this.message.search('close to selling out') > -1)
                { $alert.addClass('timer-tohide'); }
                $alert.appendTo('#sb-cart-errors').fasToggle();
            });
            setTimeout(function() {
                $('.timer-tohide').animate({ opacity: 0 });
            }, 7000);
            $('#sb-promo-errors .sb-error-message').remove();
            $.each(data.formErrors.coupon, function() {
                $('<div class="sb-error-message text-alert" style="display: none;">' + _cto.heDecode(this.message) + '</div>').appendTo('#sb-promo-errors').fasToggle();
            });
            if(data.bagCount < 1) {
                jQuery('#pc-btn-checkout').hide()
                $('.sb-cart-empty-promo').show();
                $('#sb-sum-shipping').hide();
                if($('#sb-send-cart-wrapper:visible').length) {
                    $('.sb-checkoutBtn, #sb-send-cart-wrapper').fasToggle();
                }
                $('.or-div').hide();
                $('.cart-items-header').hide();
            } else {
                jQuery('#pc-btn-checkout').show()
                $('.sb-cart-empty-promo').hide();
                $('#sb-sum-shipping').show();
                if($('#sb-send-cart-wrapper:visible').length < 1) {
                    $('.sb-checkoutBtn, #sb-send-cart-wrapper').fasToggle();
                }
                $('.or-div').show();
                $('.cart-items-header').show();
                if (typeof(sr_$) !== "undefined") {
                    loginStatus= (siteObj.customerType == 'ShopRunner') && (!siteObj.shopRunner.associateProfile);
                    if(loginStatus && cartData.hazMatError == 'true'){
                        loadDualEligibilityDivForHazmat();
                    }else{
                        loadHeaderDivForHazmat();
                    }
                    sr_updateMessages();
                }
            }
            var curItems = [];
            $('.sb-product').each(function() {
                curItems.push($(this).attr('id').split('sb-item')[1]);
            });
            $('.sb-product .sb-error-message').remove();
            var retItems = [];
            $.each(data.items, function(index, item) {
                retItems.push(this.itemId);
            });
            var remItems = [];
            $(curItems).each(function(index, item) {
                if($.inArray(item, retItems) == -1) {
                    remItems.push(item);
                }
            });
            var itemsHtml = '';
            var newItems = [];
            var itemInventoryError;
            var itemShortInvAlert;
            var itemMergedAlert;
            _cto.statics.cartContainsInventoryError = false;
            _cto.statics.cartItemAvailableCount = _cto.statics.cartItemNotAvailableCount = 0;
            var countryCode;
            if(siteObj.orderInfo != undefined) {
                countryCode = siteObj.orderInfo.countryCode;
            }
            var associate;
            if(siteObj.shopRunner != undefined) {
                associate = siteObj.shopRunner.associateProfile !== '' ? siteObj.shopRunner.associateProfile : false;
            }
            $.each(data.items, function(index, item) {
                itemInventoryError = '';
                itemShortInvAlert  = '';
                itemMergedAlert = '';
                this.unitItemPrice = (this.unitItemPrice == '$0.00') ? 'FREE' : this.unitItemPrice;
                this.rawItemPrice = (this.rawItemPrice == '$0.00') ? 'FREE' : this.rawItemPrice;
                this.finalItemPrice = (this.finalItemPrice == '$0.00') ? 'FREE' : this.finalItemPrice;
                var rawItemPrice = (this.rawItemPrice == this.finalItemPrice) ? '' : this.rawItemPrice;
                _cto.statics.cartItemAvailableCount++;
                if(this.isGiftCard == 'true') {
                    $('#sb-item' + this.itemId + ' .sb-price-after-discount').html(this.finalItemPrice);
                } else {
                    if(this.gwp == 'true') {
                        $('#sb-item' + this.itemId + ' .sb-price-before-discount').html('');
                        $('#sb-item' + this.itemId + ' .sb-price-after-discount').html('FREE');
                        _cto.statics.cartItemAvailableCount--;
                    } else {
                        $('#sb-item' + this.itemId + ' .sb-price-before-discount').html(rawItemPrice);
                        $('#sb-item' + this.itemId + ' .sb-price-after-discount').html(this.finalItemPrice);
                    }
                }
                var qty = this.qty;
                $('#' + this.itemId + ' option').each(function() {
                    if($(this).val() == qty) {
                        if(jQuery(this).parent().hasClass('.selectpicker')){
                            jQuery(this).parent().selectpicker('val',qty)
                        }
                    } else {
                        jQuery(this).removeAttr('selected');
                    }
                });
                if(this.itemNotAvailable) {
                    itemInventoryError = '<div class="sb-error-message text-alert">' + _cto.Lang.itemLevel.inventoryError + '</div>';
                    $(itemInventoryError).prependTo('#sb-item' + this.itemId + ' .sb-modify');
                    _cto.statics.cartItemNotAvailableCount++;
                    if(!_cto.statics.cartContainsInventoryError) _cto.statics.cartContainsInventoryError = true;
                }
                if(this.shortInvAlert) {
                    itemShortInvAlert = '<div class="sb-error-message  text-alert">' + this.shortInvAlert + '</div>';
                    $(itemShortInvAlert).prependTo('#sb-item' + this.itemId + ' .sb-modify');
                    if(!_cto.statics.cartContainsInventoryError) _cto.statics.cartContainsInventoryError = true;
                }
                if(this.isItemMerged == 'true') {
                    itemMergedAlert = '<div class="sb-error-message  text-alert">' + this.itemMergedMessage + '</div>';
                    $(itemMergedAlert).prependTo('#sb-item' + this.itemId + ' .sb-modify');
                    if(!_cto.statics.cartContainsInventoryError) _cto.statics.cartContainsInventoryError = true;
                }
                $('.sb-product').removeClass('sb-is-first');
                if($.inArray(this.itemId, curItems) == -1) {
                    var gwpImage = (this.gwp == 'true') ? '<div class="sb-gwp">Free Gift</div>' : '';
                    var qtySel = '';
                    for(i=1;i<=20;i++) {
                        if(this.qty == i) {
                            qtySel += '<option value="' + i + '" selected>' + i + '</option>';
                        } else {
                            qtySel += '<option value="' + i + '">' + i + '</option>';
                        }
                    }
                    prodList.push(this.tagStyleId + ',');
                    var row = '<div class="product-details-container product-details sb-product' + ((index == 0) ? ' sb-is-first' : '') + ((itemInventoryError) ? ' sb-product-has-error' : '') + '" id="sb-item' + this.itemId + '" style="display: none;">';
                    row += '<div class="row row-tight">';
                    row += '<div class="sb-product-image col-xs-3">';
                    row += '<a href="' + this.link + '" class="bluelink"><img class="img-responsive" src="' + this.image + '" alt="' + this.name + '">' + gwpImage + '</a>';
                    row += '</div>';
                    row += '<div class="sb-product-container col-xs-9">';
                    row += '<div class="row">';
                    row += '<h4 class="col-sm-5">' + this.name.replace(/&amp;/g, '&') + '</h4>';
                    row += '<div class="col-md-2 hidden-xs hidden-sm bold-font">'+this.unitItemPrice+'</div>';
                    if(window.matchMedia("(min-device-width: 992px)").matches){
                        row += '<div class="col-sm-1">';
                        row += '<div class="form-group form-group-max-width">';
                        row += '<label for="quantity-'+(index+1)+'" class="control-label sr-only">Quantity</label>';
                        row += '<select aria-label="Quanity" class="form-control selectpicker select-qty bold-font hidden-xs" onchange="_ctoTagging.asyncAction.changeQuantity();preUpdateTasks();" id="' + this.itemId + '" name="' + this.itemId + '" ' + ((this.gwp == 'true' || itemInventoryError || this.isEGiftCard == 'true') ? 'disabled' : ' ') + '>' + '<b>' + qtySel + '</b>' +'</select>';
                        var hiddenValue = 1;
                        var gwpId = ''
                        if(this.gwp == 'true' && this.rawItemPrice == 'FREE'){
                            gwpId = 'gwpMoneyCard';
                        }else if(this.gwp == 'true' && this.rawItemPrice != '$0.00'){
                            hiddenValue = 0;
                            gwpId = 'gwpProduct';
                        }
                        row += '<input class="'+gwpId+'" type="hidden" value="'+hiddenValue+'" size="4" name="' + this.itemId + '">';
                        row += '</div>';
                        row +='</div>';
                    }
                    row += '<div class="col-md-1 pull-right hidden-sm hidden-xs bold-font addSelectpicker">';
                    if (gwpImage && this.finalItemPrice == '$0.00') {
                        row += '<s><span class="sb-price-before-discount"></span></s>';
                        row += '<div class="sb-price-after-discount">FREE</div>';
                    } else {
                        row += '<s><span class="sb-price-before-discount">' + rawItemPrice + '</span></s>';
                        row += '<div class="sb-price-after-discount">' + this.finalItemPrice + '</div>';
                    }
                    row +='</div>';
                    row += '</div>';
                    row += '<div class="row">';
                    row += '<div class="col-sm-5">';
                    row += '<dl class="dl-horizontal meta-list">';
                    if (this.designName) {
                        row += '<dt class="sb-label">Design:</dt>';
                        row += '<dd class="sb-value">' + this.designName + '</dd>';
                    }
                    if (this.style && !this.isGiftCard) {
                        row += '<dt class="sb-label">Style:</dt>';
                        row += ' <dd class="sb-value">' + this.style + '</dd>';
                    }
                    if (this.sku) {
                        row += '<dt class="sb-label">SKU:</dt>';
                        row += '<dd class="sb-value">' + this.sku + '</dd>';
                    }
                    if (this.color && this.color != 'No Color') {
                        row += '<dt class="sb-label">Color:</dt>';
                        row += '<dd class="sb-value">' + this.color + '</dd>';
                    }
                    if (this.size) {
                        var sizeLabel = (this.color == 'No Color' && this.gwp == 'false')?'Amount:':'Size:';
                        row += '<dt class="sb-label">'+sizeLabel+'</dt>';
                        row += '<dd class="sb-value">' + this.size + '</dd>';
                    }
                    if (this.unitItemPrice) {
                        row += '<dt class="sb-label hidden-md hidden-lg">Price:</dt>';
                        row += '<dd class="sb-value hidden-md hidden-lg">' + this.unitItemPrice + '</dd>';
                    }
                    if (this.length) {
                        row += '<dt class="sb-label">Length:</dt>';
                        row += '<dd class="sb-value">' + _cto.heDecode(this.length) + '</dd>';
                    }
                    if (this.isHazmatItem == 'true' && !associate && (countryCode == 'USA' || countryCode == 'USA-MIL')) {
                        row += '<div name="sr_ineligibleDiv" class="sb-hazmat-item"></div>';
                    }
                    if(item.clearanceMsg){
                        row += '<div class="sb-clearance-message hidden-md hidden-lg">';
                        row += item.clearanceMsg;
                        row += ' <div class="clearance-tooltip"><a href="javascript://" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Merchandise marked &quot;FINAL SALE&quot; is sold &quot;as is&quot; and may not be returned or exchanged and is not eligible for price adjustment. Merchandise prices ending in .98 indicate final sale."><i class="fa fa-question-circle fa-lg" role="presentation"></i></a></div></div>';
                    }
                    if (this.backOrderFlag) {
                        row += '<div class="sb-value col-sm-12 hidden-md hidden-lg">' + this.expectedShipDate + '</div>';
                    }
                    var onClearance = item.onClearance || '';
                    var finalSaleLabel = item.finalSaleLabel || '';
                    if(onClearance == 'true' && finalSaleLabel){
                        var finalSaleToolTipMsg = String(item.tooltipMessage).replace(new RegExp('&amp;','g'),'&') || '';
                        row += '<span class="product-price-final hidden-md hidden-lg">';
                        row += '<span class="product-price-final-label">';
                        row += finalSaleLabel;
                        row += '<a href="javascript://" aria-label="Final Sale Disclaimer" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="'+finalSaleToolTipMsg+'">';
                        row += ' <i class="fa fa-question-circle fa-lg"></i>';
                        row += '</a>';
                        row += '</span>';
                        row += '</span>';
                    }
                    if(window.matchMedia("(max-device-width: 991px)").matches){
                        row += '<select aria-label="Quanity" class="form-control selectpicker bold-font select-qty hidden-md hidden-lg" onchange="_ctoTagging.asyncAction.changeQuantity();preUpdateTasks();" id="' + this.itemId + '" name="' + this.itemId + '" ' + ((this.gwp == 'true' || itemInventoryError || this.isEGiftCard == 'true') ? 'disabled' : ' ') + '>' + '<b>' + qtySel + '</b>' + '</select>';
                        row += '<div class="hidden-md hidden-lg bold-font">';
                        if (gwpImage && this.finalItemPrice == '$0.00') {
                            row += '<s><span class="sb-price-before-discount"></span></s>';
                            row += '<div class="sb-price-after-discount">FREE</div>';
                        } else {
                            row += '<s><span class="sb-price-before-discount">' + rawItemPrice + '</span></s>';
                            row += '<div class="sb-price-after-discount">' + this.finalItemPrice + '</div>';
                        }
                        row +='</div>';
                    }
                    row += '</dd>';
                    if(item.clearanceMsg){
                        row += '<div class="sb-clearance-message hidden-xs hidden-sm">';
                        row += item.clearanceMsg;
                        row += ' <div class="clearance-tooltip"><a href="javascript://" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Merchandise marked &quot;FINAL SALE&quot; is sold &quot;as is&quot; and may not be returned or exchanged and is not eligible for price adjustment. Merchandise prices ending in .98 indicate final sale."><i class="fa fa-question-circle fa-lg" role="presentation"></i></a></div></div>';
                    }
                    row += '</dl>';
                    row += '</div>';
                    row +='</div>';
                    if (this.backOrderFlag) {
                        row += '<div class="sb-value col-sm-5 hidden-xs hidden-sm">' + this.expectedShipDate + '</div>';
                    }
                    var onClearance = item.onClearance || '';
                    var finalSaleLabel = item.finalSaleLabel || '';
                    if(onClearance == 'true' && finalSaleLabel){
                        var finalSaleToolTipMsg = String(item.tooltipMessage).replace(new RegExp('&amp;','g'),'&') || '';
                        row += '<span class="product-price-final hidden-xs hidden-sm">';
                        row += '<span class="product-price-final-label">';
                        row += finalSaleLabel;
                        row += '<a href="javascript://" aria-label="Final Sale Disclaimer" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="'+finalSaleToolTipMsg+'">';
                        row += ' <i class="fa fa-question-circle fa-lg"></i>';
                        row += '</a>';
                        row += '</span>';
                        row += '</span>';
                    }
                    row += '<div class="pull-right hidden-xs hidden-sm">';
                    if (this.gwp == 'true' || (this.isGiftCard == 'true' || this.isEGiftCard == 'true')) {
                        row += '<div class="sb-modify">';
                        row += '<div class="sb-modify-remove">' + itemInventoryError + itemShortInvAlert + itemMergedAlert+ '<a onclick="_cto.removeLineItem(\'' + this.itemId + '\',\'removeFromLink\', true, {\'categoryId\': \'' + this.categoryId + '\', \'style\': \'' + this.style + '\'});" href="javascript: void(0);">REMOVE</a></div>';
                        row += '</div>';
                    } else {
                        if (!this.length) {
                            row += '<div class="sb-modify">' + itemInventoryError + itemShortInvAlert + itemMergedAlert+'<a onclick="quickView.quickLaunch(\'' + _cto.scrapeProductIdFromUrl(this.link) + '\',\'' + this.colorCode + '\',\'\',\'' + this.itemId + '\',\'' + 'none' + '\', \'' + ((this.sizeCode) ? this.sizeCode : '') + '\', \'' + this.designSku + '\',\'\',\'\', _cto.getProductInfo({id:\''+this.itemId+'\',label:\'qty\'}), _cto.getProductInfo({id:\''+this.itemId+'\',label:\'inseam\'})'+'\);return false;" href="javascript: void(0);">CHANGE</a> | <span class="sb-modify-remove"><a onclick="_cto.removeLineItem(\'' + this.itemId + '\',\'removeFromLink\', true, {\'categoryId\': \'' + this.categoryId + '\', \'style\': \'' + this.style + '\'});" href="javascript: void(0);">REMOVE</a></span></div>';
                        } else {
                            row += '<div class="sb-modify">' + itemInventoryError + itemShortInvAlert + itemMergedAlert+'<a onclick="quickView.quickLaunch(\'' + _cto.scrapeProductIdFromUrl(this.link) + '\',\'' + this.colorCode + '\',\'\',\'' + this.itemId + '\',\'' + _cto.heDecode(this.length) + '\', \'' + ((this.sizeCode) ? this.sizeCode : '') + '\', \'' +  this.designSku + '\',\'\',\'\', _cto.getProductInfo({id:\''+this.itemId+'\',label:\'qty\'}),\''+this.inseamType+'\'\);return false;" href="javascript: void(0);">CHANGE</a> | <span class="sb-modify-remove"><a onclick="_cto.removeLineItem(\'' + this.itemId + '\',\'removeFromLink\', true, {\'categoryId\': \'' + this.categoryId + '\', \'style\': \'' + this.style + '\'});" href="javascript: void(0);">REMOVE</a></span></div>';
                        }
                    }
                    row +='</div>';
                    row +='<div class="row removeItemMsg"><div class="alert alert-danger removeConfirmMsg hide hidden-xs hidden-sm"></div></div>'
                    row +='</div>';
                    row += '<div class="change-remove top-buffer-45 hidden-md hidden-lg">';
                    if (this.gwp == 'true' || (this.isGiftCard == 'true' || this.isEGiftCard == 'true')) {
                        row += '<div class="sb-modify">';
                        row += '<div class="sb-modify-remove">' + itemInventoryError + itemShortInvAlert + itemMergedAlert+ '<a onclick="_cto.removeLineItem(\'' + this.itemId + '\',\'removeFromLink\', true, {\'categoryId\': \'' + this.categoryId + '\', \'style\': \'' + this.style + '\'});" href="javascript: void(0);">REMOVE</a></div>';
                        row += '</div>';
                    } else {
                        if (!this.length) {
                            row += '<div class="sb-modify">' + itemInventoryError + itemShortInvAlert + itemMergedAlert+'<a onclick="quickView.quickLaunch(\'' + _cto.scrapeProductIdFromUrl(this.link) + '\',\'' + this.colorCode + '\',\'\',\'' + this.itemId + '\',\'' + 'none' + '\', \'' + ((this.sizeCode) ? this.sizeCode : '') + '\', \'' + this.designSku + '\',\'\',\'\', _cto.getProductInfo({id:\''+this.itemId+'\',label:\'qty\'}), _cto.getProductInfo({id:\''+this.itemId+'\',label:\'inseam\'})'+'\);return false;" href="javascript: void(0);">CHANGE</a> | <span class="sb-modify-remove"><a onclick="_cto.removeLineItem(\'' + this.itemId + '\',\'removeFromLink\', true, {\'categoryId\': \'' + this.categoryId + '\', \'style\': \'' + this.style + '\'});" href="javascript: void(0);">REMOVE</a></span></div>';
                        } else {
                            row += '<div class="sb-modify">' + itemInventoryError + itemShortInvAlert + itemMergedAlert+'<a onclick="quickView.quickLaunch(\'' + _cto.scrapeProductIdFromUrl(this.link) + '\',\'' + this.colorCode + '\',\'\',\'' + this.itemId + '\',\'' + _cto.heDecode(this.length) + '\', \'' + ((this.sizeCode) ? this.sizeCode : '') + '\', \'' +  this.designSku + '\',\'\',\'\', _cto.getProductInfo({id:\''+this.itemId+'\',label:\'qty\'}),\''+this.inseamType+'\'\);return false;" href="javascript: void(0);">CHANGE</a> | <span class="sb-modify-remove"><a onclick="_cto.removeLineItem(\'' + this.itemId + '\',\'removeFromLink\', true, {\'categoryId\': \'' + this.categoryId + '\', \'style\': \'' + this.style + '\'});" href="javascript: void(0);">REMOVE</a></span></div>';
                        }
                    }
                    row +='<div class="row removeItemMsg"><div class="alert alert-danger removeConfirmMsg hide hidden-lg hidden-md"></div></div>'
                    row +='</div>';
                    row +='</div>';
                    row +='</div>';
                    row +='</div>';
                    row +='</div>';
                    itemsHtml += row;
                    newItems.push(this.itemId);
                }else{
                    if(this.qty == 1 || $('select#'+this.itemId).val() != this.qty ){
                        jQuery('select#'+this.itemId).selectpicker('val',this.qty)
                        $('select#'+this.itemId).val(this.qty);
                        if(typeof callbackEvents.qtyUpdate == 'undefined'){
                            callbackEvents.qtyUpdate = function(){
                                _ctoTagging.asyncAction.changeQuantity();
                            }
                        }
                    }
                }
                if ((typeof TeaLeaf != "undefined") && (typeof TeaLeaf.Client != "undefined")) {
                    TeaLeaf.Client.tlProcessNode(document.body);
                }
            });
            if(_cto.statics.isCartPage) {
                if(_cto.inventoryCheck(data,true)){
                        $('.bag-button').hide();
                }else{
                    $('.bag-button').show();
                }
            }
            if(typeof certonaCHObject == 'object' && typeof certona_host != 'undefined') {
                window.setTimeout(function(){
                    certonaCHObject.initAndRunWithRecommendation(prodList,customerId,null,null,"shopping+cart",certona_host,prodList,null,null,certonaPageId);
                }, 2500);
            }
            $('#sb-items .sb-cart-unavailable-promo').after(itemsHtml);
            if(data.closenessQualifierMsgs) {
                $('#pc-close-qualif').html(data.closenessQualifierMsgs);
            } else {
                $('#pc-close-qualif').html('');
            }
            if(remItems.length) {
                var remItemCount = 0;
                $(remItems).each(function(index, item) {
                    remItemCount++;
                    $('#sb-item' + item).fasToggle(function() {
                        $('#sb-item' + item).remove();
                        if(remItemCount == remItems.length) {
                            $(newItems).each(function(index, item) {
                                $('#sb-item' + item).fasToggle(function() {
                                    $('#sb-item' + item).removeAttr('style');
                                });
                            });
                        }
                    });
                });
                jQuery('.is-shopping-bag .selectpicker').selectpicker();
            } else {
                $(newItems).each(function(index, item) {
                    $('#sb-item' + item).fasToggle(function() {
                        $('#sb-item' + item).removeAttr('style');
                    });
                });
                jQuery('.is-shopping-bag .selectpicker').selectpicker();
            }
            _cto.updateBagCount(data.bagCount, _cto.statics.cartContainsInventoryError);
            _cto.statics.continueToCheckoutCheck = _cto.continueToCheckoutCheck();
            $.merge(data.promoDiscounts, data.conditionalMessages);
            var curClaimed = [];
            $('.sb-discount').each(function() {
                couponId = $(this).attr('id').split('promo')[1];
                curClaimed.push(couponId);
            });
            var retClaimed = [];
            $(data.promoDiscounts).each(function(index, obj) {
                retClaimed.push(this.couponId);
            });
            var remClaimed = [];
            $(curClaimed).each(function(index, couponId) {
                if($.inArray(couponId, retClaimed) == -1) {
                    remClaimed.push(couponId);
                }
            })
            var newClaimed = [];
            $(data.promoDiscounts).each(function(index, obj) {
                if($.inArray(this.couponId, curClaimed) == -1) {
                    if(this.message) { 
                        this.discountMessage = this.message;
                        this.discountAmount = '';
                        this.isClaimed = false;
                    } else { 
                        this.isClaimed = true;
                    }
                    if(this.isClaimed == false && $('#sb-discounts-pending').length < 1) {
                        $('<div id="sb-discounts-pending" class="row"></div>').insertBefore('#sb-promo-errors');
                    }
                    if(typeof promoRemoveLinkTemplate != 'undefined'){
                        var promo_qualify_template = '<div class="sb-label col-xs-6">'+
                            '<span class="sb-promo-msg">' + _cto.heDecode(this.discountMessage) + '</span>'+
                            '</div>'+
                            '<div class="sb-promo-rem col-xs-3 text-right">'+
                            promoRemoveLinkTemplate.replace('_DAV=', '_DAV=' + this.couponId.replace('_unclaimed', '').split('-')[0])+
                            '</div>'+
                            '<div class="sb-price col-xs-3 text-right">'+
                            this.discountAmount+
                            '</div>';
                        var promo_non_qualify_template = '<div class="sb-label col-xs-9">'+
                            '<span class="sb-promo-msg"><p class="text-alert">' + _cto.heDecode(this.discountMessage) + '</p></span>'+
                            '</div>'+
                            '<div class="sb-promo-rem col-xs-3 text-right">'+
                            promoRemoveLinkTemplate.replace('_DAV=', '_DAV=' + this.couponId.replace('_unclaimed', '').split('-')[0])+
                            '</div>';
                    }
                    var use_promo = { template: promo_qualify_template, parent:'#sb-discounts'};
                    if(!this.isClaimed){use_promo.template = promo_non_qualify_template; use_promo.parent = '#sb-discounts-pending';}
                    var couponCleanId = String(this.couponId).replace('promo','');
                    $('<div id="promo' + couponCleanId + '" class="sb-discount sb-promo-is-' + this.type + ((this.isClaimed == false) ? ' sb-error-message text-alert' : '') + '" style="display: none;">'+use_promo.template+'</div>').appendTo(use_promo.parent);
                    newClaimed.push(couponCleanId);
                }
            });
            if(remClaimed.length) {
                var cpnAnimCount = 0;
                $(remClaimed).each(function(index, couponId) {
                    $('#promo' + couponId).fasToggle(function() {
                        cpnAnimCount++;
                        $('#promo' + couponId).remove();
                        if(cpnAnimCount == remClaimed.length) {
                            $(newClaimed).each(function(index, couponId) {
                                $('#promo' + couponId).fasToggle();
                            });
                        }
                    });
                });
            } else {
                $(newClaimed).each(function(index, couponId) {
                    $('#promo' + couponId).fasToggle();
                });
            }
            if(data.itemsSubtotal)
            {
                $('#sb-sum-subtotal .sb-price').html(data.itemsSubtotal);
                if (typeof(sr_$) !== "undefined") {
                    _shoprunner_com.cart["srSubTotal"] = data.subtotal;
                    if(cartData.hazMatError == 'false'){
                        loadHeaderDivForHazmat();
                    }
                    sr_updateMessages();
                }
            }
            if(data.shippingCost)
            {
                $('#sb-sum-shipping .sb-price').html((data.shippingCost == '$0.00') ? 'FREE' : data.shippingCost);
            }
            else
            {
                $('#sb-sum-shipping').hide();
                data.itemsTotal = data.itemsTotalNoShipping;
            }
            if(data.GiftOptions)     $('#sb-sum-gift .sb-price').html(data.GiftOptions);
            if(data.itemsTotalNoShipping) $('#sb-sum-total .sb-price').html(data.discountedSubtotalLessSalesTax);
            if(!_cto.isOrderPage()) {
                if(!suppressMbox) {
                    _cto.updateMbox(data);
                }
            }
            $(window).trigger("fas.pcart.products.complete");
            _cto.updateCartComplete(callbackEvents);
        }
        this.stopChecks = function(data) {
            if(data.checkout) {
                setTimeout(function() {
                    if(data.checkout.freezeOrder == 'true') {
                        $('#co-order-commit-actions input').remove();
                        $('#co-order-commit-actions-top').removeAttr('onclick');
                        $('<input type="image" value="COMPLETE ORDER" src="/store/images/checkout_redesign/co_btn_placeOrder.gif">').appendTo('#co-order-commit-actions');
                        $('#co-order-commit-actions-top, #co-order-commit-actions input').unbind('click').bind('click', function() {
                            if(!$.cookie('freezeMsg') && data.checkout.formErrors.commitOrder.length > 0) {
                                $.cookie('freezeMsg', data.checkout.formErrors.commitOrder[0].message, {path: '/'});
                            }
                            alert($.cookie('freezeMsg') || _cto.Lang.formErrors.freezeOrder + trim($('#phone').html().split('or Call')[1].replace('<br>', '')));
                        });
                    }
                    var countryCode = siteObj.shipTo[0].shipInfo.country !== '' ? siteObj.shipTo[0].shipInfo.country : siteObj.orderInfo.countryCode;
                    if(countryCode != 'USA' && data.checkout.hazMatError == 'true' && _cto.mergeErrors(data.checkout.formErrors).length < 1) {
                        if($('#modal-hazmat').length < 1) {
                            _cto.closeModals();
                            $('#modalHazMatError').trigger('click');
                        }
                    }
                }, 200);
            }
        }
        this.clearShipInfo = function(){
            var htmlSelectors = [
                '#co-shipping-review-firstName',
                '#co-shipping-review-lastName',
                '#co-shipping-review-address1',
                '#co-shipping-review-address2',
                '#co-shipping-review-city',
                '#co-shipping-review-state',
                '#co-shipping-review-zip',
                '#co-shipping-review-country',
                '#co-shipping-review-phoneFormatted',
            ];
            var valSelectors = [
                '#co-shipping-review-countryCode',
                '#co-shipping-review-phone'
            ];
            $(htmlSelectors).each(function() {
                $(this).html('');
            });
            $(valSelectors).each(function() {
                $(this).val('');
            });
        };
        this.renderShipInfo = function(shipInfo) {
            var createCCFormEl = 'form[name="frmCreateCreditCard"]';
            if($('#co-shipping-review-city').next('#co-comma').length == 0)
                $('<span id="co-comma">,&nbsp;</span>').insertAfter('#co-shipping-review-city');
            $('#co-shipping-review-firstName').html(_cto.heDecode(shipInfo.firstName));
            $('#co-shipping-review-lastName').html(_cto.heDecode(shipInfo.lastName));
            $('#co-shipping-review-address1').html(_cto.heDecode(shipInfo.address1));
            $('#co-shipping-review-address2').html(_cto.heDecode(shipInfo.address2));
            $('#co-shipping-review-city').html(shipInfo.city);
            $('#co-shipping-review-state').html(shipInfo.state);
            $('#co-shipping-review-zip').html(shipInfo.zip);
            $('#co-shipping-review-country').html(shipInfo.country);
            $('#co-shipping-review-countryCode').val(shipInfo.countryCode);
            if(shipInfo.countryCode == 'USA' || shipInfo.countryCode == 'CAN') {
                $('#co-shipping-review-phoneFormatted').html(shipInfo.phoneFormatted);
            } else {
                $('#co-shipping-review-phoneFormatted').html(shipInfo.phone);
            }
            $('#co-shipping-review-phone').val(shipInfo.phone);
        };
        this.formValidation = function(formName, errors) {
            if(errors.length>0) {
                for (var i=0;i<errors.length;i++) {
                    if(errors[i].propertyName == "borderfree") {
                        $('#borderfreeError').jqmShow();
                    }
                }
            }
            var formEl = 'form[name="' + formName + '"]';
            _cto.clearFormErrors(formEl);
            if($(formEl + ' .co-info-errors').length < 1) {
                $('<div class="co-info-errors"></div>').insertAfter(formEl + ' .co-global-error');
            } else {
                $(formEl + ' .co-info-errors').html('');
            }
            var hasGlobalFormError;
            var hasInfoFormError;
            $(errors).each(function() {
                inputEl = (this.propertyName == 'password') ?
                    $(formEl + ' [name*="ssword"]:not([name*="passwordHint"]):not([name*="_D:/"]):visible') :
                    $(formEl + ' [name*=".' + this.propertyName + '"]:not([name*="_D:/"]):last');
                if(inputEl.length > 0 && this.propertyName != '') {
                    hasGlobalFormError = true;
                    if($('.co-formError-' + formName + '_' + this.propertyName).length < 1) {
                        $('<div class="co-formError co-formError-' + formName + '_' + this.propertyName+ '" style="display: none;"><table cellpadding="0" cellspacing="0" class="co-error_wrapper"><tr><td class="co-left_shadow">&nbsp;</td><td><table cellpadding="0" cellspacing="0"><tr><td class="co-top_shadow">&nbsp;</td></tr><tr><td class="co-errorMsg-content"><div class="co-formError-c2">' + _cto.heDecode(this.message) + '</div></td></tr></table></td><td class="co-right_shadow">&nbsp;</td></tr><tr><td class="co-left_corner_shadow"></td><td class="co-bottom_shadow">&nbsp;</td><td class="co-right_corner_shadow">&nbsp;</td></tr></tr></table></div>').insertAfter(inputEl);
                    } else {
                        $('.co-formError-' + formName + '_' + this.propertyName + ' .co-formError-c2').html($('.co-formError-' + formName + '_' + this.propertyName + ' .co-formError-c2').html() + ' ' + _cto.heDecode(this.message));
                    }
                    if(inputEl.is(':hidden')) {
                        if(this.propertyName == 'state') {
                            $(inputEl).prevAll(':visible').find('select option').removeAttr('selected').parent().find('[value=""]').attr('selected', 'selected');
                            $('select[id*="_country"]').trigger('change');
                        }
                        if(this.propertyName == 'phoneNumber') {
                            $(formEl + ' .phoneNumberBoxes input').addClass('co-formField-alert');
                        } else {
                            firstVisible = inputEl.prevAll(':visible').find(':input:first');
                            if(firstVisible.is('select')) {
                                firstVisible.parent().addClass('co-formField-alert');
                            } else {
                                firstVisible.addClass('co-formField-alert');
                            }
                        }
                    } else {
                        inputEl.addClass('co-formField-alert');
                        if(this.propertyName == 'creditCardNumber') {
                            $(formEl + ' [name*=".creditCardType"]').addClass('co-formField-alert');
                        }
                    }
                } else {
                    hasInfoFormError = true;
                    $('<div class="co-info-error" style="display: none;">' + _cto.heDecode(_cto.heDecode(this.message)) + '</div>').appendTo(formEl + ' .co-info-errors');
                }
            });
            if(hasInfoFormError) {
                _cto.orderStageHeight(false);
                $(formEl + ' .co-info-error').fasToggle(function() {
                    _cto.orderStageHeight(true);
                });
            }
            if(hasGlobalFormError) {
                $(formEl).addClass('co-form-has-errors');
                setTimeout(function() { 
                    _cto.orderStageHeight(false);
                    $(formEl + ' .co-global-error').hide().fasToggle(function() {
                        _cto.orderStageHeight(true);
                    });
                }, 200);
            }
            $(formEl + ' .co-formField-alert, ' + formEl + ' .co-formField-alert select').unbind('focus').focus(function() {
                if($(this).parent().is('.phoneNumberBoxes')) {
                    $(formEl + ' div[class*="_phoneNumber"]').fadeIn();
                } else {
                    thisEl = ($(this).is('select:not([name*="/atg/"])') || $(this).nextAll('.co-formError').length == 0) ? $(this).parent().nextAll('.co-formError') : $(this).next('.co-formError');
                    thisEl.fadeIn();
                }
            }).unbind('keydown').keydown(function() {
                if($(this).parent().is('.phoneNumberBoxes')) {
                    $(formEl + ' .co-formError-frmCreateCreditCard_phoneNumber').fadeOut();
                    $(formEl + ' .co-formError-shipping_phoneNumber').fadeOut();
                    $(formEl + ' .co-formError-editShipTo_phoneNumber').fadeOut();
                } else {
                    thisEl = ($(this).is('select:not([name*="/atg/"])') || $(this).nextAll('.co-formError').length == 0) ? $(this).parent().nextAll('.co-formError') : $(this).next('.co-formError');
                    thisEl.fadeOut();
                }
            }).unbind('blur').blur(function() {
                $(this).trigger('keydown');
            });
            $(formEl + ' .co-formField-alert:first').trigger('focus');
        };
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
                _cto.statics.stageLock = false;
                _cto.stopChecks(data);
                _cto.clearFormErrors('form');
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
                this.cartCollection = new CTUI.Cart(data.cart.shipments, data.cart.items);
                this.checkoutShipments = new CTUI.CheckoutShipments(this.cartCollection.shipments);
                this.checkoutShipments.render();
                this.createCheckoutModals();
                $(window).trigger('ctoReady');
                $('#co-shipping-review-city').each(function(){
                    $(this).text($(this).text().replace('\u00A0', ''));
                });
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
                    if($('#co-billing-review-city').next('#co-comma').length == 0)
                        $('<span id="co-comma">,&nbsp;</span>').insertAfter('#co-billing-review-city');
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
                if($('#coShipToState select').length) $('#coShipToState select').trigger('change');
                if(formName == 'editShipTo') updateShipping = 1;
                if(typeof updateShipping != 'undefined' && formName == 'editShipMethod') {
                    updateBox = '.co-review-box.shippingUpdateAlert';
                    delete updateShipping;
                } else {
                    updateBox = '.co-review-box.' + formName + 'UpdateAlert';
                }
                if(formName != 'editShipTo') {
                    $(updateBox).addClass('co-updated').animate(
                        { 'backgroundColor' : '#ffffff'},
                        Config.OrderPage.duration1,
                        function() {
                            $(this).removeClass('co-updated').removeAttr('style');
                        }
                    );
                }
                if(_cto.isOrderPage()) {
                    if(!suppressMbox) {
                        _cto.updateMbox(data.checkout);
                    }
                }
            } else {
                var errors = _cto.mergeErrors(data.checkout.formErrors);
                this.formValidation(formName, errors);
            }
            if(_cto.statics.stageLock == false) {
                var hasMulti = false;
                if (data.checkout.shipments > 0) {
                    hasMulti = true;
                }
                if(billing.isCreditCardPresent == 'true') {
                    _cto.statics.showCreditCardUpdateForm = true;
                } else {
                    _cto.statics.showCreditCardUpdateForm = false;
                }
                if(data.checkout.RegistrationInfoCompleted == 'true') {
                    $('#co-email-form, #co-password-form').hide();
                } else {
                    $('#co-email-form, #co-password-form').show().css('opacity', 1);
                }
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
                if(data.checkout.RegistrationInfoCompleted == 'false' &&
                    billing.isGiftCardPresent == 'true' &&
                    billing.giftCard.applyToOrder == 'true' &&
                    data.checkout.GiftCardOnly == 'true' &&
                    data.checkout.ShippingInfoComplete == 'true') {
                    window.location.hash = '#giftCardRegister';
                    return;
                }
                if(
                billing.isGiftCardPresent == 'true' &&
                billing.giftCard.applyToOrder == 'true' &&
                data.checkout.GiftCardOnly == 'false' &&
                data.checkout.BillingInfoCompleted == 'false' &&
                data.checkout.ShippingInfoComplete == 'true') {
                    window.location.hash = '#giftCardAdditionalPayment';
                    return;
                }
                if(window.location.hash != '#review' &&
                    data.checkout.GiftCardOnly == 'false' &&
                    data.checkout.BillingInfoCompleted == 'false' &&
                    data.checkout.ShippingInfoComplete == 'true') {
                    window.location.hash = '#payment';
                    return;
                }
                if(data.checkout.ShippingInfoComplete == 'false' &&
                    data.checkout.BillingInfoCompleted == 'true') {
                    window.location.hash = '#shipping';
                    return;
                }
                if(data.checkout.BillingInfoCompleted == 'true' &&
                    data.checkout.ShippingInfoComplete == 'true' &&
                    data.checkout.RegistrationInfoCompleted == 'true') {
                    window.location.hash = '#review';
                    return;
                }
                if(data.checkout.BillingInfoCompleted == 'false' &&
                    data.checkout.ShippingInfoComplete == 'false') {
                    window.location.hash = '#start';
                    return;
                }
            }
        }
        this.clearFormErrors = function(formEl) {
            $('.co-formError, .co-info-error').remove();
            $(formEl).removeClass('co-form-has-errors');
            $(formEl + ' .co-global-error').hide();
            $(formEl).find('input, select, div').removeClass('co-formField-alert');
        }
        this.remPromo = function(promo) {
            var url = $(promo).attr('href');
            url += ((url.indexOf('?') < 0) ? '?' : '&') + 'task=remPromo';
            _cto.ajax({
                url: (_cto.statics.isOrderPage) ? url.replace('/json/cart.jsp', '/json/checkout.jsp') : url,
                dataType: 'json',
                success: function(data) {
                    if(_cto.isCartOrCheckoutObject(data)) {
                        if(_cto.statics.isCartPage) {
                            _cto.updateCart(data);
                        } else {
                            _ctoMiniCart.update(data.cart);
                            _cto.updateOrder(data);
                        }
                    }
                }
            });
        }
        this.submitMissingPurchase = function(formName) {
            _cto.ajaxSubmit('form[name="' + formName + '"]', {
                dataType: 'json',
                showLoader: false,
                success: function(data) {
                    var missingTxSuccessFlag = data.success;
                    var missingTxPointsEarned;
                    var missingTxError;
                    if(data.success == 'true') {
                        missingTxPointsEarned = data.pointsEarned;
                        missingTxError = "<div id=\"success-msg\">" +
                        "<h1> " +
                        "Thank you for submitting.<br>" +
                        "Please allow 2-3 business days<br>" +
                        "for Points to be posted<br>" +
                        "to your account.<br>" +
                        "</h1>" +
                        "</div>";
                        $('form[name="' + formName + '"] .sr-missing-purchase').html(missingTxError);
                    }
                    else {
                        if(data.alreadyAdded == 'true') {
                            missingTxError = "<div id=\"success-msg\">" +
                            "<h1>This order is already in<br>your Points History.</h1>" +
                            "<a href=\"javascript:void(0)\" onclick=\"_cto.closeModals();$('#loyalty-missing-purchases').trigger('click');\" class=\"sr-black-btn\">Submit Another Order</a>" +
                            "</div>";
                            $('form[name="' + formName + '"] .sr-missing-purchase').html(missingTxError);
                        }
                        else {
                            var missingTxError = data;
                            var missingTxErrorString = '';
                            for(var i = 0; i < data.errors.length; i++) {
                                for(var key in data.errors[i]) {
                                    missingTxErrorString += (missingTxErrorString.length == 0 ? '' : '<br>') + data.errors[i][key];
                                    if(key == 'storeTxNumber') {
                                        jQuery('input[name="storeTxNumber"]').closest('form-group').addClass('has-error');
                                    }
                                    else if(key == 'storeNumber') {
                                        jQuery('input[name="storeNumber"]').closest('form-group').addClass('has-error');
                                    }
                                    else if(key == 'registerNumber') {
                                        jQuery('input[name="registerNumber"]').closest('form-group').addClass('has-error');
                                    }
                                    else if(key == 'txDate') {
                                        jQuery('input[name="txDate"]').closest('form-group').addClass('has-error');
                                    }
                                }
                            }
                            $('form[name="' + formName + '"] .sr-missing-purchase').html(missingTxErrorString);
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("AJAX Error=" + _cto.Lang.global.general + ' (' + textStatus + ')');
                }
            });
        }
        this.loadOrderHistory = function() {
            _cto.ajaxSubmit('form[name="frmOrderHistoryMonths"]', {
                dataType: 'html',
                showLoader: true,
                success: function(data) {
                    $('#sr-history-base').html(data);
                    _cto.closeModals();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("AJAX Error=" + _cto.Lang.global.general + ' (' + textStatus + ')');
                    _cto.closeModals();
                }
            });
        }
        this.removeLineItem = function(commId, hiddenRemoveId, confirm, tag) {
            if(confirm) {
                $('#sb-item' + commId + ' .removeConfirmMsg').removeClass('hide').html('Are you sure you want to remove this item? <a onclick="_ctoTagging.asyncAction.removeFromBag({\'categoryId\': \'' + tag.categoryId + '\', \'style\': \'' + tag.style + '\'});_cto.removeLineItem(\'' + commId + '\',\'removeFromLink\', false, {\'categoryId\': \'' + tag.categoryId + '\', \'style\': \'' + tag.style + '\'});" href="javascript: void(0);">Yes</a> or <a onclick="_cto.removeLineItemReset(\'' + commId + '\',\'removeFromLink\', {\'categoryId\': \'' + tag.categoryId + '\', \'style\': \'' + tag.style + '\'});" href="javascript: void(0);">No</a>');
            } else {
                if(document.forms['couponForm'].elements['loyalityNumber']) {
                    if(document.getElementById('loyalityNumber').checked) {
                        document.getElementById('loyaltyInRemove').value = true;
                    } else {
                        document.getElementById('loyaltyInRemove').value = false;
                    }
                }
                console.log(commId);
                console.log(hiddenRemoveId);
                console.log('confirm is ' + confirm);
                console.log(tag);
                document.getElementById(hiddenRemoveId).value = commId;
                document.checkout2.submit();
            }
        }
        this.removeLineItemReset = function(commId, hiddenRemoveId, tag) {
            $('#sb-item' + commId + ' .removeConfirmMsg').html('').addClass('hide');
        }
        this.initShippingMethods = function(parent) {
            $(parent + ' .co-shipping-selects:last').addClass('last');
            $(parent + ' .co-shipping-selects').hover(function () {
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass('hover');
            });
            var smPrevSel;
            $(parent + ' .co-shipping-selects').mousedown(function() {
                var smCurType = $(this).find('.co-shipping-type').val();
                if($(this).hasClass('selected') == false) {
                    if(smPrevSel != null) {
                        $(smPrevSel).removeClass('selected');
                    }
                    $(this).addClass('selected');
                    var smPrevType = smCurType;
                    $(parent + ' #co-selectedShippingMethod').val(smCurType);
                }
                smPrevSel = $(this);
            });
            if(!_cto.statics.smDefault) {
                _cto.statics.smDefault = $(parent + ' #co-selectedShippingMethod').val();
            }
            var setDefaultMethod = false;
            $(parent + ' .co-shipping-selects').each(function() {
                var methodText = $(this).find('.co-shipping-type').val();
                if(methodText == _cto.statics.stateShippingMethodSelections[$(_cto.statics.currentCountrySelectTarget).val() + '-' + $(_cto.statics.currentStateSelectTarget + ' select').val()]) {
                    setDefaultMethod = true;
                    $(this).trigger('mousedown');
                }
            });
            if(!setDefaultMethod){
                $(parent + ' .co-shipping-selects').each(function() {
                    var methodText = $(this).find('.co-shipping-type').val();
                    if(methodText == _cto.statics.smDefault) {
                        setDefaultMethod = true;
                        $(this).trigger('mousedown');
                    }
                });
            }
            if(!setDefaultMethod){
                $(parent + ' .co-shipping-selects:first').trigger('mousedown');
            }
        }
        this.deployShippingMethods = function(data, statics) {
            if(statics.shippingMethodsContainer && $('.modalContent').not(':visible')) {
                var methodHtml = '';
                if(data.shippingMethods.length > 0) {
                    $.each(data.shippingMethods, function() {
                        this.amount = (this.amount == '0.0' || this.amount == '0.00' || this.amount == '$0.00' || this.amount == '$0.0') ? 'FREE' : this.amount;
                        if(quietTimeShipping.indexOf(this.shippingMethod)==-1){
                            methodHtml += '<div class="co-shipping-selects">' + '<div class="co-shipping-selects-wrapper">' + '<input type="hidden" class="co-shipping-type" value="' + this.shippingMethod + '" />' + '<div class="co-shipping-method-type">' + this.type + '</div>' + '<div class="co-shipping-method-cost">' + this.amount + '</div>' + '<div class="co-shipping-method-info"><div class="co-shipping-method-signature">' + this.signature + '</div><div>' + this.description + '</div>' + '<div class="co-shipping-method-eta-class">Estimated Arrival:<div>'+ this.eta +'</div></div><div>'+this.shipMethodPromoMsg+'</div></div></div></div>';
                        }else{
                            $('body').addClass('quietTime-active');
                        }
                    });
                }
                $(statics.shippingMethodsContainer).find('#co-shipping-method-options-container').html(methodHtml);
                _cto.initShippingMethods(statics.shippingMethodsContainer);
                var shippingMethodsAutosize = {
                    resize: function(){
                        var cellHt = $('.co-shipping-selects').eq(0).innerHeight();
                        var _shipMethContainer =  $('#co-shipping-method-options-container');
                        var _shipMethWrapper = $('#co-shipping-method-options .co-shipping-selects-wrapper');
                        if( _shipMethContainer.hasClass('expHt')){
                            _shipMethContainer.removeClass('expHt').css('height','');
                            _shipMethWrapper.removeClass('expWrapperHt').css('height','');
                            cellHt = $('.co-shipping-selects').eq(0).innerHeight();
                        }
                        if(_shipMethWrapper.css('backgroundColor')!='transparent'){
                            _shipMethWrapper.addClass('expWrapperHt');
                        }
                        $('.co-shipping-selects').each(function(i){
                            var curHt = $(this).innerHeight(true);
                            var max = $('.co-shipping-selects').length-1;
                            if(curHt!=cellHt){
                                cellHt = (curHt>cellHt)?curHt:cellHt;
                                _shipMethContainer.addClass('expHt')
                            }
                            if( _shipMethContainer.hasClass('expHt') && i== max ){
                                if(_shipMethWrapper.hasClass('expWrapperHt')){
                                    _shipMethWrapper.height(cellHt-10);
                                }
                                _shipMethContainer.height(cellHt );
                            }
                        });
                    }
                }.resize();
            }
        }
        this.initCityStateCountry = function(statics) {
            var country;
            $(statics.countryTarget).unbind('change').change(function() {
                if ($(statics.countryTarget).val() === country) {
                    return;
                }
                country = $(statics.countryTarget).val();
                if(!selectHiddenInputValue) {
                    $(statics.cityHiddenInput).val('');
                    $(statics.stateHiddenInput).val('');
                    $('form input[id*="_add"]').val('');
                    $('form input[id*="_zip"]').val('');
                    $('form input[id*="pAddress"]').val('');
                    $('form input[id*="pPostalCode"]').val('');
                }
                _cto.statics.currentStateSelectTarget = statics.stateTarget;
                _cto.statics.currentCountrySelectTarget = statics.countryTarget;
                if(statics.shippingMethodsContainer) {
                    var lisStateEvent = setInterval(function() {
                        if($(statics.stateTarget + ' select').length > 0) {
                            $(statics.stateTarget + ' select').unbind('mousedown change click keyup').bind('mousedown change click keyup', function() {
                                if(!_cto.statics.sessionExpired) {
                                    _cto.statics.stateShippingMethodSelections[$(_cto.statics.currentCountrySelectTarget).val() + '-' + $(_cto.statics.currentStateSelectTarget + ' select').val()] = $('#co-selectedShippingMethod').val();
                                    var url4245 = '/store/common/json/addressStateList.jsp?task=shipMethods&needShipMethods=' +
                                        ((statics.shippingMethodsContainer) ? 'true' : 'false') +
                                        '&country=' + $(statics.countryTarget).val() + '&state=' + $(this).val() +
                                        "&p4245=" + new Date().getTime();
                                    _cto.ajax({
                                        url: url4245,
                                        dataType: 'json',
                                        success: function(data) {
                                            if(!data.location) {
                                                _cto.deployShippingMethods(data, statics);
                                            }
                                        }
                                    });
                                }
                            });
                            clearInterval(lisStateEvent);
                        }
                    }, 200);
                }
                var url = '/store/common/json/addressStateList.jsp?needShipMethods=' + ((statics.shippingMethodsContainer) ? 'true' : 'false') + '&country=';
                if(typeof statics.preSelect != 'undefined') {
                    url += statics.preSelect.country;
                    $(statics.countryTarget + ' option').each(function() {
                        if($(this).val() == statics.preSelect.country) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                } else {
                    url += $(statics.countryTarget).val();
                }
                if($(statics.phoneTarget != '' && statics.countryTarget).val() != 'USA' && $(statics.countryTarget).val() != 'CAN') {
                    $(statics.phoneTarget + ' .dash, ' + statics.phoneTarget + ' .frmPhone2, '+ statics.phoneTarget + ' .frmPhone3').hide().val('');
                    $(statics.phoneTarget + ' .frmPhone1').attr('maxlength', '15').addClass('co-formFields-small frmPhoneIntl').removeClass('co-formFields').val($(statics.phoneTarget + ' .coFormPhone').val());
                } else {
                    $(statics.phoneTarget + ' .dash, ' + statics.phoneTarget + ' .frmPhone2, '+ statics.phoneTarget + ' .frmPhone3').show();
                    $(statics.phoneTarget + ' .frmPhone1').attr('maxlength', '3').removeClass('co-formFields-small frmPhoneIntl').addClass('co-formFields');
                    _cto.initPhoneNumberBoxes();
                }
                _cto.ajax({
                    url: url,
                    dataType: 'json',
                    success: function(data) {
                        var selectedState = (statics.preSelect) ? statics.preSelect.state : $(statics.stateHiddenInput).val();
                        var selectedCity = (statics.preSelect) ? statics.preSelect.city : $(statics.cityHiddenInput).val();
                        if (selectedState && selectedCity) {
                            selectHiddenInputValue = true;
                        }
                        var stateOptions;
                        if(data.stateList.length < 1) {
                            stateOptions = '<input id="' + $(statics.stateHiddenInput).attr('id') + '" class="co-formFields-small" type="text" maxlength="30" name="' + $(statics.stateHiddenInput).attr('name') + '"/>';
                        } else {
                            stateOptions = '<option class="co-formFields-select" value=""></option>';
                            $(data.stateList).each(function() {
                                stateOptions += '<option class="co-formFields-select" value="' + this.key + '">' + this.value + '</option>';
                            });
                            stateOptions = '<select id="' + $(statics.stateHiddenInput).attr('id') + '" class="co-formFields-small co-formField-select" name="' + $(statics.stateHiddenInput).attr('name') + '">' + stateOptions + '</select>';
                        }
                        $(statics.stateTarget).html(stateOptions);
                        var cityOptions;
                        if(data.cityList.length < 1) {
                            cityOptions = '<input id="' + $(statics.cityHiddenInput).attr('id') + '" class="co-formFields" type="text" maxlength="30" name="' + $(statics.cityHiddenInput).attr('name') + '"/>';
                        } else {
                            cityOptions = '<option class="co-formFields-select" value=""></option>';
                            $(data.cityList).each(function() {
                                cityOptions += '<option class="co-formFields-select" value="' + this.key + '">' + this.value + '</option>';
                            });
                            cityOptions = '<select id="' + $(statics.cityHiddenInput).attr('id') + '" class="co-formFields co-formField-select" name="' + $(statics.cityHiddenInput).attr('name') + '">' + cityOptions + '</select>';
                        }
                        $(statics.cityTarget).html(cityOptions);
                        if(selectHiddenInputValue) {
                            if(selectedState) {
                                $(statics.stateHiddenInput).val(selectedState);
                                if($(statics.stateTarget + ' select').length) {
                                    $(statics.stateTarget + ' option').each(function() {
                                        if($(this).val() == selectedState) {
                                            $(this).attr('selected', 'selected');
                                        }
                                    });
                                } else {
                                    $(statics.stateTarget + ' input').val(statics.selectedState);
                                }
                            }
                            if(selectedCity) {
                                $(statics.cityHiddenInput).val(selectedCity);
                                if($(statics.cityTarget + ' select').length) {
                                    $(statics.cityTarget + ' option').each(function() {
                                        if($(this).val() == selectedCity) {
                                            $(this).attr('selected', 'selected');
                                        }
                                    });
                                } else {
                                    var city = statics.selectedCity;
                                    if (city) {
                                        city = city.replace('\u00A0', '');
                                    }
                                    $(statics.cityTarget + ' input').val(city);
                                }
                            }
                        }
                        if(!$('#contextSelector').is(':visible')){
                            _cto.deployShippingMethods(data, statics);
                        }
                        selectHiddenInputValue = false;
                        delete statics.preSelect;
                    }
                });
            });
            var selectHiddenInputValue = true;
            $(statics.countryTarget).change();
        }
        this.initAddressChangeListener = function(container, checkbox) {
            var container = $(container),
                checkbox = $(checkbox),
                label = checkbox.find('label');
            if(container.find('[id*="_selAddress"]').is(':visible') && container.is(':visible') && !_cto.statics.addressChangeListener) {
                label.html(_cto.Lang.order.updateCopy);
                _cto.statics.addressChangeListener = setInterval(function() {
                    if(!_cto.statics.initCityStateCountryActive) {
                        if(container.is(':visible')) {
                            var inputs = [
                                    container.find('[id*="_fName"]'),
                                    container.find('[id*="_lName"]'),
                                    container.find('[id*="_add1"]'),
                                    container.find('[id*="_add2"]'),
                                    container.find('[id*="_city_hidden"]:first'),
                                    container.find('[id*="_country"] option[selected]'),
                                    container.find('[id*="_state_hidden"]:first'),
                                    container.find('[id*="_zip"]'),
                                    container.find('[id*="_phone"]')
                                ],
                                addA = _cto.statics.tempAddressSelected,
                                addB = $.map(inputs, function(input, index) {
                                    return $.trim($(input).val());
                                }),
                                isDiff = 0,
                                type = (addA.join('')[0]) ? 'update' : 'save';
                            for(i = 0; i <= addA.length; i++) {
                                if(addA[i] != addB[i]) {
                                    isDiff = -1;
                                    break;
                                }
                            }
                            if(isDiff) { 
                                if(checkbox.is(':not(:visible)')) { 
                                    if(type == 'save') { 
                                        label.html(_cto.Lang.order.saveCopy);
                                    }
                                    checkbox.fasToggle(function() { 
                                        if(type == 'update') { 
                                            label.html(_cto.Lang.order.updateCopy);
                                        }
                                    });
                                } else { 
                                    if(type == 'save' && checkbox.is(':not(:animated)')) {  
                                        label.html(_cto.Lang.order.saveCopy); 
                                    }
                                }
                            } else { 
                                if(checkbox.is(':not(:animated):visible')) { 
                                    checkbox.fasToggle(function() { 
                                        switch(type) { 
                                            case 'save':
                                                label.html(_cto.Lang.order.saveCopy);
                                                break;
                                            case 'update':
                                                label.html(_cto.Lang.order.updateCopy);
                                                break;
                                        }
                                    });
                                }
                            }
                        } else {
                            clearInterval(_cto.statics.addressChangeListener);
                            _cto.statics.addressChangeListener = '';
                        }
                    }
                    return;
                }, 300);
                return -1;
            }
            return 0;
        }
        this.showCreditCardForm = function(cscParams) {
            if(_cto.statics.showCreditCardUpdateForm == true) {
                $('#frmUpdateCreditCard_wrapper, #co-modal-savedCC, #co-ccard-form-header-wrapper').show();
                $('#frmCreateCreditCard_wrapper').hide();
                if($('#frmUpdateCreditCard_wrapper div[id^="coBillingCity"] input').length < 1)
                    _cto.initCityStateCountry(cscParams.billingUpdate);
            } else {
                $('#frmUpdateCreditCard_wrapper, #co-modal-savedCC, #co-ccard-form-header-wrapper').hide();
                $('#frmCreateCreditCard_wrapper').show();
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
            $(statics.form + ' .co-billing-credit-card-type:first option').each(function() {
                ccSelected = $(this).val();
                if(ccSelected && ccSelected != ccDefault) {
                    ccImages.push(urlTemplate.replace('*', ccSelected));
                }
            });
            preloadArray(ccImages);
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
            $('#co-billing').css('height', ((op) ? $('#co-billing').height() : ''));
        }
        this.LOGSTEP = true;
        this.logStep = function(curr, prev) {
            if (this.LOGSTEP) {
                console.log("Checkout step changed: [ Current: \"" + curr + "\", Prev: \"" + prev + "\"]");
            }
        };
        this.initOrderPage = function(orderData) {
            var prevHash;
            _ctoMiniCart.build(orderData.cart, false);
            _cto.updateOrder(orderData, '', true);
            _cto.createCheckoutModals();
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
            $.history.init(function() {
                setInterval(function() {
                    switch(window.location.hash) {
                        case '#start':
                            if(prevHash == window.location.hash) {
                                break;
                            } else {
                                _cto.logStep('#start', '(any)');
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
                                $('#co-content').children().stop(true); 
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); 
                                $('#co-shipping-options, #co-billing-options').show().
                                    css('opacity', 1);
                                $('#co-shipping-options').
                                    css('zIndex', 1);
                                $('#co-shipping-review, #co-billing-review, #co-billing-content, #co-order-review-actions, #co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);
                                $('#co-billing').css('height', $('#co-billing-header').outerHeight() - 1);
                                if($('#coShipToCity input').length < 1)
                                    _cto.initCityStateCountry(cscParams.shipping);
                                $('#co-content').css('visibility', 'visible');
                            }
                            break
                        case '#payment':
                            if(prevHash == window.location.hash) {
                                break;
                            } else if(!prevHash) {
                                _cto.logStep('#payment', '(none)');
                                prevHash = window.location.hash;
                                _cto.showCreditCardForm(cscParams);
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);
                                _cto.clearFormErrors('form');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });
                                $('#co-content').children().stop(true); 
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); 
                                $('#co-shipping-proceed').
                                    css({ 'height': '20px', 'opacity': 0, 'padding': 0, 'left': -1000 });
                                $('#co-billing-options').show().
                                    css('opacity', 1);
                                $('#co-billing-gift-result').removeAttr('style').hide();
                                $('#co-billing-gift-form').removeAttr('style').show();
                                $('#co-billing-gift-result-remove, #co-billing-review, #co-shipping-options, #co-order-commit-actions, #co-order-commit-actions-top').hide().
                                    css('opacity', 0);
                                $('#co-billing-header').css('zIndex', 1);
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
                                $('#co-content').css('visibility', 'visible');
                                break;
                            } else if(prevHash == '#giftCardRegister') {
                                _cto.logStep('#payment', '#giftCardRegister)');
                                prevHash = window.location.hash;
                                document.frmRemoveGiftcard.submit();
                                _cto.showCreditCardForm(cscParams);
                                $('#co-billing-gift-form input[type="text"]').val('');
                                _cto.clearFormErrors('form');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });
                                $('#co-content').children().not('.asyncForm, #co-order-review-actions, #co-shipping-proceed, #co-shipping, #co-shipping-options').removeAttr('style'); 
                                $('#co-shipping-review').
                                    css('zIndex', 2);
                                $('#co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);
                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);
                                $('#co-content').css('visibility', 'visible');
                                $('#co-billing-header').css('zIndex', 1);
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
                                _cto.logStep('#payment', '#giftCardAdditionalPayment)');
                                prevHash = window.location.hash;
                                document.frmRemoveGiftcard.submit();
                                _cto.showCreditCardForm(cscParams);
                                $('#co-billing-gift-form input[type="text"]').val('');
                                _cto.clearFormErrors('form');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });
                                $('#co-content').children().not('.asyncForm, #co-order-review-actions, #co-shipping-proceed, #co-shipping, #co-shipping-options').removeAttr('style'); 
                                $('#co-shipping-review').
                                    css('zIndex', 2);
                                $('#co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);
                                $('#co-content').css('visibility', 'visible');
                                $('#co-billing-header').css('zIndex', 1);
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
                                                }
                                            });
                                        }
                                        runOnce++;
                                    }
                                );
                            } else if(prevHash == '#shipping') {
                                _cto.logStep('#payment', '#shipping)');
                                prevHash = window.location.hash;
                                _cto.showCreditCardForm(cscParams);
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);
                                _cto.clearFormErrors('form');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });
                                $('#co-content').children().not('.asyncForm, #co-shipping, #co-shipping-options, #co-shipping-proceed').removeAttr('style'); 
                                $('#co-shipping-review').
                                    css('zIndex', 2);
                                $('#co-order-commit-actions, #co-order-commit-actions-top').hide().
                                    css('opacity', 0);
                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);
                                coShippingHeight = $('#co-shipping-header').outerHeight() + $('#co-shipping-review').outerHeight();
                                coBillingHeight = $('#co-billing-content').outerHeight();
                                $('#co-content').css('visibility', 'visible');
                                $('#co-billing-header').css('zIndex', 2);
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
                                _cto.logStep('#payment', 'not #review)');
                                prevHash = window.location.hash;
                                _cto.showCreditCardForm(cscParams);
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);
                                _cto.clearFormErrors('form');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('payment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });
                                $('#co-content').children().not('.asyncForm, #co-shipping, #co-shipping-options').removeAttr('style'); 
                                $('#co-shipping-review').
                                    css('zIndex', 2);
                                $('#co-order-review-actions, #co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);
                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);
                                var coShippingHeight = $('#co-shipping').outerHeight();
                                var coBillingHeight = $('#co-billing-content').outerHeight();
                                $('#co-content').css('visibility', 'visible');
                                $('#co-billing-header').css('zIndex', 2);
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
                                _cto.logStep('#payment', 'see code');
                                prevHash = window.location.hash;
                                $('#modalEditAll').trigger('click');
                                _cto.statics.stageLock = true;
                                window.location.hash = '#review';
                            }
                            break;
                        case '#giftCardRegister':
                            if(prevHash == window.location.hash) {
                                break;
                            } else if(!prevHash || prevHash == '#giftCardAdditionalPayment') {
                                _cto.logStep('#giftCardRegister', 'none or #giftCardAdditionalPayment');
                                if(prevHash == '#review') _cto.statics.stageLock = true;
                                prevHash = window.location.hash;
                                _cto.showCreditCardForm(cscParams);
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);
                                _cto.clearFormErrors('form');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('giftCardRegister-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });
                                $('#co-content').children().stop(true); 
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); 
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
                                $('#co-content').css('visibility', 'visible');
                                break;
                            } else if(prevHash == '#payment') {
                                _cto.logStep('#giftCardRegister', '#payment');
                                prevHash = window.location.hash;
                                _cto.showCreditCardForm(cscParams);
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
                                prevHash = window.location.hash;
                                $('#modalEditAll').trigger('click');
                                _cto.statics.stageLock = true;
                                window.location.hash = '#review';
                            } else {
                                _cto.logStep('#giftCardRegister', 'any other');
                                prevHash = window.location.hash;
                                _cto.showCreditCardForm(cscParams);
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);
                                _cto.clearFormErrors('form');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('giftCardRegister-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });
                                $('#co-content').children().not('.asyncForm, #co-shipping, #co-shipping-options').removeAttr('style'); 
                                $('#co-shipping-review').
                                    css('zIndex', 2);
                                $('#co-order-review-actions, #co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);
                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);
                                coShippingHeight = $('#co-shipping-header').outerHeight() + $('#co-shipping-review').outerHeight();
                                coBillingHeight = $('#co-billing-content').outerHeight();
                                $('#co-content').css('visibility', 'visible');
                                $('#co-billing-header').css('zIndex', 2);
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
                                break;
                            } else if(!prevHash || prevHash == '#giftCardRegister') {
                                _cto.logStep('#giftCardAdditionalPayment', 'none or #giftCardRegister');
                                if(prevHash == '#review') _cto.statics.stageLock = true;
                                prevHash = window.location.hash;
                                _cto.showCreditCardForm(cscParams);
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);
                                _cto.clearFormErrors('form');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('giftCardRegister-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });
                                $('#co-content').children().stop(true); 
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); 
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
                                $('#co-content').css('visibility', 'visible');
                                break;
                            } else if(prevHash == '#payment') {
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
                                prevHash = window.location.hash;
                                $('#modalEditAll').trigger('click');
                                _cto.statics.stageLock = true;
                                window.location.hash = '#review';
                            } else {
                                _cto.logStep('#giftCardAdditionalPayment', '!none, #giftCardRegister, !#payment, !#review');
                                prevHash = window.location.hash;
                                _cto.showCreditCardForm(cscParams);
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':billing' , siteCatalyst_loginStatus);
                                _cto.clearFormErrors('form');
                                $('#co-billing').removeClass('co-review-stage');
                                $('#co-shipping').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('giftCardAdditionalPayment-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Payment Information',
                                    'src': '../images/checkout_redesign/co_review_header_paymentInfo.gif'
                                });
                                $('#co-content').children().not('.asyncForm, #co-shipping, #co-shipping-options').removeAttr('style'); 
                                $('#co-shipping-review').
                                    css('zIndex', 2);
                                $('#co-order-review-actions, #co-order-commit-actions,#co-order-commit-actions-top').hide().
                                    css('opacity', 0);
                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);
                                coShippingHeight = $('#co-shipping-header').outerHeight() + $('#co-shipping-review').outerHeight();
                                coBillingHeight = $('#co-billing-content').outerHeight();
                                $('#co-content').css('visibility', 'visible');
                                $('#co-billing-header').css('zIndex', 2);
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
                                break;
                            } else if(prevHash == '#start' || !prevHash) {
                                _cto.logStep('#review', '#start or none');
                                prevHash = window.location.hash;
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':orderReview' , siteCatalyst_loginStatus);
                                _cto.clearFormErrors('form');
                                $('.co-review-box').addClass('activeCopyState');
                                $('#co-shipping, #co-billing').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('review-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Order Review',
                                    'src': '../images/checkout_redesign/co_review_header_orderReview.gif'
                                });
                                $('#co-content').children().stop(true); 
                                $('#co-content').children().not('.asyncForm').removeAttr('style'); 
                                $('#co-shipping-proceed').
                                    css({ 'height': '20px', 'opacity': 0, 'padding': 0, 'left': -1000 });
                                $('#co-billing-content, #co-order-review-actions, #co-shipping-review, #co-billing-review, #co-order-commit-actions,#co-order-commit-actions-top').show().
                                    css('opacity', 1);
                                $('#co-billing-options, #co-order-review-actions').hide().css('opacity', 0);
                                $('#co-billing').
                                    css('height',
                                    $('#co-billing-header').outerHeight() +
                                    $('#co-billing-review').outerHeight());
                                $('#co-content').css('visibility', 'visible');
                                if(window.cartData.isBorderFree == 'true') {
                                    $('#borderfree-partner-terms').show();
                                }
                                break;
                            } else if(prevHash == '#shipping') {
                                _cto.logStep('#review', '#shipping');
                                prevHash = window.location.hash;
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':orderReview' , siteCatalyst_loginStatus);
                                _cto.clearFormErrors('form');
                                $('.co-review-box').addClass('activeCopyState');
                                $('#co-shipping, #co-billing').addClass('co-review-stage');
                                $('#co-content').removeClass().addClass('review-step');
                                $('#co-main-header img').attr({
                                    'alt': 'Checkout: Order Review',
                                    'src': '../images/checkout_redesign/co_review_header_orderReview.gif'
                                });
                                $('#co-content').children().stop(true); 
                                $('#co-content').children().not('.asyncForm, #co-shipping-proceed, #co-shipping, #co-shipping-options, #co-billing, #co-billing-options').removeAttr('style'); 
                                $('#co-order-commit-actions').hide().
                                    css('opacity', 0);
                                if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);
                                coShippingHeight =
                                    $('#co-shipping-header').outerHeight() +
                                    $('#co-shipping-review').outerHeight();
                                $('#co-content').css('visibility', 'visible');
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
                                if(window.cartData.isBorderFree == 'true') {
                                    $('#borderfree-partner-terms').show();
                                }
                            } else {
                                _cto.logStep('#review', '!none, !start, !#shipping');
                                prevHash = window.location.hash;
                                set_page_send_tag(siteCatalyst_brand, 'checkout', siteCatalyst_checkoutType + ':orderReview' , siteCatalyst_loginStatus);
                                if(_cto.statics.stageLock == false) {
                                    _cto.clearFormErrors('form');
                                    $('.co-review-box').addClass('activeCopyState');
                                    $('#co-shipping, #co-billing').addClass('co-review-stage');
                                    $('#co-content').removeClass().addClass('review-step');
                                    $('#co-main-header img').attr({
                                        'alt': 'Checkout: Order Review',
                                        'src': '../images/checkout_redesign/co_review_header_orderReview.gif'
                                    });
                                    $('#co-content').children().stop(true); 
                                    $('#co-content').children().not('.asyncForm, #co-shipping-proceed, #co-shipping, #co-shipping-options, #co-billing, #co-billing-options').removeAttr('style'); 
                                    $('#co-order-commit-actions').hide().
                                        css('opacity', 0);
                                    if(_cto.statics.isIE6) $('#co-content select').hide().css('opacity', 0);
                                    coBillingHeight =
                                        $('#co-billing-header').outerHeight() +
                                        $('#co-billing-review').outerHeight();
                                    $('#co-content').css('visibility', 'visible');
                                    $('#co-billing-header').css('zIndex', 2);
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
    _ctoTaggingClass = function(Config) {
        this.doTracking = function(data, formName) {
            if($.inArray(formName, Config.asyncFormNames) > -1 || formName === true) {
                data = (data.cart) ? data.cart : data;
                if(!_ctoTagging.asyncAction.addToBag(data) && data.trackingVars) {
                    var customerType = "";
                    var customerId = "";
                    var trkVars = data.trackingVars.siteCatalyst;
                    s.pageName = _cto.statics.pageName;
                    if(trkVars['CI_PageType']) {
                        var CI_PageType = trkVars['CI_PageType'];
                    }
                    if(trkVars['s.server']) s.server = trkVars['s.server'];
                    if(trkVars['s.channel']) s.channel = trkVars['s.channel'];
                    if(trkVars['s.prop1']) s.prop1 = trkVars['s.prop1'];
                    if(trkVars['s.prop2']) s.prop2 = trkVars['s.prop2'];
                    if(trkVars['s.prop3']) s.prop3 = trkVars['s.prop3'];
                    if(trkVars['s.prop4']) s.prop4 = trkVars['s.prop4'];
                    if(trkVars['s.prop5']) s.prop5 = trkVars['s.prop5'];
                    if(trkVars['s.prop11']) s.prop11 = trkVars['s.prop11'];
                    if(trkVars['s.prop12']) s.prop12 = trkVars['s.prop12'];
                    if(trkVars['s.prop2']) s.pageType = trkVars['s.prop2'];
                    if(trkVars['s.eVar1']) s.eVar1 = trkVars['s.eVar1'];
                    if(trkVars['s.eVar7']) s.eVar7 = trkVars['s.eVar7'];
                    if(trkVars['s.eVar8']) s.eVar8 = trkVars['s.eVar8'];
                    if(trkVars['s.eVar9']) s.eVar9 = trkVars['s.eVar9'];
                    if(trkVars['s.eVar10']) s.eVar10 = trkVars['s.eVar10'];
                    if(trkVars['s.eVar25']) s.eVar25 = trkVars['s.eVar25'];
                    if(trkVars['s.eVar26']) s.eVar26 = trkVars['s.eVar26'];
                    if(trkVars['s.eVar27']) s.eVar27 = trkVars['s.eVar27'];
                    if(trkVars['s.eVar28']) s.eVar28 = trkVars['s.eVar28'];
                    if(trkVars['s.eVar29']) s.eVar29 = trkVars['s.eVar29'];
                    if(trkVars['s.eVar30']) s.eVar30 = trkVars['s.eVar30'];
                    if(trkVars['s.eVar31']) s.eVar31 = trkVars['s.eVar31'];
                    if(trkVars['s.eVar2']) s.eVar2 = trkVars['s.eVar2'];
                    if(trkVars['s.eVar3']) s.eVar3 = trkVars['s.eVar3'];
                    if(trkVars['s.eVar5']) s.eVar5 = trkVars['s.eVar5'];
                    if(trkVars['s.eVar6']) s.eVar6 = trkVars['s.eVar6'];
                    if(trkVars['s.eVar11']) s.eVar11 = trkVars['s.eVar11'];
                    if(trkVars['s.eVar12']) s.eVar12 = trkVars['s.eVar12'];
                    if(trkVars['s.eVar13']) s.eVar13 = trkVars['s.eVar13'];
                    if(trkVars['s.eVar14']) s.eVar14 = trkVars['s.eVar14'];
                    if(trkVars['s.eVar15']) s.eVar15 = trkVars['s.eVar15'];
                    if(trkVars['s.eVar16']) s.eVar16 = trkVars['s.eVar16'];
                    if(trkVars['s.state']) s.state = trkVars['s.state'];
                    if(trkVars['s.purchaseID']) s.purchaseID = trkVars['s.purchaseID'];
                    if(trkVars['s.eVar17']) s.eVar17 = trkVars['s.eVar17'];
                    if(trkVars['s.eVar18']) s.eVar18 = trkVars['s.eVar18'];
                    if(!s.eVar17) {
                        var customerType = "" + readCookie("TRACK_LOYALTY_STATUS");
                        if(customerType != "" && customerType != "null")
                            s.eVar17 = customerType;
                    }
                    if(!s.eVar18) {
                        var customerId = "" + readCookie("TRACK_LOYALTY_ID");
                        if(customerId != "" && customerId != "null")
                            s.eVar18 = customerId;
                    }
                    _D('_ctoTagging.doTracking|Omniture Tags', {'pageName': s.pageName, 'events': s.events, 'products': s.products});
                    var s_code=s.t();if(s_code)document.write(s_code);
                    if(typeof data.trackingVars.cheetahMail!='undefined' && data.trackingVars.cheetahMail.reqCheetahMail) {
                        _D('_ctoTagging.doTracking|CheetahMail Tags', data.trackingVars.cheetahMail);
                        Req("/web_assets/js/cheetah_mail/sc_tracking.js", function(){
                                eval(_cto.heDecode(data.trackingVars.cheetahMail.reqCheetahMail));
                            }, function(){
                                sc_send_data();
                            }
                        );
                    }
                    return -1;
                } else {
                    return 0;
                }
            }
        }
        this.asyncAction = {
            addToBag: function(data) {
                if(data.recentlyAdded) {
                    var imageTag = "",
                        prodList = [],
                        merchCat = (typeof merchandisingCategory != "undefined") ? merchandisingCategory : "",
                        addCatId = (typeof catId != "undefined") ? catId : "",
                        ra = data.recentlyAdded;
                    for(i = 0; i < ra.products.length; i++) {
                        if(!!data.items[i]){
                            if(i < 1) s.products = '';
                            if(/GIFTCERT/i.test(ra.products[i])) {
                                ra.color[i] = $.trim($('select#skuIdSelect option[value="' + ra.skus[i] + '"]').text());
                                ra.price[i] = $.map(ra.price[i].split(".0"), function(val, index){
                                    if(val) {
                                        return val + ".0";
                                    }
                                }).reverse()[0];
                            }
                            s.products += ";" + ra.products[i] + ";" + ra.qty[i] +";" + ra.price[i] + ";;" + "evar19=" + ra.skus[i] + "|evar20=" + ra.size[i] + "|evar21=" + ra.color[i] + "|evar44=" + ra.upc[i] + ",";
                            imageTag = "1012~" + ra.skus[i] + "~131~" + data.items[i].name + "~1113~" + addCatId + "~1112~" + merchCat;
                            _D('_ctoTagging.addToBagTagging|Omniture Tags', {
                                'firstInCart': data.firstInCart,
                                'recentlyAdded': data.recentlyAdded,
                                'skuIdAdded': ra.skus[i],
                                'imageTag': imageTag
                            });
                            prodList.push(data.items[i].tagStyleId + ',');
                            if(typeof SC_Sku != 'undefined') {
                                SC_Sku.addToCart("" + ra.skus[i], imageTag, ra.qty[i], ra.price[i]);
                            }
                        }
                    }
                    if(prodList.length > 0) {
                        if(data.firstInCart == 'true') {
                            s.events = "scAdd,scOpen";
                        } else {
                            s.events = "scAdd";
                        }
                        if(s.products.length > 0 && s.products.charAt(s.products.length - 1) == ',') {
                            s.products = s.products.substring(0, s.products.length - 1);
                        }
                        void (s.t());
                        if(typeof SC_Sku != 'undefined') {
                            sc_send_data();
                        }
                        Req(true,
                            '/web_assets/js/certona/resxclsx.js',
                            '/web_assets/js/certona/flex-recommendation.js',
                            function(){
                                _D('_ctoTagging.addToBagTagging|Certona Tags', {'host': certona_host, 'prodList': prodList});
                                var promotionlessProdlist = JSON.parse(JSON.stringify(
                                    data.recentlyAdded.products
                                )).filter(function(str){
                                    return /^[0-9,]+$/.test(str)
                                }).map(function(d){
                                    return d+',';
                                });
                                certonaCHObject.initAndRunWithRecommendation(prodList,customerId,null,null,"addtocart_op",certona_host,[promotionlessProdlist[0]],null,null,null);
                            }
                        );
                        return -1;
                    } else {
                        return 0;
                    }
                }
            },
            removeFromBag: function(tag) {
                console.log(tag);
                s.pageName = _cto.statics.pageName;
                s.events = 'scRemove';
                s.products = tag.categoryId + ';' + tag.style;
                return;
            },
            changeQuantity: function() {
                return;
            },
            couponFormSubmit: function() {
                return;
            }
        }
    }
    var CTUI = {};
    CTUI.Collection = Class.extend({
        _array: [],
        push: function(item) {
            this._array.push(item);
        },
        reset: function() {
            this._array = [];
        },
        getAll: function() {
            return this._array;
        },
        cloneItem: function(item) {
            return $.extend(true, {}, item);
        },
        createAnonymousShipment: function(items) {
            var self = this;
            var shipment = {};
            shipment.items = [];
            shipment.index = 0;
            shipment.itemGiftOptions = {};
            shipment.isAnonymous = true;
            shipment.shipGroupId = 'guest';
            if (window.cartData.giftOption) {
                shipment.giftOption = window.cartData.giftOption;
            } else {
                delete shipment.giftOption;
            }
            $.each(items, function(iIndex, item) {
                var data = self.cloneItem(item);
                $.each(data.itemGiftOptions, function(index, option){
                    var optionData = self.cloneItem(option);
                    shipment.shipGroupId = optionData.shippingGroupId;
                    data.shippingGroupId = optionData.shippingGroupId;
                    if (typeof shipment.itemGiftOptions[data.itemId] == "undefined") {
                        shipment.itemGiftOptions[data.itemId] = [];
                    }
                    shipment.itemGiftOptions[data.itemId].push(optionData);
                });
                shipment.items.push(data);
            });
            return shipment;
        }
    });
    CTUI.Cart = CTUI.Collection.extend({
        init: function(shipments, items) {
            this._array = [];
            this.addresses = [];
            this.shipments = [];
            this.process(shipments, items);
        },
        process: function(shipments, items) {
            var self = this;
            if (typeof shipments != "undefined") {
                $.each(shipments, function(sIndex, ship){
                    var shipment = self.cloneItem(ship);
                    shipment.items = [];
                    shipment.index = sIndex;
                    shipment.itemGiftOptions = {};
                    $.each(shipment.shipItems, function(sItemIndex, shipmentItem){
                        $.each(items, function(iIndex, item) {
                            var data = self.cloneItem(item);
                            if (data.itemId === shipmentItem.itemId) {
                                data.qty = shipmentItem.qty;
                                data.shippingGroupId = shipment.shipGroupId;
                                $.each(data.itemGiftOptions, function(index, option){
                                    var optionData = self.cloneItem(option);
                                    if (optionData.shippingGroupId === shipment.shipGroupId) {
                                        if (typeof shipment.itemGiftOptions[data.itemId] == "undefined") {
                                            shipment.itemGiftOptions[data.itemId] = [];
                                        }
                                        shipment.itemGiftOptions[data.itemId].push(optionData);
                                    }
                                });
                                shipment.items.push(data);
                            }
                        });
                    });
                    shipment.isMultiship = self.isMultiShip();
                    self.addShipment(shipment);
                });
            } else {
                this.addShipment(this.createAnonymousShipment(items));
            }
            this.cartItems = new CTUI.CartItemCollection(items);
        },
        isMultiShip: function() {
            if (this.shipments.length > 0 ){
                return true;
            }
            return false;
        },
        addAddress: function() {
        },
        addShipment: function(shipment) {
            this.shipments.push(new CTUI.Shipment(shipment));
        },
        getShipment: function(shipmentGroupId) {
            var shipment = null;
            $.each(this.shipments, function(i, value) {
                if (value.shipGroupId === shipmentGroupId) {
                    shipment = value;
                }
            });
            return shipment;
        },
        canChangeAddress: function() {
            if (this.addressses.length >= 10) {
                return false;
            }
            return true;
        }
    });
    CTUI.CartItem = Class.extend({
        IMAGE_PREFIX_REPLACE: "_shelf2",
        SMALL_IMAGE_PREFIX: "_thumb2",
        GCARD_IMAGE_PREFIX: "_thumb",
        LARGE_IMAGE_PREFIX: "",
        init: function(data) {
            this.update(data);
        },
        generateUid: function(index, cid) {
            return cid + "_" + index;
        },
        getImage: function(){
            if (typeof this.image === "undefined") {
                throw "Product Missing Image";
            }
            return this.image;
        },
        getSmallImage: function(){
            if (!this.isGiftCard && !this.isEGiftCard) {
                return this.image.replace(this.IMAGE_PREFIX_REPLACE, this.SMALL_IMAGE_PREFIX);
            }
            return this.image.replace(this.IMAGE_PREFIX_REPLACE, this.GCARD_IMAGE_PREFIX);
        },
        getTruncatedGiftMessage: function() {
            var GIFTMESSAGE_MAX_LENGTH = 18;
            if (this.giftMessage.length > GIFTMESSAGE_MAX_LENGTH) {
                return $.trim(this.giftMessage.substring(0, GIFTMESSAGE_MAX_LENGTH)) + '...';
            }
            return this.giftMessage;
        },
        update: function(data) {
            for (var prop in data) {
                this[prop] = data[prop];
            }
            if (typeof this.index != "undefined") {
                this.uid = this.generateUid(this.index, this.itemId);
            } else {
                this.uid = this.itemId;
            }
            if (this.giftable === "false") {
                this.giftable = false;
            }
            if (this.itemGiftOptions) {
            }
        },
        processGiftOptions: function(index, options) {
            if (options[index]) {
                var option = options[index];
                this.isGifted = true;
                this.giftedTo = option.giftedTo;
                this.giftedFrom = option.giftedFrom;
                this.giftMessage = option.giftMessage;
                this.giftBoxPrice = option.giftBoxPrice;
                this.boxType = option.giftBoxSkuId;
            }
        }
    });
    CTUI.Shipment = Class.extend({
        init: function(shipment) {
            this.giftedItemsTogetherTemplate = $('#co-gifting-together-products-template').html();
            this.giftedItemsIndividualTemplate = $('#co-gifting-individually-product-template').html();
            this.shipmentItemsTemplate = $('#co-products-template').html();
            this.index = shipment.index;
            this.initShipment = shipment;
            this.isAnonymous = shipment.isAnonymous;
            this.shipGroupId = shipment.shipGroupId;
            this.shipAddress = new CTUI.AddressInfo(shipment.shipAddress, shipment.shipGroupId);
            this.shipMethod = new CTUI.ShippingMethod(shipment.shipMethod, shipment.shipGroupId);
            this.processShipmentGiftOptions(shipment.giftOption);
            this.itemGiftOptions = shipment.itemGiftOptions;
            this.shipCart = shipment.cartItems;
            this.processItems(shipment.items);
        },
        processItems: function(items) {
            var self = this;
            this.items = new CTUI.CartItemCollection(items);
            this.items.addGiftOptions(this.itemGiftOptions);
            this.giftedItems = new CTUI.CartItemCollection();
            this.nonGiftedItems = new CTUI.CartItemCollection();
            $.each(this.items.getAll(), function(index, item) {
                if (item.isGifted) {
                    self.giftedItems.pushClone(item);
                } else {
                    self.nonGiftedItems.pushClone(item);
                }
            });
        },
        processShipmentGiftOptions: function(giftOption) {
            if (typeof giftOption != "undefined" && typeof giftOption[0] != "undefined") {
                this.isGifted = true;
                this.giftedTo = giftOption[0].giftMessageTo;
                this.giftedFrom = giftOption[0].giftMessageFrom;
                this.giftMessage = giftOption[0].userText;
                var giftBox = giftOption[0].giftBox;
                if (giftBox === "false") {
                    giftBox = null;
                }
                this.giftBox = giftBox;
                this.giftBoxPrice = giftOption[0].giftBoxPrice;
                this.description = giftOption[0].description;
                this.boxType = giftOption[0].giftBoxSkuId;
            }
        },
        getAllItems: function() {
            return this.items.getAll();
        },
        getNonGiftedItems: function() {
            return this.nonGiftedItems.getAll();
        },
        getGiftedItems: function() {
            return this.giftedItems.getAll();
        },
        render: function(element) {
            var output = "";
            element.attr('data-sg', this.shipGroupId);
            element.attr('id', 'co-shipping');
            element.find('button.giftOptionsButton').attr('data-sg', this.shipGroupId);
            if (this.shipAddress && this.shipMethod) {
                this.shipAddress.render(element);
                this.shipMethod.render(element);
            }
            element.find('.gift-more-items').attr('data-sg', this.shipGroupId);
            if (this.moreItemsAvailableToGift()) {
                element.find('.view-gift-options').addClass('gift-button-hide');
                element.find('.gift-more-items').removeClass('gift-button-hide');
            } else {
                element.find('.view-gift-options').removeClass('gift-button-hide');
                element.find('.gift-more-items').addClass('gift-button-hide');
            }
            if (this.isGifted || this.allItemsGifted()) {
                element.find('.view-gift-options').addClass('gift-button-hide');
                element.find('.gift-more-items').addClass('gift-button-hide');
            }
            output += this.renderShipmentItems();
            element.find('#co-shipping-review').append(output);
            element.find('#co-shipping-review').addClass('co-shipment-' + this.index);
            return element.html();
        },
        allItemsGifted: function() {
            if (this.getAllItems().length === this.getGiftedItems().length) {
                return true;
            }
            return false;
        },
        moreItemsAvailableToGift: function() {
            if (this.getGiftedItems().length > 0 &&
                this.getAllItems().length > this.getGiftedItems().length) {
                return true;
            }
            return false;
        },
        renderShipmentItems: function() {
            var output = "";
            if (!this.isGifted) {
                if (this.getNonGiftedItems().length > 0) {
                    output += this.renderNonGiftedItems();
                }
                if (this.getGiftedItems().length > 0) {
                    output += this.renderGiftedItems();
                }
            } else {
                output += this.renderGiftedItems();
            }
            return output;
        },
        renderNonGiftedItems: function() {
            return Mustache.render(this.shipmentItemsTemplate, {products: this.getNonGiftedItems()});
        },
        renderGiftedItems: function() {
            var output = "";
            if (!this.isGifted) {
                output = Mustache.render(this.giftedItemsIndividualTemplate, {
                    shippingGroupId: this.shipGroupId,
                    items: this.getGiftedItems()
                });
            } else {
                output = Mustache.render(this.giftedItemsTogetherTemplate, {
                    items: this.getAllItems(),
                    boxType: this.boxType,
                    giftBox: this.giftBox,
                    description: this.description,
                    price: this.giftBoxPrice,
                    giftMessage: this.truncateGiftMessage(this.giftMessage),
                    giftTo: this.giftedTo,
                    giftFrom: this.giftedFrom,
                    giftId: this.shipGroupId
                });
            }
            return output;
        },
        truncateGiftMessage: function(message) {
            var GIFTMESSAGE_MAX_LENGTH = 18;
            if (message.length > GIFTMESSAGE_MAX_LENGTH) {
                return $.trim(message.substring(0, GIFTMESSAGE_MAX_LENGTH)) + '...';
            }
            return message;
        }
    });
    CTUI.CartItemCollection = CTUI.Collection.extend({
        init: function(items) {
            this._array = [];
            if (items && items.length > 0) {
                this.initialItems = items;
                var splitItems = this.qtySplit(items);
                this.process(splitItems);
            }
        },
        process: function(items) {
            var self = this;
            $.each(items, function(index, item) {
                self.push(new CTUI.CartItem(item));
            });
        },
        qtySplit: function(items) {
            var splitItems = [];
            var self = this;
            $.each(items, function(index, item) {
                if (item.qty == 1) {
                    var data = self.cloneItem(item);
                    data.index = 0;
                    data.qtyIndex = 0;
                    splitItems.push(data);
                } else {
                    for (var i = 0; i < item.qty; i++) {
                        var data = self.cloneItem(item);
                        data.qty = 1;
                        data.qtyIndex = i;
                        data.index = i;
                        splitItems.push(data);
                    };
                }
            });
            return splitItems;
        },
        pushClone: function(item) {
            this.push(this.cloneItem(item));
        },
        addGiftOptions: function(itemGiftOptions) {
            var self = this;
            $.each(this._array, function(index, item) {
                self.addGiftOption(itemGiftOptions, item);
            });
        },
        addGiftOption: function(itemGiftOptions, item) {
            if (typeof itemGiftOptions != "undefined") {
                if (typeof itemGiftOptions[item.itemId] != "undefined") {
                    var optionsArray = itemGiftOptions[item.itemId];
                    $.each(optionsArray, function(oIndex, option){
                        if (option.shippingGroupId === item.shippingGroupId &&
                            !option.hasItem) {
                            option.hasItem = true;
                            item.itemGiftOptionIndex = option.itemGiftOptionIndex;
                            item.isGifted = true;
                            item.giftedTo = option.giftedTo;
                            item.giftedFrom = option.giftedFrom;
                            item.giftMessage = option.giftMessage;
                            item.giftBoxPrice = option.giftBoxPrice;
                            item.boxType = option.giftBoxSkuId;
                            item.giftBoxName = option.giftBoxName;
                            return false;
                        }
                    });
                }
            }
        }
    });
    CTUI.MiniCartItemCollection = CTUI.Collection.extend({
        init: function(cartData) {
            this._array = [];
            var self = this;
            var items = cartData.items;
            var shipments = cartData.shipments;
            $.each(items, function(i, item){
                item.giftQty = item.itemGiftOptions.length;
                if (!shipments && cartData.giftOption) {
                    shipments = [];
                    shipments.push(self.createAnonymousShipment(cartData.items));
                    shipments[0].shipItems = cartData.items;
                }
                if (shipments) {
                    $.each(shipments, function(j, shipment){
                        if (typeof shipment.giftOption != "undefined") {
                            $.each(shipment.shipItems, function(k, shipItem){
                                if (item.itemId == shipItem.itemId) {
                                    item.giftQty += parseInt(shipItem.qty);
                                }
                            });
                        }
                    });
                }
                self.push(item);
            });
        }
    });
    CTUI.CheckoutShipments = CTUI.Collection.extend({
        init: function(shipments) {
            this._array = shipments;
        },
        render: function() {
            var self = this;
            var output = "";
            if (this._array.length > 0 ) {
                if (typeof this._array[0].isAnonymous == "undefined") {
                    $.each(this._array, function(index, shipment) {
                        var template = $($('#co-shipping-review-template').html()).clone();
                        output += shipment.render(template);
                    });
                    $('#co-shipping').find('#co-shipping-options').html(output);
                } else {
                    $('#co-shipping-content').show();
                    $('#co-shipping').find('#co-shipping-gift-options .co-shipping-gift-options-inner').hide();
                    $('.co-gift-options-promoslot').show();
                    $('#co-shipping').find('.view-gift-options').removeClass('gift-button-hide');
                    if (this._array[0].isGifted || this._array[0].getGiftedItems().length > 0) {
                        output += this._array[0].renderGiftedItems();
                        $('.co-gift-options-promoslot').hide();
                        $('#co-shipping').find('#co-shipping-gift-options .co-shipping-gift-options-inner').show().html(output);
                        if (this._array[0].isGifted || this._array[0].allItemsGifted()) {
                            $('#co-shipping').find('.view-gift-options').addClass('gift-button-hide');
                            $('#co-shipping').find('.gift-more-items').addClass('gift-button-hide');
                        }
                    }
                }
                this.bind();
            }
        },
        setGiftOptionsIndexes: function(){
            var self = this;
            _cto.highestOptions = {};
            var definedIndexes = [];
            var undefinedIndexes = [];
            if (this._array) {
                $.each(this._array, function(sindex, shipment){
                    $.each(shipment.items.getAll(), function(index, item){
                        if (typeof item.itemGiftOptionIndex != 'undefined') {
                            definedIndexes.push(item);
                        } else {
                            undefinedIndexes.push(item);
                        }
                    });
                });
                $.each(definedIndexes, function(index, item) {
                    self.setHighest(item);
                });
                $.each(undefinedIndexes, function(index, item) {
                    self.setHighest(item);
                });
            }
        },
        setHighest: function(item) {
            if (typeof item.itemGiftOptionIndex != 'undefined') {
                var numericIndex = parseInt(item.itemGiftOptionIndex);
                if (typeof _cto.highestOptions[item.itemId] != 'undefined'){
                    var highestOption = _cto.highestOptions[item.itemId];
                    if (numericIndex > highestOption) {
                        _cto.highestOptions[item.itemId] = numericIndex;
                    }
                } else {
                    _cto.highestOptions[item.itemId] = numericIndex;
                }
            } else {
                if (typeof _cto.highestOptions[item.itemId] != 'undefined') {
                    var nextHighest = _cto.highestOptions[item.itemId] + 1;
                    item.itemGiftOptionIndex = nextHighest;
                    _cto.highestOptions[item.itemId] = nextHighest;
                } else {
                    item.itemGiftOptionIndex = 0;
                    _cto.highestOptions[item.itemId] = 0;
                }
            }
        },
        bind: function() {
            $('.gift-edit').unbind('click').bind("click", function(event){
                var currentTarget = $(event.currentTarget);
                return false;
            });
            $('.gift-remove').unbind('click').bind("click", function(event){
                var currentTarget = $(event.currentTarget);
                currentTarget.addClass('gift-remove-hide');
                var removeConfirm = currentTarget.parent().find('.gift-remove-confirm');
                removeConfirm.removeClass('gift-remove-hide');
                return false;
            });
            $('.gift-remove-confirm-yes').bind("click", function(event){
                var atgForm = new CTUI.AtgForm('#giftForm', '/atg/commerce/order/purchase/CartModifierFormHandler');
                var atgFormData = {};
                var itemUid = $(this).attr('data-uid');
                var sg = $(this).attr('data-sg');
                if (sg === 'guest') {
                    sg = '';
                }
                atgFormData.shippingGroupId = sg;
                atgFormData.itemQuantity = "";
                atgFormData.hasGiftMessage = "";
                atgFormData.giftedTo = "";
                atgFormData.giftedFrom = "";
                atgFormData.isGiftBox = "";
                atgFormData.giftMessage = "";
                atgFormData.giftBoxSkuId = "";
                atgFormData.hasGiftReceipt = "";
                if (typeof itemUid != "undefined") {
                    atgFormData.giftCommerceItems = itemUid;
                    if (_cto.cartCollection && _cto.cartCollection.shipments) {
                        $.each(_cto.cartCollection.shipments, function(index, shipment){
                            if (shipment.shipGroupId === sg) {
                                $.each(shipment.items.getAll(), function(iIndex, item){
                                    if (item.uid === itemUid && item.itemGiftOptionIndex) {
                                        atgFormData.giftCommerceItems = item.itemId + "_" + item.itemGiftOptionIndex;
                                        return false;
                                    }
                                });
                            }
                        });
                    }
                    atgFormData.removeGiftOptionFromCommerceItems = true;
                } else {
                    atgFormData.removeGiftOptionFromShippingGroup  = true;
                }
                atgForm.submit(atgFormData, function(data) {
                    $(window).trigger('updateCheckoutPage', data);
                });
                return false;
            });
            $('.gift-remove-confirm-no').bind("click", function(event){
                var currentTarget = $(event.currentTarget);
                var removeSpanTarget = currentTarget.parent().parent().find('.gift-remove');
                var removeConfirmSpanTarget = currentTarget.parent();
                removeSpanTarget.removeClass('gift-remove-hide');
                removeConfirmSpanTarget.addClass('gift-remove-hide');
                return false;
            });
        }
    });
    CTUI.ShippingMethod = Class.extend({
        init: function(shipMethod, shipmentGroup) {
            var data = {};
            this.shipmentGroup = shipmentGroup;
            if (shipMethod) {
                data = shipMethod;
            }
            this.type = data.type;
            this.amount = data.amount;
            this.eta = data.eta;
            this.signature = data.signature;
            this.selectorTemplate = '#co-ship-method-';
        },
        getAmount: function() {
            if (this.amount) {
                return ((this.amount == '0.0') || (this.amount == '0.00') || (this.amount == '$0.00')) ? 'FREE' : this.amount;
            }
            return;
        },
        render: function(element) {
            this.element = element;
            this.element.find(this.selectorTemplate + 'signature').html(this.signature);
            this.element.find(this.selectorTemplate + 'type').html(this.type);
            this.element.find(this.selectorTemplate + 'amount').html(this.getAmount());
            this.element.find(this.selectorTemplate + 'eta').html(this.eta);
        }
    });
    CTUI.AddressInfo = Class.extend({
        init: function(info, shipmentGroup) {
            this.shipmentGroup = shipmentGroup;
            this.update(info);
            this.selectorTemplate = '#co-shipping-review-';
        },
        update: function(info) {
            this.info = info;
            if (typeof info != "undefined") {
                for (var prop in info) {
                    this[prop] = info[prop];
                }
            }
        },
        getFields: function(){
            return{
                firstName: this.decodeHtml,
                lastName:  this.decodeHtml,
                address1: this.decodeHtml,
                address2: this.decodeHtml,
                city: this.htmlWithComma,
                state: this.html,
                zip: this.html,
                country: this.html,
                countryCode: this.val,
                phone: this.val
            }
        },
        html: function(fieldname) {
            this.element.find(this.selectorTemplate + fieldname).html(this[fieldname])
        },
        val: function(fieldname) {
            this.element.find(this.selectorTemplate + fieldname).val(this[fieldname])
        },
        decodeHtml: function(fieldname) {
            this.element.find(this.selectorTemplate + fieldname).html(_cto.heDecode(this[fieldname]));
        },
        htmlWithComma: function(fieldname) {
            this.element.find(this.selectorTemplate + fieldname).html(this[fieldname] + $('<span id="co-comma">,&nbsp;</span>').html());
        },
        doubleDecode: function(value) {
            return _cto.heDecode(_cto.heDecode(value));
        },
        render: function(element){
            if (typeof this.info != "undefined") {
                this.element = element;
                var self = this;
                $.each(this.getFields(), function(i, val){
                    val.call(self, i);
                });
                if(this.countryCode === 'USA' || this.countryCode === 'CAN') {
                    this.element.find(this.selectorTemplate + 'phoneFormatted').html(this.phoneFormatted);
                } else {
                    this.element.find(this.selectorTemplate + 'phoneFormatted').html(this.phone);
                }
                this.element.find('.co-shipping-review-title-firstname').text(this.doubleDecode(this.firstName));
                this.element.find('.co-shipping-review-title-address1').text(this.doubleDecode(this.address1));
                var editShippingAddressLink = this.element.find('#modalEditShippingAddress');
                editShippingAddressLink.attr('href', editShippingAddressLink.attr('href') + '?shippingGroupId=' + this.shipmentGroup);
                var editShippingMethodLink = this.element.find('#modalEditShippingMethod');
                editShippingMethodLink.attr('href', editShippingMethodLink.attr('href') + '?shippingGroupId=' + this.shipmentGroup);
            }
        }
    });
    CTUI.Form = Class.extend({
        errorMessageSelector: '.gmui-form-error',
        errorMessages: [],
        init: function(formSelector) {
            this.formSelector = formSelector;
        },
        bind: function() {
            this.hideErrors();
        },
        showError: function(errorMessage) {
            $(this.errorMessageSelector+errorMessage).show();
        },
        hideErrors: function() {
            $(this.errorMessageSelector).hide();
        },
        process: function(scope, func, data) {
            if (typeof data === "undefined") {
                data = this.getFormData();
            }
            return func.call(scope, data);
        },
        getFormData: function() {
            return $(this.formSelector).serializeObject();
        },
        validate: function(scope, func) {
            this.hideErrors();
            this.data = this.getFormData();
            this.errors = func.call(scope, this.getFormData());
            if (typeof this.errors !== "undefined" && this.errors.length > 0) {
                for (var i = 0; i < this.errors.length; i++) {
                    this.showError(this.errors[i]);
                }
                return false;
            }
            return true;
        }
    });
    CTUI.AtgForm = CTUI.Form.extend({
        init: function(elementSelector, formHandler) {
            this.element = $(elementSelector);
            this.formHandler = formHandler;
            this.element.find('.atgFields').empty();
        },
        createFieldName: function(field) {
            return this.formHandler + '.' + field;
        },
        createPlaceHolderFieldName: function(field) {
            return "_D:" + this.createFieldName(field);
        },
        process: function(data) {
            var self = this;
            var processedData = {};
            $.each(data, function(key, value) {
                var fieldName = self.createFieldName(key);
                var placeHolderFieldName = self.createPlaceHolderFieldName(key);
                processedData[fieldName] = value;
                processedData[placeHolderFieldName] = " ";
            });
            return processedData;
        },
        checkForRedirect: function(data) {
            if(typeof data !== 'object') {
                if(/<\/head>/i.test(data)) {
                    _cto.clearSessionLaunchModal();
                    return true;
                }
            }
            return false;
        },
        errorAlert: function(status) {
            alert(_cto.Lang.global.general + ' (' + status + ')');
        },
        submit: function(data, successCallback, errorCallback) {
            var self = this;
            this.data = this.process(data);
            this.element.ajaxSubmit({
                data: this.data,
                dataType: 'json',
                success: function(data, status, xhr){
                    if (self.checkForRedirect()) {
                        return false;
                    }
                    if (successCallback) {
                        successCallback(data, status, xhr);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    self.errorAlert(textStatus);
                    if (errorCallback) {
                        errorCallback();
                    }
                }
            });
        }
    });
    CTUI.OrderConfirmation = Class.extend({
        init: function(shipments) {
            this.giftedItemsTogetherTemplate = $('#co-gifting-together-products-template').html();
            this.giftedItemsIndividualTemplate = $('#co-gifting-individually-product-template').html();
            this.shipmentItemsTemplate = $('#co-products-template').html();
            this.shipments = shipments;
        },
        renderShipments: function() {
            var self = this;
            $.each(this.shipments, function(i, shipment){
                var element = $('div [data-sg="' + shipment.shipGroupId + '"]').find('.shipment-gifting');
                self.renderShipment(element, shipment);
            });
        },
        renderShipment: function(element, shipment) {
            var output = "";
            if (!shipment.isGifted) {
                output += this.renderNonGifted(shipment);
                output += this.renderGiftedIndividual(shipment);
            } else {
                output += this.renderGiftedTogether(shipment);
            }
            element.html(output)
        },
        renderNonGifted: function(shipment) {
            var output = "";
            if (shipment.getNonGiftedItems().length > 0) {
                output += Mustache.render(this.shipmentItemsTemplate, {products: shipment.getNonGiftedItems()});
            }
            return output;
        },
        renderGiftedTogether: function(shipment) {
            var output = Mustache.render(this.giftedItemsTogetherTemplate, {
                items: shipment.getAllItems(),
                boxType: shipment.boxType,
                giftBox: shipment.giftBox,
                description: shipment.description,
                price: shipment.giftBoxPrice,
                giftMessage: shipment.truncateGiftMessage(shipment.giftMessage),
                giftTo: shipment.giftedTo,
                giftFrom: shipment.giftedFrom,
                giftId: shipment.shipGroupId
            });
            return output
        },
        renderGiftedIndividual: function(shipment) {
            var output = "";
            if (shipment.getGiftedItems().length > 0) {
                output = Mustache.render(this.giftedItemsIndividualTemplate, {
                    shippingGroupId: shipment.shipGroupId,
                    items: shipment.getGiftedItems()
                });
            }
            return output;
        }
    });
    CTUI.orderConfirmationStart = function() {
        if (window.orderConfirmation.shipments && window.orderConfirmation.items) {
            window.OrderConfirmtaionCart = new CTUI.Cart(
                window.orderConfirmation.shipments,
                window.orderConfirmation.items
            );
            var coc = new CTUI.OrderConfirmation(window.OrderConfirmtaionCart.shipments);
            coc.renderShipments();
        }
    };
    window.CTUI = CTUI;
})(jQuery);
$(window).bind('orderConfirmationReady', function() {
    window.CTUI.orderConfirmationStart();
});
if(typeof _cto == 'undefined') {
    _cto = initCto();
}
function initCto() {
    return new _ctoClass({
        repriceRequests: {
            asyncFormNames: {
                cartPage: ['qvFrmAddToBag','checkoutEditOrder','couponForm'],
                checkoutPage: ['qvFrmAddToBag','checkoutEditOrder','couponForm']
            },
            ajaxTaskParams: {
                cartPage: ['remPromo'],
                checkoutPage: ['remPromo','checkoutOnLoadCart']
            }
        },
        tealeaf: {
            enabled: false
        },
        sessionTimeout: {
            seconds: 1680
        },
        ajaxTimeout: {
            duration: 60000
        },
        scrollTop: {
            duration: 1000
        },
        OrderPage: {
            duration1: 300,
            duration2: 600
        }
    });
}
if(typeof _ctoTagging == 'undefined') {
    _ctoTagging = new _ctoTaggingClass({
        asyncFormNames: ['checkout2','frmAddToBag','qvFrmAddToBag','checkoutEditOrder']
    });
}
if(typeof _ctoMiniCart == 'undefined') {
    _ctoMiniCart = new _ctoMiniCartClass({
        timeOut: {
            duration1: 600,
            duration2: 3000
        },
        delayBeforeFlyIn: {
            duration: 450
        },
        errors: {
            duration: 600
        },
        items: {
            duration: 600
        },
        flyIn: {
            duration: 1000
        },
        flyOut: {
            duration: 1000
        }
    });
    _ctoMiniCartTriggers = new _ctoMiniCart.triggers();
    _ctoMiniCartTriggers = new _ctoMiniCart.triggers();
}
$(window).bind('updateCheckoutPage', function(event, data) {
    if (data && _cto.isCartOrCheckoutObject(data)) {
        _cto.stopChecks(data); 
        if (data.cart.bagCount == 0) {
            _cto.goHomeUnsecure();
        } else {
            $('#canvas').css('visibility', 'visible');
            _cto.initOrderPage(data);
            _ctoMiniCart.update(data);
            _cto.initPhoneNumberBoxes();
        }
    }
});
$(window).bind('cartInventoryCheck', function(event,onComplete) {
    var onComplete = (onComplete)?onComplete:function(){};
    if(!_cto.isOrderPage()){
        _cto.ajax({
            url: '/store/common/json/cart.jsp?isCartPage=-1',
            dataType: 'json',
            success: function(data) {
                if(_cto.isCartOrCheckoutObject(data)) {
                    if(data.bagCount > 0) {
                        _cto.updateCart(data,false);
                        onComplete();
                    }
                }
            }
        });
    }
});
if(_cto.isShopPage()){
    $('#persistent-cart #pc-btn-checkout').live('click',function(e){
        var _self = $(this);
        if(!_self.hasClass('auto-click')){
            e.preventDefault();
            $(window).trigger('cartInventoryCheck',[function(){
                if(_cto.statics.continueToCheckoutCheck){
                    _self.addClass('auto-click').click();
                }else{
                    window.location = '/store/checkout/cart.jsp?sourcePage=persistentCart';
                }
            }]);
        }
    })
}
function updatePageContent() {
    var scriptName = _cto.scriptName();
    var agentIE6 = ($.browser.msie && $.browser.version.substr(0, 1) < 7) ? true : false;
    var agentIpad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
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
        if(typeof s.pageName != 'undefined') {
            _cto.statics.pageName = s.pageName;
        }
    }, 1600);
    _cto.RequestHandler.readyForms();
    _cto.previouslyVisited();
    _cto.createLoginModal();
    if(_cto.scriptName() == 'account/login') {
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
        _cto.ajax({
            url: '/store/common/json/checkout.jsp?task=checkoutOnLoadCart',
            dataType: 'json',
            success: function(data) {
                console.log('TEST')
                console.log(data)
                if(_cto.isCartOrCheckoutObject(data)) {
                    _cto.stopChecks(data); 
                    if(data.cart.bagCount == 0) {
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
};
var createCCFormEl = 'form[name="frmCreateCreditCard"]';
var updateCCFormEl = 'form[name="frmUpdateCreditCard"]';
$("#co-billing-save-address,#co-billing-save-address2").live("click",function () {
    var form = $(this).closest("form"); 
    var shipAddress = _cto.checkoutShipments._array[0].shipAddress;
    if($(this).is(':checked')) {
        form.find(".billingForm").slideUp();
        form.find("#billingForm_fName").val(shipAddress.firstName);
        form.find("#billingForm_lName").val(shipAddress.lastName);
        form.find("#billingForm_add1").val(shipAddress.address1);
        form.find("#billingForm_add2").val(shipAddress.address2);
        form.find("#billingForm_country").val(shipAddress.countryCode);
        form.find("#billingForm_city_hidden").val(shipAddress.city);
        form.find("#billingForm_state_hidden").val(shipAddress.state);
        form.find("#billingForm_zip").val(shipAddress.zip);
        form.find("#billingForm_phone").val(shipAddress.phone);
    } else {
        form.find("#billingForm_fName").val('');
        form.find("#billingForm_lName").val('');
        form.find("#billingForm_add1").val('');
        form.find("#billingForm_add2").val('');
        form.find("#billingForm_country").val(userCountryCode);
        form.find("#billingForm_city_hidden").val('');
        form.find("#billingForm_state_hidden").val('');
        form.find("#billingForm_zip").val('');
        form.find("#billingForm_phone").val('');
        form.find(".billingForm").slideDown();
    }
    _cto.FormHandler.phoneNumberBoxes();
});
$(document).ready(function(){
    if($('body').hasClass('is-shopping-bag')) {
        $('input.claimCodeField[placeholder="Enter promo"]').attr('id', 'claimCodeField');
    }
    $(window).resize(function(){
        if(window.matchMedia("(max-device-width: 767px)").matches){
            $(".item-is-clearance .clearance-tooltip, .product-price-final .clearance-tooltip").removeClass("top").addClass("left");
        } else {
            $(".item-is-clearance .clearance-tooltip, .product-price-final .clearance-tooltip").removeClass("left").addClass("top");
        }
    }).resize();
    $('#gc-submit').click(function(){
        $('#zone-error2').html('');
    });
    $('#CheckoutPage #checkout-guest-sre').live('click', function(){
        _cto.closeModals();
        sr_$.payrunner.Controller.initializePayRunner();
        return false;
    });
    if($('#srEnabled').length > 0) {
        $('#checkout-login-sre').live('click',function() {
            loadCheckoutLoginForm();
        });
        $("form[name='loginSREForm']").live('keypress', function(e){
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