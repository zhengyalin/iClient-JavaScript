/**
 * Class:L.supermap.AddressMatchService
 * 地址匹配服务
 * 用法：
 *      L.supermap.AddressMatchService(url,options)
 *      .code(function(result){
 *          //doSomething
 *      })
 */
var L = require("leaflet");
var SuperMap = require('../../common/SuperMap');
var ServiceBase = require('./ServiceBase');
var CommonMatchAddressService = require('../../common/iServer/AddressMatchService');

var AddressMatchService = ServiceBase.extend({

    initialize: function (url, options) {
        ServiceBase.prototype.initialize.call(this, url, options);
    },

    /**
     * 获取正向地址匹配结果。
     * @param params 正向匹配参数。
     * @param callback 请求结果的回调函数。
     * @param resultFormat 返回的结果类型（默认为GeoJSON）。
     */
    code: function (params, callback, resultFormat) {
        var me = this,
            format = me._processFormat(resultFormat);
        var addressMatchService = new CommonMatchAddressService(me.url, {
            serverType: me.options.serverType,
            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: format
        });
        addressMatchService.code(me.url + '/geocoding', params);
        return me;
    },

    /**
     * 获取反向地址匹配结果。
     * @param params 反向匹配参数。
     * @param callback 请求结果的回调函数。
     * @param resultFormat 返回的结果类型（默认为GeoJSON）。
     */
    decode: function (params, callback, resultFormat) {
        var me = this,
            format = me._processFormat(resultFormat);
        var addressMatchService = new CommonMatchAddressService(me.url, {
            serverType: me.options.serverType,
            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: format
        });
        addressMatchService.decode(me.url + '/geodecoding', params);
        return me;
    },

    _processFormat: function (resultFormat) {
        return (resultFormat) ? resultFormat : SuperMap.DataFormat.GEOJSON;
    }
});

L.supermap.AddressMatchService = function (url, options) {
    return new AddressMatchService(url, options);
};

module.exports = AddressMatchService;