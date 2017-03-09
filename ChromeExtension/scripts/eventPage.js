var radioFlux = false, playingRadio = false, audio = false, currentVolume = 0.5, timeToSetVolume = false, port;
chrome.extension.onConnect.addListener(function(portTmp) {
  port = portTmp;
  port.onDisconnect.addListener(function() {
    port = undefined;
  });
});

chrome.commands.onCommand.addListener(function(command) {
  switch(command) {
    case 'toggle-play-pause':
      if(playingRadio) {
        stopRadio();
        playingRadio = false;
        chrome.storage.sync.set({radioPlay : 'false'});
      } else {
        if (radioFlux !== undefined && radioFlux !== '') {
          if(playingRadio) {
            stopRadio();
          }
          playRadio(radioFlux);
        }
        playingRadio = true;
        chrome.storage.sync.set({radioPlay : 'true'});
      }
      break;
    case 'volume-down':
      if (playingRadio && audio !== false) {
        var newVolume = parseFloat(currentVolume - 0.2) <= 0 ? 0 : parseFloat(currentVolume - 0.2);
        if (port !== undefined) {
          port.postMessage(parseInt(newVolume * 100));
        }
        changeVolume(newVolume * 100);
        // if(!timeToSetVolume || parseInt(timeToSetVolume) + 1000 < Date.now()) {
          chrome.storage.sync.set({radioVolume : parseInt(newVolume * 100)});
        // }
        timeToSetVolume = Date.now();
      }
      break;
    case 'volume-up':
      if (playingRadio && audio !== false) {
        var upVolume = parseFloat(currentVolume + 0.2) > 1 ? 1 : parseFloat(currentVolume + 0.2);
        if (port !== undefined) {
          port.postMessage(parseInt(upVolume * 100));
        }
        changeVolume(upVolume * 100);
        // if(!timeToSetVolume || parseInt(timeToSetVolume) + 1000 < Date.now()) {
          chrome.storage.sync.set({radioVolume : parseInt(upVolume * 100)});
        // }
        timeToSetVolume = Date.now();
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

chrome.storage.sync.get("radioVolume", function (items) {
  if (items.hasOwnProperty('radioVolume') && audio !== false) {
    changeVolume('radioVolume');
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
      if(!playingRadio) {
        playRadio(radioFlux);
        playingRadio = true;
      }
    } else {
      if (playingRadio) {
        stopRadio();
      }
      playingRadio = false;
    }
  }

  if (changes.hasOwnProperty('radioVolume') && changes.radioVolume.newValue !== "" && audio !== false) {
    changeVolume(changes.radioVolume.newValue);
  }
}));

function changeVolume(volume) {
  volume = parseFloat(parseFloat(volume / 100).toFixed(2));
  audio.volume = volume;
  currentVolume = volume;
}

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