angular.module("myApp", []).controller("wordController", function ($scope, $window) {    
    var chars;
    var solution;
    initialize();
    function initialize(){
        chars = "";
        solution = $window.document.getElementById("solution").innerText;
        solution = solution.toUpperCase();
        $scope.charInput = "";
        $scope.charsOutput = chars;
        var element = $window.document.getElementById("charInput");
        element.focus();
    }
    $scope.initChars = function () {
        initialize();
    };    
    $scope.addChar = function (keyEvent) {
        // Read only letters
        var charCode = keyEvent.which;
        if (( charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123 ))
        {
            var oneChar = String.fromCharCode(charCode).toUpperCase() ;
            chars = chars + oneChar;                       
        }
        if( charCode == 8 || charCode == 46 )
        {
            chars = chars.substring(0,(chars.length -1))
        }
        $scope.charInput = "";
        $scope.charsOutput = chars;
    };
    $scope.checkChars = function () {
        if ( chars == solution.substring(0,chars.length) )
        {
                return true;
        }
        else
        {
                return false;
        }
    };
    $scope.checkWord = function () {
        if ( chars == solution )
        {
                var element = $window.document.getElementById("nextURL");
                element.focus();
                return true;
        }
        else
        {
                return false;
        }
    };
});