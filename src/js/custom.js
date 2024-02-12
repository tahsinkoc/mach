const { remote, ipcRenderer } = require('electron');

const blobToBuffer = require('blob-to-buffer');



document.getElementById('minimize-btn').addEventListener('click', () => {
  ipcRenderer.invoke('minimize', 'mini')
});

document.getElementById('close-btn').addEventListener('click', () => {
  ipcRenderer.invoke('close', 'close')
});



class Incicator {
  constructor() {

  }

  drawIndicator(textId, id, value) {
    let element = document.getElementById(id)
    let glow = document.getElementById(id + 'g')  
    let valText= document.getElementById(textId)

    valText.textContent = value + ' °C'
    console.log(value / 103 * 100);
    element.style.strokeDashoffset = this.length - value / 103 * this.length;
    glow.style.strokeDashoffset = this.length - value / 103 * this.length;
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
  var receivedData = event.data;

  // Eğer veri blob ise, blob'u metne dönüştürmek için FileReader kullanabilirsiniz
  if (receivedData instanceof Blob) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var textData = e.target.result;
      let ta = atob(textData)
      let parsed = JSON.parse(ta)
      indicator.drawIndicator('temp-val','temp', parsed['CPU Core #1'])
      // console.log('Blob Verisi:', 100 - parsed['CPU Core #1'] / 103 * 100);

      // Burada textData üzerinde işlemlerinizi gerçekleştirebilirsiniz
    };
    reader.readAsText(receivedData);
  } else {
    // Eğer veri blob değilse, doğrudan kullanabilirsiniz
    console.log('Blob Olmayan Veri:', receivedData);

    // Burada receivedData üzerinde işlemlerinizi gerçekleştirebilirsiniz
  }

})