<?php

/**
 * Implement hook_services_resources()
 */
function path_alias_service_services_resources() {
  $api = array(
    'alias' => array(
      'operations' => array(
        'retrieve' => array(
          'help' => 'Get a path alias from the server',
          'callback' => '_path_alias_service_retrieve',
          'access callback' => 'user_access',
          'access arguments' => array('access content'),
          'access arguments append' => FALSE,
          'args' => array(
            array(
              'name' => 'type',
              'type' => 'string',
              'description' => t('Type of object being aliased (node, user, term)'),
              'source' => array('path' => '0'),
              'optional' => FALSE
            ),
            array(
              'name' => 'id',
              'type' => 'string',
              'description' => t('Id of item being aliased'),
              'source' => array('param' => 'id'),
              'optional' => FALSE
            )
          )
        )
      )
    )
  );
  return $api;
}


function _path_alias_service_retrieve($type, $id) {
  $path = '';
  //$language = language_default();
  
  switch ($type) {
    case 'term':
      $path = 'taxonomy/term/'.$id;
      break;
    case 'node':
      $path = 'node/'.$id;
      break;
    case 'user':
      $path = 'user/'.$id;
      break;
  }
  $ret = new stdClass();
  $ret->id    = $id;
  $ret->alias = drupal_get_path_alias($path);
  
  return $ret;  
}

