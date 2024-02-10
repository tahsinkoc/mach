const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

function createWindow() {
    const win = new BrowserWindow({
        minWidth: 860,
        minHeight: 981.5,
        // webPreferences: {
        //     preload: path.join(__dirname, 'preload.js')
        // }
        frame: false,
        autoHideMenuBar: true,
    })

    win.loadFile('./windows/index.html')
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