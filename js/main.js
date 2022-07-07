// Defaults
(function ($, List, _, moment) {
    // List.js classes to use for search elements
    const listOptions = {
        valueNames: [
            'js-promise-text',
            'js-promise-category',
            'js-promise-status'
        ]
    };

    // Tooltip
    $(function () {
        $('[data-bs-toggle="tooltip"]').tooltip();
    });

    // Tabs
    $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // Find any within a facet
    function foundAny(facets, compareItem) {
        // No facets selected, show all for this facet
        if (_.isEmpty(facets)) {
            return true;
        }
        // Otherwise, show this item if it contains any of the selected facets
        return facets.reduce(function (found, facet) {
            if (found) {
                return found;
            }
            return compareItem[facet['facet']] === facet['value'];
        }, false);
    }

    // Startup + Misc
    $(function () {
        // Dates
        const today = moment();
        const kickstarterended = moment('2012-11-19');
        $('#days-since-kickstarter').html(today.diff(kickstarterended, 'days') > 0 ? today.diff(kickstarterended, 'days') : 0);
        $('#years-since-kickstarter').html(today.diff(kickstarterended, 'years') > 0 ? today.diff(kickstarterended, 'years') : 0);

        // Always show tooltip on confidence-btn
        //$('#confidence-btn').tooltip('show');

        // Select and replace maintained by name
        const maintainers = ["SomethingAwful Goons", "Low I.Q. Individuals Who Haven't Got a Clue", "Lowlifes With Zero Credibility", "Celestial Body Construction Team 09", "CryTek Legal Beagles", "Coutts & Co.", "10% for the Cayman", "Bitter EvE Goons", "Salty Asshats", "Goons stuck in checkmate", "T-posed Goons", "MY GIRLFRIEND", "The Fourth Stimpire", "WaffleImages", "COBOL Greybeards", "Blocked Buddies", "Thanks notepad", "Archive-Priests™", "Ryan Archer"];
        const maintainer = maintainers[Math.floor(Math.random() * maintainers.length)];
        $('.maintainer-name').html(maintainer);

        // List.js object that we can filter upon
        const promiseList = new List('promises', listOptions).on('updated', function (list) {
            $('#count').html(list.visibleItems.length);
        });

        const $search = $('#search');
        const $facets = $('[data-list-facet]'); // All buttons that can filter

        // Clear all
        function resetFilter(e) {
            e.preventDefault();
            // Visually reset buttons
            $facets.removeClass('active');
            // Clear out text field
            $search.val('');
            // Wipe all filters
            promiseList.search();
            promiseList.filter();
            // Wipe graph to default
            Build_and_fill_Chart();
        }

        // Hard reset all the buttons
        $('.promises__category--reset').on('click', resetFilter);

        let anchorhash = window.location.hash.substring(1);
        if (anchorhash) {
            anchorhash = _.replace(anchorhash, new RegExp("_", "g"), " ");
            $search.val(anchorhash.toString());
            promiseList.search(anchorhash);
            // promiseList.filter();
            // promiseList.update();
            // promiseList = new List('promises', listOptions).on('updated', function(list) {
            //   $('#count').html(list.visibleItems.length);
            // });
        }

        // Any facet filter button
        $facets.on('click', function (e) {

            const facet = $(this).data('list-facet'); // ie 'js-promise-category'
            const value = $(this).data('facet-value'); // ie 'Culture'
            const isSingle = !!$(this).data('select-single'); // ie true/false for if there can only be one of this filter

            // Single-select categories should have their active state wiped
            if (isSingle) {
                $facets
                    .filter(function () {
                        return $(this).data('list-facet') === facet;
                    })
                    .removeClass('active');
            }

            // Flag as active
            $(this).toggleClass('active');

            // Array of active
            const facets = $facets.filter('.active').map(function () {
                // Return object instead with facet/value
                return {
                    facet: $(this).data('list-facet'),
                    value: $(this).data('facet-value'),
                    isSingle: !!$(this).data('select-single')
                };
            }).get();

            // console.log(facets);
            // Update graph on "js-promise-status" changes
            if (facets[0].facet === "js-promise-status") {
                Build_and_fill_Chart(facets[0].value);
            }

            // When deselecting last, clear all filters
            if (facets.length === 0) {
                promiseList.filter();
                return; // Eject now
            }

            // Otherwise, filter on the array
            promiseList.filter(function (item) {
                const itemValues = item.values();

                // Single selects, eg "Not started"
                const single = _.filter(facets, ['isSingle', true]);
                const foundSingle = foundAny(single, itemValues);

                // Single-selection items hide if false no matter what, so eject if not found here
                if (!foundSingle) {
                    return false;
                }

                // Full categories can have multiples show, list out here
                const multis = _.filter(facets, ['isSingle', false]);
                return foundAny(multis, itemValues);

            }); //promiseList.filter()

        });
    });

})(jQuery, List, _, moment);

