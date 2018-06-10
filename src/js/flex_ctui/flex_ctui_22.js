    /**
     * Wrapper for an array fo cart items. Splits items quantity.
     */
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
        /**
         * Create new items based on item quantity.
         * @param items  array of raw cart items
         * @returns {Array}  cart items split on quantity
         */
        qtySplit: function(items) {
            var splitItems = [];
            var self = this;
            $.each(items, function(index, item) {
                if (item.qty == 1) {
                    // then create the var
                    var data = self.cloneItem(item);
                    data.index = 0;
                    data.qtyIndex = 0;
                    splitItems.push(data);
                } else {
                    // for greater qtys, create an item for each
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
        /**
         * Clones item and adds it to the collection.
         *
         * @param item
         */
        pushClone: function(item) {
            this.push(this.cloneItem(item));
        },
        /**
         * Adds gift options to the items of the collection.
         *
         * @param itemGiftOptions
         */
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
                        // Find the option with an index that
                        // matches the index of the item.
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
                // Check for guest checkout.
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

    /**
     * Wrapper for Shipments array. Used for rendering/binding.
     */
    CTUI.CheckoutShipments = CTUI.Collection.extend({
        /**
         * @param shipments  array of CTUI.Shipments.
         */
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
                    // If Anonymous shipment use different rendering.
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
                    // Assume item level gifting is itemUid is found.
                    atgFormData.giftCommerceItems = itemUid;
                    // Look up the backend uid if needed.
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
                    // Assume shipment level gifting is itemUid is not found.
                    atgFormData.removeGiftOptionFromShippingGroup  = true;
                }
                atgForm.submit(atgFormData, function(data) {
                    $(window).trigger('updateCheckoutPage', data);
                });
                return false;
            });
            // Hide the remove confirm text when 'no' is clicked.
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

    /**
     * Shipping Method Object.
     * This contains a lot of legacy functionality.
     * @type {*}
     */
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
                //return (this.amount == '0.0') ? 'FREE' : '$' + fasMoneyAbs(this.amount);
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

    /**
     * AddressInfo Object.
     * This contains a lot of legacy functionality.
     */
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
                // Use country code specific phone number
                // TODO: This should be updated to be more extensible.
                if(this.countryCode === 'USA' || this.countryCode === 'CAN') {
                    this.element.find(this.selectorTemplate + 'phoneFormatted').html(this.phoneFormatted);
                } else {
                    this.element.find(this.selectorTemplate + 'phoneFormatted').html(this.phone);
                }
                this.element.find('.co-shipping-review-title-firstname').text(this.doubleDecode(this.firstName));
                this.element.find('.co-shipping-review-title-address1').text(this.doubleDecode(this.address1));
                var editShippingAddressLink = this.element.find('#modalEditShippingAddress');
                // add shipment group id
                editShippingAddressLink.attr('href', editShippingAddressLink.attr('href') + '?shippingGroupId=' + this.shipmentGroup);
                var editShippingMethodLink = this.element.find('#modalEditShippingMethod');
                editShippingMethodLink.attr('href', editShippingMethodLink.attr('href') + '?shippingGroupId=' + this.shipmentGroup);
            }
        }
    });

    /**
     * Form definition and validation.
     *
     */
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

    /**
     * ATG form submitting.
     *  - Used to asynchronously fetch and asynchronously submit an
     *    ATG form.
     */
    CTUI.AtgForm = CTUI.Form.extend({
        init: function(elementSelector, formHandler) {
            this.element = $(elementSelector);
            this.formHandler = formHandler;
            this.element.find('.atgFields').empty();
        },
        /**
         * Creates ATG formhandler field.
         * @param field
         * @returns {string}
         */
        createFieldName: function(field) {
            return this.formHandler + '.' + field;
        },
        /**
         * Creates ATG placeholder fields(_D:...)
         * @param field
         * @returns {string}
         */
        createPlaceHolderFieldName: function(field) {
            return "_D:" + this.createFieldName(field);
        },
        /**
         * Convert `data` to ATG fields using the formhandler property.
         * @param data
         * @returns {{}}. ATG fields
         */
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
        /**
         * Reusable method to check for redirects when the session times out.
         * Taken from CTUI standard.
         * @param data  String
         * @returns boolean  true if has redirect.
         */
        checkForRedirect: function(data) {
            if(typeof data !== 'object') {
                if(/<\/head>/i.test(data)) {
                    _cto.clearSessionLaunchModal();
                    return true;
                }
            }
            return false;
        },
        /**
         * Reusable method for when there is a async error.
         * Taken from CTUI standard.
         * @param status  HTTP status code.
         */
        errorAlert: function(status) {
            alert(_cto.Lang.global.general + ' (' + status + ')');
        },
        /**
         * Submits an ATG Form asynchronously.
         * @param data  Form data used to be submitted.
         * @param successCallback
         * @param errorCallback
         */
        submit: function(data, successCallback, errorCallback) {
            var self = this;
            this.data = this.process(data);
            this.element.ajaxSubmit({
                data: this.data,
                dataType: 'json',
                success: function(data, status, xhr){
                    // Check to see if user was redirected.
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
