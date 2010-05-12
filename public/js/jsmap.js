// jsmap :: jsmap.js
// Copyright (c) 2010 Andrew Benton
// This software is distributed under the MIT license. See LICENSE for details.

// Define some useful functions to build html
// TODO: Compare this with jaml and see if it would be useful to put this into a library of some sort
function div(id, class, html) { return '<div id="'+id+'" class="'+class+'">'+html+'</div>' }
function tr(class, html) { return '<tr class="'+class+'">'+html+'</tr>' }
function td(html) { return '<td>'+html+'</td>' }
function select(id, class, html) { return '<select id="'+id+'" class="'+class+'">'+html+'</select>' }
function option(val, html) { return '<option value="'+val+'">'+((!html)?val:html)+'</option>' }

function identifierRows(class) {
  return tr(class,
    td('<label>identifier:</label>') +
    td(
      select('', 'identifier-type',
        option('access-request') +
        option('device') +
        option('identity') +
        option('ip-address') +
        option('mac-address')
      )
    )
  ) +
  tr(class,
    td('<label>name/value:</label>') +
    td('<input class="identifier-value" name="identifier-value" type="text" size="50"/>')
  ) +
  tr(class,
    td('<label>ad:</label>') +
    td('<input class="identifier-ad" name="identifier-ad" type="text" size="50"/>')
  ) +
  tr(class + ' hr', '');
}

function metadata_rows() {
  return tr('metadata',
    td('<label>metadata:</label>') +
    td(
      select('', 'metadata-type',
        option('access-request-device') +
        option('access-request-ip') +
        option('access-request-mac') +
        option('authenticated-as') +
        option('authenticated-by') +
        option('ip-mac')
      )
    )
  )// +
//  tr('metadata',
//    td('<label>value:</label>') +
//    td('<input class="metadata-value" name="metadata-value" type="text" size="50"/>')
//  );
}

function match_links_row() {
  return tr('match-links',
    td('<label>match-links:</label>') +
    td('<input class="match-links-value" name="match-links-value" type="text" size="50"/>')
  );
}

function filter_row() {
  return tr('filter',
    td('<label>filter:</label>') +
    td('<input class="filter-value" name="filter-value" type="text" size="50"/>')
  );
}

function search_maximum_rows() {
  return tr('max-depth',
    td('<label>max-depth:</label>') +
    td('<input class="max-depth-value" name="max-depth-value" type="text" size="10"/>')
  ) +
  tr('max-size',
    td('<label>max-size:</label>') +
    td('<input class="max-size-value" name="max-size-value" type="text" size="10"/>')
  );
}

function buildIdentifierFrom(selector) {
  var type = $(selector + ' .identifier-type option:selected').attr('value');
  var params = {};
  if (type == 'identity') { params['type'] = $(selector + ' #identity-type option:selected').attr('value'); }
  if (type == 'ip-address' || type == 'mac-address') {
    params['value'] = $(selector + ' .identifier-value').val();
  } else {
    params['name'] = $(selector + ' .identifier-value').val();
  }
  if ($(selector + ' .identifier-ad').val() != '') {
    params['administrative-domain'] = $(selector + ' .identifier-ad').val();
  }
  return (new IfmapIdentifier(type, params));
}

//TODO: Fix this to work with all metadata types
function buildMetadataFrom(selector) {
  var type = $(selector + ' .metadata-type option:selected').attr('value');
  var params = {};
//  if (type == 'identity') { params['type'] = $(selector + ' #identity-type option:selected').attr('value'); }
//  if (type == 'ip-address' || type == 'mac-address') {
//    params['value'] = $(selector + ' .identifier-value').val();
//  } else {
//    params['name'] = $(selector + ' .identifier-value').val();
//  }
//  if ($(selector + ' .identifier-ad').val() != '') {
//    params['administrative-domain'] = $(selector + ' .identifier-ad').val();
//  }
  return (new IfmapMetadata(type, params));
}

