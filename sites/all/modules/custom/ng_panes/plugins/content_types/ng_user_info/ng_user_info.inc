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
  'title' => t('NG user info'),
  'single' => TRUE,
  'icon' => 'icon_page.png',
  'description' => t('Add user info and/or login and register to the header'),
  'render callback' => 'ng_user_info_content_type_render',
  'category' => t('Page elements'),
  'hook theme' => 'ng_user_pane_content_type_theme'
);

/**
 * Output function for the 'page_primary_links' content type.
 *
 * Outputs the primary_links (local tasks) of the current page.
 */
function ng_user_info_content_type_render($subtype, $conf, $panel_args) {
  global $user;
  $user = user_load($user->uid);
  
  $block = new stdClass();
  
  // Add settings
  $user_name = 'Anonymous';
  $user_uid = '0';
  if ($user->uid) {
    $user_name = $user->name;
    $user_uid = $user->uid;
  }
  // Check if picture exists
  if (isset($user->picture->uri)) {
    $user_image_url = image_style_url('user_thumb_small', image_style_path('user_thumb_small', $user->picture->uri));
  }
  else {
    $user_image_url = image_style_url('user_thumb_small', image_style_path('user_thumb_small', 'public://ts_logo.png'));
  }
  
  // --- JS files ---
  // Add angular js files
  drupal_add_js(libraries_get_path('angularjs').'/angular-resource.min.js', array('group' => JS_LIBRARY, 'weight' => 1));
  
  // Primary app js file
  drupal_add_js(drupal_get_path('module', 'ng_panes') . '/plugins/content_types/ng_user_info/js/ng_user_info.js');
  
  // Required settings  
  drupal_add_js( // add user settings info for the frontend to pick up
    array(
      'ng_panes' => array(
        'ng_user_info' => array(
          'user_name' => $user_name, 
          'user_uid' => $user_uid,
          'user_image_url' => $user_image_url
        )
      )
    ), 
  'setting');
  // --- end js additions ---
   
  $block->content = theme('ng_user_info_pane', array());
  return $block;
}

function ng_user_pane_content_type_theme(&$theme, $plugin) {
  $theme['ng_user_info_pane'] = array(
    'variables' => array(),
    'path' => $plugin['path'],
    'template' => 'templates/ng_user_info_pane'
  );
}

/**
 * Returns an edit form for custom type settings.
 */
function ng_user_info_content_type_edit_form($form, &$form_state) {
  // Empty so that we can have title override.
  return $form;
}


