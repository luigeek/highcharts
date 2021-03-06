/**
 * Checks that the timezone option is applied and works.
 */
QUnit.test('timezone', function (assert) {
    var chart,
        oct27Point;

    Highcharts.setOptions({
        global: {
            timezone: 'Europe/Oslo',

            // This should be ignored
            getTimezoneOffset: function (timestamp) {
                var zone = 'America/New_York',
                    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                return timezoneOffset;
            }
        }
    });

    chart = Highcharts.chart('container', {

        title: {
            text: 'timezone with local DST crossover'
        },

        subtitle: {
            text: 'From October 27, UTC midnight is 01:00 AM in Oslo'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            data: (function () {
                var arr = [],
                    i;
                for (i = 0; i < 5; i = i + 1) {
                    arr.push(i);
                }
                return arr;
            }()),
            dataLabels: {
                enabled: true,
                format: '{x:%H:%M}'
            },
            pointStart: Date.UTC(2014, 9, 24),
            pointInterval: 24 * 36e5,
            name: 'UTC Midnight',
            tooltip: {
                pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
            }
        }]
    });

    oct27Point = chart.series[0].data[3];

    assert.equal(
        typeof Date.hcGetTimezoneOffset,
        'function',
        'timezone option is applied'
    );

    assert.equal(
        Highcharts.dateFormat('%H:%M', oct27Point.x),
        '01:00',
        'From October 27, UTC midnight is 01:00 AM in Oslo'
    );
});

/**
 * Checks that specified getTimezoneOffset function is used if timezone option
 * is not.
 */
QUnit.test('getTimezoneOffset', function (assert) {
    var chart,
        oct27Point;

    Highcharts.setOptions({
        global: {
            getTimezoneOffset: function (timestamp) {
                var zone = 'Europe/Oslo',
                    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                return timezoneOffset;
            }
        }
    });

    chart = Highcharts.chart('container', {

        title: {
            text: 'timezone with local DST crossover'
        },

        subtitle: {
            text: 'From October 27, UTC midnight is 01:00 AM in Oslo'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            data: (function () {
                var arr = [],
                    i;
                for (i = 0; i < 5; i = i + 1) {
                    arr.push(i);
                }
                return arr;
            }()),
            dataLabels: {
                enabled: true,
                format: '{x:%H:%M}'
            },
            pointStart: Date.UTC(2014, 9, 24),
            pointInterval: 24 * 36e5,
            name: 'UTC Midnight',
            tooltip: {
                pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
            }
        }]
    });

    oct27Point = chart.series[0].data[3];

    assert.equal(
        typeof Date.hcGetTimezoneOffset,
        'function',
        'getTimezoneOffset function is applied'
    );

    assert.equal(
        Highcharts.dateFormat('%H:%M', oct27Point.x),
        '01:00',
        'From October 27, UTC midnight is 01:00 AM in Oslo'
    );
});

QUnit.test('Crossing over DST with hourly ticks (#6278)', function (assert) {

    Highcharts.setOptions({
        global: {
            useUTC: true,
            timezone: 'Europe/London'
        }
    });

    var chart = Highcharts.chart('container', {

        chart: {
            width: 600
        },
        tooltip: {
            borderColor: 'black',
            crosshairs: true,
            shared: true,
            useHTML: true
        },

        xAxis: {
            type: 'datetime'
        },

        title: {
            text: 'DST Demo'
        },

        series: [{
            data: [
                [Date.UTC(2016, 9, 30, 0, 15), 9],
                [Date.UTC(2016, 9, 30, 0, 30), 10],
                [Date.UTC(2016, 9, 30, 0, 45), 11],
                [Date.UTC(2016, 9, 30, 1, 0), 12],
                [Date.UTC(2016, 9, 30, 1, 15), 13],
                [Date.UTC(2016, 9, 30, 1, 30), 14],
                [Date.UTC(2016, 9, 30, 1, 45), 15],
                [Date.UTC(2016, 9, 30, 2, 0), 16],
                [Date.UTC(2016, 9, 30, 2, 15), 17],
                [Date.UTC(2016, 9, 30, 2, 30), 18],
                [Date.UTC(2016, 9, 30, 2, 45), 19],
                [Date.UTC(2016, 9, 30, 3, 0), 20]
            ]
        }]
    });

    var ticks = chart.xAxis[0].tickPositions
        .map(function (pos) {
            return chart.xAxis[0].ticks[pos].label.element.textContent;
        });

    assert.deepEqual(
        ticks,
        ['01:30', '01:00', '01:30', '02:00', '02:30', '03:00'],
        'Ticks before DST crossover'
    );

});
