<?php

/**
 * Idealy, this file should contain only includes
 */
$inc = DRUPAL_ROOT . '/' . drupal_get_path('theme', 'nebula') . '/inc/';

require_once $inc . 'alter.inc';
require_once $inc . 'preprocess.inc';
require_once $inc . 'process.inc';
require_once $inc . 'theme.inc';
