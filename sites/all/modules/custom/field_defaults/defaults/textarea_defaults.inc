<?php

// ----------------------------------------------------------------------------------
// Implementations of hook_[form_id]__textarea_defaults
// ----------------------------------------------------------------------------------

// Search block form defaults (header search)
//function field_defaults_contact_site_form__textarea_defaults($form, &$matrix) {
  //dpm('Testing');
  //$matrix['contact_site_form']['selectors'] = array(
  //  '.pane-coral-contact-us .form-item-message textarea' => t('')
  //);

  // Custom validation
  //$matrix['contact_site_form']['validate'] = array('field_defaults_textarea_contact_site_form_validate');
//}


// Validator for the contact site form defaults.
//  added above ^
//function field_defaults_textarea_contact_site_form_validate($form, &$form_state) {
//  $matrix = variable_get('field_defaults_textarea_matrix', array());

//  if ($form_state['values']['message'] == $matrix[$form['#form_id']]['selectors']['.pane-coral-contact-us .form-item-message textarea']) {
//    form_set_error('message', t('You cannot submit default values.'));
//  }
//}
