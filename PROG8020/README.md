# [PROG8020 Project 2 Start](https://github.com/rhildred/PROG8020Project2Start)
This is part 2 of a [product page](https://github.com/rhildred/PROG8020ProjectStart). This one adds basic Create Read Update and Delete (CRUD) functionality. My intention is to complete the functionality as a way of "taking this up" after the term is up. The thing about CRUD is that it is intertwined with security. You don't want just anyone to be able to update the products that you offer. To deal with the security we add the rhildred/oauth2 composer module.

```
{
    "require": {
        "slim/slim": "^2.6",
        "rhildred/slimphpviews": "dev-master",
        "rhildred/editable": "dev-master",
        "rhildred/oauth2": "dev-master"
    }
}

```

We also add a page views/crud.phtml. This page makes use of angular.js and the following UI to provide a user interface for CRUD:

```

<div class="bookmark container" ng-app="myApp" ng-controller="myCtrl">
    <h1>Product Maintenance</h1>
    <div class="row">
        <h3 class="col-md-2">Name</h3><h3 class="col-md-6">Description</h3>
    </div>
    <div class="row" ng-repeat="product in products track by $index">
        <div class="col-md-2">{{product.name}}</div><div class="col-md-6">{{product.description}}</div>
        <div class="col-md-4">
            <button type="button" class="btn btn-primary btn-large" data-toggle="modal" data-target="#createUpdate" ng-click="editProduct($index)"><i class="fa fa-pencil"></i>&nbsp;Edit</button>
            <button type="button" class="btn btn-danger btn-large" data-toggle="modal" data-target="#delete" ng-click="checkDelete($index)"><i class="fa fa-remove"></i>&nbsp;Delete</button>
        </div>
    </div>
    <div class="row">
        <button type="button" class="btn btn-primary btn-large" data-toggle="modal" data-target="#createUpdate" ng-click="addProduct()"><i class="fa fa-plus"></i>&nbsp;Add</button>

    </div>
    <!-- Create/Update -->
    <div class="modal fade" id="createUpdate" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">{{title}}</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" role="form">
                          <div class="form-group">
                            <label class="control-label col-sm-3" for="productname">Name:</label>
                            <div class="col-sm-9">
                                <input ng-model="currentProduct.name" placeholder="product name" id="productname" class="form-control"/>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="control-label col-sm-3" for="productdescription">Description:</label>
                            <div class="col-sm-9"> 
                                <textarea ng-model="currentProduct.description" placeholder="product description" id="productdescription" class="form-control"></textarea>
                            </div>
                          </div>
                    </form>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="saveProduct()"><i class="fa fa-database"></i>&nbsp;Save</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </div>

        </div>

    </div>


```

The `createUpdate` dialog is a standard bootstrap dialog that gets triggered by the buttons using the bootstrap javascript. As the dialogs are triggered though, the angular `addProduct` and `editProduct` methods are called to set up the contents of the dialog.

```
        $scope.editProduct = function(nProduct){
            // get ready to show the dialog
            angular.extend($scope.currentProduct, $scope.products[nProduct]);
            $scope.nCurrent = nProduct;
            $scope.title="Edit Product";
        };
        $scope.addProduct = function(){
            // get ready to show the dialog
            $scope.currentProduct = {};
            $scope.nCurrent = -1;
            $scope.title="Add Product";
        };


```

The crud methods themselves are invoked buttons on the dialogs themselves.

```

        $scope.saveProduct = function(){
            if($scope.nCurrent == -1){
                // then add a new product to the list
                $http.post("/crud/products", $scope.currentProduct).success(function(oProduct){
                    $scope.products.push(oProduct);
                }).error(failure);
            }else{
                // copy the product back in to the list
                $http.post("/crud/products/" + $scope.currentProduct.productID, $scope.currentProduct).success(function(oProduct){
                    $scope.products[$scope.nCurrent] = oProduct;
                }).error(failure);
            }
        };
        $scope.deleteProduct = function(){
            // remove the product from the list
            $http.delete("/crud/products/" + $scope.currentProduct.productID).success(function(){
                $scope.products.splice($scope.nCurrent, 1);
            }).error(failure);
        };


```

These methods call the index.php crud/products endpoint which are protected by `new \Auth()` from being accessed unless the user is logged in:

```

$oApp->get("/crud/products", new \Auth(), function() use($oDb){
    $oStmt = $oDb->prepare("SELECT * FROM products");
    $oStmt->execute();
    $aProducts = $oStmt->fetchAll(PDO::FETCH_OBJ);
    echo json_encode($aProducts);
});
$oApp->post("/crud/products", new \Auth(), function() use($oDb, $oApp){
    $oData = json_decode($oApp->request->getBody());
    $oStmt = $oDb->prepare("INSERT INTO products(name, description) VALUES(:name, :description)");
    $oStmt->bindParam("name", $oData->name);
    $oStmt->bindParam("description", $oData->description);
    $oStmt->execute();
    $oData->productID = $oDb->lastInsertId();
    echo json_encode($oData);
});
$oApp->post("/crud/products/:productID", new \Auth(), function($nProductID) use($oDb, $oApp){
    $oData = json_decode($oApp->request->getBody());
    $oStmt = $oDb->prepare("UPDATE products SET name = :name, description = :description where productID = :id");
    $oStmt->bindParam("name", $oData->name);
    $oStmt->bindParam("description", $oData->description);
    $oStmt->bindParam("id", $nProductID);
    $oStmt->execute();
    echo json_encode($oData);
});
$oApp->delete("/crud/products/:productID", new \Auth(), function($nProductID) use($oDb, $oApp){
    $oStmt = $oDb->prepare("DELETE FROM products where productID = :id");
    $oStmt->bindParam("id", $nProductID);
    $oStmt->execute();
    echo '{"result":"success"}';
});



```

Users become logged in by accessing the login url:

```

// endpoints for auth
$oApp->get("/login", function() use( $oApp){
    // see if this is the original redirect or if it's the callback
    $sCode = $oApp->request->params('code');
    // get the uri to redirect to
    $sUrl = "http";
    if(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443)
    {
        $sUrl .= "s";
    }
    $sUrl .= "://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
    $oAuth = new \Oauth2($sUrl);
    if($sCode == null){
        $oApp->response->redirect($oAuth->redirectUrl());
    }else{
        $oAuth->handleCode($sCode);
        $oApp->response->redirect("/");
    }
});
$oApp->get("/currentUser", new \Auth(), function() use($oApp){
    echo json_encode($_SESSION['CurrentUser']);
});
$oApp->get("/logout", function(){
    session_start();
    unset($_SESSION["CurrentUser"]);
});

```

 which in turn accesses a file holding google oauth2 credentials /creds/google.json


```

{"ClientID":"<your client id>", "ClientSecret":"<your client secret>",
"Users":["<email of person you want to be able to update>"]}
Status API Training Shop Blog About Pricing


```