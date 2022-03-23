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

}(window);