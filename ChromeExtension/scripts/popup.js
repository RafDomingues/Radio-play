$(function () {
  var pathJson = 'radio_flux.json',
    radioFlux,
    currentVolume = 50,
    select2,
    selectedObject,
    muted = false;
    icon = $('.play');

  icon.hide();
  stopEqualizer();
  select2 = $('#radioSelect').select2();

  // event communication
  var port = chrome.extension.connect({
    name: "Sample Communication"
  });

  port.onMessage.addListener(function(msg) {
    if(msg !== null) {
      $('#volumeLabel').text('Volume ' + msg + '%');
      $('#radioVolume').val(msg);
    }
  });
  //

  // set the radio
  $('#radioSelect').on('change', function () {
    var selectedItem = $('#radioSelect').find(":selected");
    chromeSet({radioSelected : selectedItem.text().trim()});
    chromeSet({radioVolume : currentVolume});
    chromeSet({radioSelectedFlux : selectedItem.val().trim()});
  });

  $('#radioVolume').on('input change', function () {
    $('#volumeLabel').text('Volume ' + $(this).val() + '%');
  });

  $('#radioVolume').on('change', function () {
    chromeSet({radioVolume : $(this).val()});
    currentVolume = $(this).val();

  });


  $('#muteVolume').click(function () {
    if(!muted) {
      muted = $('#radioVolume').val();
      $('#volumeLabel').text('Volume ' + 0 + '%');
      $('#radioVolume').val(0);
      chromeSet({radioVolume : 0});
      currentVolume = 0;
    } else {
      chromeSet({radioVolume : muted});
      $('#volumeLabel').text('Volume ' + muted + '%');
      $('#radioVolume').val(muted);
      muted = false;
      currentVolume = muted;
    }
  });

  icon.click(function() {
    icon.toggleClass('active');
    if (icon.hasClass('active')) {
      chromeSet({radioPlay : 'true'});
      playEqualizer();
    } else {
      stopEqualizer();
      chromeSet({radioPlay : 'false'});
    }
    chromeSet({'radioVolume' : currentVolume});
    return false;
  });

  chrome.storage.sync.get("radioVolume", function (items) {
    if (items.hasOwnProperty("radioVolume")) {
      /* Set volume label */
      $('#volumeLabel').text('Volume ' + items.radioVolume + '%');
      $('#radioVolume').val(items.radioVolume);
      chromeSet({radioVolume : items.radioVolume});
      currentVolume = items.radioVolume;
    }
  });

  chrome.storage.sync.get("radioPlay", function (items) {
    if (items.hasOwnProperty('radioPlay') && items.radioPlay === 'true') {
      playEqualizer();
      icon.addClass('active');
    } else if(items.hasOwnProperty('radioPlay') && items.radioPlay === 'false') {
      stopEqualizer();
    }
  });

  // Get the last radio selected
  chrome.storage.sync.get("radioSelected", function (items) {
    if (items.hasOwnProperty('radioSelected')) {
      selectedObject = items.radioSelected;
    }
    storeSelect2(pathJson, selectedObject, select2);
    icon.show();
  });
});

function storeSelect2(pathJson, radioSelected, select2){
  var html;
  // Get radio flux from json path
  $.getJSON(pathJson, function (data) {
    // create option elements
    $.each(data, function (key, val) {
      html += '<optgroup label="' + val.group + '">';
      for (var i = 0; i < val.list.length; i++) {
        if (radioSelected !== undefined && val.list[i].name.trim() === radioSelected.trim()) {
          radioSelected = val.list[i].flux;
        }
        html += '<option value="' + val.list[i].flux + '">' + val.list[i].name + '</option>';
      }
      html += '</optgroup>';
    });
    $('#radioSelect').append(html);
    if (radioSelected !== undefined) {
      select2.val(radioSelected).trigger("change");
    }
  });
}

function playEqualizer(){
  $('.equalizer').removeClass('stopAnime');
}

function stopEqualizer(){
  $('.equalizer').addClass('stopAnime');
}

function chromeSet(value) {
  chrome.storage.sync.set(value);
}