angular.module('pikaday', [])

.constant('PikadayConfig', {})

.directive('pikaday', ['PikadayConfig', function(PikadayConfig) {
    PikadayConfig = PikadayConfig || {};

    return {
        scope: {
            'date': '=ngModel',
            'pikadayObject': '='
        },
        require: 'ngModel',
        link: function ($scope, elem, attrs) {
            var options = {
                field: elem[0],
                defaultDate: $scope.date
            };
            angular.extend(options, PikadayConfig, attrs.pikaday ? $scope.$parent.$eval(attrs.pikaday) : {});

            var onSelect = options.onSelect;

            options.onSelect = function(date) {
                $scope.date = date;
                $scope.$apply($scope.date);

                if (angular.isFunction(onSelect)) {
                    onSelect();
                }
            };

            // Adds weekday/weekend class to cells
            // Pikaday hides render implementation, need to consider forking it
            options.onDraw = function() {
              var $el, sundayIndex, saturdayIndex;
              $el = $(this.el);
              saturdayIndex = (6 - this._o.firstDay) % 7;
              sundayIndex = (saturdayIndex + 1) % 7;
              _.each([saturdayIndex, sundayIndex], function(index) {
                $el.find("th:eq("+ index + ")").addClass("weekend");
                $el.find("tr td:nth-child(" + (index + 1) + ")").addClass("weekend");
              })
              $el.find("tr > :not(.weekend)").addClass("weekday");
            }

            $scope.pikadayObject = new Pikaday(options);

            $scope.$on('$destroy', function() {
                $scope.pikadayObject.destroy();
            });
        }
    };
}]);
