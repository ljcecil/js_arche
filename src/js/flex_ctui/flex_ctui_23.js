/**
 * Wrapper to create cto class with default configuration.
 * @returns {_ctoClass}
 */
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

    //Add triggers elem
    _ctoMiniCartTriggers = new _ctoMiniCart.triggers();

    //Add triggers elem
    _ctoMiniCartTriggers = new _ctoMiniCart.triggers();
}

/**
 * Bind for updating the data for the checkout page.
 */
$(window).bind('updateCheckoutPage', function(event, data) {
    if (data && _cto.isCartOrCheckoutObject(data)) {
        // The rest was taken from ctui.
        _cto.stopChecks(data); // validate the user can continue
        if (data.cart.bagCount == 0) {
            // redirect to shopping bag
            // Go home shopping bag, your empty.
            _cto.goHomeUnsecure();
        } else {
            $('#canvas').css('visibility', 'visible');
            _cto.initOrderPage(data);
            // TODO: Find a better solution for this, as it builds the minicart twice.
            _ctoMiniCart.update(data);
            _cto.initPhoneNumberBoxes();
        }
    }
});

