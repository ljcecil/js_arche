        //bj functions
        this.toggleSubscribe = function()
        {
            if($('.ibf-email-optin-checkbox').attr('checked'))
            {
                $('.checkout-emailFrequencyDropDownDiv').css({'display':'block'})
                _cto.orderStageHeight(false);
            }
            else
            {
                $('.checkout-emailFrequencyDropDownDiv').css({'display':'none'})
                _cto.orderStageHeight(true);
            }
        }
        this.checkVoiceMsgBox = function()
        {
            if($('.checkout-phoneCallOptOut').attr('checked'))
            {
                $('.checkout-receiveRecordedMsgs').checked(true);
            }
        }
        this.displayCaslDiv = function()
        {
            var strCountry = $('#billingForm_country').val();
            if(strCountry  == 'USA')
            {
                $('#statelableid').html('State');
                $('#zipcodeid').html('ZIP Code');
            }
            else if(strCountry == 'CAN'){
                $('#statelableid').html('Province');
                $('#zipcodeid').html('Postal Code');
            }
            else if(strCountry == 'GBR'){
                $('#statelableid').html('County');
                $('#zipcodeid').html('Postal Code');
            }
            else{
                $('#statelableid').html('State/Region');
                $('#zipcodeid').html('Postal Code');
            }
            if(strCountry != 'USA' && strCountry != '')
            {
                $('.co-billing-email-casl,.checkout-form-row-casl').css({'display':'block'})
                $('.checkout-promo-slot-container-casl').css({'display':'block'})
                _cto.orderStageHeight(false);
            }
            else
            {
                $('.co-billing-email-casl,.checkout-form-row-casl').css({'display':'none'})
                $('.checkout-promo-slot-container-casl').css({'display':'none'})
                _cto.orderStageHeight(true);
            }
        }

        this.createLoginModal = function() {

            // login modal
            $('<div class="modalWindow" id="modalLogin"><table border="0" cellspacing="0" cellpadding="0"><tr class="modalControls"><td class="modalCaption"></td><td align="right"><a class="modalClose"></a></td></tr><tr><td colspan="2"><div class="coModalContent loading"></div></td></tr></table></div>').appendTo('body');
            $('#modalLogin').jqm({
                target: 'div.coModalContent',
                ajax: '@href',
                title: '@title',
                trigger: 'a.modalLoginTrigger',
                onLoad: function() {
                    $('#modalLogin .coModalContent').removeClass('loading');
                    $('#modalLogin').prev('div').unbind('click');
                    //_cto.validateLoginForm('#modalLogin');
                }
            });

        }
