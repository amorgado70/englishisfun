angular.module("myApp", []).controller("hstController", function ($scope) {
    $scope.amounts = [];
    $scope.subtotal = 0;
    $scope.grandtotal = 0;
    $scope.province = "ON";
    $scope.addAmount = function (nAmount) {
        $scope.amounts.push($scope.amount);
        $scope.subtotal += Number($scope.amount);
        $scope.grandtotal = $scope.subtotal + $scope.hst();
        $scope.amount = "";
    };
    $scope.hst = function () {
        var nRc = 0;
        switch($scope.province){
            case 'AB':
                nRc = Number($scope.subtotal) * .05;
                break;
            case 'QC':
                nRc = Number($scope.subtotal) * .14975;
                break;
            default:
                nRc = Number($scope.subtotal) * .13;

        }
        return nRc;
    }

});
