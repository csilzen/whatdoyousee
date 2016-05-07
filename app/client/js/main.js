// Copyright 2015, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Expecting this line in file named key.js
// var apiKey = "[YOUR API KEY HERE]";
var CV_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + apiKey;

var PURPLE = '#7B287D';
var CORNFLOWER = '#7067CF';
var LIGHTBLUE = '#B7C0EE';
var MINT = '#CBF3D2';
var DARKPURPLE = '#330C2F';

$(document).ready(function() {


  $('#fileform').on('submit', uploadFiles);
});

/**
 * 'submit' event handler - reads the image bytes and sends it to the Cloud
 * Vision API.
 */
function uploadFiles(event) {
  event.preventDefault(); // Prevent the default form post

  // Grab the file and asynchronously convert to base64.
  var file = $('#fileform [name=fileField]')[0].files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    $('#img').show().attr('src', e.target.result);
  }
  reader.onloadend = processFile;
  reader.readAsDataURL(file);
}

/**
 * Event handler for a file's data url - extract the image data and pass it off.
 */
function processFile(event) {
  var content = event.target.result;
  sendFileToCloudVision(
      content.replace("data:image/jpeg;base64,", ""));
}

/**
 * Sends the given file contents to the Cloud Vision API and outputs the
 * results.
 */
function sendFileToCloudVision(content) {
  var type = $("#fileform [name=type]").val();

  // Strip out the file prefix when you convert to json.
  var request = {
    requests: [{
      image: {
        content: content
      },
      features: [{
        type: "LABEL_DETECTION",
        maxResults: 200
      }]
    }]
  };

  $('#results-container').append('I see...');

  $.post({
    url: CV_URL,
    data: JSON.stringify(request),
    contentType: 'application/json'
  }).fail(function(jqXHR, textStatus, errorThrown) {
    $('#results-container').text('ERRORS: ' + textStatus + ' ' + errorThrown);
  }).done(displayJSON);
}

/**
 * Displays the results.
 */

function colorSelect() {
  var colors = [PURPLE, CORNFLOWER, LIGHTBLUE, MINT];

}

function displayJSON(data) {
  var labels = [];

  data.responses[0].labelAnnotations.forEach(function(elem, idx, arr) {
    labels.push(elem.description);
  });

  console.log('Descriptions: ', labels);

  // var contents = JSON.stringify(data, null, 4);

  $.each(labels, function(idx, elem) {
    $('<div/>', {
      'text': elem
    }).css('color', DARKPURPLE)
    .appendTo(' #label-container ');
    console.log('appended', elem);
  });

}
