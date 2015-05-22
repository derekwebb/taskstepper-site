<?php

/**
 * Preprocess variables for html.tpl.php
 */
function nebula_preprocess_html(&$vars) {
  global $language;
  global $user;

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
  //drupal_add_css()
  drupal_add_js(libraries_get_path('underscore').'/underscore-min.js', array('group' => JS_LIBRARY));
  drupal_add_js(libraries_get_path('backbone').'/backbone-min.js', array('group' => JS_LIBRARY));
  drupal_add_js(libraries_get_path('angularjs').'/angular.min.js', array('group' => JS_LIBRARY));
  drupal_add_js(libraries_get_path('angularjs').'/angular-resource.min.js', array('group' => JS_LIBRARY));
}

// Add form id theme hook suggestions.
function nebula_preprocess_form(&$vars) {
  $vars['theme_hook_suggestions'][] = 'form_'.$vars['element']['#form_id'];
}


/**
 * Pane css and js file attachment:
 *
 * All panes must run through this function
 *  so it should be able to capture the lions
 *  share of the attachment workload.
 *
 * All css and js added by this function will
 *  be seeking files in the following format:
 *
 * pane__{pane_type}.(css|js)  * or *
 * pane__{pane_type}_{pane_subtype}.(css|js)
 *
 * eg. pane__block_superfish_1.css
 *
 * All files must exist within the "panes"
 *  folder (w/in css|js) to be included here.
 *
 */
function nebula_preprocess_panels_pane(&$vars) {
  global $base_path;

  $path     = drupal_get_path('theme', 'nebula');
  $join     = '_';
  $root     = 'pane__';
  $type     = str_replace('-', $join, $vars['pane']->type);            // dpm($type);
  $subtype  = $join.str_replace(array('-', ':'), $join, $vars['pane']->subtype);   // dpm($subtype);
  $base_css_file = $root.$type.'.css';
  $base_js_file  = $root.$type.'.js';
  $css_file = $root.$type.$subtype.'.css';
  $js_file  = $root.$type.$subtype.'.js';

  //dpm($css_file);

  // Add the css - basic type
  if (file_exists($path.'/css/panes/'.$base_css_file)) drupal_add_css($path.'/css/panes/'.$base_css_file, array('group' => CSS_THEME)); // - targeted type
  if (file_exists($path.'/css/panes/'.$css_file))      drupal_add_css($path.'/css/panes/'.$css_file, array('group' => CSS_THEME));

  // Add the js - basic type
  if (file_exists($path.'/js/panes/'.$base_js_file)) drupal_add_js($path.'/js/panes/'.$base_js_file, array('group' => JS_THEME)); // - targeted type
  if (file_exists($path.'/js/panes/'.$js_file))      drupal_add_js($path.'/js/panes/'.$js_file, array('group' => JS_THEME));

  // Add layout types
  $layout = $vars['display']->layout;
  if (file_exists($path.'/css/layouts/'.$layout.'.css')) drupal_add_css($path.'/css/layouts/'.$layout.'.css', array('group' => CSS_THEME)); // - targeted layout
  if (file_exists($path.'/js/layouts/'.$layout.'.js'))   drupal_add_css($path.'/js/layouts/'.$layout.'.js', array('group' => JS_THEME));

  // Call potential preprocessors
  $base_func = 'nebula_preprocess_panels_pane__'.$type; //dpm($base_func);
  $full_func = 'nebula_preprocess_panels_pane__'.$type.'__'.$subtype; //dpm($full_func);
  if (function_exists($base_func)) $base_func($vars);
  if (function_exists($full_func)) $full_func($vars);
}


// Compile a default user picture and link
function nebula_preprocess_user_picture(&$vars) {
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
    $vars['user_picture'] = nebula_compile_default_user_image($account->uid, $image_style, $title);
  }
  else {
    $image_style = (!isset($image_style)) ? 'user_thumb_small' : $image_style;
    $vars['user_picture'] = nebula_compile_default_user_image($account->uid, $image_style, $title);
  }
}


// Compiles a user image
function nebula_compile_default_user_image($user, $image_style, $title) {
  $uri = 'public://ts_logo.png'; // default image

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





