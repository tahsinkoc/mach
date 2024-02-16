const { remote, ipcRenderer } = require('electron');

const blobToBuffer = require('blob-to-buffer');
const si = require('systeminformation');

si.graphics().then(data => {
  console.log(data);
})

let gpuImage = document.getElementById('gpuImage');
let cpuImage = document.getElementById('cpuImage');
let gpuVoltageImage = document.getElementById('gpuVoltageImage');
let cpuVoltageImage = document.getElementById('cpuVoltageImage');
let cpuTempImage = document.getElementById('cpuTempImage');
let gpuTempImage = document.getElementById('gpuTempImage');
let cpuTemp = document.getElementById('cpuTemp');
let cpuTempBar = document.getElementById('cpuTempBar');
let gpuTemp = document.getElementById('gpuTemp');
let gpuTempBar = document.getElementById('gpuTempBar');
let gline = document.getElementById('gline');

let isLoaded = false;
let isRamLoaded = false

let colors = {
  nvidia: '#13C500',
  amd: 'red',
  intel: '#209EE7',
  proccesAmd: '../src/assets/1x/CPU AMD.png',
  processIntel: '../src/assets/1x/CPU.png',
  gpuAmd: '../src/assets/1x/GPU AMD.png',
  gpuNvidia: '../src/assets/1x/GPU NVIDIA.png',
  voltageAmd: '../src/assets/1x/Voltage Red.png',
  voltageIntel: '../src/assets/1x/Voltage.png',
  voltageNvidia: '../src/assets/1x/Voltage Green.png',
  tempIntel: '../src/assets/1x/TEMP Blue.png',
  tempNvidia: '../src/assets/1x/TEMP Green.png',
  tempAmd: '../src/assets/1x/TEMP Red.png',
}

