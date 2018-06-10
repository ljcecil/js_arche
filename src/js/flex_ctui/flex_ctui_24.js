/**
 * FLX-3175: Bind for checking inventory on checkout button click and redirect if all items in cart have 0 inventory (sold out).
 */
//Check cart inventory event
$(window).bind('cartInventoryCheck', function(event,onComplete) {
    var onComplete = (onComplete)?onComplete:function(){};
    if(!_cto.isOrderPage()){
        _cto.ajax({
            url: '/store/common/json/cart.jsp?isCartPage=-1',
            dataType: 'json',
            success: function(data) {
                if(_cto.isCartOrCheckoutObject(data)) {
                    if(data.bagCount > 0) {
                        // redirect to shopping bag
                        //_cto.goHomeUnsecure()
                        _cto.updateCart(data,false);
                        onComplete();
                    }
                }
            }
        });
    }
});

//Persistent Cart Checkout Bind for shopPagesOnly (_cto.isShopPage()) to check products availablilty before going to checkout.  If all products in the cart are
//unavaliable, the user will get redirected to the shopping cart instead og checkout login.
if(_cto.isShopPage()){
    $('#persistent-cart #pc-btn-checkout').live('click',function(e){
        var _self = $(this);
        if(!_self.hasClass('auto-click')){
            e.preventDefault();
            //check cart to validate if cart can proceed to checkout
            $(window).trigger('cartInventoryCheck',[function(){
                if(_cto.statics.continueToCheckoutCheck){
                    //Proceed to checkout as normal.
                    _self.addClass('auto-click').click();
                }else{
                    //Redirect to Chopping bag
                    window.location = '/store/checkout/cart.jsp?sourcePage=persistentCart';
                }
            }]);
        }
    })
}

//@@ remove this!!!!!!!!!!!!!!!!!
function updatePageContent() {

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
        // populate page with latest cart+checkout object
        _cto.ajax({
            url: '/store/common/json/checkout.jsp?task=checkoutOnLoadCart',
            dataType: 'json',
            success: function(data) {
                console.log('TEST')
                console.log(data)
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
    var form = $(this).closest("form"); // IDs on the page aren't unique, forcing a form check.
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
