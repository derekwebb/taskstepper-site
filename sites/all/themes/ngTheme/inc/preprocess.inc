<?php

/**
 * Preprocess variables for html.tpl.php
 */
function ngTheme_preprocess_html(&$vars) {
  global $language;
  global $user;
  $user = user_load($user->uid);

  // First check if libraries module exists.
  // Look for html5 and responsive js files for IE. Use them if found, else
  // use external source.
  if (module_exists('libraries', 1.0)) {
    $respond_path = libraries_get_path('Respond') . '/respond.min.js';
    $html5_path = libraries_get_path('html5') . '/html5.js';
    $vars['nebula_lib']['ie']['respond_path'] = file_exists($respond_path) ? base_path() . $respond_path : 'https://raw.github.com/scottjehl/Respond/master/respond.min.js';
    $vars['nebula_lib']['ie']['html5_path'] = file_exists($html5_path) ? base_path() . $html5_path : 'http://html5shim.googlecode.com/svn/trunk/html5.js';
  }
  if (module_exists('rdf')) {
    $vars['doctype'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML+RDFa 1.1//EN">' . "\n";
    $vars['rdf']->version = 'version="HTML+RDFa 1.1"';
    $vars['rdf']->namespaces = $vars['rdf_namespaces'];
    $vars['rdf']->profile = ' profile="' . $vars['grddl_profile'] . '"';
  }
  else {
    $vars['doctype'] = '<!DOCTYPE html>' . "\n";

    if (!isset($vars['rdf'])) {
      $vars['rdf'] = new stdClass();
    }

    $vars['rdf']->version = '';
    $vars['rdf']->namespaces = '';
    $vars['rdf']->profile = '';
  }

  // Attributes for html element.
  $vars['html_attributes'] = 'lang="' . $language->language . '" dir="' . $language->dir . '"';
  
  // Add fonts css external files
  drupal_add_css('http://fonts.googleapis.com/css?family=Lora:400,700', array('group' => CSS_THEME, 'type' => 'external'));
  drupal_add_css('http://fonts.googleapis.com/css?family=Open+Sans:300italic,600italic,400,300,600', array('group' => CSS_THEME, 'type' => 'external'));
  
  // Frameworks
  drupal_add_js(libraries_get_path('underscore').'/underscore-min.js', array('group' => JS_LIBRARY));
  drupal_add_js(libraries_get_path('backbone').'/backbone-min.js', array('group' => JS_LIBRARY));
  drupal_add_js(libraries_get_path('angularjs').'/angular.min.js', array('group' => JS_LIBRARY));
  drupal_add_js(libraries_get_path('angularjs').'/angular-resource.min.js', array('group' => JS_LIBRARY, 'weight' => 1));
  drupal_add_js(libraries_get_path('angularjs').'/angular-sanitize.min.js', array('group' => JS_LIBRARY, 'weight' => 2));
  
  // Settings ---
  // Compile settings
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
    $user_image_url = image_style_url('user_thumb_small', image_style_path('user_thumb_small', 'public://ts_logo_med.png'));
  }
  
  // Required settings  
  drupal_add_js( // add user settings info for the frontend to pick up
    array(
      'ng_blocks' => array(
        'user_info' => array(
          'user_name' => $user_name, 
          'user_uid' => $user_uid,
          'user_image_url' => $user_image_url,
          'user_thumbnail_med_preset' => 'user_thumb',
          'user_thumbnail_sml_preset' => 'user_thumb_small',
          'user_default_image' => theme_get_setting('logo_path')
        )
      )
    ), 
  'setting');
  // End settings ---
}

function ngTheme_preprocess($vars, $hook) {
  //dpm($hook);
}

// Add form id theme hook suggestions.
function ngTheme_preprocess_form(&$vars) {
  $vars['theme_hook_suggestions'][] = 'form_'.$vars['element']['#form_id'];
}


function ngTheme_preprocess_page(&$vars) {
  
  // Hide the title if the hide title field is set
  $node = $vars['node'];
  if (isset($node->field_hide_title) && field_get_items('node', $node, 'field_hide_title')) {
    $vars['title'] = false;  
  }
  
  // Hide $tabs variable if no tabs are present
  if ($vars['tabs']['#primary'] == '') {
    $vars['tabs'] = FALSE;
  }
  
}

// Preprocess blocks
function ngTheme_preprocess_block(&$vars) {
  //dpm($vars);
  $path = drupal_get_path('theme', 'ngTheme');
  $suggestions = $vars['theme_hook_suggestions'];
  foreach($suggestions as $suggestion) {
    //dpm($suggestion);  
    // Add the css
    if (file_exists($path.'/css/blocks/'.$suggestion.'.css')) drupal_add_css($path.'/css/blocks/'.$suggestion.'.css', array('group' => CSS_THEME));
    // Add the js
    if (file_exists($path.'/js/blocks/'.$suggestion.'.js'))   drupal_add_js($path.'/js/blocks/'.$suggestion.'.js', array('group' => JS_THEME));
  }
}


// Compile a default user picture and link
function ngTheme_preprocess_user_picture(&$vars) {
  $a0 = arg(0); $a1 = arg(1); $a2 = arg(2);

  $account = $vars['account'];
  $title = '';
  if (isset($account->name)) {
    $title = t('View profile of '.$account->name);
  }

  $styles = image_styles();
  
  if (isset($vars['image_style']) && array_key_exists($vars['image_style'], $styles)) {
    $image_style = $vars['image_style'];
  }

  if ($a0 == 'user') { // thumbnail (larger than normal)
    $image_style = (!isset($image_style)) ? 'user_thumb' : $image_style;
    $vars['user_picture'] = ngTheme_compile_default_user_image($account->uid, $image_style, $title);
  }
  else {
    $image_style = (!isset($image_style)) ? 'user_thumb_small' : $image_style;
    $vars['user_picture'] = ngTheme_compile_default_user_image($account->uid, $image_style, $title);
  }
}


// Compiles a user image
function ngTheme_compile_default_user_image($user, $image_style, $title) {
  $uri = variable_get('ng_theme_default_user_img', 'public://ts_logo_med.png'); // default image

  if (is_numeric($user)) $user = user_load($user);
  if (is_object($user) && $user->uid) {
    if (isset($user->picture->uri)) {
      $uri = $user->picture->uri;
    }
  }

  return l(
    theme(
      'image_style',
      array(
        'style_name' => $image_style,
        'path' => $uri,
        'title' => $title
      )
    ),
    'user/'.$user->uid, // link path
    array('html' => 'true') // we have a pic
  );
}

// Prepare a logo
function ngTheme_compile_theme_logo() {
  $logo = theme_get_setting('logo', 'ngTheme');
  $image = '<img src="' . $logo . '" alt="' . t('Home') . '" />';
  $content = l($image, '', array('html' => TRUE, 'attributes' => array('rel' => 'home', 'id' => 'logo', 'title' => t('Home'))));
  return $content;
}

// Get TS site name in the right format 
function ngTheme_compile_site_name() {
  $name = '<span class="site-name cont"><span class="first">'.t('task').'</span><span class="last">'.t('stepper').'</span></span>';
  return l($name, '<front>', array('html'=>true));
}

