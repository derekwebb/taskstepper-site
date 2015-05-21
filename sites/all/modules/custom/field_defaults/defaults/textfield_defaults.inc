<?php

// ----------------------------------------------------------------------------------
// Implementations of hook_[form_id]__textfield_defaults
// ----------------------------------------------------------------------------------


// Search block form defaults (header search)
function field_defaults_search_block_form__textfield_defaults($form, &$matrix) {
  $matrix['search_block_form']['selectors'] = array(
    '#search-block-form .form-text' => t('Search')
  );
}


// Validator for the answer node form defaults.
//  added above ^
//function field_defaults_textfield_contact_site_form_validate($form, &$form_state) {
  /*$matrix = variable_get('field_defaults_textfield_matrix', array());

  if ($form_state['values']['name'] == $matrix[$form['#form_id']]['selectors']['.pane-coral-contact-us .form-item-name .form-text']) {
    form_set_value($form['name'], '', $form_state);  //reset the input
  }

  if ($form_state['values']['company'] == $matrix[$form['#form_id']]['selectors']['.pane-coral-contact-us .form-item-company .form-text']) {
    form_set_value($form['company'], '', $form_state);  //reset the input
  }*/
//}
