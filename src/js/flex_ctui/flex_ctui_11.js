        //Flex: Get product onfo from labels
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
                            // if(!value) value=inseamArray[0];
                        } ;
                    }
                })
            }
            return value;
        }
        //SCRUM: Update for GWP fix
        triggerCartRefesh = false;
        this.updateCartComplete = function(callbackEventsObj){
            var cbObj = callbackEventsObj || '';
            //Initiate callback event functions.
            if(cbObj){
                for (var prop in cbObj) {
                    if(cbObj[prop] instanceof Function){
                        cbObj[prop]();
                    }
                }
            }

            /*if(triggerCartRefesh){
             triggerCartRefesh = false;
             setTimeout(function(){
             document.checkout.submit();
             },1100);
             }*/

        }

        //Check item inventory based on @itemNotAvailable
        this.inventoryCheck = function(data,isSoldOutOnly){
            if(!data) return;
            var isSoldOutOnly =  isSoldOutOnly || '';
            var inventoryAlerts = false;
            var inventoryErrorType = '';
            var inventoryErrorItems = [];
            //var itemShortInvAlert;

            $.each(data.items, function(index, item) {
                // item level error message
                if(this.itemNotAvailable) {
                    inventoryErrorItems.push(item);
                }
            });

            if(inventoryErrorItems.length){
                inventoryAlerts = {};
                if(data.items.length == inventoryErrorItems.length){
                    //All items are sold out
                    inventoryErrorType = 'soldOut'
                }else{
                    //Some items are sold out
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
            // cart level errors
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
            // promo errors
            $('#sb-promo-errors .sb-error-message').remove();
            $.each(data.formErrors.coupon, function() {
                $('<div class="sb-error-message text-alert" style="display: none;">' + _cto.heDecode(this.message) + '</div>').appendTo('#sb-promo-errors').fasToggle();
            });

            // empty cart
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

            // items
            var curItems = [];
            $('.sb-product').each(function() {
                curItems.push($(this).attr('id').split('sb-item')[1]);
            });

            // remove current item errors from view before we begin item iterations
            $('.sb-product .sb-error-message').remove();

            // store returned item ids in array
            var retItems = [];
            $.each(data.items, function(index, item) {
                retItems.push(this.itemId);
            });

            // store removed item ids in array
            var remItems = [];
            $(curItems).each(function(index, item) {
                if($.inArray(item, retItems) == -1) {
                    remItems.push(item);
                }
            });

            // iterate through cart items
            var itemsHtml = '';
            var newItems = [];
            var itemInventoryError;
            var itemShortInvAlert;
            var itemMergedAlert;
            _cto.statics.cartContainsInventoryError = false;
            _cto.statics.cartItemAvailableCount = _cto.statics.cartItemNotAvailableCount = 0;
            // Country code added to display ineligible div only for USA and USA-MIL countries
            var countryCode;
            if(siteObj.orderInfo != undefined) {
                countryCode = siteObj.orderInfo.countryCode;
            }
            // Associate status added to hide SR ineligible div for Associate users. 
            var associate;
            if(siteObj.shopRunner != undefined) {
                associate = siteObj.shopRunner.associateProfile !== '' ? siteObj.shopRunner.associateProfile : false;
            }

            $.each(data.items, function(index, item) {

                // clear inventory related errors
                itemInventoryError = '';
                itemShortInvAlert  = '';
                itemMergedAlert = '';

                // apply free label
                this.unitItemPrice = (this.unitItemPrice == '$0.00') ? 'FREE' : this.unitItemPrice;
                this.rawItemPrice = (this.rawItemPrice == '$0.00') ? 'FREE' : this.rawItemPrice;
                this.finalItemPrice = (this.finalItemPrice == '$0.00') ? 'FREE' : this.finalItemPrice;

                // don't display raw price if it's the same as the final price
                var rawItemPrice = (this.rawItemPrice == this.finalItemPrice) ? '' : this.rawItemPrice;

                //Track product Items only (disregard GWP / Moneycard)
                _cto.statics.cartItemAvailableCount++;

                // modify item price
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

                // modify quantity

                var qty = this.qty;
                $('#' + this.itemId + ' option').each(function() {
                    if($(this).val() == qty) {
                        if(jQuery(this).parent().hasClass('.selectpicker')){
                            jQuery(this).parent().selectpicker('val',qty)
                        }

                        //jQuery(this).attr('selected', 'selected');
                    } else {
                        jQuery(this).removeAttr('selected');
                    }
                });

                // item level error message
                if(this.itemNotAvailable) {
                    itemInventoryError = '<div class="sb-error-message text-alert">' + _cto.Lang.itemLevel.inventoryError + '</div>';
                    $(itemInventoryError).prependTo('#sb-item' + this.itemId + ' .sb-modify');
                    _cto.statics.cartItemNotAvailableCount++;
                    if(!_cto.statics.cartContainsInventoryError) _cto.statics.cartContainsInventoryError = true;
                }

                // item level alert - short on inventory
                if(this.shortInvAlert) {
                    itemShortInvAlert = '<div class="sb-error-message  text-alert">' + this.shortInvAlert + '</div>';
                    $(itemShortInvAlert).prependTo('#sb-item' + this.itemId + ' .sb-modify');
                    if(!_cto.statics.cartContainsInventoryError) _cto.statics.cartContainsInventoryError = true;
                }

                // item level alert - items merged
                if(this.isItemMerged == 'true') {
                    itemMergedAlert = '<div class="sb-error-message  text-alert">' + this.itemMergedMessage + '</div>';
                    $(itemMergedAlert).prependTo('#sb-item' + this.itemId + ' .sb-modify');
                    if(!_cto.statics.cartContainsInventoryError) _cto.statics.cartContainsInventoryError = true;
                }