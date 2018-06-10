    var CTUI = {};

    /**
     * Base class for wrapped arrays.
     */
    CTUI.Collection = Class.extend({
        _array: [],
        /**
         * Add cart item to collection.
         * @param item
         */
        push: function(item) {
            this._array.push(item);
        },
        reset: function() {
            this._array = [];
        },
        getAll: function() {
            return this._array;
        },
        /**
         * Create another instance of the item.
         * @param item  to be cloned
         * @returns {object}  cloned item
         */
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
            // TODO: it would be better to not use global data here
            if (window.cartData.giftOption) {
                shipment.giftOption = window.cartData.giftOption;
            } else {
                delete shipment.giftOption;
            }
            //shipment.shipAddress = {};
            //shipment.shipMethod = {};
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
        /**
         * Convert the JSON data to a data structure used for the application.
         * This is the heavy lifting.
         * @param shipments  shipments from cart json data.
         * @param items  items from cart json data.
         */
        process: function(shipments, items) {
            var self = this;
            if (typeof shipments != "undefined") {
                // Loop shipments
                $.each(shipments, function(sIndex, ship){
                    var shipment = self.cloneItem(ship);
                    shipment.items = [];
                    shipment.index = sIndex;
                    shipment.itemGiftOptions = {};
                    // Loop each shipItems
                    $.each(shipment.shipItems, function(sItemIndex, shipmentItem){
                        $.each(items, function(iIndex, item) {
                            var data = self.cloneItem(item);
                            if (data.itemId === shipmentItem.itemId) {
                                data.qty = shipmentItem.qty;
                                data.shippingGroupId = shipment.shipGroupId;
                                $.each(data.itemGiftOptions, function(index, option){
                                    var optionData = self.cloneItem(option);
                                    //console.log(optionData.shippingGroupId + "===" + shipment.shipGroupId);
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
                    // TODO: insert address creation here.
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
        /**
         * Creates and add Shipment object to array.
         * @param shipment
         */
        addShipment: function(shipment) {
            this.shipments.push(new CTUI.Shipment(shipment));
        },
        /**
         * Return the shipment that matches shipmentGroupId.
         * @param shipmentGroupId
         * @returns {CTUI.Shipment}
         */
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

    /**
     * Wrapper for cart data.
     */
    CTUI.CartItem = Class.extend({
        IMAGE_PREFIX_REPLACE: "_shelf2",
        SMALL_IMAGE_PREFIX: "_thumb2",
        GCARD_IMAGE_PREFIX: "_thumb",
        LARGE_IMAGE_PREFIX: "",
        init: function(data) {
            this.update(data);
        },
        /**
         * Create a unique id for item.
         * @param index  int from loop
         * @param cid  commerce item id
         * @returns {string} unique id
         */
        generateUid: function(index, cid) {
            return cid + "_" + index;
        },
        getImage: function(){
            if (typeof this.image === "undefined") {
                throw "Product Missing Image";
            }
            return this.image;
        },
        /**
         * Creates small image url.
         * @returns {XML|string|void}
         */
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
            // TODO: can this be removed?
            if (this.itemGiftOptions) {
                //this.processGiftOptions(this.giftIndex, this.itemGiftOptions);
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

    /**
     * Wrapper for Shipment data with render methods.
     */
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
            // TODO: Create help button toggle method
            // Hide buttons based on amount of items left to gift.
            if (this.moreItemsAvailableToGift()) {
                element.find('.view-gift-options').addClass('gift-button-hide');
                element.find('.gift-more-items').removeClass('gift-button-hide');
            } else {
                element.find('.view-gift-options').removeClass('gift-button-hide');
                element.find('.gift-more-items').addClass('gift-button-hide');
            }
            // Hide both buttons if gifted at shipping group or all items gifted.
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
        /**
         * Compares gifted items to total items.
         * @returns {boolean}
         */
        moreItemsAvailableToGift: function() {
            if (this.getGiftedItems().length > 0 &&
                this.getAllItems().length > this.getGiftedItems().length) {
                return true;
            }
            return false;
        },
        /**
         * Render the items in the shipment. Not need in multiship but can be
         * hidden with CSS.
         * @returns {string}
         */
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
