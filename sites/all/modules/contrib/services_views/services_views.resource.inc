<?php
/**
 * @file
 * Callbacks for services module resource hooks.
 */

/**
 * Callback for retrieving views resources.
 *
 * @param $view_name
 *   String. The views name.
 * @param $display_id
 *   String (optional). The views display name.
 * @param $args
 *   Array (optional). A list of arguments to pass to the view.
 * @param $offset
 *   Integer (optional). An offset integer for paging.
 * @param $limit
 *   Integer (optional). A limit integer for paging.
 * @param $return_type
 *   String (optional). Whether to return the raw data results (FALSE), the entire views object ('view') or themed results ('theme').
 * @param $filters
 *   Array (optional). A list of exposed filters to pass to the view.
 *
 * @return
 *  Array. The views return.
 */
function services_views_retrieve($view_name, $display_id = 'default', $args = array(), $offset = 0, $limit = -1, $return_type = FALSE, $filters = array()) {
  $result = array();
  $view = views_get_view($view_name);
  // Put all arguments and filters and then execute.
  watchdog('services_views args resource.inc 32', print_r(func_get_args(),true));
  $view->set_arguments($args, FALSE);
  $view->set_exposed_input($filters);
  $view->set_offset($offset);
  // Support for Views 2
  if (method_exists($view, 'set_use_pager')) {
    // If offset is set we can't have a user pager.
    if (empty($offset)) {
      $view->set_use_pager(TRUE);
      if ($limit >= 0) {
        $view->set_items_per_page($limit);
      }
    }
    else {
      // Disable the user pager.
      $view->set_use_pager(FALSE);
    }
  }
  elseif ($limit >= 0) {
    $view->set_items_per_page($limit);
  }

  // If we display values and not themed view output.
  if (empty($return_type)) {
    $view->set_display($display_id);
    $view->pre_execute();
    $view->execute();
    $result = $view->result;

    $row_plugin = $view->display_handler->get_option('row_plugin');

    // If row plugin is node, then we should load each node
    if ($row_plugin == 'node') {
      $nodes = array();
      foreach ($view->result as $row) {
        $nodes[] = node_load($row->nid);
      }
      $result = $nodes;
    }
    elseif ($row_plugin == 'fields') {
      $items = array();
      foreach ($view->result as $row) {
        $item = new stdClass();
        foreach ($view->field as $field_id => $field) {
          if (!empty($field->options['label'])) {
            $field_label = strtolower($field->options['label']);
          }
          elseif ($field->field_alias) {
            $field_label = $field->field_alias;
          }
          else {
            $field_label = $field_id;
          }
          $item->$field_label = $field->theme($row);
        }
        $items[] = $item;
      }

      if ($items) {
        $result = $items;
      }
    }
  }
  elseif ($return_type == 'view') {
    $view->set_display($display_id);
    $view->execute();
    return $view;
  }
  else {
    // We want to keep the result an array.
    $result[] = $view->preview($display_id);
  }
  return $result;
}
/*
 *  +    // Pager From / To: get a subset of nodes from the view results
    +    // Offset: starting point (position) of the subset of nodes
    +    if (!empty($_REQUEST['offset'])) {
    +      $offset = (int) $_REQUEST['offset'];
    +      if ($offset >= 0) {
    +        $view->set_offset($offset);
    +      }
    +    }
    +    // Limit: is the number of nodes to return
    +    if (!empty($_REQUEST['limit'])) {
    +      $limit = (int) $_REQUEST['limit'];
    +      if ($limit >= 0) {
    +        $view->set_items_per_page($limit);
    +      }
    +    }
    +    // /Pager From / To: get a subset of nodes from the view results
 */

/**
 * Execute a view and return results.
 */
function services_views_execute_view($view_info, $view = NULL, $display_id = NULL) {
  //watchdog('services_views exec Request', print_r($_REQUEST, true)); 
  
  $args = $get_args = $view_args = $arg_order = array();
  $arg_count = 0;
  $search = 0; // var to contain array loc of arg data from view settings
  
  if (!empty($view_info)) {
    $view_name = $view_info['view_name'];
    $display_id = $view_info['display_id'];
    $view = views_get_view($view_name);
    
    $args = $view_info['args']; // self-contained args

    if (!empty($_REQUEST['filter_args'])) {
      $default_display = $view->display['default'];
      $selected_display = $view->display[$display_id];
      
      // Are the arguments default?
      if (!$selected_display->display_options['defaults']['arguments']) {
        $view_args = $selected_display->display_options['arguments'];
      }
      // use args from default display
      else { 
        $view_args = $default_display->display_options['arguments'];
      }
      
      $arg_count = count($view_args);
      $get_args = array_fill(0, $arg_count, null); // fill the args to pass to views with null to start with
      
      foreach ($view_args as $id => $arg) {
        $arg_order[] = $id;
      }

      $request_args = $_REQUEST['filter_args']; // todo security check!
      foreach($request_args as $index => $arg_str) {
        $arg = explode('=', $arg_str);
        $search = array_search($arg[0], $arg_order);
        $get_args[$search] = $arg[1];
      }
      $args = $get_args;
    }
    
    if (!empty($_REQUEST['offset'])) {
      $offset = (int) $_REQUEST['offset'];
      if ($offset >= 0) {
        $view->set_offset($offset);
      }
    }
    // Limit: is the number of nodes to return
    if (!empty($_REQUEST['limit'])) {
      $limit = (int) $_REQUEST['limit'];
      if ($limit >= 0) {
        $view->set_items_per_page($limit);
      }
    }

    if (isset($args) && !empty($args)) {
      $view->set_arguments($args);
      $view->execute_display($display_id, $args);
    }
    
  }
  
  

  // Avoid translation of the field labels.
  $view->localization_plugin = views_get_plugin('localization', 'none');

  // Execute a view.
  $output = $view->render($display_id);

  // Add support for Services Raw formatter.
  foreach ($view->result as $index => $row) {
    foreach ($view->field as $field_key => $field) {
      $f_key = 'field_' . $field_key;
      if (isset($row->$f_key)) {

        $target_key = $field_key;
        $format = ($field->options['type'] == 'services') ? 'raw' : 'rendered';

        // Skip this field?
        if (isset($field->options['exclude']) && $field->options['exclude'] == TRUE) {
          continue;
        }

        if (isset($field->options['label']) && !empty($field->options['label'])) {
          $target_key = $field->options['label'];
        }

        $output[$index]->$target_key = array();
        $obj = &$output[$index]->$target_key;

        foreach ($row->$f_key as $idx => $res) {

          if (isset($res[$format])) {
            $data = $res[$format];

            // If this is raw formatter.
            if ($format == 'raw') {
              foreach ($data as $key => $val) {
                if ($field->options['settings']['skip_safe'] && strpos($key, 'safe_') === 0) {
                  unset($data[$key]);
                }
                if ($field->options['settings']['skip_empty_values'] && empty($val)) {
                  unset($data[$key]);
                }
              }
              $obj[$idx] = $data;
            }
            // Rendered output.
            elseif (isset($data['#access']) && $data['#access'] == TRUE) {
              $obj[$idx] = render($data);
            }
            else {
              $obj[$idx] = array('error' => t('Access denied or format unknown on field.'));
            }
          }
        }

        // Check cardinality of the field.
        if ($field->field_info['cardinality'] == 1 && count($obj) == 1) {
          $obj = $obj[$idx];
        }
      }
    }
  }

  drupal_alter('services_views_execute_view', $output, $view);

  $view->destroy();
  return $output;
}
