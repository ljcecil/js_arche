        this.Lang = {
            'global' : {
                'general' : 'There was a problem while processing your request. Please click OK and try again. '
            },
            'itemLevel': {
                'inventoryError': 'We\'re sorry, but this item is no longer available.'
            },
            'formErrors': {
                'global': 'Please review the highlighted areas below to continue.',
                'login': {
                    'email': 'Please enter a valid email address.',
                    'password': 'Please enter your password.'
                },
                'freezeOrder': 'We could not process your order at this time. If you feel you received this in error, please call customer service at '
            }
        }

        this.getSessionIdFromCookie = function() {
            if (document.cookie == '') return null;
            var cookies = document.cookie.split(';');
            for(var i = 0; i < cookies.length; i++) {
                var pair = cookies[i].split('=');
                if(pair[0]=='JSESSIONID') return unescape(pair[1]);
            }
        }

        this.heDecode = function(encodedString) {
            return $('<span/>').html(encodedString).text();
        }

        this.animScrollTop = function(duration, callback, formName) {
            var runOnce = 0;
            if($('form[name="' + formName + '"]').offset().top - $(document).scrollTop() < 100) {
                $('html, body').animate({ scrollTop: $('form[name="' + formName + '"]').offset().top - 300 }, duration, function() {
                    if(runOnce < 1) { callback(); } runOnce++;
                });
            } else {
                callback();
            }
        }

        this.closeModals = function() {
            try {
                jQuery('.modal:visible').modal('hide');
                $('.modalWindow').jqmHide(); //Support legacy modals
            } catch(e) {
                $('.modal .close').trigger('click');
                $('.modalWindow .qvClose').trigger('click'); //Support legacy modals
            }

        }

        this.goHomeUnsecure = function() {
            document.location = _cto.getHomeUnsecure();
        }

        this.getHomeUnsecure = function() {
            return document.location.href.split('/store')[0] + '/store/home.jsp';
        }

        this.sessionTimeoutModal = function() {
            _cto.closeModals();
            $('#modalSessionTimedOut').trigger('click');
            $('.jqmOverlay').unbind();
        }

        this.getTaskFromUrl = function(url) {
            var q = url.split('?')[1];
            if(!q) return false;
            q = q.split('&');
            for(var i = 0 ; i < q.length; i++) {
                var o = q[i].split('=');
                if(o[0] == 'task') return o[1]
            }
        }

        this.ajaxBeforeSerializeUrl = function(form, url) {
            var formName = form.attr('name');
            if(_cto.statics.isOrderPage && (formName == 'qvFrmAddToBag' || formName == 'couponForm')) {
                form.find('input[name*="SuccessURL"], input[name*="ErrorURL"]').val('/store/common/json/checkout.jsp');
                url = url.replace('/json/cart.jsp', '/json/checkout.jsp');
            }
            if(_cto.statics.isCartPage) {
                url = url + '&isCartPage=-1';
            }
            return _cto.RequestHandler.urlReprice(url, formName);
        }

        this.ajax = function(o) {
            $.ajax($.extend(o, {
                url: _cto.RequestHandler.urlReprice(o.url),
                beforeSend: function(xhr) {
                    if(_cto.RequestHandler.handleSessionRedirect()) { return false; }
                },
                complete: function(xhr) {
                    _cto.RequestHandler.responseRedirect(xhr);
                }
            }));
        }

        this.ajaxForm = function(r, o) {
            $(r).ajaxForm($.extend(o, {
                beforeSerialize: function(form) {
                    this.url = _cto.ajaxBeforeSerializeUrl(form, this.url);
                },
                beforeSend: function(xhr) {
                    if(_cto.RequestHandler.handleSessionRedirect()) { return false; }
                },
                complete: function(xhr) {
                    _cto.RequestHandler.responseRedirect(xhr);
                }
            }));
        }

        this.ajaxSubmit = function(r, o) {
            $(r).ajaxSubmit($.extend(o, {
                beforeSerialize: function(form) {
                    this.url = _cto.ajaxBeforeSerializeUrl(form, this.url);
                },
                beforeSend: function(xhr) {
                    if(_cto.RequestHandler.handleSessionRedirect()) { return false; }
                },
                complete: function(xhr) {
                    _cto.RequestHandler.responseRedirect(xhr);
                }
            }));
        }

        this.isCartOrCheckoutObject = function(data) {
            var isModalLogin;
            if(typeof data == 'object') {
                if(data.modalLogin) {
                    if(data.modalLogin == 'true') isModalLogin = true;
                } else {
                    isModalLogin = false;
                }
                if(isModalLogin || data.items || data.checkout) return -1;
            }
            return 0;
        }

        this.clearSessionLaunchModal = function() {
            _cto.statics.sessionExpired = true;
            $.cookie('JSESSIONID', null, {path:'/', secure: ((document.location.protocol == 'https:') ? true : false)});
            _cto.sessionTimeoutModal();
        }
