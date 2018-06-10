        this.initShippingMethods = function(parent) {
            // remove right padding on last shipping method container
            $(parent + ' .co-shipping-selects:last').addClass('last');
            // shipping method hover states
            $(parent + ' .co-shipping-selects').hover(function () {
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass('hover');
            });
            // user select shipping method
            var smPrevSel;
            $(parent + ' .co-shipping-selects').mousedown(function() {
                var smCurType = $(this).find('.co-shipping-type').val();
                if($(this).hasClass('selected') == false) {
                    if(smPrevSel != null) {
                        $(smPrevSel).removeClass('selected');
                    }
                    $(this).addClass('selected');
                    var smPrevType = smCurType;
                    $(parent + ' #co-selectedShippingMethod').val(smCurType);
                }
                smPrevSel = $(this);
            });
            // define default shipping method
            if(!_cto.statics.smDefault) {
                _cto.statics.smDefault = $(parent + ' #co-selectedShippingMethod').val();
            }
            // auto-select default shipping method
            var setDefaultMethod = false;
            $(parent + ' .co-shipping-selects').each(function() {
                var methodText = $(this).find('.co-shipping-type').val();
                if(methodText == _cto.statics.stateShippingMethodSelections[$(_cto.statics.currentCountrySelectTarget).val() + '-' + $(_cto.statics.currentStateSelectTarget + ' select').val()]) {
                    setDefaultMethod = true;
                    $(this).trigger('mousedown');
                }
            });
            if(!setDefaultMethod){
                $(parent + ' .co-shipping-selects').each(function() {
                    var methodText = $(this).find('.co-shipping-type').val();
                    if(methodText == _cto.statics.smDefault) {
                        setDefaultMethod = true;
                        $(this).trigger('mousedown');
                    }
                });
            }
            if(!setDefaultMethod){
                $(parent + ' .co-shipping-selects:first').trigger('mousedown');
            }
        }

        this.deployShippingMethods = function(data, statics) {
            // build shipping method html
            if(statics.shippingMethodsContainer && $('.modalContent').not(':visible')) {
                var methodHtml = '';
                if(data.shippingMethods.length > 0) {
                    $.each(data.shippingMethods, function() {
                        this.amount = (this.amount == '0.0' || this.amount == '0.00' || this.amount == '$0.00' || this.amount == '$0.0') ? 'FREE' : this.amount;
                        //this.amount = (this.amount == '0.0') ? 'FREE' : '$' + fasMoneyAbs(this.amount);
                        if(quietTimeShipping.indexOf(this.shippingMethod)==-1){
                            methodHtml += '<div class="co-shipping-selects">' + '<div class="co-shipping-selects-wrapper">' + '<input type="hidden" class="co-shipping-type" value="' + this.shippingMethod + '" />' + '<div class="co-shipping-method-type">' + this.type + '</div>' + '<div class="co-shipping-method-cost">' + this.amount + '</div>' + '<div class="co-shipping-method-info"><div class="co-shipping-method-signature">' + this.signature + '</div><div>' + this.description + '</div>' + '<div class="co-shipping-method-eta-class">Estimated Arrival:<div>'+ this.eta +'</div></div><div>'+this.shipMethodPromoMsg+'</div></div></div></div>';
                        }else{
                            $('body').addClass('quietTime-active');
                        }
                    });
                }
                // deploy shipping method html to view
                $(statics.shippingMethodsContainer).find('#co-shipping-method-options-container').html(methodHtml);
                _cto.initShippingMethods(statics.shippingMethodsContainer);

                //auto-resize shipping methods based on the height of the tallest box
                var shippingMethodsAutosize = {
                    resize: function(){
                        var cellHt = $('.co-shipping-selects').eq(0).innerHeight();
                        var _shipMethContainer =  $('#co-shipping-method-options-container');
                        var _shipMethWrapper = $('#co-shipping-method-options .co-shipping-selects-wrapper');

                        //Reset heights, if contry field is changed
                        if( _shipMethContainer.hasClass('expHt')){
                            _shipMethContainer.removeClass('expHt').css('height','');
                            _shipMethWrapper.removeClass('expWrapperHt').css('height','');
                            cellHt = $('.co-shipping-selects').eq(0).innerHeight();
                        }
                        //SOMA Only: Will update height of wrapper also
                        if(_shipMethWrapper.css('backgroundColor')!='transparent'){
                            _shipMethWrapper.addClass('expWrapperHt');
                        }
                        $('.co-shipping-selects').each(function(i){
                            var curHt = $(this).innerHeight(true);
                            var max = $('.co-shipping-selects').length-1;

                            // console.log(i+ 'this '+curHt)
                            if(curHt!=cellHt){
                                cellHt = (curHt>cellHt)?curHt:cellHt;
                                _shipMethContainer.addClass('expHt')
                            }

                            if( _shipMethContainer.hasClass('expHt') && i== max ){
                                // console.log('AT END '+cellHt )
                                if(_shipMethWrapper.hasClass('expWrapperHt')){
                                    _shipMethWrapper.height(cellHt-10);
                                }
                                _shipMethContainer.height(cellHt );
                            }
                        });

                    }
                }.resize();
            }
        }

        this.initCityStateCountry = function(statics) {
            var country;
            $(statics.countryTarget).unbind('change').change(function() {
                if ($(statics.countryTarget).val() === country) {
                    return;
                }
                country = $(statics.countryTarget).val();
                /*
                 jQuery.fn.displayGifting = function() {
                 if($(statics.countryTarget).val() != 'USA') {$('div#co-shipping-gift-options').hide();} else {$('div#co-shipping-gift-options').show();}
                 };
                 if($(statics.countryTarget).val() != 'ZTGW6'){ $('div#co-shipping-gift-options').displayGifting();}
                 */
                // clear hidden fields if changed country
                if(!selectHiddenInputValue) {
                    $(statics.cityHiddenInput).val('');
                    $(statics.stateHiddenInput).val('');
                    // clears address1 and address2 and zipcode
                    $('form input[id*="_add"]').val('');
                    $('form input[id*="_zip"]').val('');
                    $('form input[id*="pAddress"]').val('');
                    $('form input[id*="pPostalCode"]').val('');
                }
                // save state target to temp var to use when shipping method and state changes.
                // we need to save each state+shipping method pair so the view matches
                // the selection if the user changes their state
                _cto.statics.currentStateSelectTarget = statics.stateTarget;
                _cto.statics.currentCountrySelectTarget = statics.countryTarget;
                if(statics.shippingMethodsContainer) {
                    // check for ship methods every time state is selected
                    var lisStateEvent = setInterval(function() {
                        if($(statics.stateTarget + ' select').length > 0) {
                            $(statics.stateTarget + ' select').unbind('mousedown change click keyup').bind('mousedown change click keyup', function() {
                                if(!_cto.statics.sessionExpired) {
                                    // set new default shipping method
                                    _cto.statics.stateShippingMethodSelections[$(_cto.statics.currentCountrySelectTarget).val() + '-' + $(_cto.statics.currentStateSelectTarget + ' select').val()] = $('#co-selectedShippingMethod').val();
                                    // Added param p4245 for ajax IE cache issue
                                    var url4245 = '/store/common/json/addressStateList.jsp?task=shipMethods&needShipMethods=' +
                                        ((statics.shippingMethodsContainer) ? 'true' : 'false') +
                                        '&country=' + $(statics.countryTarget).val() + '&state=' + $(this).val() +
                                        "&p4245=" + new Date().getTime();
                                    _cto.ajax({
                                        url: url4245,
                                        dataType: 'json',
                                        success: function(data) {
                                            if(!data.location) {
                                                _cto.deployShippingMethods(data, statics);
                                            }
                                        }
                                    });
                                }
                            });
                            clearInterval(lisStateEvent);
                        }
                    }, 200);
                }
                // url to get list of cities, states, and shipping methods
                var url = '/store/common/json/addressStateList.jsp?needShipMethods=' + ((statics.shippingMethodsContainer) ? 'true' : 'false') + '&country=';
                // handle preselected country
                if(typeof statics.preSelect != 'undefined') {
                    url += statics.preSelect.country;
                    $(statics.countryTarget + ' option').each(function() {
                        if($(this).val() == statics.preSelect.country) {
                            $(this).attr('selected', 'selected');
                        }
                    });
                    // if no preselect country, then get it from current view
                } else {
                    url += $(statics.countryTarget).val();
                }
                if($(statics.phoneTarget != '' && statics.countryTarget).val() != 'USA' && $(statics.countryTarget).val() != 'CAN') {
                    $(statics.phoneTarget + ' .dash, ' + statics.phoneTarget + ' .frmPhone2, '+ statics.phoneTarget + ' .frmPhone3').hide().val('');
                    $(statics.phoneTarget + ' .frmPhone1').attr('maxlength', '15').addClass('co-formFields-small frmPhoneIntl').removeClass('co-formFields').val($(statics.phoneTarget + ' .coFormPhone').val());
                } else {
                    $(statics.phoneTarget + ' .dash, ' + statics.phoneTarget + ' .frmPhone2, '+ statics.phoneTarget + ' .frmPhone3').show();
                    $(statics.phoneTarget + ' .frmPhone1').attr('maxlength', '3').removeClass('co-formFields-small frmPhoneIntl').addClass('co-formFields');
                    _cto.initPhoneNumberBoxes();
                }
                _cto.ajax({
                    url: url,
                    dataType: 'json',
                    success: function(data) {
                        // get current city and state from view
                        var selectedState = (statics.preSelect) ? statics.preSelect.state : $(statics.stateHiddenInput).val();
                        var selectedCity = (statics.preSelect) ? statics.preSelect.city : $(statics.cityHiddenInput).val();
                        if (selectedState && selectedCity) {
                            selectHiddenInputValue = true;
                        }
                        // build states html
                        var stateOptions;
                        if(data.stateList.length < 1) {
                            stateOptions = '<input id="' + $(statics.stateHiddenInput).attr('id') + '" class="co-formFields-small" type="text" maxlength="30" name="' + $(statics.stateHiddenInput).attr('name') + '"/>';
                        } else {
                            stateOptions = '<option class="co-formFields-select" value=""></option>';
                            $(data.stateList).each(function() {
                                stateOptions += '<option class="co-formFields-select" value="' + this.key + '">' + this.value + '</option>';
                            });
                            stateOptions = '<select id="' + $(statics.stateHiddenInput).attr('id') + '" class="co-formFields-small co-formField-select" name="' + $(statics.stateHiddenInput).attr('name') + '">' + stateOptions + '</select>';
                        }
                        $(statics.stateTarget).html(stateOptions);
                        // build city html
                        var cityOptions;
                        if(data.cityList.length < 1) {
                            cityOptions = '<input id="' + $(statics.cityHiddenInput).attr('id') + '" class="co-formFields" type="text" maxlength="30" name="' + $(statics.cityHiddenInput).attr('name') + '"/>';
                        } else {
                            cityOptions = '<option class="co-formFields-select" value=""></option>';
                            $(data.cityList).each(function() {
                                cityOptions += '<option class="co-formFields-select" value="' + this.key + '">' + this.value + '</option>';
                            });
                            cityOptions = '<select id="' + $(statics.cityHiddenInput).attr('id') + '" class="co-formFields co-formField-select" name="' + $(statics.cityHiddenInput).attr('name') + '">' + cityOptions + '</select>';
                        }
                        $(statics.cityTarget).html(cityOptions);
                        if(selectHiddenInputValue) {
                            // select the state
                            if(selectedState) {
                                $(statics.stateHiddenInput).val(selectedState);
                                if($(statics.stateTarget + ' select').length) {
                                    $(statics.stateTarget + ' option').each(function() {
                                        if($(this).val() == selectedState) {
                                            $(this).attr('selected', 'selected');
                                        }
                                    });
                                } else {
                                    $(statics.stateTarget + ' input').val(statics.selectedState);
                                }
                            }
                            // select the city
                            if(selectedCity) {
                                $(statics.cityHiddenInput).val(selectedCity);
                                if($(statics.cityTarget + ' select').length) {
                                    $(statics.cityTarget + ' option').each(function() {
                                        if($(this).val() == selectedCity) {
                                            $(this).attr('selected', 'selected');
                                        }
                                    });
                                } else {
                                    // Fix for jQuery.trim() bug that doesn't
                                    // remove char 160.
                                    var city = statics.selectedCity;
                                    if (city) {
                                        city = city.replace('\u00A0', '');
                                    }
                                    $(statics.cityTarget + ' input').val(city);
                                }
                            }
                        }
                        // build shipping method html
                        if(!$('#contextSelector').is(':visible')){
                            _cto.deployShippingMethods(data, statics);
                        }
                        // update option to select input on change
                        selectHiddenInputValue = false;
                        delete statics.preSelect;
                    }
                });
            });
            // trigger the change once to load country and states right now
            var selectHiddenInputValue = true;
            $(statics.countryTarget).change();
        }

        this.initAddressChangeListener = function(container, checkbox) {
            var container = $(container),
                checkbox = $(checkbox),
                label = checkbox.find('label');
            if(container.find('[id*="_selAddress"]').is(':visible') && container.is(':visible') && !_cto.statics.addressChangeListener) {
                label.html(_cto.Lang.order.updateCopy);
                _cto.statics.addressChangeListener = setInterval(function() {
                    if(!_cto.statics.initCityStateCountryActive) {
                        if(container.is(':visible')) {
                            var inputs = [
                                    container.find('[id*="_fName"]'),
                                    container.find('[id*="_lName"]'),
                                    container.find('[id*="_add1"]'),
                                    container.find('[id*="_add2"]'),
                                    container.find('[id*="_city_hidden"]:first'),
                                    container.find('[id*="_country"] option[selected]'),
                                    container.find('[id*="_state_hidden"]:first'),
                                    container.find('[id*="_zip"]'),
                                    container.find('[id*="_phone"]')
                                ],
                                addA = _cto.statics.tempAddressSelected,
                                addB = $.map(inputs, function(input, index) {
                                    return $.trim($(input).val());
                                }),
                                isDiff = 0,
                                type = (addA.join('')[0]) ? 'update' : 'save';
                            // find if input address is different than selected address
                            for(i = 0; i <= addA.length; i++) {
                                if(addA[i] != addB[i]) {
                                    isDiff = -1;
                                    break;
                                }
                            }
                            if(isDiff) { // if selected address differs from user input
                                if(checkbox.is(':not(:visible)')) { // if is hidden
                                    if(type == 'save') { // change text if save
                                        label.html(_cto.Lang.order.saveCopy);
                                    }
                                    checkbox.fasToggle(function() { // animate
                                        if(type == 'update') { // change text if not save
                                            label.html(_cto.Lang.order.updateCopy);
                                        }
                                    });
                                } else { // if is visible
                                    if(type == 'save' && checkbox.is(':not(:animated)')) {  // and is save and not animated
                                        label.html(_cto.Lang.order.saveCopy); // change visual text
                                    }
                                }
                            } else { // if addresses are the same
                                if(checkbox.is(':not(:animated):visible')) { // if is visible and not animated
                                    checkbox.fasToggle(function() { // animate
                                        switch(type) { // change visual text
                                            case 'save':
                                                label.html(_cto.Lang.order.saveCopy);
                                                break;
                                            case 'update':
                                                label.html(_cto.Lang.order.updateCopy);
                                                break;
                                        }
                                    });
                                }
                            }
                        } else {
                            clearInterval(_cto.statics.addressChangeListener);
                            _cto.statics.addressChangeListener = '';
                        }
                    }
                    return;
                }, 300);
                return -1;
            }
            return 0;
        }
