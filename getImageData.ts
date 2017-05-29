function getImageData(img: HTMLImageElement) {
  if (!img.complete) throw new Error('Cannot get pixel array from incomplete image')

  const context = getContext()
  context.drawImage(img, 0, 0)
  return context.getImageData(0, 0, img.width, img.height)

  function getContext() {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    return notNull(canvas.getContext('2d'))
  }
}
