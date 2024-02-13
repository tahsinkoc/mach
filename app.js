const { app, BrowserWindow, ipcMain } = require('electron/main')
const WebSocket = require('ws')
const { WebSocketServer } = require('ws')
const path = require('node:path')



const server = new WebSocketServer({ port: 3000 })
const clients = []
server.on('connection', (socket) => {
    console.log('Client connected');
    clients.push(socket)
    // console.log(clients);
    socket.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Broadcast the message to all connected clients
        // clients.forEach((client) => {
        //     if (client !== socket && client.readyState === WebSocket.OPEN) {
        //         client.send(message);
        //         console.log(clients);
        //     }
        // });
        clients.forEach(item => {
            item.send(message)
        })
    });

    // Event listener for closing connections
    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on port 3000');

function createWindow() {
    const win = new BrowserWindow({
        minWidth: 860,
        height: 981.5,
        minHeight: 981.5,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            devTools: true,
            nodeIntegration: true,
            contextIsolation: false,
            // enableRemoteModule: true,
        },
        frame: false,
        autoHideMenuBar: true,
    })

    win.loadFile('./windows/index.html')

    win.webContents.openDevTools();
    ipcMain.handle('minimize', async (event, ...args) => {
        win.minimize()
    })
    ipcMain.handle('close', () => {
        win.close()
    })
}
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})