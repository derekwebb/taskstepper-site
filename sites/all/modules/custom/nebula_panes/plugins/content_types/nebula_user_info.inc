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
  'title' => t('Nebula user info'),
  'single' => TRUE,
  'icon' => 'icon_page.png',
  'description' => t('Add user info to the header'),
  'render callback' => 'nebula_user_info_content_type_render',
  'category' => t('Page elements')
);

/**
 * Output function for the 'page_primary_links' content type.
 *
 * Outputs the primary_links (local tasks) of the current page.
 */
function nebula_user_info_content_type_render($subtype, $conf, $panel_args) {
  $block = new stdClass();
  
  global $user;
  $user = user_load($user->uid); // load addons like picture
  
  if ($user->uid) {
    $title   = t("View profile of ".$user->name);
    $picture = nebula_compile_default_user_image($user, 'user_thumb_small', $title);
    $picture = l($picture, 'user/'.$user->uid, array('html' => TRUE));
    $name    = l($user->name, 'user/'.$user->uid, array('attributes'=>array('title' => t('View profile of '.$user->name))));
    $status  = '<span class="user-status"><i></i><span></span></span>';
    
    $block->content = $picture.$name.$status;
  }
  else {
    $login    = '<span class="login">'.l('Login', 'user/login').'</span>';
    $register = '<span class="register">'.l('Register', 'user/register').'</span>';
    
    $block->content = $register.$login;
  }
  
  return $block;
}

/**
 * Returns an edit form for custom type settings.
 */
function nebula_user_info_content_type_edit_form($form, &$form_state) {
  // Empty so that we can have title override.
  return $form;
}


