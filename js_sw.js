const CACHE_NAME = `converter-temperatura-v1`;

//Use o evento de instalação para pré-armazenar em cache todos os recursos iniciais.
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll([
            '/',
            '/js_converter.js',
            '/js_openpages.js',
            '/style_converter.css',
            '/style_about.css',
            '/style_blog.css'
            
        ]);
    })());
});

self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);

        //Obtenha o recurso do cache.
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            return cachedResponse;
        }else {
            try {
                //Se o recurso não estiver no cache, tente a rede.
                const fetchResponse = await fetch(event.request);

                //Salve o recurso no cache e devolva-o.
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            }catch (e) {
            //A rede falhou.
            }
        }
    })());
});

// O código acima escuta o evento e o usa para armazenar em cache todos os 
// recursos que o aplicativo precisa para funcionar: a página HTML inicial, 
// o arquivo JS do conversor e o arquivo CSS do conversor. 'install'.
//
// O código também intercepta eventos, que acontecem toda vez que seu aplicativo 
// envia uma solicitação ao servidor, e aplica uma estratégia de cache primeiro.
// 
// O service worker retorna recursos armazenados em cache para que o seu 
// aplicativo possa funcionar offline e, se isso falhar, tenta fazer o 
// download do servidor. 'fetch'.