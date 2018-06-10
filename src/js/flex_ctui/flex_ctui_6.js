            urlReprice: function(url, formName) {
                var task = ((typeof formName == 'string') ? formName : null) || _cto.getTaskFromUrl(url);
                if((_cto.statics.isCartPage && $.inArray(task, $.merge(Config.repriceRequests.asyncFormNames.cartPage, Config.repriceRequests.ajaxTaskParams.cartPage)) > -1) ||
                    (_cto.statics.isOrderPage && $.inArray(task, $.merge(Config.repriceRequests.asyncFormNames.checkoutPage, Config.repriceRequests.ajaxTaskParams.checkoutPage)) > -1)) {
                    return url + ((url.indexOf('?') < 0) ? '?' : '&') + 'reprice=true';
                } else {
                    return url;
                }
            },

            validateLogin: function(parent) {
                parent = (parent) ? parent : 'body';
                $(parent + ' .validateFormLogin').submit(function() {
                    values = {};
                    errors = [];
                    $.each($(this).serializeArray(), function(i, field) {
                        values[field.name] = field.value;
                    });
                    // valid email entered
                    if(!_cto.FormUtils.isValidEmail(values['login'])) {
                        errors.push({
                            'login' : _cto.Lang.formErrors.login.email
                        });
                    }
                    // password entered
                    if(!values['password']) {
                        errors.push({
                            'password' : _cto.Lang.formErrors.login.password
                        });
                    }
                    if(errors.length) {
                        $('.form-error').removeClass('form-error');
                        $('.form-error-msg').remove();
                        $.each(errors, function(index, error){
                            $.each(error, function(index, error){
                                index = (index == 'email') ? 'login' : index; // FIX IN JAVA
                                if($(parent + ' .validateFormLogin' + ' input[name=' + index + '] + .form-error-msg').length < 1) {
                                    e = $(parent + ' .validateFormLogin' + ' input[name=' + index + ']');
                                    e.addClass('form-error');
                                    $('<div class="form-error-msg">' + error + '</div>').insertAfter(e);
                                }
                            });
                        });
                        return false;
                    }
                    return true;
                });
            },

            isValidEmail: function(email) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
            },

            phoneNumberBoxes: function() {
                $('.phoneNumberBoxes').each(function() {
                    //vars for tech table (TT)
                    var inputObserveInt = 0, observeTimeout = 0;
                    var isTechTable = function(){return (navigator.userAgent.indexOf("FAS TechTable") != -1)};
                    // handle phone number form input
                    var phone = $(this).find('.coFormPhone').val().split('-').join('');
                    // retain object context
                    var parent = $(this);

                    //Locate Primary Phone Field and update to single input for TT
                    var $primaryPhone = $(parent).find('.frmPhone1');
                    if(isTechTable() && !$primaryPhone.hasClass('frmPhoneIntl')){
                        $primaryPhone.attr('maxlength',10).addClass('ttPhone');
                        $(parent).find('.frmPhone2, .frmPhone3, .dash').remove();
                    }
                    // inject phone number from hidden input value into visible inputs
                    if($(parent).find('.frmPhone1').attr('maxlength') == 3) {
                        $(parent).find('.frmPhone1').val(phone.substring(0, 3));
                        $(parent).find('.frmPhone2').val(phone.substring(3, 6));
                        $(parent).find('.frmPhone3').val(phone.substring(6, 10));
                    } else {
                        $(parent).find('.frmPhone1').val(phone);
                    }

                    // sync the visible input value with hidden input value
                    if(isTechTable()){
                        //Is Tech Table (TT)
                        $(parent).find('.co-formPhone').unbind('keyup change');
                        $(parent).find('.co-formPhone').blur(function(){
                            clearInterval(inputObserveInt);
                        })
                            .focus(function() {
                                clearInterval(inputObserveInt);
                                var $phoneInput = $(this);
                                //Start TT touch interval - Limits input to 10 characters
                                inputObserveInt = setInterval(function() {
                                    var inputClass = $phoneInput.attr('class');
                                    var charCount  = $phoneInput.val().length;
                                    if(charCount <= 10){
                                        clearTimeout(observeTimeout)
                                    }else{
                                        $(parent).find('.frmPhone1').val($(parent).find('.coFormPhone').val().substring(0, 10));
                                        $phoneInput.blur();
                                        clearInterval(inputObserveInt);
                                        clearTimeout(observeTimeout)
                                    }
                                    $(parent).find('.coFormPhone').val($primaryPhone.val());
                                }, 100);
                                //Stop TT touch interval after 2 seconds
                                observeTimeout = setTimeout(function(){$phoneInput.blur();clearInterval(inputObserveInt)},2000);
                            });
                    }else{
                        //Is Desktop/Mobile
                        $(parent).find('.co-formPhone').bind('keyup change', function() {
                            var inputClass = $(this).attr('class');
                            var charCount  = $(this).val().length;
                            if(inputClass != 'frmPhone3' && charCount == 3) {
                                $(this).next().focus();
                            }
                            $(parent).find('.coFormPhone').val(
                                $(parent).find('.frmPhone1').val() +
                                $(parent).find('.frmPhone2').val() +
                                $(parent).find('.frmPhone3').val()
                            );
                        });
                    }
                });
            }

        };
        // this.validateLoginForm = this.FormUtils.validateLogin;
        this.initPhoneNumberBoxes = this.FormUtils.phoneNumberBoxes;
        //this.initPhoneNumberBoxes = FASFormControler.phoneNumber;

        this.clearObjDataTimeouts = function(obj, tids) {
            $.each(tids, function(index, tid) {
                if(typeof obj.data(tid) != 'undefined' && obj.data(tid) != '') {
                    clearTimeout(obj.data(tid));
                    obj.data(tid, '');
                }
            });
        }
