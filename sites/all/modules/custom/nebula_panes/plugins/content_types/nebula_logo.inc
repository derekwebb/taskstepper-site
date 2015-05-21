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
  'title' => t('Nebula logo'),
  'single' => TRUE,
  'icon' => 'icon_page.png',
  'description' => t('Add a scalable logo'),
  'render callback' => 'nebula_logo_content_type_render',
  'category' => t('Page elements')
);

/**
 * Output function for the 'page_primary_links' content type.
 *
 * Outputs the primary_links (local tasks) of the current page.
 */
function nebula_logo_content_type_render($subtype, $conf, $panel_args) {
  $block = new stdClass();
  $logo = '<span class="cont"><span class="top"></span><span class="mdl"></span><span class="bot"></span></span>';
  $block->content = l($logo, '<front>', array('html' => TRUE, 'attributes' => array('title' => t('Go to home page'))));
  
  return $block;
}

/**
 * Returns an edit form for custom type settings.
 */
function nebula_logo_content_type_edit_form($form, &$form_state) {
  // Empty so that we can have title override.
  return $form;
}


