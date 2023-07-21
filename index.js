const fs = require('fs')
const { Translate } = require('@google-cloud/translate').v2

const TARGET_FOLDER = 'public/locales/en'
const TARGET_LANG = 'fr'
const projectId = 'projects-web-dev' // Change projects-web-dev by your project id

// Instantiates a client
const translate = new Translate({ projectId })

// Get files
function getFiles(dir, files = []) {
  fs.mkdirSync(`public/locales/${TARGET_LANG}`, { recursive: true })
  const fileList = fs.readdirSync(dir)
  for (const file of fileList) {
    const name = `${dir}/${file}`
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files)
    } else {
      files.push(name)
    }
  }
  return files
}

// Get json from local machine
const getJSON = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err)
      }
      try {
        resolve(JSON.parse(data))
      } catch (err) {
        reject(err)
      }
    })
  })
}

// returns [{key:"fullName", value:"Full name"}]
const convertToArray = obj => Object.keys(obj).map(key => ({ key, value: obj[key] }))

// Proccess all the input array and calls `getTranslation` onEach row
const processTranslation = (arr, target) => {
  return new Promise(resolve => {
    const convert = (arr, book = [], currentIndex = 0) =>
      currentIndex <= arr.length - 1
        ? getTranslation(arr[currentIndex], target).then(obj =>
            convert(arr, [...book, obj], currentIndex + 1),
          )
        : resolve(book)
    convert(arr)
  })
}

// Calls the translation google api
async function getTranslation(text, target) {
  const [translation] = await translate.translate(text.value, target)

  return {
    key: text.key,
    value: translation,
  }
}

// Converts array to object, returns {fullName:"Full Name"}
const convertToObject = arr =>
  arr.reduce((acc = {}, curr) => ({ ...acc, [curr.key]: curr.value }), {})

// Saves object as JSON into file
const writeToFile = (filename, obj) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(obj), err => (err ? reject(err) : resolve(filename)))
  })
}

getFiles(TARGET_FOLDER).forEach(file => {
  const filename = file.split('/')[3]
  getJSON(file)
    .then(input_vars => convertToArray(input_vars))
    .then(input_arr => processTranslation(input_arr, TARGET_LANG))
    .then(transl_arr => convertToObject(transl_arr))
    .then(output_vars => writeToFile(`public/locales/${TARGET_LANG}/${filename}`, output_vars))
    .then(filename =>
      console.log(`Translation succesfully saved in public/locales/${TARGET_LANG}/${filename}`),
    )
    .catch(err => console.error('Error', err))
})