// Chart
function Build_and_fill_Chart(para_Type) {
    if (para_Type === void 0) {
        para_Type = "all";
    }
    const History = [
        {"Not_implemented": 0, "Completed": 0, "date": "2012-10-01T07:00:00.000Z"},
        {"Not_implemented": 14, "In_alpha": 2, "Completed": 1, "date": "2012-11-01T07:00:00.000Z"},
        {"Not_implemented": 44, "In_alpha": 3, "Completed": 7, "Compromised": 1, "date": "2012-12-01T08:00:00.000Z"},
        {"Not_implemented": 44, "In_alpha": 3, "Completed": 7, "Compromised": 1, "date": "2013-01-01T08:00:00.000Z"},
        {"Not_implemented": 45, "In_alpha": 3, "Completed": 8, "Compromised": 1, "date": "2013-02-01T08:00:00.000Z"},
        {"Not_implemented": 46, "In_alpha": 3, "Completed": 9, "Compromised": 1, "date": "2013-03-01T08:00:00.000Z"},
        {"Not_implemented": 47, "In_alpha": 4, "Completed": 9, "Compromised": 1, "date": "2013-04-01T07:00:00.000Z"},
        {"Not_implemented": 54, "In_alpha": 4, "Completed": 9, "Compromised": 1, "date": "2013-05-01T07:00:00.000Z"},
        {"Not_implemented": 55, "In_alpha": 5, "Completed": 11, "Compromised": 1, "date": "2013-06-01T07:00:00.000Z"},
        {"Not_implemented": 66, "In_alpha": 6, "Completed": 11, "Compromised": 1, "date": "2013-07-01T07:00:00.000Z"},
        {"Not_implemented": 68, "In_alpha": 6, "Completed": 11, "Compromised": 1, "date": "2013-08-01T07:00:00.000Z"},
        {"Not_implemented": 70, "In_alpha": 6, "Completed": 11, "Compromised": 1, "date": "2013-09-01T07:00:00.000Z"},
        {"Not_implemented": 73, "In_alpha": 6, "Completed": 12, "Compromised": 1, "date": "2013-10-01T07:00:00.000Z"},
        {"Not_implemented": 74, "In_alpha": 7, "Completed": 12, "Compromised": 1, "date": "2013-11-01T07:00:00.000Z"},
        {"Not_implemented": 82, "In_alpha": 7, "Completed": 12, "Compromised": 1, "date": "2013-12-01T08:00:00.000Z"},
        {"Not_implemented": 90, "In_alpha": 9, "Completed": 17, "Compromised": 1, "date": "2014-01-01T08:00:00.000Z"},
        {"Not_implemented": 113, "In_alpha": 13, "Completed": 29, "Broken": 1, "Compromised": 2, "date": "2014-02-01T08:00:00.000Z"},
        {"Not_implemented": 133, "In_alpha": 15, "Completed": 32, "Broken": 1, "Compromised": 2, "date": "2014-03-01T08:00:00.000Z"},
        {"Not_implemented": 162, "In_alpha": 20, "Completed": 34, "Broken": 1, "Compromised": 2, "date": "2014-04-01T07:00:00.000Z"},
        {"Not_implemented": 186, "In_alpha": 25, "Completed": 37, "Broken": 1, "Compromised": 2, "date": "2014-05-01T07:00:00.000Z"},
        {"Not_implemented": 212, "In_alpha": 27, "Completed": 37, "Broken": 1, "Compromised": 3, "date": "2014-06-01T07:00:00.000Z"},
        {"Not_implemented": 244, "In_alpha": 27, "Completed": 40, "Broken": 2, "Compromised": 3, "date": "2014-07-01T07:00:00.000Z"},
        {"Not_implemented": 256, "In_alpha": 28, "Completed": 41, "Broken": 2, "Compromised": 3, "date": "2014-08-01T07:00:00.000Z"},
        {"Not_implemented": 273, "In_alpha": 30, "Completed": 44, "Broken": 2, "Compromised": 3, "date": "2014-09-01T07:00:00.000Z"},
        {"Not_implemented": 275, "In_alpha": 31, "Completed": 45, "Broken": 2, "Compromised": 3, "date": "2014-10-01T07:00:00.000Z"},
        {"Not_implemented": 276, "In_alpha": 31, "Completed": 46, "Broken": 2, "Compromised": 3, "date": "2014-11-01T07:00:00.000Z"},
        {"Not_implemented": 289, "In_alpha": 33, "Completed": 48, "Broken": 2, "Compromised": 4, "date": "2014-12-01T08:00:00.000Z"},
        {"Not_implemented": 291, "In_alpha": 33, "Completed": 49, "Broken": 2, "Compromised": 4, "date": "2015-01-01T08:00:00.000Z"},
        {"Not_implemented": 284, "In_alpha": 33, "Completed": 56, "Broken": 8, "Compromised": 4, "date": "2015-02-01T08:00:00.000Z"},
        {"Not_implemented": 284, "In_alpha": 35, "Completed": 56, "Broken": 8, "Compromised": 4, "date": "2015-03-01T08:00:00.000Z"},
        {"Not_implemented": 287, "In_alpha": 35, "Completed": 56, "Broken": 8, "Compromised": 4, "date": "2015-04-01T07:00:00.000Z"},
        {"Not_implemented": 291, "In_alpha": 35, "Completed": 56, "Broken": 8, "Compromised": 4, "date": "2015-05-01T07:00:00.000Z"},
        {"Not_implemented": 291, "In_alpha": 35, "Completed": 56, "Broken": 9, "Compromised": 5, "date": "2015-06-01T07:00:00.000Z"},
        {"Not_implemented": 295, "In_alpha": 35, "Completed": 56, "Broken": 10, "Compromised": 5, "date": "2015-07-01T07:00:00.000Z"},
        {"Not_implemented": 294, "In_alpha": 35, "Completed": 56, "Broken": 11, "Compromised": 5, "date": "2015-08-01T07:00:00.000Z"},
        {"Not_implemented": 299, "In_alpha": 37, "Completed": 56, "Broken": 11, "Compromised": 5, "date": "2015-09-01T07:00:00.000Z"},
        {"Not_implemented": 319, "In_alpha": 38, "Completed": 56, "Broken": 12, "Compromised": 5, "date": "2015-10-01T07:00:00.000Z"},
        {"Not_implemented": 324, "In_alpha": 38, "Completed": 56, "Broken": 12, "Compromised": 5, "date": "2015-11-01T07:00:00.000Z"},
        {"Not_implemented": 327, "In_alpha": 38, "Completed": 56, "Broken": 12, "Compromised": 5, "date": "2015-12-01T08:00:00.000Z"},
        {"Not_implemented": 329, "In_alpha": 38, "Completed": 56, "Broken": 13, "Compromised": 5, "date": "2016-01-01T08:00:00.000Z"},
        {"Not_implemented": 328, "In_alpha": 38, "Completed": 57, "Broken": 19, "Compromised": 5, "date": "2016-02-01T08:00:00.000Z"},
        {"Not_implemented": 336, "In_alpha": 39, "Completed": 57, "Broken": 19, "Compromised": 5, "date": "2016-03-01T08:00:00.000Z"},
        {"Not_implemented": 345, "In_alpha": 40, "Completed": 57, "Broken": 19, "Compromised": 5, "date": "2016-04-01T07:00:00.000Z"},
        {"Not_implemented": 347, "In_alpha": 40, "Completed": 57, "Broken": 19, "Compromised": 5, "date": "2016-05-01T07:00:00.000Z"},
        {"Not_implemented": 345, "In_alpha": 40, "Completed": 59, "Broken": 20, "Compromised": 5, "date": "2016-06-01T07:00:00.000Z"},
        {"Not_implemented": 344, "In_alpha": 40, "Completed": 60, "Broken": 20, "Compromised": 5, "date": "2016-07-01T07:00:00.000Z"},
        {"Not_implemented": 345, "In_alpha": 40, "Completed": 60, "Broken": 20, "Compromised": 5, "date": "2016-08-01T07:00:00.000Z"},
        {"Not_implemented": 362, "In_alpha": 44, "Completed": 60, "Broken": 20, "Compromised": 6, "date": "2016-09-01T07:00:00.000Z"},
        {"Not_implemented": 363, "In_alpha": 45, "Completed": 60, "Broken": 20, "Compromised": 6, "date": "2016-10-01T07:00:00.000Z"},
        {"Not_implemented": 365, "In_alpha": 45, "Completed": 60, "Broken": 20, "Compromised": 6, "Stagnant": 3, "date": "2016-11-01T07:00:00.000Z"},
        {"Not_implemented": 349, "In_alpha": 45, "Completed": 60, "Broken": 21, "Compromised": 6, "Stagnant": 19, "date": "2016-12-01T08:00:00.000Z"},
        {"Not_implemented": 337, "In_alpha": 45, "Completed": 60, "Broken": 21, "Compromised": 6, "Stagnant": 31, "date": "2017-01-01T08:00:00.000Z"},
        {"Not_implemented": 329, "In_alpha": 45, "Completed": 62, "Broken": 27, "Compromised": 6, "Stagnant": 32, "date": "2017-02-01T08:00:00.000Z"},
        {"Not_implemented": 331, "In_alpha": 45, "Completed": 62, "Broken": 27, "Compromised": 6, "Stagnant": 32, "date": "2017-03-01T08:00:00.000Z"},
        {"Not_implemented": 329, "In_alpha": 45, "Completed": 62, "Broken": 28, "Compromised": 6, "Stagnant": 33, "date": "2017-04-01T07:00:00.000Z"},
        {"Not_implemented": 325, "In_alpha": 45, "Completed": 62, "Broken": 30, "Compromised": 6, "Stagnant": 35, "date": "2017-05-01T07:00:00.000Z"},
        {"Not_implemented": 320, "In_alpha": 45, "Completed": 62, "Broken": 30, "Compromised": 6, "Stagnant": 40, "date": "2017-06-01T07:00:00.000Z"},
        {"Not_implemented": 310, "In_alpha": 45, "Completed": 62, "Broken": 30, "Compromised": 6, "Stagnant": 50, "date": "2017-07-01T07:00:00.000Z"},
        {"Not_implemented": 307, "In_alpha": 46, "Completed": 63, "Broken": 31, "Compromised": 6, "Stagnant": 51, "date": "2017-08-01T07:00:00.000Z"},
        {"Not_implemented": 307, "In_alpha": 46, "Completed": 63, "Broken": 31, "Compromised": 6, "Stagnant": 53, "date": "2017-09-01T07:00:00.000Z"},
        {"Not_implemented": 305, "In_alpha": 46, "Completed": 63, "Broken": 31, "Compromised": 6, "Stagnant": 55, "date": "2017-10-01T07:00:00.000Z"},
        {"Not_implemented": 298, "In_alpha": 46, "Completed": 69, "Broken": 32, "Compromised": 6, "Stagnant": 57, "date": "2017-11-01T07:00:00.000Z"},
        {"Not_implemented": 298, "In_alpha": 46, "Completed": 70, "Broken": 32, "Compromised": 6, "Stagnant": 57, "date": "2017-12-01T08:00:00.000Z"},
        {"Not_implemented": 290, "In_alpha": 47, "Completed": 70, "Broken": 35, "Compromised": 6, "Stagnant": 64, "date": "2018-01-01T08:00:00.000Z"},
        {"Not_implemented": 283, "In_alpha": 47, "Completed": 70, "Broken": 35, "Compromised": 6, "Stagnant": 72, "date": "2018-02-01T08:00:00.000Z"},
        {"Not_implemented": 259, "In_alpha": 47, "Completed": 70, "Broken": 38, "Compromised": 6, "Stagnant": 94, "date": "2018-03-01T08:00:00.000Z"},
        {"Not_implemented": 246, "In_alpha": 47, "Completed": 71, "Broken": 38, "Compromised": 6, "Stagnant": 114, "date": "2018-04-01T07:00:00.000Z"},
        {"Not_implemented": 223, "In_alpha": 47, "Completed": 71, "Broken": 38, "Compromised": 6, "Stagnant": 140, "date": "2018-05-01T07:00:00.000Z"},
        {"Not_implemented": 200, "In_alpha": 47, "Completed": 71, "Broken": 38, "Compromised": 6, "Stagnant": 163, "date": "2018-06-01T07:00:00.000Z"},
        {"Not_implemented": 176, "In_alpha": 47, "Completed": 71, "Broken": 38, "Compromised": 6, "Stagnant": 187, "date": "2018-07-01T07:00:00.000Z"},
        {"Not_implemented": 146, "In_alpha": 47, "Completed": 71, "Broken": 39, "Compromised": 6, "Stagnant": 217, "date": "2018-08-01T07:00:00.000Z"},
        {"Not_implemented": 138, "In_alpha": 48, "Completed": 71, "Broken": 39, "Compromised": 6, "Stagnant": 227, "date": "2018-09-01T07:00:00.000Z"},
        {"Not_implemented": 122, "In_alpha": 49, "Completed": 71, "Broken": 39, "Compromised": 6, "Stagnant": 244, "date": "2018-10-01T07:00:00.000Z"},
        {"Not_implemented": 126, "In_alpha": 49, "Completed": 71, "Broken": 39, "Compromised": 6, "Stagnant": 245, "date": "2018-11-01T07:00:00.000Z"},
        {"Not_implemented": 123, "In_alpha": 49, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 248, "date": "2018-12-01T08:00:00.000Z"},
        {"Not_implemented": 116, "In_alpha": 49, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 257, "date": "2019-01-01T08:00:00.000Z"},
        {"Not_implemented": 114, "In_alpha": 49, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 259, "date": "2019-02-01T08:00:00.000Z"},
        {"Not_implemented": 115, "In_alpha": 49, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 259, "date": "2019-03-01T08:00:00.000Z"},
        {"Not_implemented": 115, "In_alpha": 50, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 259, "date": "2019-04-01T07:00:00.000Z"},
        {"Not_implemented": 115, "In_alpha": 50, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 259, "date": "2019-05-01T07:00:00.000Z"},
        {"Not_implemented": 110, "In_alpha": 50, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 264, "date": "2019-06-01T07:00:00.000Z"},
        {"Not_implemented": 111, "In_alpha": 50, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 264, "date": "2019-07-01T07:00:00.000Z"},
        {"Not_implemented": 106, "In_alpha": 50, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 269, "date": "2019-08-01T07:00:00.000Z"},
        {"Not_implemented": 107, "In_alpha": 50, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 269, "date": "2019-09-01T07:00:00.000Z"},
        {"Not_implemented": 104, "In_alpha": 50, "Completed": 72, "Broken": 39, "Compromised": 6, "Stagnant": 273, "date": "2019-10-01T07:00:00.000Z"}
    ];
    const brokenArray = [], stagnantArray = [], notimplementedArray = [], inalphaArray = [], compromisedArray = [], completedArray = [], labels = [];

    // Build data arrays
    for (let _i = 0, History_1 = History; _i < History_1.length; _i++) {
        const month = History_1[_i];
        switch (para_Type) {
            default:
                brokenArray.push(month.Broken);
                stagnantArray.push(month.Stagnant);
                notimplementedArray.push(month.Not_implemented);
                inalphaArray.push(month.In_alpha);
                compromisedArray.push(month.Compromised);
                completedArray.push(month.Completed);
                break;
            case "Broken":
                brokenArray.push(month.Broken);
                break;
            case "Stagnant":
                stagnantArray.push(month.Stagnant);
                break;
            case "Not implemented":
                notimplementedArray.push(month.Not_implemented);
                break;
            case "In alpha":
                inalphaArray.push(month.In_alpha);
                break;
            case "Compromised":
                compromisedArray.push(month.Compromised);
                break;
            case "Completed":
                completedArray.push(month.Completed);
                break;
        }
        // Labels always needed to mark each tick on the graph
        labels.push(month.date);
    }

    // Charts Data
    const ctx = document.getElementById("timechart");
    const data = {
        labels: labels,
        datasets: [{
            label: "Broken",
            backgroundColor: "#f2dede",
            borderColor: "#c56d6d",
            borderWidth: 1,
            fill: 'origin',
            data: brokenArray
        }, {
            label: "Stagnant",
            backgroundColor: "#fcddc4",
            borderColor: "#f5903d",
            fill: 'origin',
            data: stagnantArray
        }, {
            label: "Not implemented",
            backgroundColor: "#fcf8e3",
            borderColor: "#ecd046",
            fill: 'origin',
            data: notimplementedArray
        }, {
            label: "In alpha",
            backgroundColor: "#d9edf7",
            borderColor: "#57afdb",
            fill: 'origin',
            data: inalphaArray
        }, {
            label: "Compromised",
            backgroundColor: "#ccdde8",
            borderColor: "#72a1c0",
            fill: 'origin',
            data: compromisedArray
        }, {
            label: "Completed",
            backgroundColor: "#dff0d8",
            borderColor: "#86c66c",
            fill: 'origin',
            data: completedArray
        }]
    };

    // Add any shared elements to all datasets
    for (let i = 0; i < data.datasets.length; i++) {
        data.datasets[i].borderWidth = 1;
        data.datasets[i].pointRadius = 1;
        data.datasets[i].pointHitRadius = 10;
        data.datasets[i].pointHoverRadius = 6;
        data.datasets[i].pointHoverBorderWidth = 3;
    }

    // Update chart data if already created
    if (typeof (AllChart) == "object") {
        AllChart.config.data = data;
        AllChart.update();
    } else {
        Chart.defaults.plugins.legend.display = false;
        AllChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                interaction: {
                    mode: 'index'
                },
                spanGaps: true,
                animation: false,
                tooltips: {
                    mode: "label",
                    position: "nearest",
                    titleAlign: "center"
                },
                scales: {
                    x: {
                        type: 'time',
                        min: new Date('2012-10-01').valueOf(),
                        stacked: true,
                        ticks: { autoSkip: false },
                        time: {
                            tooltipFormat:'MMM YYYY',
                            displayFormats: {
                                'millisecond': 'MMM YYYY',
                                'second': 'MMM YYYY',
                                'minute': 'MMM YYYY',
                                'hour': 'MMM YYYY',
                                'day': 'MMM YYYY',
                                'week': 'MMM YYYY',
                                'month': 'MMM YYYY',
                                'quarter': 'MMM YYYY',
                                'year': 'MMM YYYY',
                            }
                        }
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });
    }
}

// Build AllChart with default input
Build_and_fill_Chart();
