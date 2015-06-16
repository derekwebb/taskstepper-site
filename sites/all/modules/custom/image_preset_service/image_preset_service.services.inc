<?php

/**
 * Implement hook_services_resources()
 */
function image_preset_service_services_resources() {
  $api = array(
    'image' => array(
      'operations' => array(
        'retrieve' => array(
          'help' => 'Generate an image with a style ',
          'callback' => '_image_preset_service_retrieve',
          'access callback' => 'user_access',
          'access arguments' => array('access content'),
          'access arguments append' => FALSE,
          'args' => array(
            array(
              'name' => 'style',
              'type' => 'string',
              'description' => t('Image preset style use'),
              'source' => array('path' => '0'),
              'optional' => FALSE
            ),
            array(
              'name' => 'uri',
              'type' => 'string',
              'description' => t('Image uri to use'),
              'source' => array('param' => 'uri'),
              'optional' => FALSE
            )
          )
        )
      )
    )
  );
  return $api;
}


function _image_preset_service_retrieve($style, $uri) {
  return (object) array(
    'image' => image_style_url($style, $uri)
  ); 
}

