!function (w) {
    const firebaseConfig = {
        apiKey: "AIzaSyCs9A8y7U-iCfMd4MAQdCU9UrKMqczkfrs",
        authDomain: "workflows-test-13c0a.firebaseapp.com",
        databaseURL: "https://workflows-test-13c0a-default-rtdb.firebaseio.com",
        projectId: "workflows-test-13c0a",
        storageBucket: "workflows-test-13c0a.appspot.com",
        messagingSenderId: "34553799520",
        appId: "1:34553799520:web:019b8f7ef6e9c02405b405",
        measurementId: "G-LDLNR4NN8J"
    };

    firebase.initializeApp(firebaseConfig);

    w.dbRef = firebase.database().ref('battle-warship');

    // if (sessionStorage.getItem('__uid')) {
    //     w.uid = sessionStorage.getItem('__uid');
    // } else {
    //     sessionStorage.setItem('__uid', (w.uid = '-' + btoa(Date.now())))
    // }

    // let roomId = sessionStorage.getItem('__room');

    // if (!roomId) {
    //     let searchParams = new URLSearchParams(w.location.search);
    //     if (searchParams.has('roomId')) {
    //         sessionStorage.setItem('__room', (w.roomId = searchParams.get('roomId')))
    //     }
    // }

    // if (!roomId) {
    //     sessionStorage.setItem('__room', '');
    // } else {
    //     sessionStorage.setItem('__room', (w.roomId = roomId));
    // }
}(window);