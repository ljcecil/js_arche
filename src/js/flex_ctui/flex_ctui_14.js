        /**
         * Clear shipping info.
         */
        this.clearShipInfo = function(){
            var htmlSelectors = [
                '#co-shipping-review-firstName',
                '#co-shipping-review-lastName',
                '#co-shipping-review-address1',
                '#co-shipping-review-address2',
                '#co-shipping-review-city',
                '#co-shipping-review-state',
                '#co-shipping-review-zip',
                '#co-shipping-review-country',
                '#co-shipping-review-phoneFormatted',
            ];
            var valSelectors = [
                '#co-shipping-review-countryCode',
                '#co-shipping-review-phone'
            ];
            $(htmlSelectors).each(function() {
                $(this).html('');
            });
            $(valSelectors).each(function() {
                $(this).val('');
            });
        };

        /**
         * Insert shipping info into page.
         *
         */
        this.renderShipInfo = function(shipInfo) {
            var createCCFormEl = 'form[name="frmCreateCreditCard"]';


            // insert comma after city
            if($('#co-shipping-review-city').next('#co-comma').length == 0)
                $('<span id="co-comma">,&nbsp;</span>').insertAfter('#co-shipping-review-city');
            // begin injecting data
            $('#co-shipping-review-firstName').html(_cto.heDecode(shipInfo.firstName));
            $('#co-shipping-review-lastName').html(_cto.heDecode(shipInfo.lastName));
            $('#co-shipping-review-address1').html(_cto.heDecode(shipInfo.address1));
            $('#co-shipping-review-address2').html(_cto.heDecode(shipInfo.address2));
            $('#co-shipping-review-city').html(shipInfo.city);
            $('#co-shipping-review-state').html(shipInfo.state);
            $('#co-shipping-review-zip').html(shipInfo.zip);
            $('#co-shipping-review-country').html(shipInfo.country);
            $('#co-shipping-review-countryCode').val(shipInfo.countryCode);
            if(shipInfo.countryCode == 'USA' || shipInfo.countryCode == 'CAN') {
                $('#co-shipping-review-phoneFormatted').html(shipInfo.phoneFormatted);
            } else {
                $('#co-shipping-review-phoneFormatted').html(shipInfo.phone);
            }
            $('#co-shipping-review-phone').val(shipInfo.phone);


        };

        this.formValidation = function(formName, errors) {
            // magic borderfree error check
            if(errors.length>0) {
                for (var i=0;i<errors.length;i++) {
                    if(errors[i].propertyName == "borderfree") {
                        //borderfree error exists, show modal
                        $('#borderfreeError').jqmShow();
                    }
                }
            }
            var formEl = 'form[name="' + formName + '"]';
            // clear form errors
            _cto.clearFormErrors(formEl);
            // insert "informational" error container into DOM
            if($(formEl + ' .co-info-errors').length < 1) {
                $('<div class="co-info-errors"></div>').insertAfter(formEl + ' .co-global-error');
            } else {
                $(formEl + ' .co-info-errors').html('');
            }
            // iterate through all error messages and create "tooltip"
            var hasGlobalFormError;
            var hasInfoFormError;
            $(errors).each(function() {
                inputEl = (this.propertyName == 'password') ?
                    $(formEl + ' [name*="ssword"]:not([name*="passwordHint"]):not([name*="_D:/"]):visible') :
                    $(formEl + ' [name*=".' + this.propertyName + '"]:not([name*="_D:/"]):last');
                if(inputEl.length > 0 && this.propertyName != '') {
                    hasGlobalFormError = true;
                    if($('.co-formError-' + formName + '_' + this.propertyName).length < 1) {
                        $('<div class="co-formError co-formError-' + formName + '_' + this.propertyName+ '" style="display: none;"><table cellpadding="0" cellspacing="0" class="co-error_wrapper"><tr><td class="co-left_shadow">&nbsp;</td><td><table cellpadding="0" cellspacing="0"><tr><td class="co-top_shadow">&nbsp;</td></tr><tr><td class="co-errorMsg-content"><div class="co-formError-c2">' + _cto.heDecode(this.message) + '</div></td></tr></table></td><td class="co-right_shadow">&nbsp;</td></tr><tr><td class="co-left_corner_shadow"></td><td class="co-bottom_shadow">&nbsp;</td><td class="co-right_corner_shadow">&nbsp;</td></tr></tr></table></div>').insertAfter(inputEl);
                    } else {
                        $('.co-formError-' + formName + '_' + this.propertyName + ' .co-formError-c2').html($('.co-formError-' + formName + '_' + this.propertyName + ' .co-formError-c2').html() + ' ' + _cto.heDecode(this.message));
                    }
                    if(inputEl.is(':hidden')) {
                        if(this.propertyName == 'state') {
                            $(inputEl).prevAll(':visible').find('select option').removeAttr('selected').parent().find('[value=""]').attr('selected', 'selected');
                            $('select[id*="_country"]').trigger('change');
                        }
                        if(this.propertyName == 'phoneNumber') {
                            $(formEl + ' .phoneNumberBoxes input').addClass('co-formField-alert');
                        } else {
                            firstVisible = inputEl.prevAll(':visible').find(':input:first');
                            if(firstVisible.is('select')) {
                                firstVisible.parent().addClass('co-formField-alert');
                            } else {
                                firstVisible.addClass('co-formField-alert');
                            }
                        }
                    } else {
                        inputEl.addClass('co-formField-alert');
                        if(this.propertyName == 'creditCardNumber') {
                            $(formEl + ' [name*=".creditCardType"]').addClass('co-formField-alert');
                        }
                    }
                } else {
                    hasInfoFormError = true;
                    $('<div class="co-info-error" style="display: none;">' + _cto.heDecode(_cto.heDecode(this.message)) + '</div>').appendTo(formEl + ' .co-info-errors');
                }
            });
            if(hasInfoFormError) {
                _cto.orderStageHeight(false);
                $(formEl + ' .co-info-error').fasToggle(function() {
                    _cto.orderStageHeight(true);
                });
            }
            if(hasGlobalFormError) {
                // add flag to form to indicate it contains errors
                $(formEl).addClass('co-form-has-errors');
                // animate global error message
                setTimeout(function() { // delay for ie
                    _cto.orderStageHeight(false);
                    $(formEl + ' .co-global-error').hide().fasToggle(function() {
                        _cto.orderStageHeight(true);
                    });
                }, 200);
            }
            // attach events to fields for error toggling
            $(formEl + ' .co-formField-alert, ' + formEl + ' .co-formField-alert select').unbind('focus').focus(function() {
                if($(this).parent().is('.phoneNumberBoxes')) {
                    $(formEl + ' div[class*="_phoneNumber"]').fadeIn();
                } else {
                    thisEl = ($(this).is('select:not([name*="/atg/"])') || $(this).nextAll('.co-formError').length == 0) ? $(this).parent().nextAll('.co-formError') : $(this).next('.co-formError');
                    thisEl.fadeIn();
                }
            }).unbind('keydown').keydown(function() {
                if($(this).parent().is('.phoneNumberBoxes')) {
                    $(formEl + ' .co-formError-frmCreateCreditCard_phoneNumber').fadeOut();
                    $(formEl + ' .co-formError-shipping_phoneNumber').fadeOut();
                    $(formEl + ' .co-formError-editShipTo_phoneNumber').fadeOut();
                } else {
                    thisEl = ($(this).is('select:not([name*="/atg/"])') || $(this).nextAll('.co-formError').length == 0) ? $(this).parent().nextAll('.co-formError') : $(this).next('.co-formError');
                    thisEl.fadeOut();
                }
            }).unbind('blur').blur(function() {
                $(this).trigger('keydown');
            });
            $(formEl + ' .co-formField-alert:first').trigger('focus');
        };
