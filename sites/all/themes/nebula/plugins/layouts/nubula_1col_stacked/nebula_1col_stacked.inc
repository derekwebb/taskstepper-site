<?php
/**
 * @file
 * Plugin definition for 1 column stacked layout.
 */

$plugin = array(
  'title' => t('1 column stacked template'),
  'theme' => 'nebula-1col-stacked',
  'category' => 'Global',
  'icon' => 'screenshot.png',
  'regions' => array(
    'top' => t('Top'),
    'center' => t('Center'),
    'bottom' => t('Bottom'),
  ),
);