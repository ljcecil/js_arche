//Quiet Time Controller
// Accepted values: 'Parcel Post Delivery, Expedited Delivery, Express Delivery, Overnight Delivery'
//Disable using 'null';
var quietTimeShipping = 'null'; //Accepts string of Shipping methods that should be hidden for quiet time.

var createCCFormEl = 'form[name="frmCreateCreditCard"]';
var updateCCFormEl = 'form[name="frmUpdateCreditCard"]';

if(typeof prodList === 'undefined') var prodList = [];
if(typeof qtyList === 'undefined') var qtyList = [];
if(typeof s_account === 'undefined') var s_account = '';
if(typeof certonaPageId === 'undefined') var certonaPageId = '';

// method used to display debug information in the console
function _D() {
    if(s_account.indexOf('comdev') > -1 ||s_account.indexOf('comqa')) {
        console.log(arguments);
    }
}

/**
 * NEW CUSTOMER TRANSITION UI LAYER
 * provides site visitors with a rich customer conversion experience:
 *     +sign in modal box
 *     +fly-in persistent cart or "mini cart"
 *     +one-page cart edit and order process
 */

(function($) {

