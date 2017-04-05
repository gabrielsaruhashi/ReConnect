<?php //header( 'Location: /index.html' ) ;
  $app->get('/', function() use($app) {
    $app['monolog']->addDebug('logging output.');
    readfile('index.html');;
  });


  ?>
