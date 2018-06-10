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
            // all shopping related page parents
            var nonShopLocs = [
                'checkout',
                'account',
                'wish_list'
            ];
            // check if current location is a shopping related page
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
            // Check for product actions(legacy PDP) or form controls(current PDP)
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

        //Disable the checkout buttons if only products in cart are Sold out.  Fix for JSON error on checkout when only sold out items in cart
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
