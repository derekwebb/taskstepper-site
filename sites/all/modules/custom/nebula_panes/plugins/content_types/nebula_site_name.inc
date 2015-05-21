<?php

/**
* This plugin array is more or less self documenting
*
* To use:
*
* 1: Simply rename the functions. Removing "generic" and adding some other
*    useful name for this plugin, eg: SSO.
*
* 2: Fill in the $plugin title and category below.
*
* 3: And update the render function to use your content for $block->content
*
* 4: Save this plugin in the components > plugins > content_types folder
*
* 5: Add your new plugin to a panel
*
*/
$plugin = array(
  // the title in the admin
  'title' => t('Nebula site name'),
  // no one knows if "single" defaults to FALSE...
  'single' => TRUE,
  // oh joy, I get my own section of panel panes
  'category' => array(t('Page elements'), -9), // We can change this category at will

  //NOTE--->> Un-comment the next line to add configs.  Talk to me if this is not clear ;-) (DW)
  //'edit form' => 'nebula_site_name_pane_content_type_edit_form',    // Edit form callback

  // Renderer function
  'render callback' => 'nebula_site_name_pane_content_type_render'  // Render callback
);


/**
* Run-time rendering of the body of the block (content type)
* See ctools_plugin_examples for more advanced info
*/
function nebula_site_name_pane_content_type_render($subtype, $conf, $args, $context, $incoming_content) {
  $block = new stdClass;
  $name = '<span class="first">task</span><span class="second">stepper</span>';
  $block->content = l($name, '<front>', array('html' => TRUE, 'attributes' => array('title' => t('Go to home page'))));
  return $block;
}


/**
* 'Edit form' callback for the content type.
*
* Currently un-called... no edit form needed most of the time.
*/
function nebula_site_name_pane_content_type_edit_form($form, &$form_state) {
  // The configurations as they were saved
  $conf = $form_state['conf'];

  // Add your Form API (FAPI) additions here:

  return $form;
}


/**
* Submit function, note anything in the formstate[conf] automatically gets saved
*
* You prob. don't need this for a static content pane.
*/
function nebula_site_name_pane_content_type_edit_form_submit($form, &$form_state) {
  // Values have to be moved to conf or they won't be there when you get back bon hommie!
  //$form_state['conf']['twitter_username'] = $form_state['values']['twitter_username'];
}
