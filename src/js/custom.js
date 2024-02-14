const { remote, ipcRenderer } = require('electron');

const blobToBuffer = require('blob-to-buffer');
const si = require('systeminformation');


si.mem().then(item => {
  console.log(item);
})

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
        indicator.drawIndicator('voltage-val', 'voltage', parsed['Core (SVI2 TFN)'], parsed['Core (SVI2 TFN)Max'], 'v')
      } else {
        let colored = '#209EE7'
        indicator.drawIndicator('voltage-val', 'voltage', Math.floor(parsed['CPU Core']), Math.floor(parsed['CPU CoreMax']), 'v')
      }
    },
    3: function render(parsed) {
      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {
        indicator.setCpuTheme('red', hardwareName)
        indicator.drawIndicator('clock-val', 'clock', Math.floor(parsed['Core #1']), Math.floor(parsed['Core #1Max']), 'Mhz')
      } else {
        let colored = '#209EE7'
        indicator.drawIndicator('clock-val', 'clock', Math.floor(parsed['CPU Core #1']), Math.floor(parsed['CPU Core #1Max']), ' Mhz')
      }

    },
    4: function render(parsed) {
      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {
        indicator.setCpuTheme('red', hardwareName)
        indicator.drawIndicator('temp-val', 'temp', Math.floor(parsed['Core #1']))
      } else {
        indicator.drawIndicator('temp-val', 'temp', Math.floor(parsed['CPU Core #1']))
      }
    },
    5: function render(parsed) {
      // console.log(parsed);
      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {
        indicator.setCpuTheme('red', hardwareName)
        indicator.drawIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%')
      } else {
        let colored = '#209EE7'
        indicator.setCpuTheme('#209EE7', hardwareName)
        indicator.drawIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%')
      }
    }
  },
  GPU: {
    2:function render(parsed) {
      let hardwareName = parsed.hwn;
      if (hardwareName.includes('AMD')) {
        indicator.setGpuTheme('red', hardwareName)
      }else {
        indicator.setGpuTheme('#13C500', hardwareName)
        // indicator.drawIndicator('voltage-val', 'voltage', parsed['GPU Core'], 1.600, 'v')
        indicator.drawGpuIndicator('voltage-val', 'voltage', parsed['GPU Package'], parsed['GPU PackageMax'], 'w')
      }
    },
    3:function render(parsed) {
      let hardwareName = parsed.hwn;
      if (hardwareName.includes('AMD')) {
        indicator.setGpuTheme('red', hardwareName)
      }else {
        indicator.setGpuTheme('#13C500', hardwareName)
        // console.log(parsed['GPU Core']);
        // indicator.drawIndicator('voltage-val', 'voltage', parsed['GPU Core'], 1.600, 'v')
        indicator.drawGpuIndicator('clock-val', 'clock', parsed['GPU Core'], parsed['GPU CoreMax'], ' Mhz')
      }
    },
    5: function render(parsed) {
      // console.log(parsed);
      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {
        indicator.setCpuTheme('red', hardwareName)
        indicator.drawIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), parsed['GPU Core'], '%')
      } else {
        indicator.setGpuTheme('#13C500', hardwareName)
        // indicator.drawIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%')
        indicator.drawGpuIndicator('usage-val', 'usage', Math.floor(parsed['GPU Core']), parsed['GPU CoreMax'], '%')
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

  setGpuTheme(color, gpuModel) {
    let cpuStrokes = document.getElementsByClassName('gpuTheme');
    let cpuName = document.getElementById('gpuName');
    cpuName.style.color = color
    cpuName.textContent = gpuModel;
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

  drawGpuIndicator(textId, id, value, max, icon) {
    let element = document.getElementById('g'+id)
    let glow = document.getElementById('g'+ id + 'g')
    let valText = document.getElementById('g'+textId)
    let length = element.getTotalLength();
    valText.textContent = value + icon
    // console.log(value / 100 * 100);
    element.style.strokeDashoffset = length - value / max * length;
    glow.style.strokeDashoffset = length - value / max * length;
  }

  innitializeIndicator() {
    const paths = document.querySelectorAll('.st0, .st1, .st00, .st11, .st000, .st111');
    paths.forEach(path => {
      const length = path.getTotalLength();
      // console.log(length);
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
      // console.log(parsed);
      events[parsed.hw][parsed.type](parsed.data)
      si.mem().then(data => {
        indicator.drawIndicator('mem-val', 'mem', Math.floor(data.used / data.total * 100), 100, '%')
      })
    };
    reader.readAsText(receivedData);
  } else {
    // Eğer veri blob değilse, doğrudan kullanabilirsiniz
    console.log('Blob Olmayan Veri:', receivedData);

    // Burada receivedData üzerinde işlemlerinizi gerçekleştirebilirsiniz
  }

})