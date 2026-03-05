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
        icon: "/logo.png",
        tag: "move-my-car-alert", // Use a tag to replace existing notifications of the same type
        renotify: true,           // Vibrate/sound again even if replaced
        data: {
            url: "/"              // Could be dynamic if needed
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
    console.log("[firebase-messaging-sw.js] Notification clicked:", event.notification.tag);

    // Close the notification
    event.notification.close();

    // Focus existing window or open a new one
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return clients.openWindow("/");
        })
    );
});
