<?php

// Hook form_alter()
function ngTheme_form_alter(&$form, &$form_state, $form_id) {
  //dpm($form);
}

// Hook form_seach_block_alter()
function ngTheme_form_search_block_form_alter(&$form, &$form_state) {
  $form['actions']['submit']['#type'] = 'image_button';
  $form['actions']['submit']['#src'] = drupal_get_path('theme', 'ngTheme') . '/assets/images/search.png';
  $form['actions']['submit']['#attributes']['title'] = t('Search');
  $form['actions']['submit']['#attributes']['onmouseover'] = "this.src='" . base_path() . drupal_get_path('theme', 'ngTheme') . "/assets/images/search-on.png'";
  $form['actions']['submit']['#attributes']['onmouseout'] = "this.src='" . base_path() . drupal_get_path('theme', 'ngTheme') . "/assets/images/search.png'";
}

