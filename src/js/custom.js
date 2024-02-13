const { remote, ipcRenderer } = require('electron');

const blobToBuffer = require('blob-to-buffer');


document.getElementById('minimize-btn').addEventListener('click', () => {
  ipcRenderer.invoke('minimize', 'mini')
});

document.getElementById('close-btn').addEventListener('click', () => {
  ipcRenderer.invoke('close', 'close')
});

const events = {

  CPU: {
    0: function render(parsed) {
      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {
        indicator.setCpuTheme('red', hardwareName)
        indicator.drawIndicator('voltage-val', 'voltage', parsed['Core (SVI2 TFN)'], 1.200, 'v')
      } else {
        let colored = '#209EE7'
        indicator.drawIndicator('usage-val', 'usage', parsed['CPU Core #1'], 4000)
      }
    },
    3: function render(parsed) {
      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {
        indicator.setCpuTheme('red', hardwareName)
        indicator.drawIndicator('clock-val', 'clock', Math.floor(parsed['Core #1']), 6000, 'Mhz')
      } else {
        let colored = '#209EE7'
        indicator.drawIndicator('usage-val', 'usage', parsed['CPU Core #1'], 4000)
      }

    },
    4: function render(parsed) {
      // let hardwareName = parsed.hwn
      // // console.log(parsed);
      // if (hardwareName.includes('AMD')) {
      //   indicator.setCpuTheme('red', hardwareName)
      //   indicator.drawIndicator('temp-val', 'temp', Math.floor(parsed['Core #1']))
      // } else {
      //   indicator.drawIndicator('temp-val', 'temp', parsed['CPU Core #1'])
      // }
    },
    5: function render(parsed) {
      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {
        indicator.setCpuTheme('red', hardwareName)
        indicator.drawIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%')
      } else {
        let colored = '#209EE7'
        indicator.drawIndicator('usage-val', 'usage', parsed['CPU Core #1'], 100)
      }
    }
  }

}


class Incicator {
  constructor() {

  }

  setCpuTheme(color, cpuModel) {
    let cpuStrokes = document.getElementsByClassName('cpuTheme');
    let cpuName = document.getElementById('cpuName');
    cpuName.style.color = color
    cpuName.textContent = cpuModel;
    for (let index = 0; index < cpuStrokes.length; index++) {
      const element = cpuStrokes[index];
      element.style.stroke = color
      element.style.color = color
    }
  }

  drawIndicator(textId, id, value, max, icon) {
    let element = document.getElementById(id)
    let glow = document.getElementById(id + 'g')
    let valText = document.getElementById(textId)
    let length = element.getTotalLength();
    valText.textContent = value + icon
    // console.log(value / 100 * 100);
    element.style.strokeDashoffset = length - value / max * length;
    glow.style.strokeDashoffset = length - value / max * length;
  }

  innitializeIndicator() {
    const paths = document.querySelectorAll('.st0, .st1');
    paths.forEach(path => {
      const length = path.getTotalLength();
      console.log(length);
      this.length = length
      path.style.transition = path.style.WebkitTransition = 'none';
      path.style.strokeDasharray = length + ' ' + length;
      path.style.strokeDashoffset = length;
      path.getBoundingClientRect();
      path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
      path.style.strokeDashoffset = '0';
    });
  }
}





const indicator = new Incicator();

indicator.innitializeIndicator()
let socket = new WebSocket('ws://localhost:3000')

socket.addEventListener('open', (event) => {
  console.log('WebSocket connection opened:', event);
});

socket.addEventListener('message', (event) => {
  let loader = document.getElementById('loader');
  loader.style.display = 'none';
  var receivedData = event.data;

  // Eğer veri blob ise, blob'u metne dönüştürmek için FileReader kullanabilirsiniz
  if (receivedData instanceof Blob) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var textData = e.target.result;
      let ta = atob(textData)
      let parsed = JSON.parse(ta)
      events[parsed.hw][parsed.type](parsed.data)
    };
    reader.readAsText(receivedData);
  } else {
    // Eğer veri blob değilse, doğrudan kullanabilirsiniz
    console.log('Blob Olmayan Veri:', receivedData);

    // Burada receivedData üzerinde işlemlerinizi gerçekleştirebilirsiniz
  }

})