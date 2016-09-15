angular.module("myApp", []).controller("wordController", function ($scope) {
    $scope.letters = [];
    $scope.teste = "";
    $scope.addChar = function (keyEvent) {
        // Read only letters
        var charCode = keyEvent.which;
        if (( charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123 ))
        {
        var oneChar = String.fromCharCode(charCode).toUpperCase() ;
        $scope.letters.push(oneChar);
        }
        $scope.teste = "";
    };
});