                // insert item if new
                $('.sb-product').removeClass('sb-is-first');
                if($.inArray(this.itemId, curItems) == -1) {

                    // conditional html item variables
                    var gwpImage = (this.gwp == 'true') ? '<div class="sb-gwp">Free Gift</div>' : '';

                    // create quantity html and select the corresponding option
                    var qtySel = '';
                    for(i=1;i<=20;i++) {
                        if(this.qty == i) {
                            qtySel += '<option value="' + i + '" selected>' + i + '</option>';
                        } else {
                            qtySel += '<option value="' + i + '">' + i + '</option>';
                        }
                    }

                    // push to certona array
                    prodList.push(this.tagStyleId + ',');

                    // new item html template
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
                        //SCRUM: Temporary fix for GWP price update issue, set value=2
                        var hiddenValue = 1;
                        var gwpId = ''
                        if(this.gwp == 'true' && this.rawItemPrice == 'FREE'){
                            gwpId = 'gwpMoneyCard';
                        }else if(this.gwp == 'true' && this.rawItemPrice != '$0.00'){
                            hiddenValue = 0;
                            gwpId = 'gwpProduct';
                        }
                        row += '<input class="'+gwpId+'" type="hidden" value="'+hiddenValue+'" size="4" name="' + this.itemId + '">';
                        //row += '<input type="hidden" value="1" size="4" name="' + this.itemId + '">';
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
                    // If item is clearance, show message
                    if(item.clearanceMsg){
                        row += '<div class="sb-clearance-message hidden-md hidden-lg">';
                        row += item.clearanceMsg;
                        row += ' <div class="clearance-tooltip"><a href="javascript://" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Merchandise marked &quot;FINAL SALE&quot; is sold &quot;as is&quot; and may not be returned or exchanged and is not eligible for price adjustment. Merchandise prices ending in .98 indicate final sale."><i class="fa fa-question-circle fa-lg" role="presentation"></i></a></div></div>';
                    }
                    if (this.backOrderFlag) {
                        //row += '<dt class="sb-label"></dt>';
                        row += '<div class="sb-value col-sm-12 hidden-md hidden-lg">' + this.expectedShipDate + '</div>';
                    }
                    // If item is final sale, show message
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
                    //row += '<dt class="sb-label">Item Price:</dt>';
                    //row += '<dd class="sb-price">' + this.unitItemPrice + '</dd>';
                    //row += '<dt class="sb-label">Total Price:</dt>';
                    //row += '<dd class="sb-total">';
                    row += '</dd>';
                    // If item is clearance, show message
                    if(item.clearanceMsg){
                        row += '<div class="sb-clearance-message hidden-xs hidden-sm">';
                        row += item.clearanceMsg;
                        row += ' <div class="clearance-tooltip"><a href="javascript://" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Merchandise marked &quot;FINAL SALE&quot; is sold &quot;as is&quot; and may not be returned or exchanged and is not eligible for price adjustment. Merchandise prices ending in .98 indicate final sale."><i class="fa fa-question-circle fa-lg" role="presentation"></i></a></div></div>';
                    }
                    row += '</dl>';

                    row += '</div>';
                    row +='</div>';
                    if (this.backOrderFlag) {
                        //row += '<dt class="sb-label"></dt>';
                        row += '<div class="sb-value col-sm-5 hidden-xs hidden-sm">' + this.expectedShipDate + '</div>';
                    }
                    // If item is final sale, show message
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


                    // append to string buffer
                    itemsHtml += row;

                    // add item to array so we can toggle it later
                    newItems.push(this.itemId);

                }else{
                    //Update Item Qty
                    if(this.qty == 1 || $('select#'+this.itemId).val() != this.qty ){
                        jQuery('select#'+this.itemId).selectpicker('val',this.qty)
                        $('select#'+this.itemId).val(this.qty);

                        //ADd qtyUpdate callback event. This event will trigger when  _cto.updateCartComplete(callbackEvents) is called;
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

            //Show Hide Cart Checkout buttons based on inventory check
            if(_cto.statics.isCartPage) {
                if(_cto.inventoryCheck(data,true)){
                        $('.bag-button').hide();
                }else{
                    $('.bag-button').show();
                }
            }

            // certona tagging
            if(typeof certonaCHObject == 'object' && typeof certona_host != 'undefined') {
                window.setTimeout(function(){
                    certonaCHObject.initAndRunWithRecommendation(prodList,customerId,null,null,"shopping+cart",certona_host,prodList,null,null,certonaPageId);
                }, 2500);
            }
