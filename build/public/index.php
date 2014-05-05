<?php

/* Environment */
$host = $_SERVER['HTTP_HOST'];
$base_url = "http://" . $host;
$full_url = $base_url . dirname($_SERVER['REQUEST_URI']);
$minified_js = false;
$environment_id;
if(strpos($full_url,'valhalla-client') > 0){
    $environment_id = 'local';
}else if(strpos($full_url,'labs') > 0){
    $environment_id = 'dev';
}

/* Misc Vars */
$version_number = '1.3.1';

?><!DOCTYPE html>

<!--[if lt IE 7]>      <html itemscope itemtype="http://schema.org/Blog" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html itemscope itemtype="http://schema.org/Blog" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html itemscope itemtype="http://schema.org/Blog" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html itemscope itemtype="http://schema.org/Blog" class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Valhalla - Client</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <!-- FB/G+ Open Graph Meta Data -->
        <meta property="og:title" content="Title"/>
        <meta property="og:description" content="Description"/>
        <meta property="og:url" content="<?php echo str_replace('"', '&quot;', $base_url); ?>"/>
        <meta property="og:image" content=""/>
        <meta property="og:site_name" content=""/>

        <!-- Twitter Meta Data -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="">
        <meta name="twitter:description" content="">
        <meta name="twitter:image" content="">

        <link rel="stylesheet" href="assets/css/main.min.css?v=<?php echo $version_number; ?>">

        <script src="assets/js/lib/modernizr/modernizr.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
         <script>
            var environments = {
                local:{
                    server:'http://valhalla-server:8080',
                    assetRoot:'/assets/'
                },
                dev:{
                    server:'http://ec2-54-187-105-51.us-west-2.compute.amazonaws.com',
                    assetRoot:'/labs/valhalla/assets/'
                }
            };
            var environmentId = '<?php echo $environment_id ?>';
            var environment = environments[environmentId];
        </script>
        <?php echo $minified_js ? '<script src="assets/js/main.min.js?v='.$version_number.'" data-main="assets/js/main"></script>' : '<script src="assets/js/lib/require/require.js" data-main="assets/js/main"></script>'; ?>
    </body>
</html>


