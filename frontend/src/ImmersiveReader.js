function getTokenAndSubdomainAsync() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "/GetTokenAndSubdomain",
            type: "GET",
            success: function (data) {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function handleLaunchImmersiveReader() {
    getTokenAndSubdomainAsync()
        .then(function (response) {
            const token = response["token"];
            const subdomain = response["subdomain"];

            // Learn more about chunk usage and supported MIME types https://docs.microsoft.com/azure/cognitive-services/immersive-reader/reference#chunk
            const data = {
                title: $("#ir-title").text(),
                chunks: [{
                    content: $("#ir-content").html(),
                    mimeType: "text/html"
                }]
            };


            ImmersiveReader.launchAsync(token, subdomain, data, options)
                .catch(function (error) {
                    alert("Error in launching the Immersive Reader. Check the console.");
                    console.log(error);
                });
        })
        .catch(function (error) {
            alert("Error in getting the Immersive Reader token and subdomain. Check the console.");
            console.log(error);
        });
}
