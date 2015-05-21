<?php

function guide_page_edit_form($form, &$form_state) {
    drupal_set_title("Guide editor");
    dpm($form_state);
    $form = array();
    //$form['top'] = array(
    //    '#markup' => '<p>'.t('This is the form with args ').$args.'</p>'
    //);
    
    $form['this'] = array(
      '#type' => 'textfield', 
      '#title' => t('Subject'), 
      '#default_value' => t('This'), 
      '#size' => 60, 
      '#maxlength' => 128, 
      '#required' => TRUE,
    );
    
    $form['submit'] = array('#type' => 'submit', '#value' => t('Save'));
    return $form;
}

function guide_page_edit_form_submit($form, &$form_state) {
    dpm($form_state);
}
