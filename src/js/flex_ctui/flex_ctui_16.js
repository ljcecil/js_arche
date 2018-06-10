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
                                    //The key is the field name in error
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
                //SCRUM: GWP Fix
                //triggerCartRefesh = true;
                document.checkout2.submit();
            }
        }

        this.removeLineItemReset = function(commId, hiddenRemoveId, tag) {
            $('#sb-item' + commId + ' .removeConfirmMsg').html('').addClass('hide');
        }
