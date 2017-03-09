$(function () {
  var pathJson = 'radio_flux.json',
    radioFlux,
    selectedObject,
    icon = $('.play');

  icon.hide();

  $('#radioSelect').select2();

  $('#radioSelect').on('change', function () {
    var selectedItem = $('#radioSelect').find(":selected");
    chromeSet({radioSelected : selectedItem.text().trim()});
    chromeSet({radioSelectedFlux : selectedItem.val().trim()});
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