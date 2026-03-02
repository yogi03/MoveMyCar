importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "env-vars-cannot-be-used-here-directly",
    authDomain: "env-vars-cannot-be-used-here-directly",
    projectId: "env-vars-cannot-be-used-here-directly",
    storageBucket: "env-vars-cannot-be-used-here-directly",
    messagingSenderId: "env-vars-cannot-be-used-here-directly",
    appId: "env-vars-cannot-be-used-here-directly",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/icons/icon-192x192.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
