// service-worker.jsからの相対パスで指定する


// service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log("loaded")
    navigator.serviceWorker.register('./service-worker.js')
      .then(async registration => {
        console.log("registered")
        console.log('subcription does not exist')
        askPermission().then(() => {
          const options = {
            userVisibleOnly: true,
            applicationServerKey: "BJzntD4NHrcJ541QBbifTpkURRh8Iy7ifdJ7ZFbpQ6q9EJx8LrAaA0-leJqES1Td25D9FvXrXn2c2GSMhUXoCFg"
          }
          console.log('Service Worker registered', registration);
          return registration.pushManager.subscribe(options);
        }).then(subscription => {
          console.log('User is subscribed');
          console.log(subscription);
        })
          .catch(err => { console.log(err) })
          .then(subscription => {
            console.log('User is subscribed');
            console.log(subscription);
          })

      });
  });
}

const askPermission = async () => {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission((result) => {
      resolve(result)
    })
    if (permissionResult) {
      permissionResult.then(resolve, reject)
    }
  })
    .then((permissionResult) => {
      if (permissionResult !== 'granted') {
        throw new Error('Permission denied')
      }
    })
}

document.getElementById('submit').onclick = async function (e) {
  e.preventDefault();
  // formのデータを収集する
  const form = document.querySelector('form');
  const formData = new FormData(form);

  // キー/バリューのペアを表示
  const delay = formData.get('delay');
  const subscription = await navigator.serviceWorker.getRegistration()
    .then(async registration => {
      return registration.pushManager.getSubscription()
        .then(subscription => {
          return subscription;
        })
    });

  fetch('./notify', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      subscription: subscription,
      delay: delay,
    }),
  });
};
