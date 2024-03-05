import { Requester } from 'cote'

const requester = new Requester({ name: 'miporra'})

export async function resizeImage(imageToResize) {
    const evento = {
        type: 'resize-image',
        image: imageToResize,
    }
    return new Promise(resolve => requester.send(evento, resolve))
}