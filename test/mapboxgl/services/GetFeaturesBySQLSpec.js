require('../../../src/mapboxgl/services/FeatureService');
var mapboxgl = require('mapbox-gl');

var url = GlobeParameter.dataServiceURL;
describe('mapboxgl_FeatureService_getFeaturesBySQL', function () {
    var serviceResult;
    var originalTimeout;
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        serviceResult = null;
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    //数据集SQL查询服务
    it('getFeaturesBySQL', function (done) {
        var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
                name: "Countries@World",
                attributeFilter: "SMID = 247"
            },
            datasetNames: ["World:Countries"]
        });
        var service = new mapboxgl.supermap.FeatureService(url);
        service.getFeaturesBySQL(sqlParam, function (result) {
            serviceResult = result
        });
        setTimeout(function () {
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toBe("processCompleted");
                expect(serviceResult.result.succeed).toBe(true);
                expect(serviceResult.object.options.data).toContain("Countries@World");
                expect(serviceResult.object.options.data).toContain("SMID = 247");
                expect(serviceResult.result.featureCount).toEqual(1);
                expect(serviceResult.result.totalCount).toEqual(serviceResult.result.featureCount);
                expect(serviceResult.result.features.type).toEqual("FeatureCollection");
                var features = serviceResult.result.features.features[0];
                expect(features.id).toEqual(247);
                expect(features.type).toEqual("Feature");
                expect(features.properties).not.toBeNull();
                expect(features.geometry.type).toEqual("MultiPolygon");
                var coordinates = features.geometry.coordinates;
                for (var i = 0; i < coordinates.length; i++) {
                    expect(coordinates[i][0].length).toBeGreaterThan(0);
                    for (var j = 0; j < coordinates[i][0].length; j++) {
                        expect(coordinates[i][0][j].length).toEqual(2);
                    }
                }
                done();
            } catch (e) {
                console.log("'getFeaturesBySQL'案例失败" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
        }, 5000);
    });
});