// si.mem().then(item => {
//   // console.log(item);
// })

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
        indicator.setCpuTheme('red', hardwareName.replace('with Radeon Vega Mobile Gfx', ''))
        indicator.drawDottedVoltageIndicator('voltage-val', 'voltage', parsed['Core (SVI2 TFN)'].toFixed(3), Math.floor(parsed['Core (SVI2 TFN)']), 'V', document.getElementsByClassName('al'), colors.amd)
        // indicator.drawIndicator('voltage-val', 'voltage', parsed['Core (SVI2 TFN)'], parsed['Core (SVI2 TFN)Max'], ' V')
      } else {
        let colored = '#209EE7'
        cpuImage.src = colors.processIntel;
        cpuVoltageImage.src = colors.voltageIntel;
        console.log(Math.floor(parsed['CPU Core']));
        // indicator.drawIndicator('voltage-val', 'voltage', Math.floor(parsed['CPU Core']), Math.floor(parsed['CPU CoreMax']), 'v')
        indicator.drawDottedVoltageIndicator('voltage-val', 'voltage', Math.floor(parsed['CPU Core']), Math.floor(parsed['CPU CoreMax']), 'V', document.getElementsByClassName('al'), colors.intel)
        indicator.setCpuTheme('#209EE7', hardwareName)
      }
    },
    3: function render(parsed) {

      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {
        indicator.drawIndicator('clock-val', 'clock', Math.floor(parsed['Core #1']), Math.floor(parsed['Core #1Max']), 'Mhz')
      } else {
        cpuImage.src = colors.processIntel;
        cpuVoltageImage.src = colors.voltageIntel;
        let colored = '#209EE7'
        indicator.drawIndicator('clock-val', 'clock', Math.floor(parsed['CPU Core #1']), Math.floor(parsed['CPU Core #1Max']), ' Mhz')
      }

    },
    4: function render(parsed) {

      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {

        cpuTempBar.style.width = Math.floor(parsed['Core #1']) / 105 * 100 + '%'
        cpuTemp.textContent = Math.floor(parsed['Core #1']) + ' °C'

        // indicator.drawIndicator('temp-val', 'temp', Math.floor(parsed['Core #1']))
      } else {
        cpuImage.src = colors.processIntel;
        cpuVoltageImage.src = colors.voltageIntel;
        cpuTempImage.src = colors.tempIntel;
        cpuTemp.style.color = colors.intel;
        cpuTempBar.style.width = Math.floor(parsed['CPU Core #1']) / 105 * 100 + '%'
        cpuTemp.textContent = Math.floor(parsed['CPU Core #1']) + ' °C'
        // indicator.drawIndicator('temp-val', 'temp', Math.floor(parsed['CPU Core #1']))
      }
    },
    5: function render(parsed) {

      // console.log(parsed);
      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('AMD')) {

        // indicator.setCpuTheme('red', hardwareName)
        indicator.drawDottedIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%', document.getElementsByClassName('at'), colors.amd)

        // indicator.drawIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%')
      } else {
        cpuImage.src = colors.processIntel;
        cpuVoltageImage.src = colors.voltageIntel;
        let colored = '#209EE7'
        indicator.drawDottedIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%', document.getElementsByClassName('at'), colors.intel)
        indicator.setCpuTheme('#209EE7', hardwareName)
        // indicator.drawIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%')
        // let paths = document.getElementsByClassName('at')

      }
    }
  },
  GPU: {
    2: function render(parsed) {
      let hardwareName = parsed.hwn;
      if (hardwareName.includes('NVIDIA')) {
        gpuImage.src = colors.gpuNvidia;
        gpuVoltageImage.src = colors.voltageNvidia;
        indicator.setGpuTheme('#13C500', hardwareName)
        indicator.drawDottedGpuVoltageIndicator('gvoltage-val', 'gvoltage', Math.floor(parsed['GPU Package']), Math.floor(400), 'w', document.getElementsByClassName('alg'), colors.nvidia)
      } else {
        gpuImage.src = colors.gpuAmd;
        gpuVoltageImage.src = colors.voltageAmd;
        indicator.setGpuTheme('red', hardwareName)
        indicator.drawDottedGpuVoltageIndicator('gvoltage-val', 'gvoltage', Math.floor(parsed['GPU Package']), Math.floor(400), 'w', document.getElementsByClassName('alg'), colors.amd)
      }
    },
    3: function render(parsed) {
      let hardwareName = parsed.hwn;
      if (hardwareName.includes('NVIDIA')) {
        gpuImage.src = colors.gpuNvidia;
        gpuVoltageImage.src = colors.voltageNvidia;
        indicator.setGpuTheme('#13C500', hardwareName)
        // console.log(parsed['GPU Core']);
        // indicator.drawIndicator('voltage-val', 'voltage', parsed['GPU Core'], 1.600, 'v')
        indicator.drawGpuIndicator('clock-val', 'clock', parsed['GPU Core'], parsed['GPU CoreMax'], ' Mhz')
        indicator.drawIndicator('gmem-val', 'gmem', Math.floor(parsed['GPU Memory'] / parsed['GPU MemoryMax'] * 100), 100, '%')
      } else {
        gpuImage.src = colors.gpuAmd;
        gpuVoltageImage.src = colors.voltageAmd;
        indicator.setGpuTheme('red', hardwareName)
        // console.log(parsed['GPU Core']);
        // indicator.drawIndicator('voltage-val', 'voltage', parsed['GPU Core'], 1.600, 'v')
        indicator.drawGpuIndicator('clock-val', 'clock', parsed['GPU Core'], parsed['GPU CoreMax'], ' Mhz')
        indicator.drawIndicator('gmem-val', 'gmem', Math.floor(parsed['GPU Memory'] / parsed['GPU MemoryMax'] * 100), 100, '%')

      }
    },
    4: function render(parsed) {
      let hardwareName = parsed.hwn;
      if (hardwareName.includes('NVIDIA')) {
        gpuImage.src = colors.gpuNvidia;
        gpuVoltageImage.src = colors.voltageNvidia;
        gpuTempImage.src = colors.tempNvidia
        gpuTempBar.style.fill = colors.nvidia
        gpuTempBar.style.width = Math.floor(parsed['GPU Core']) / 105 * 100 + '%'
        gpuTemp.style.color = colors.nvidia
        gpuTemp.textContent = Math.floor(parsed['GPU Core']) + ' °C'
      } else {
        gpuImage.src = colors.gpuAmd;
        gpuVoltageImage.src = colors.voltageAmd;
        gpuTempImage.src = colors.tempAmd
        gpuTempBar.style.fill = colors.amd
        gpuTempBar.style.width = Math.floor(parsed['GPU Core']) / 105 * 100 + '%'
        gpuTemp.style.color = colors.amd
        gpuTemp.textContent = Math.floor(parsed['GPU Core']) + ' °C'
      }
    },
    5: function render(parsed) {
      // console.log(parsed);
      let hardwareName = parsed.hwn
      // console.log(parsed);
      if (hardwareName.includes('NVIDIA')) {
        gpuImage.src = colors.gpuNvidia;
        gpuVoltageImage.src = colors.voltageNvidia;
        // indicator.setGpuTheme('#13C500', hardwareName)
        // indicator.drawIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%')
        indicator.drawDottedGpuVoltageIndicator('gusage-val', 'gusage', Math.floor(parsed['GPU Core']), 100, '%', document.getElementsByClassName('atg'), colors.nvidia)
        indicator.setGpuTheme('#13C500', hardwareName)
        // indicator.drawGpuIndicator('usage-val', 'usage', Math.floor(parsed['GPU Core']), parsed['GPU CoreMax'], '%')
      } else {
        gline.style.stroke = colors.amd
        gpuImage.src = colors.gpuAmd;
        gpuVoltageImage.src = colors.voltageAmd;
        // indicator.setGpuTheme('#13C500', hardwareName)
        // indicator.drawIndicator('usage-val', 'usage', Math.floor(parsed['CPU Total']), 100, '%')
        indicator.drawDottedGpuVoltageIndicator('gusage-val', 'gusage', Math.floor(parsed['GPU Core']), 100, '%', document.getElementsByClassName('atg'), colors.amd)
        indicator.setGpuTheme('red', hardwareName)
        // indicator.drawGpuIndicator('usage-val', 'usage', Math.floor(parsed['GPU Core']), parsed['GPU CoreMax'], '%')
      }
    }
  },
  MEM: {
    12: function render(parsed) {
      indicator.drawMemoryIndi('mem-val', 'mem', Math.floor(parsed['Memory Used'] / (parsed['Memory Used'] + parsed['Memory Available']) * 100), 100, '%', parsed['Memory Used'])
      if (isRamLoaded) {

      } else {
        si.memLayout().then(data => {
          console.log(data);
          document.getElementById('mem-clock').textContent = data[0].clockSpeed
        })
        isRamLoaded = true
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
    let line = document.getElementById('line');
    if (!isLoaded && color === 'red') {
      cpuImage.src = colors.proccesAmd;
      cpuVoltageImage.src = colors.voltageAmd;
      cpuTempImage.src = colors.tempAmd;
      cpuTemp.style.color = colors.amd;
      cpuTempBar.style.fill = colors.amd
      cpuTempBar.style.stroke = colors.amd
      isLoaded = true
    } else if (!isLoaded && color === '#209EE7') {
      cpuImage.src = colors.processIntel;
      cpuVoltageImage.src = colors.voltageIntel;
      cpuTempImage.src = colors.tempIntel;
      cpuTemp.style.color = colors.intel;
      cpuTempBar.style.fill = colors.intel;
      isLoaded = true
    } else if (isLoaded) {

    }
    line.style.stroke = color;
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
  drawMemoryIndi(textId, id, value, max, icon, pure) {
    let element = document.getElementById(id)
    let glow = document.getElementById(id + 'g')
    let valText = document.getElementById(textId)
    let length = element.getTotalLength();
    valText.textContent = pure.toFixed(3) + ' GB'
    // console.log(value / 100 * 100);
    element.style.strokeDashoffset = length - value / max * length;
    glow.style.strokeDashoffset = length - value / max * length;
  }
  drawDottedIndicator(textId, id, value, max, icon, paths, color) {
    let element = document.getElementById(id)
    let glow = document.getElementById(id + 'g')
    let valText = document.getElementById(textId)
    valText.textContent = value + icon
    for (let index = 0; index < paths.length; index++) {
      const element = paths[index];
      element.style.fill = 'transparent'
      element.style.stroke = color
      element.transition = 'all 1s ease-in-out'
    }
    for (let index = 0; index < value / 5; index++) {
      const element = paths[index];
      element.style.stroke = color
      element.style.fill = color
      element.transition = 'all 1s ease-in-out'
    }
  }
  drawDottedVoltageIndicator(textId, id, value, max, icon, paths, color) {
    let element = document.getElementById(id)
    let glow = document.getElementById(id + 'g')
    let valText = document.getElementById(textId)
    valText.textContent = value + icon
    let neval = value / max * 20
    for (let index = 0; index < paths.length; index++) {
      const element = paths[index];
      element.style.fill = 'transparent'
      element.transition = 'all 1s ease-in-out'
      element.style.stroke = color
    }
    for (let index = 0; index < neval; index++) {
      const element = paths[index];
      element.style.fill = color
      element.style.stroke = color
      element.transition = 'all 1s ease-in-out'
    }
  }
  drawGpuIndicator(textId, id, value, max, icon) {
    let element = document.getElementById('g' + id)
    let glow = document.getElementById('g' + id + 'g')
    let valText = document.getElementById('g' + textId)
    let length = element.getTotalLength();
    valText.textContent = value + icon
    element.style.strokeDashoffset = length - value / max * length;
    glow.style.strokeDashoffset = length - value / max * length;
  }
  drawDottedGpuIndicator(textId, id, value, max, icon, paths, color) {
    let element = document.getElementById(id)
    let glow = document.getElementById(id + 'g')
    let valText = document.getElementById(textId)
    valText.textContent = value + icon
    for (let index = 0; index < paths.length; index++) {
      const element = paths[index];
      element.style.fill = 'transparent'
      element.transition = 'all 1s ease-in-out'
    }
    for (let index = 0; index < value / 5; index++) {
      const element = paths[index];
      element.style.fill = color
      element.transition = 'all 1s ease-in-out'
    }
  }

  drawDottedGpuVoltageIndicator(textId, id, value, max, icon, paths, color) {
    let element = document.getElementById(id)
    let glow = document.getElementById(id + 'g')
    let valText = document.getElementById(textId)
    valText.textContent = value + icon
    let neval = value / max * 20
    for (let index = 0; index < paths.length; index++) {
      const element = paths[index];
      element.style.fill = 'transparent'
      element.style.stroke = color
      element.transition = 'all 1s ease-in-out'
    }
    for (let index = 0; index < neval; index++) {
      const element = paths[index];
      element.style.fill = color
      element.style.stroke = color
      element.transition = 'all 1s ease-in-out'
    }
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
      path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 1s ease-in-out';
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

      // si.mem().then(data => {
      //   indicator.drawIndicator('mem-val', 'mem', Math.floor(data.used / data.total * 100), 100, '%')
      // })
    };
    reader.readAsText(receivedData);
  } else {
    // Eğer veri blob değilse, doğrudan kullanabilirsiniz
    console.log('Blob Olmayan Veri:', receivedData);

    // Burada receivedData üzerinde işlemlerinizi gerçekleştirebilirsiniz
  }

})