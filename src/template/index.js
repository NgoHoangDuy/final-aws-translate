// const axios = require('axios')

async function doTranslate() {
    const respone = await fetch('http://localhost:3000/translate', {
        method: 'post',
        mode: 'cors',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(getParamTranslate())
    })
    // console.log(res)
    const data = await respone.json()
    var outputTextArea = document.getElementById('outputText');
    outputTextArea.value = data.TranslatedText;
}

function getParamTranslate() {
    var inputText = document.getElementById('inputText').value;
    if (!inputText) {
        var outputText = document.getElementById('outputText');
        outputText.value = ""
    }
    var sourceDropdown = document.getElementById("sourceLanguageCodeDropdown");
    var sourceLanguageCode = sourceDropdown.options[sourceDropdown.selectedIndex].value;
    var targetDropdown = document.getElementById("targetLanguageCodeDropdown");
    var targetLanguageCode = targetDropdown.options[targetDropdown.selectedIndex].value;
    const param = {
        SourceLanguageCode: sourceLanguageCode,
        TargetLanguageCode: targetLanguageCode,
        Text: inputText
    }
    return param
}

var countDoSynthesizeSpeech = 0;

async function doSynthesizeSpeechhInput() {
    
    var text = document.getElementById('inputText').value.trim();
    var sourceDropdown = document.getElementById("sourceLanguageCodeDropdown");
    var sourceLanguageCode = sourceDropdown.options[sourceDropdown.selectedIndex].value;

    const param = {
        text: text,
        languageCode: sourceLanguageCode
    }
    
    const src =await doSynthesizeSpeech(param)
    if(src === 'blank') {
        alert("Vui lòng nhập văn bản bạn muốn dịch"); 
        exit(); 
    }
    else if(src === 'language') {
        alert("Hiện tại chưa hỗ trợ giọng nói cho ngôn ngữ \"" + param.languageCode + "\""); 
        exit(); 
    }
    else playAudioInput(src)
    countDoSynthesizeSpeech++;
    console.log(countDoSynthesizeSpeech)
}

function doSynthesizeSpeechOutput() {
    var text = document.getElementById('inputText').value.trim();
    var targetDropdown = document.getElementById("targetLanguageCodeDropdown");
    var targetLanguageCode = targetDropdown.options[targetDropdown.selectedIndex].value;

    const param = {
        text: text,
        languageCode: targetLanguageCode
    }
    return param
}

async function doSynthesizeSpeech(param) {
    const respone = await fetch('http://localhost:3000/speech', {
        method: 'post',
        mode: 'cors',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(param)
    })
    const data = await respone.json()
    if(data.message ==='language')return data.message
    else if(data.message ==='blank')return `blank`
    else return data
}



function playAudioInput(src) {
    addSrcToAudio(src)
    var audioInput = document.getElementById('audioInput')
    audioInput.play()
}

function pauseAudioInput() {
    var audioInput = document.getElementById('audioInput')
    if (audioInput.duration > 0 && !audioInput.paused) {
        audioInput.pause();
        audioInput.currentTime = 0;
    }
}

function playAudioOutput() {
    var audioInput = document.getElementById('audioInput')
    var audioOutput = document.getElementById('audioOutput')

    if (audioInput.duration > 0 && !audioInput.paused) {
        audioInput.pause();
        audioInput.currentTime = 0;
    }

    audioOutput.play()
}

function pauseAudioOutput() {
    var audioOutput = document.getElementById('audioOutput')
    if (audioOutput.duration > 0 && !audioOutput.paused) {
        audioOutput.pause();
        audioOutput.currentTime = 0;
    }
}


function addSrcToAudio(src){
    document.getElementById('audioInput').setAttribute('src',`../../mp3/${src}.mp3`)
}


function clearInput(){
    document.getElementById('inputText').value = "";
    document.getElementById('outputText').value = "";
}
function download(value){
    function dataUrl(data){return "data:x-application/text,"+escape(data)}
    window.open(dataUrl(value))
}

function swap(){
    var input = document.getElementById('inputText')
    var output = document.getElementById('outputText')
    var targetDropdown = document.getElementById("targetLanguageCodeDropdown");
    var sourceDropdown = document.getElementById("sourceLanguageCodeDropdown");

    if(sourceDropdown.options[sourceDropdown.selectedIndex].value==='auto'){
        alert(`Can not swap with language auto`)
        exit()
    }

    var inputValue = input.value
    var outputValue = output.value
    input.value = outputValue
    output.value = inputValue


    var temp ;
    temp = sourceDropdown.value
    sourceDropdown.value =  targetDropdown.value
    targetDropdown.value = temp

    // doTranslate()
}