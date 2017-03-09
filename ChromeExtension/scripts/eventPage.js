var radioFlux = false, playingRadio = false, audio;

chrome.commands.onCommand.addListener(function(command) {
  switch(command) {
    case 'toggle-play-pause':
      if(playingRadio) {
        stopRadio();
        playingRadio = false;
        chrome.storage.sync.set({radioPlay : 'false'});
      } else {
        if (radioFlux !== undefined && radioFlux !== '') {
          playRadio(radioFlux);
        }
        playingRadio = true;
        chrome.storage.sync.set({radioPlay : 'true'});
      }
      break;
  }
});

chrome.storage.sync.get("radioSelectedFlux", function (items) {
  if (items.hasOwnProperty('radioSelectedFlux') && items.radioSelectedFlux.trim() !== '') {
    radioFlux = items.radioSelectedFlux.trim();
    chrome.storage.sync.get("radioPlay", function (itemsPlay) {
      if (itemsPlay.hasOwnProperty('radioPlay') && itemsPlay.radioPlay.toLowerCase() === 'true') {
        playRadio(radioFlux);
      }
    });
  } else {
    radioFlux = false;
  }
});

chrome.storage.sync.get("radioPlay", function (items) {
  if (items.hasOwnProperty('radioPlay')) {
    playingRadio = items.radioPlay === 'true';
  }
});


chrome.storage.onChanged.addListener((function (changes) {
  if (changes.hasOwnProperty('radioSelectedFlux') && changes.radioSelectedFlux.newValue.trim() == '') {
    radioFlux = false;
  } else if (changes.hasOwnProperty('radioSelectedFlux') && changes.radioSelectedFlux.newValue.trim() !== '') {
    var tmpRadioFlux = changes.radioSelectedFlux.newValue.trim();
    if (radioFlux !== tmpRadioFlux) {
      if (playingRadio) {
        radioFlux = tmpRadioFlux;
        changeFlux(radioFlux);
      } else {
        radioFlux = tmpRadioFlux;
      }
    }
  }

  if (changes.hasOwnProperty('radioPlay')) {
    if (changes.radioPlay.newValue.toLowerCase().trim() === 'true' && radioFlux !== false) {
      playRadio(radioFlux);
      playingRadio = true;
    } else {
      if (playingRadio) {
        stopRadio();
      }
      playingRadio = false;
    }
  }
}));

function changeFlux(flux) {
  audio.src = flux;
  audio.load();
  audio.play();
}

function playRadio(flux) {
  audio = document.createElement('audio');
  audio.src = flux;
  audio.play();
}

function stopRadio() {
  audio.pause();
}