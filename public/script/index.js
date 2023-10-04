$(document).ready(function(){
    console.log( "ready!" );
    convertHeicToJpeg();
})

async function convertHeicToJpeg() {
    const inputElement = $('#heicFileInput');
    const convertedImagesDiv = $('#convertedImages');
    const file = inputElement.prop('files')[0];

    if (file) {
        const formData = new FormData();
        formData.append('heicFile', file);
    
        try {
            const response = await fetch('/convert', {
                method: 'POST',
                body: formData,
            });
          
            if (response.ok) {
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
            
                const imgElement = $('<img>');
                imgElement.attr('src', imageUrl);
                convertedImagesDiv.append(imgElement);

                $('#downloadLink').attr('href', imageUrl);

            } else {
                console.error('Error converting HEIC to JPEG:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error converting HEIC to JPEG:', error);
        }
    }
}