//-----------------------------------------------------------------------------
// $(function() ...): Execute when the DOM is ready
//-----------------------------------------------------------------------------
$( function() {

  // Create the main page structure
  $("body").html(
    '<div id="request-pane" class="pane">' +
      '<div class="pane-header">build a request</div>' +
      '<div class="pane-content">' +
        '<div id="request-builder">' +
          '<table id="ifmap-request-params">' +
          '</table>' +
        '</div>' +
        '<div id="request-display"></div>' +
      '</div>' +
    '</div>' +
    '<div id="log-pane" class="pane">' +
      '<div class="pane-header">message log</div>' +
      '<div class="pane-content"></div>' +
    '</div>'
  );
  
  // Fill in the beginning of the ifmap request params table
  $("#ifmap-request-params").html(
    tr('permanent',
      td('<label>map server url:</label>') +
      td('<input id="url" name="url" type="text" size="50"/><button id="start" class="extra">start</button>')
    ) +
    tr('permanent hr', '') +
    tr('permanent',
      td('<label>request type:</label>') +
      td(
        select('ifmap-request-type', '',
          option('update') +
          option('delete') +
          option('search') +
          option('purge')
        ) +
        '<button id="submit" class="extra">submit</button>'
      )
    ) +
    tr('permanent hr', '')
  );
  
  // Focus the map server url bar
  $("#url").focus();
  
  // Handle the resizing of the page
  $(window).resize( function() {
    var w = $(window).width();
    var h = $(window).height();
    
    $(".pane").css({"width": (w-36)/2, "height": (h-26)});
    $(".pane-content").css({"width": $(".pane").innerWidth()-12,
                            "height": $(".pane").innerHeight()-$(".pane-header").outerHeight()-12});
  }).resize();
  
  
  // Define some functions to assist with dynamically altering the UI
  
  function append_update_params() {
    $("#ifmap-request-params").append(
      identifierRows('identifier-one') +
      identifierRows('identifier-two') +
      metadata_rows()
    );
  }
  
  function append_delete_params() {
    $("#ifmap-request-params").append(
      identifierRows('identifier-one') +
      identifierRows('identifier-two') +
      filter_row()
    );
  }

  function append_search_params() {
    $("#ifmap-request-params").append(
      identifierRows('identifier-one') +
      match_links_row() +
      search_maximum_rows() +
      filter_row()
    );
  }
  
  // Add stuff to the DOM when the user selects a different ifmap request-type
  $("#ifmap-request-type").live( "change", function() {
    // Clear the request params rows first
    $("#ifmap-request-params tr").not(".permanent").remove();
    
    // Now see what request type was selected and add stuff to the DOM appropriately
    switch($("#ifmap-request-type option:selected").attr("value")) {
      case 'update':
        append_update_params();
        break;
      case 'delete':
        append_delete_params();
        break;
      case 'search':
        append_search_params();
        break;
    }
  }).change();
  
  // Add the identity-type dropdown when the identifier-type selected is 'identity'
  $(".identifier-type").live( "change", function() {
    if ($(this).children("option:selected").attr("value") == "identity") {
      $(this).parent().append(
        select('identity-type', 'extra',
          option('aik-name') +
          option('distinguished-name') +
          option('dns-name') +
          option('email-address') +
          option('kerberos-principal') +
          option('trusted-platform-module') +
          option('username') +
          option('sip-uri') +
          option('tel-uri')
        )
      );
    } else {
      $(this).siblings("#identity-type").remove();
    }
  });
  
  // Append SOAP message to the log after ajax POST returns
  function appendToLog(xml) {
    $('<code class="prettyprint">').text(xml.replace(/>/g,'>\n')).appendTo("#log-pane > .pane-content").wrap('<p>');
    prettyPrint();
  }

  // Set up an IfmapClient object when the user clicks 'start'
  $("#start").click( function(e) {
    e.preventDefault();
    ifmapClient = new IfmapClient('/', $("#url").val());
    ifmapClient.newSession( function(data, status, xhr) {
      if (status == "success") { appendToLog(data["soap"]) }
      else { appendToLog("An error occurred while trying to establish a session with the MAP server") }
    });
  });
  
  // Do the right thing when 'submit request' is pressed
  $('#submit').click( function(e) {
    e.preventDefault();
    // Figure out what request type to create and create it
    switch($('#ifmap-request-type option:selected').attr('value')) {
      case 'update':
        var identifiers = [buildIdentifierFrom('.identifier-one')];
        if ($('.identifier-two .identifier-value').val() != '') {
          identifiers.push(buildIdentifierFrom('.identifier-two'));
        }
        var metadata = buildMetadataFrom('.metadata');
        ifmapClient.publishUpdate( identifiers, metadata, function(data, status, xhr) {
          if (status == "success") { appendToLog(data["soap"]) }
          else { appendToLog("An error occurred while trying to send a request to the MAP server") }
        });
        break;
      case 'delete':
        var identifiers = [buildIdentifierFrom('.identifier-one')];
        if ($('.identifier-two .identifier-value').val() != '') {
          identifiers.push(buildIdentifierFrom('.identifier-two'));
        }
        var filter = $('.filter-value').val();
        ifmapClient.publishDelete( identifiers, filter, function(data, status, xhr) {
          if (status == "success") { appendToLog(data["soap"]) }
          else { appendToLog("An error occurred while trying to send a request to the MAP server") }
        });
        break;
      case 'search':
        identifier = buildIdentifierFrom('.identifier-one');
        params = {};
        if ($('.match-links-value').val() != '') { params['match-links'] = $('.match-links-value').val() }
        if ($('.max-depth-value').val() != '') { params['max-depth'] = $('.max-depth-value').val() }
        if ($('.max-size-value').val() != '') { params['max-size'] = $('.max-size-value').val() }
        if ($('.filter-value').val() != '') { params['result-filter'] = $('.filter-value').val() }
        ifmapClient.search( identifier, params, function(data, status, xhr) {
          if (status == "success") { appendToLog(data["soap"]) }
          else { appendToLog("An error occurred while trying to send a request to the MAP server") }
        });
        break;
      case 'purge':
        ifmapClient.purgePublisher( function(data, status, xhr) {
          if (status == "success") { appendToLog(data["soap"]) }
          else { appendToLog("An error occurred while trying to send a request to the MAP server") }
        });
        break;
    }
  }); // End submit click handler
}); // End $(function() ...): Execute when the DOM is ready
