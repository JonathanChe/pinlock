function extractHostName(url) {
    let hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function extractRootDomain(url) {
    var domain = extractHostName(url),
    splitArr = domain.split('.'),
    arrLen = splitArr.length;

    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

let currentURL; 
let pin;
let createButton;

// get the current domain name and pass it into the object. 
chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    let url = tabs[0].url;
    currentURL = extractRootDomain(url);
});

// checks to see if domain has already been registered.
chrome.storage.local.get(currentURL, function(items) {

    if (items.hasOwnProperty(currentURL)) {
        pin = items[currentURL]; // store the pin inside the object 
        let parentDiv = document.getElementsByTagName('body');
        parentDiv[0].style.backgroundImage = "url('https://www.shareicon.net/data/256x256/2016/02/02/273992_locked_256x256.png')";
        console.log(items) // if desired, can check what's in your local memory 
    } else {
        pin = Math.ceil(1000 + Math.random() * 9000) // generate new pin
        // console.log(pin)

        // create a button, assign css rules
        createButton = document.createElement('button'); 
        createButton.setAttribute('id', 'submit');
        createButton.innerText = 'Lock this pin';

        // ------------------Upon button click, store site and pin ------------
        setTimeout(function() {
            createButton.addEventListener('click', function() {
                // create an object to pass to .set to store in local storage
                let obj = {};
                obj[currentURL] = pin;
                chrome.storage.local.set(obj);
                createButton.style.display = 'none'; // no longer show the button if clicked.
                let parentDiv = document.getElementsByTagName('body');
                parentDiv[0].style.backgroundImage = "url('https://www.shareicon.net/data/256x256/2016/02/02/273992_locked_256x256.png')";
            })
        }, 0);
        // ---------------------------------------------------------------------
    }
});


// ------- create a div and append to show pin number in HTML -----------
let createDiv = document.createElement('div');
let parentDiv = document.getElementsByTagName('body');

setTimeout(function() {
    createDiv.setAttribute('id', 'pin');
    createDiv.innerHTML = pin;
}, 0);

setTimeout(function() {
    parentDiv[0].appendChild(createDiv)
    parentDiv[0].appendChild(createButton);
}, 0);

// use if you want to clear your memory.
// chrome.storage.local.clear();