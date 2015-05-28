<?php

/**
 * @file
 * Plugin to handle the 'page' content type which allows the standard page
 * template variables to be embedded into a panel.
 */

/**
 * Plugins are described by creating a $plugin array which will be used
 * by the system that includes this file.
 */
$plugin = array(
  'title' => t('NG guide list'),
  'single' => TRUE,
  'icon' => 'icon_page.png',
  'description' => t('View and edit TaskStepper guides'),
  'render callback' => 'ng_guide_list_content_type_render',
  'category' => t('Guide'),
  'hook theme' => 'ng_guide_list_content_type_theme'
);

function ng_guide_list_content_type_render() {
  global $user;
  $user = user_load($user->uid);
  
  // Add js files
  
  
  
  // --- JS files ---
  // Add angular js files
  drupal_add_js(libraries_get_path('angularjs').'/angular-resource.min.js', array('group' => JS_LIBRARY, 'weight' => 1));
  //drupal_add_js(libraries_get_path('angularjs').'/angular-route.min.js', array('group' => JS_LIBRARY, 'weight' => 1));
  
  // Primary app js file
  drupal_add_js(drupal_get_path('module', 'ng_panes') . '/plugins/content_types/ng_guide_list/js/ng_guide_list.js');
  drupal_add_js(drupal_get_path('module', 'ng_panes') . '/plugins/content_types/ng_guide_list/js/controllers/ng_guide_list_controllers.js');
  
  // Required settings  
  // drupal_add_js(array(),'setting'); // see ng_user_info.inc for example.
  // --- end js additions ---
  
  $block = new stdClass();
  $block->title = t('NG guide list');
  $block->content = theme('ng_guide_list_pane', array());
  return $block;
}

function ng_guide_list_content_type_theme(&$theme, $plugin) {
  $theme['ng_guide_list_pane'] = array(
    'variables' => array(),
    'path' => $plugin['path'],
    'template' => 'templates/ng_guide_list_pane'
  );
}

/**
 * Returns an edit form for custom type settings.
 */
function ng_guide_list_content_type_edit_form($form, &$form_state) {
  // Empty so that we can have title override.
  return $form;
}
