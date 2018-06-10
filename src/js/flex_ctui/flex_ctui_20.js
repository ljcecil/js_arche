    /**
     * TAGGING CLASS
     * contains functions used to invoke tagging upon asynchronous requests
     */

    _ctoTaggingClass = function(Config) {

        this.doTracking = function(data, formName) {
            if($.inArray(formName, Config.asyncFormNames) > -1 || formName === true) {
                data = (data.cart) ? data.cart : data;

                if(!_ctoTagging.asyncAction.addToBag(data) && data.trackingVars) {
                    var customerType = "";
                    var customerId = "";

                    var trkVars = data.trackingVars.siteCatalyst;
                    // revert to original pageName (e.g. quick view could have overridden this)
                    s.pageName = _cto.statics.pageName;
                    // channel variables
                    if(trkVars['CI_PageType']) {
                        var CI_PageType = trkVars['CI_PageType'];
                    }
                    if(trkVars['s.server']) s.server = trkVars['s.server'];
                    if(trkVars['s.channel']) s.channel = trkVars['s.channel'];
                    if(trkVars['s.prop1']) s.prop1 = trkVars['s.prop1'];
                    if(trkVars['s.prop2']) s.prop2 = trkVars['s.prop2'];
                    if(trkVars['s.prop3']) s.prop3 = trkVars['s.prop3'];
                    if(trkVars['s.prop4']) s.prop4 = trkVars['s.prop4'];
                    if(trkVars['s.prop5']) s.prop5 = trkVars['s.prop5'];
                    if(trkVars['s.prop11']) s.prop11 = trkVars['s.prop11'];
                    if(trkVars['s.prop12']) s.prop12 = trkVars['s.prop12'];
                    if(trkVars['s.prop2']) s.pageType = trkVars['s.prop2'];
                    if(trkVars['s.eVar1']) s.eVar1 = trkVars['s.eVar1'];
                    if(trkVars['s.eVar7']) s.eVar7 = trkVars['s.eVar7'];
                    if(trkVars['s.eVar8']) s.eVar8 = trkVars['s.eVar8'];
                    if(trkVars['s.eVar9']) s.eVar9 = trkVars['s.eVar9'];
                    if(trkVars['s.eVar10']) s.eVar10 = trkVars['s.eVar10'];
                    if(trkVars['s.eVar25']) s.eVar25 = trkVars['s.eVar25'];
                    if(trkVars['s.eVar26']) s.eVar26 = trkVars['s.eVar26'];
                    if(trkVars['s.eVar27']) s.eVar27 = trkVars['s.eVar27'];
                    if(trkVars['s.eVar28']) s.eVar28 = trkVars['s.eVar28'];
                    if(trkVars['s.eVar29']) s.eVar29 = trkVars['s.eVar29'];
                    if(trkVars['s.eVar30']) s.eVar30 = trkVars['s.eVar30'];
                    if(trkVars['s.eVar31']) s.eVar31 = trkVars['s.eVar31'];
                    if(trkVars['s.eVar2']) s.eVar2 = trkVars['s.eVar2'];
                    if(trkVars['s.eVar3']) s.eVar3 = trkVars['s.eVar3'];
                    if(trkVars['s.eVar5']) s.eVar5 = trkVars['s.eVar5'];
                    if(trkVars['s.eVar6']) s.eVar6 = trkVars['s.eVar6'];
                    if(trkVars['s.eVar11']) s.eVar11 = trkVars['s.eVar11'];
                    if(trkVars['s.eVar12']) s.eVar12 = trkVars['s.eVar12'];
                    if(trkVars['s.eVar13']) s.eVar13 = trkVars['s.eVar13'];
                    if(trkVars['s.eVar14']) s.eVar14 = trkVars['s.eVar14'];
                    if(trkVars['s.eVar15']) s.eVar15 = trkVars['s.eVar15'];
                    if(trkVars['s.eVar16']) s.eVar16 = trkVars['s.eVar16'];
                    if(trkVars['s.state']) s.state = trkVars['s.state'];
                    if(trkVars['s.purchaseID']) s.purchaseID = trkVars['s.purchaseID'];
                    if(trkVars['s.eVar17']) s.eVar17 = trkVars['s.eVar17'];
                    if(trkVars['s.eVar18']) s.eVar18 = trkVars['s.eVar18'];
                    if(!s.eVar17) {
                        var customerType = "" + readCookie("TRACK_LOYALTY_STATUS");
                        if(customerType != "" && customerType != "null")
                            s.eVar17 = customerType;
                    }
                    if(!s.eVar18) {
                        var customerId = "" + readCookie("TRACK_LOYALTY_ID");
                        if(customerId != "" && customerId != "null")
                            s.eVar18 = customerId;
                    }


                    _D('_ctoTagging.doTracking|Omniture Tags', {'pageName': s.pageName, 'events': s.events, 'products': s.products});

                    /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
                    var s_code=s.t();if(s_code)document.write(s_code);

                    // cheetah mail tracking
                    if(typeof data.trackingVars.cheetahMail!='undefined' && data.trackingVars.cheetahMail.reqCheetahMail) {
                        _D('_ctoTagging.doTracking|CheetahMail Tags', data.trackingVars.cheetahMail);
                        Req("/web_assets/js/cheetah_mail/sc_tracking.js", function(){
                                eval(_cto.heDecode(data.trackingVars.cheetahMail.reqCheetahMail));
                            }, function(){
                                sc_send_data();
                            }
                        );
                    }

                    return -1;
                } else {
                    return 0;
                }
            }
        }

        this.asyncAction = {

            addToBag: function(data) {

                if(data.recentlyAdded) {
                    var imageTag = "",
                        prodList = [],
                        merchCat = (typeof merchandisingCategory != "undefined") ? merchandisingCategory : "",
                        addCatId = (typeof catId != "undefined") ? catId : "",
                        ra = data.recentlyAdded;

                    for(i = 0; i < ra.products.length; i++) {
                        //Added !!data.items[i] condition to fix add to bag error when added 5 items to cart. Error data.items[i] was undefined.
                        if(!!data.items[i]){
                            if(i < 1) s.products = '';
                            if(/GIFTCERT/i.test(ra.products[i])) {
                                ra.color[i] = $.trim($('select#skuIdSelect option[value="' + ra.skus[i] + '"]').text());
                                ra.price[i] = $.map(ra.price[i].split(".0"), function(val, index){
                                    if(val) {
                                        return val + ".0";
                                    }
                                }).reverse()[0];
                            }


                            s.products += ";" + ra.products[i] + ";" + ra.qty[i] +";" + ra.price[i] + ";;" + "evar19=" + ra.skus[i] + "|evar20=" + ra.size[i] + "|evar21=" + ra.color[i] + "|evar44=" + ra.upc[i] + ",";

                            imageTag = "1012~" + ra.skus[i] + "~131~" + data.items[i].name + "~1113~" + addCatId + "~1112~" + merchCat;

                            _D('_ctoTagging.addToBagTagging|Omniture Tags', {
                                'firstInCart': data.firstInCart,
                                'recentlyAdded': data.recentlyAdded,
                                'skuIdAdded': ra.skus[i],
                                'imageTag': imageTag
                            });
                            prodList.push(data.items[i].tagStyleId + ',');
                            if(typeof SC_Sku != 'undefined') {
                                SC_Sku.addToCart("" + ra.skus[i], imageTag, ra.qty[i], ra.price[i]);
                            }
                        }
                    }

                    if(prodList.length > 0) {

                        // send item taggs
                        if(data.firstInCart == 'true') {
                            s.events = "scAdd,scOpen";
                        } else {
                            s.events = "scAdd";
                        }

                        if(s.products.length > 0 && s.products.charAt(s.products.length - 1) == ',') {
                            s.products = s.products.substring(0, s.products.length - 1);
                        }
                        void (s.t());
                        if(typeof SC_Sku != 'undefined') {
                            sc_send_data();
                        }

                        // certona tagging
                        Req(true,
                            '/web_assets/js/certona/resxclsx.js',
                            '/web_assets/js/certona/flex-recommendation.js',
                            function(){
                                _D('_ctoTagging.addToBagTagging|Certona Tags', {'host': certona_host, 'prodList': prodList});
                                var promotionlessProdlist = JSON.parse(JSON.stringify(
                                    data.recentlyAdded.products
                                )).filter(function(str){
                                    return /^[0-9,]+$/.test(str)
                                }).map(function(d){
                                    return d+',';
                                });
                                certonaCHObject.initAndRunWithRecommendation(prodList,customerId,null,null,"addtocart_op",certona_host,[promotionlessProdlist[0]],null,null,null);
                            }
                        );

                        return -1;
                    } else {
                        return 0;
                    }
                }
            },

            removeFromBag: function(tag) {
                console.log(tag);
                s.pageName = _cto.statics.pageName;
                s.events = 'scRemove';
                s.products = tag.categoryId + ';' + tag.style;
                return;
            },

            changeQuantity: function() {
                //SCRUM: GWP Fix
                //triggerCartRefesh = true;
                return;
            },

            couponFormSubmit: function() {
                return;
            }

        }
    }
