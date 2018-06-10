        this.RequestHandler = this.FormHandler = this.FormUtils = {

            handleSessionRedirect: function() {
                if(_cto.statics.isOrderPage) {
                    var currentEpochTime = new Date().getTime();
                    var secondsSinceLastRequest = (currentEpochTime - _cto.statics.lastRequestTime) / 1000;
                    _cto.statics.lastRequestTime = currentEpochTime;
                    if(secondsSinceLastRequest > Config.sessionTimeout.seconds || _cto.statics.sessionExpired) {
                        _cto.clearSessionLaunchModal();
                        return -1;
                    } else {
                        return 0;
                    }
                }
                return 0;
            },

            responseRedirect: function(xhr) {
                if(xhr.readyState == 4 && (_cto.statics.isOrderPage || _cto.statics.isCartPage)) {
                    var data = xhr.responseText;
                    if(typeof data != 'object') {
                        if(/<\/head>/i.test(data) && xhr.status != 500) {
                            _cto.clearSessionLaunchModal();
                            return -1;
                        } else if(trim(data).substring(0, 1) != '<') {
                            data = eval('(' + data + ')');
                        } else {
                            return 0;
                        }
                    }
                    if(data.modalLogin == 'false' && data.location) {
                        if(data.location.indexOf('/store/home.jsp') > -1) {
                            _cto.clearSessionLaunchModal();
                        } else {
                            document.location = data.location;
                        }
                        return -1;
                    } else {
                        return 0;
                    }
                }
                return 0;
            },

            readyForms: function() {

                // unhide ajax forms
                $('form.asyncForm').show();

                // inject global error language
                $('.co-global-error').html(_cto.Lang.formErrors.global);

                // override existing form submit method
                //Disabling now that we have an instant validation plug that manages this
                // same as above, but for IE
                for (i = 0; i < document.forms.length; i++) {
                    document.forms[i]._submit = document.forms[i].submit;
                    document.forms[i].submit = function (event) {
                        target = event ? event.target : this;
                        if ($(target).attr('class').indexOf('asyncForm') != -1) {
                            // call jquery submit
                            $(target).submit();
                        } else {
                            // call native submit
                            target._submit();
                        }
                    }
                }

                _cto.ajaxForm('.asyncForm', this.ajaxConfig);

            },
            ajaxConfig: {
                dataType: 'json',
                showLoader: true,
                timeout: Config.ajaxTimeout.duration,
                success: function(data, status, xhr) {
                    if(_cto.isCartOrCheckoutObject(data)) {
                        $form = $(xhr);
                        var formName = $form.attr('name');
                        if(data.cart) data.formErrors = data.cart.formErrors;
                        if(_cto.isAddToBag() && data.formErrors.cart.length > 0) {
                            $('#alert.modalWindow').jqmHide();
                            var m = '';
                            $(data.formErrors.cart).each(function() {
                                m += ' ' + this.message;
                            });
                            $form.find('.product-zone-error-message').html(m).removeClass('hide').show();
                        } else {
                            //Hide Zone Errors on successful submit
                            $form.find('.product-zone-error-message').html('').addClass('hide').hide();
                            if(data.modalLogin == 'true') {
                                _cto.closeModals();
                                $('#pc-btn-checkout2').trigger('click');
                            } else {
                                _ctoTagging.doTracking(data, formName); // invoke tagging
                                if(((data.cart) ? data.cart.wishlist : data.wishlist) == 'false') {

                                    var ele = 'html';
                                    if ($('body').scrollTop() > 0){ ele = 'body'; }

                                    if(_cto.statics.isCartPage) {
                                        if(data.recentlyAdded.price.length > 0){
                                            // $(ele) .animate({scrollTop: 0}, Config.scrollTop.duration, 'fasEaseOut', function() {
                                            // });
                                            _cto.updateCart(data);
                                        }else{
                                            _cto.updateCart(data);
                                        }
                                    } else if(_cto.statics.isOrderPage) {
                                        // $(ele).animate({scrollTop: 0}, Config.scrollTop.duration, 'fasEaseOut', function() {
                                        // });
                                        _ctoMiniCart.update(data, formName);
                                        _cto.updateOrder(data, formName);
                                    } else {
                                        // $(ele).animate({scrollTop: 0}, Config.scrollTop.duration, 'fasEaseOut', function() {
                                        // });
                                        _ctoMiniCart.isAddToBag = true;
                                        _ctoMiniCart.update(data, formName);
                                    }

                                    // close all opened modals
                                    _cto.closeModals();
                                } else {
                                    $('#alert').jqmHide();
                                }
                            }
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(_cto.Lang.global.general + ' (' + textStatus + ')');
                    _cto.closeModals();
                }
            },
