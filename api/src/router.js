const { Router } = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const imageProcessor = require('./imageProcessor')


const router = Router()

const filename = (request, file, callback) => {
    callback(null, file.originalname)
}
const storage = multer.diskStorage({
    destination: 'api/uploads/photos',
    filename
})

const fileFilter = (request, file, callback) => {
    if (file.mimetype !== 'image/png') {
        request.fileValidationError = 'Wrong file type'
        callback(null, false, new Error('Wrong file type'))
    } else {
        callback(null, true)
    }
}
const upload = multer({ fileFilter, storage })

router.post('/upload', upload.single('photo'), async (request, response) => {
    if (request.fileValidationError) {
        response.status(400).json({ error: request.fileValidationError })
    } else {
        try {
            await imageProcessor(request.file.filename)
        } catch (error) {}
        response.redirect('/' + request.file.filename)
    }
})


router.get('/:filename', (request, response) => {
    const { filename } = request.params
    response.render('photo-viewer', { title: filename, filename })
    setTimeout(() => {
        const uploadPath = path.resolve(__dirname, '../uploads/photos')
        cleanDir(uploadPath)
    }, 60000)
})

module.exports = router

function cleanDir (directory) {
    fs.readdir(directory, (err, files) => {
        if (err) throw err
        for (let file of files) {
            if (file === '.keep') continue
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err
            })
        }
    })
}