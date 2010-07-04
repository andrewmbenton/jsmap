// jsmap :: jsmap.js
// Copyright (c) 2010 Andrew Benton
// This software is distributed under the MIT license. See LICENSE for details.

//-----------------------------------------------------------------------------
// Define some functions to build ifmap objects from form input
//-----------------------------------------------------------------------------

function buildIdentifierFrom(selector) {
  var type = $(selector + ' .identifier-type option:selected').attr('value');
  var params = {};
  if (type == 'identity') { params['type'] = $(selector + ' .identity-type option:selected').attr('value'); }
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

//TODO: Make this work with all metadata types
function buildMetadataFrom(selector) {
  var type = $(selector + ' .metadata-type option:selected').attr('value');
  var params = {};
  return (new IfmapMetadata(type, params));
}

//-----------------------------------------------------------------------------
// $(function() ...): Execute when the DOM is ready
//-----------------------------------------------------------------------------

$( function() {

  // Create the main page structure
  $("body").html(JUP.html(templates.structure));
  
  // Fill in the beginning of the ifmap request params table
  $("#ifmap-request-params").html(JUP.html(templates.ifmapRequestParams));
  
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
  
  
  // Add stuff to the DOM when the user selects a different ifmap request-type
  $("#ifmap-request-type").live( "change", function() {
    // Clear the request params rows first
    $("#ifmap-request-params tr").not(".permanent").remove();
    
    // Now see what request type was selected and add stuff to the DOM appropriately
    switch($("#ifmap-request-type option:selected").attr("value")) {
      case 'update':
        $("#ifmap-request-params").append(
          JUP.html([{'class':'identifier-one'}, {'class':'identifier-two'}], templates.identifierRows) +
          JUP.html(templates.metadataRows)
        );
        break;
      case 'delete':
        $("#ifmap-request-params").append(
          JUP.html([{'class':'identifier-one'}, {'class':'identifier-two'}], templates.identifierRows) +
          JUP.html([{'type':'filter'}], templates.paramRow)
        );
        break;
      case 'search':
        $("#ifmap-request-params").append(
          JUP.html([{'class':'identifier-one'}], templates.identifierRows) +
          JUP.html([{'type':'match-links'}, {'type':'max-depth'}, {'type':'max-size'}, {'type':'filter'}], templates.paramRow)
        );
        break;
    }
  }).change();
  
  // Add the identity-type dropdown when the identifier-type selected is 'identity'
  $(".identifier-type").live( "change", function() {
    if ($(this).children("option:selected").attr("value") == "identity") {
      $(this).parent().append(JUP.html(templates.identitySelector));
    } else {
      $(this).siblings(".identity-type").remove();
    }
  });
  
  // Append SOAP message to the log after ajax POST returns
  function appendToLog(xml) {
    $('<code class="prettyprint">').text(xml).appendTo("#log-pane > .pane-content").wrap('<p>');
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
