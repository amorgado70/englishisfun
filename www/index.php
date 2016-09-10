<?php


require __DIR__ . "/../vendor/autoload.php";

//connect to database
//$oDb = new PDO("sqlite:" . __DIR__ . "/../products.sqlite");
$oDb = new PDO("sqlite:" . __DIR__ . "/../products_.sqlite");

$oApp = new \Slim\Slim(array(
        'view' => new \PHPView\PHPView(),
        'templates.path' => __DIR__ . "/../views" ));

$oApp->get("/", function(){
    renderCategory();
});

$oApp->get("/about", function()use($oApp){
   $oApp->render("about_.phtml");
});

$oApp->get("/topdeals", function()use($oApp){
   $oApp->render("topdeals_.phtml");
});

$oApp->get("/contact", function()use($oApp){
   $oApp->render("contact_.phtml");
});

$oApp->get("/credits", function(){
   renderCredits();
});

$oApp->get("/success", function()use($oApp){
   $oApp->render("success_.phtml");
});

$oApp->get("/failure", function()use($oApp){
   $oApp->render("failure_.phtml");
});

$oApp->get("/products/:productID", function($nId){
    renderProduct($nId);
});

$oApp->post("/", function() use($oApp, $oDb){
    $oData = json_decode($oApp->request->body);
    print_r($oData);
});

$oApp->run();

function renderCredits(){
    global $oApp, $oDb;
    //fetching list of products
    $oStmt = $oDb->prepare("SELECT * FROM products");
    $oStmt->execute();
    $aProducts = $oStmt->fetchAll(PDO::FETCH_OBJ);

    //fetching list of categories
    $oStmt = $oDb->prepare("SELECT * FROM categories");
    $oStmt->execute();
    $aCategories = $oStmt->fetchAll(PDO::FETCH_OBJ);

    // render template with data
    $oApp->render("credits_.phtml", array("products"=>$aProducts, "categories"=>$aCategories));
}

function renderCategory(){
    global $oApp, $oDb;
    //fetching list of categories
    $oStmt = $oDb->prepare("SELECT * FROM categories");
    $oStmt->execute();
    $aCategories = $oStmt->fetchAll(PDO::FETCH_OBJ);

    // render template with data
    $oApp->render("category_.phtml", array("categories"=>$aCategories));
}


function renderProduct($nId){
    global $oApp, $oDb;
    // fetching product
    $oStmt = $oDb->prepare("SELECT * FROM products WHERE productID = :id");
    $oStmt->bindParam("id", $nId);
    $oStmt->execute();
    $aProduct = $oStmt->fetchAll(PDO::FETCH_OBJ);

    //fetching images
    $oStmt = $oDb->prepare("SELECT * FROM images WHERE productID = :id");
    $oStmt->bindParam("id", $nId);
    $oStmt->execute();
    $aImages = $oStmt->fetchAll(PDO::FETCH_OBJ);

    //fetching offers
    $oStmt = $oDb->prepare("SELECT * FROM offers WHERE productID = :id");
    $oStmt->bindParam("id", $nId);
    $oStmt->execute();
    $aOffers = $oStmt->fetchAll(PDO::FETCH_OBJ);

    //fetching list of products
    $oStmt = $oDb->prepare("SELECT * FROM products");
    $oStmt->execute();
    $aProducts = $oStmt->fetchAll(PDO::FETCH_OBJ);

    //fetching list of categories
    $oStmt = $oDb->prepare("SELECT * FROM categories");
    $oStmt->execute();
    $aCategories = $oStmt->fetchAll(PDO::FETCH_OBJ);

    // render template with data
    $oApp->render("product_.phtml", array("product"=>$aProduct[0],"images"=>$aImages, "offers"=>$aOffers, "products"=>$aProducts,"categories"=>$aCategories));
}
