$(function () {
  var pathJson = 'radio_flux.json',
    radioFlux,
    selectedObject,
    muted = false;
    icon = $('.play');

  icon.hide();

  $('#radioSelect').select2();

  $('#radioSelect').on('change', function () {
    var selectedItem = $('#radioSelect').find(":selected");
    chromeSet({radioSelected : selectedItem.text().trim()});
    chromeSet({radioSelectedFlux : selectedItem.val().trim()});
  });

  $('#muteVolume').click(function () {
    if(!muted) {
      muted = $('#radioVolume').val();
      $('#volumeLabel').text('Volume ' + 0 + '%');
      $('#radioVolume').val(0);
      chromeSet({radioVolume : 0});
    } else {
      chromeSet({radioVolume : muted});
      $('#volumeLabel').text('Volume ' + muted + '%');
      $('#radioVolume').val(muted);
      muted = false;
    }
  });

  $('#radioVolume').on('input change', function () {
    $('#volumeLabel').text('Volume ' + $(this).val() + '%');
  });

  $('#radioVolume').on('change', function () {
    chromeSet({radioVolume : $(this).val()});
  });


  icon.click(function() {
    icon.toggleClass('active');
    if (icon.hasClass('active')) {
      chromeSet({radioPlay : 'true'});
    } else {
      chromeSet({radioPlay : 'false'});
    }
    return false;
  });

  chrome.storage.sync.get("radioVolume", function (items) {
    if (items.hasOwnProperty("radioVolume")) {
      /* Set volume label */
      $('#volumeLabel').text('Volume ' + items.radioVolume + '%');
      $('#radioVolume').val(items.radioVolume);
    }
  });

  chrome.storage.sync.get("radioPlay", function (items) {
    if (items.hasOwnProperty('radioPlay') && items.radioPlay === 'true') {
      icon.addClass('active');
    }
  });

  chrome.storage.sync.get("radioSelected", function (items) {

    if (items.hasOwnProperty('radioSelected')) {
      selectedObject = items.radioSelected;
    }

    $.getJSON(pathJson, function (data) {
      $.each(data, function (key, val) {
        if (selectedObject !== undefined && key !== undefined && key !== '' && key.trim() === selectedObject.trim()) {
          $('#radioSelect').append('<option value="' + val + '" selected>' + key + '</option>');
        } else {
          $('#radioSelect').append('<option value="' + val + '">' + key + '</option>');
        }
      });
    });

    icon.show();
  });

  function chromeSet(value) {
    chrome.storage.sync.set(value);
  }
});