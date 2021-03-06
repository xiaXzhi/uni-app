import { fileToUrl } from 'uni-platform/helpers/file'

const {
  invokeCallbackHandler: invoke
} = UniServiceJSBridge

let imageInput = null

const _createInput = function (options) {
  let inputEl = document.createElement('input')
  inputEl.type = 'file'
  inputEl.style = 'visibility: hidden;z-index: -999;width: 0;height: 0;'
  inputEl.accept = 'image/*'
  if (options.count > 1) {
    inputEl.multiple = 'multiple'
  }
  // 经过测试，仅能限制只通过相机拍摄，不能限制只允许从相册选择。
  if (options.sourceType.length === 1 && options.sourceType[0] === 'camera') {
    inputEl.capture = 'camera'
  }

  return inputEl
}

export function chooseImage ({
  count,
  // sizeType,
  sourceType
}, callbackId) {
  // TODO handle sizeType 尝试通过 canvas 压缩

  if (imageInput) {
    document.body.removeChild(imageInput)
    imageInput = null
  }

  imageInput = _createInput({
    count: count,
    sourceType: sourceType
  })
  document.body.appendChild(imageInput)

  imageInput.addEventListener('change', function (event) {
    const tempFilePaths = []
    const tempFiles = []
    const fileCount = event.target.files.length
    for (let i = 0; i < fileCount; i++) {
      const file = event.target.files[i]
      const filePath = fileToUrl(file)

      tempFilePaths.push(filePath)
      tempFiles.push({
        path: filePath,
        size: file.size
      })
    }

    invoke(callbackId, {
      errMsg: 'chooseImage:ok',
      tempFilePaths: tempFilePaths,
      tempFiles: tempFiles
    })

    // TODO 用户取消选择时，触发 fail，目前尚未找到合适的方法。
  })

  imageInput.click()
}
