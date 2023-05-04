self.addEventListener('push', function (event) {
  if (event.data) {
    console.log('Push event!! ', event.data.text());

    event.waitUntil(
      self.registration.showNotification('Push Notification', {
        body: event.data.text(),
      })
    );
  } else {
    console.log('Push event but no data');
  }
});