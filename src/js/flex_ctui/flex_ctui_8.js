        this.createCheckoutModals = function() {
            // edit checkout option modal
            var self = this;
            this.checkoutModalGuid = Math.floor(Math.random() * 100000000);
            $('<div class="modalWindow" id="modalCheckoutOption'+ this.checkoutModalGuid +'"><table border="0" cellspacing="0" cellpadding="0"><tr class="modalControls"><td class="modalCaption"></td><td align="right"><a class="modalClose"></a></td></tr><tr><td colspan="2"><div class="coModalContent loading"></div></td></tr></table></div>').appendTo('body');
            // Unbind the links and remove the jqm metadata.
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

            // edit checkout option modal LOCKED
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
