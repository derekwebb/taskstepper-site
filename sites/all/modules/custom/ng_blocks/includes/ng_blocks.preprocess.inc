<?php

// Compile data for the ng_header_content block
function template_preprocess_ng_header_content(&$vars) {
  module_load_include('inc', 'search', 'search.pages');
  
  // Search form
  $search = drupal_get_form('search_block_form'); // get form
  $vars['search'] = '<div class="search-form">'.drupal_render($search).'</div>'; // render
  
  // Logo and site_name pulled from a helper
  //  function in ngTheme preprocess. Yeah so that's
  //  kinda ungly... Sue me ;-)
  $vars['logo'] = ngTheme_compile_theme_logo();
  $vars['site_name'] = ngTheme_compile_site_name();
  
  // Fetch NG template for primary links
  $vars['primary_links'] = theme('ng_header_primary_links');
  
  // User info section
  $vars['user_info'] = theme('ng_header_user_info');
}