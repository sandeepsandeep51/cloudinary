document.getElementById("submit-btn").addEventListener("click", function(event) {
    event.preventDefault();

    const cloudName = 'djpcamawm'; // Your Cloudinary Cloud Name
    const uploadPreset = 'public'; // Your Cloudinary Upload Preset
    const folderName = 'leave_records'; // Cloudinary folder

    // Function to upload file to Cloudinary
    function uploadFile(file) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', folderName);

            fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => resolve(data.secure_url))
            .catch(error => reject(error));
        });
    }

    // Take a screenshot of the form
    html2canvas(document.querySelector(".form-container")).then(canvas => {
        canvas.toBlob(async function(blob) {
            try {
                // Upload form screenshot
                const formImageUrl = await uploadFile(blob);

                // Upload selected image if any
                const fileInput = document.getElementById("file-upload");
                const file = fileInput.files[0];
                let uploadedFileUrl = null;

                if (file) {
                    uploadedFileUrl = await uploadFile(file);
                }

                // Collect form data
                const leaveData = {
                    name: document.getElementById("name").value,
                    token: document.getElementById("token").value,
                    leaveType: document.querySelector('input[name="leave_type"]:checked')?.value || '',
                    reason: document.getElementById("reason").value,
                    date: document.getElementById("date").value,
                    from: document.getElementById("from").value,
                    to: document.getElementById("to").value,
                    totalHours: document.getElementById("total_hours").value,
                    cumulativeHours: document.getElementById("cumulative_hours").value,
                    formImageUrl: formImageUrl, // Screenshot of the form
                    uploadedFileUrl: uploadedFileUrl // Selected image/file
                };

                console.log("Leave Data:", leaveData);
                alert("Form Screenshot & File Successfully Uploaded!");

            } catch (error) {
                console.error('Upload Error:', error);
                alert("Error uploading files.");
            }
        });
    });
});
