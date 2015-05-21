<?php

function nebula_form_alter(&$form, &$form_state, $form_id) {
  //dpm($form_id);
}

function nebula_form_search_block_form_alter(&$form, &$form_state) {
  $form['actions']['submit']['#type'] = 'image_button';
  $form['actions']['submit']['#src'] = drupal_get_path('theme', 'nebula') . '/assets/images/search.png';
  $form['actions']['submit']['#attributes']['title'] = t('Search');
  $form['actions']['submit']['#attributes']['onmouseover'] = "this.src='" . base_path() . drupal_get_path('theme', 'nebula') . "/assets/images/search-on.png'";
  $form['actions']['submit']['#attributes']['onmouseout'] = "this.src='" . base_path() . drupal_get_path('theme', 'nebula') . "/assets/images/search.png'";
}
