            // add hidden item to view
            $('#sb-items .sb-cart-unavailable-promo').after(itemsHtml);

            // closeness qualifier
            if(data.closenessQualifierMsgs) {
                $('#pc-close-qualif').html(data.closenessQualifierMsgs);
            } else {
                $('#pc-close-qualif').html('');
            }

            // remove items that no longer exist
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
                // add items that are new
                //Initialize Select Picker
                jQuery('.is-shopping-bag .selectpicker').selectpicker();
            } else {
                $(newItems).each(function(index, item) {
                    $('#sb-item' + item).fasToggle(function() {
                        $('#sb-item' + item).removeAttr('style');
                    });
                });

                //Initialize Select Picker
                jQuery('.is-shopping-bag .selectpicker').selectpicker();
            }

            // bag count
            _cto.updateBagCount(data.bagCount, _cto.statics.cartContainsInventoryError);

            //check cart to validate if cart can proceed to checkout
            _cto.statics.continueToCheckoutCheck = _cto.continueToCheckoutCheck();

            // merge unclaimed coupons into discounts object
            $.merge(data.promoDiscounts, data.conditionalMessages);

            // claimed coupons
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
                    if(this.message) { // is unclaimed
                        this.discountMessage = this.message;
                        this.discountAmount = '';
                        this.isClaimed = false;
                    } else { // is claimed
                        this.isClaimed = true;
                    }
                    if(this.isClaimed == false && $('#sb-discounts-pending').length < 1) {
                        $('<div id="sb-discounts-pending" class="row"></div>').insertBefore('#sb-promo-errors');
                    }

                    //Promo Templates
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


                    //Default Template
                    var use_promo = { template: promo_qualify_template, parent:'#sb-discounts'};

                    //Load Non-Qualifing Template
                    if(!this.isClaimed){use_promo.template = promo_non_qualify_template; use_promo.parent = '#sb-discounts-pending';}
                    var couponCleanId = String(this.couponId).replace('promo','');
                    $('<div id="promo' + couponCleanId + '" class="sb-discount sb-promo-is-' + this.type + ((this.isClaimed == false) ? ' sb-error-message text-alert' : '') + '" style="display: none;">'+use_promo.template+'</div>').appendTo(use_promo.parent);

                    newClaimed.push(couponCleanId);
                }
            });

            // toggle removed coupons from view
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
                // toggle new copons into view
            } else {
                $(newClaimed).each(function(index, couponId) {
                    $('#promo' + couponId).fasToggle();
                });
            }


            // totals
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

            //CR-715 | LJC | Total amount in shopping bag includes tax when customer is signed-in
            //Subtract sales tax from subtotal
            if(data.itemsTotalNoShipping) $('#sb-sum-total .sb-price').html(data.discountedSubtotalLessSalesTax);



            // update mbox in shopping bag
            if(!_cto.isOrderPage()) {
                if(!suppressMbox) {
                    _cto.updateMbox(data);
                }
            }

            //Callback
            $(window).trigger("fas.pcart.products.complete");
            _cto.updateCartComplete(callbackEvents);
        }

        this.stopChecks = function(data) {
            if(data.checkout) {
                setTimeout(function() {
                    // set flag for freeze order disables commit button
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
                    // trigger locked modal if hazmat error true and no form errors
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
